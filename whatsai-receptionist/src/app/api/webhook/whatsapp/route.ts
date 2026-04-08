import { NextResponse } from 'next/server';
import { verifyWebhookSignature, parseMessages, WebhookPayload } from '@/lib/whatsapp/webhook-parser';
import { whatsappClient } from '@/lib/whatsapp/client';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { decrypt } from '@/lib/utils/encryption';
import { sarvamAI } from '@/lib/ai/sarvam';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === process.env.META_WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse('Forbidden', { status: 403 });
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-hub-signature-256');

    if (!verifyWebhookSignature(rawBody, signature)) {
      console.error('Webhook signature failed');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload: WebhookPayload = JSON.parse(rawBody);
    const parsedMessages = parseMessages(payload);

    if (parsedMessages.length === 0) {
      return NextResponse.json({ status: 'ok' }, { status: 200 }); // Status update or unsupported
    }

    for (const { phoneNumberId, message, customerName } of parsedMessages) {
      // 1. Deduplicate by message.id
      const { data: existingMsg } = await supabaseAdmin
        .from('messages')
        .select('id')
        .eq('wa_message_id', message.id)
        .single();
        
      if (existingMsg) continue; // Already processed

      // 2. Find business by phone_number_id
      const { data: business, error: bizError } = await supabaseAdmin
        .from('businesses')
        .select('*')
        .eq('phone_number_id', phoneNumberId)
        .single();

      if (!business || !business.is_active || bizError) {
         console.error(`BUSINESS_ERROR: Business not active or not found for phone_number_id=${phoneNumberId}`);
         continue;
      }
      
      const phone = message.from; 

      // 3. Find or create customer
      let { data: customer } = await supabaseAdmin
        .from('customers')
        .select('*')
        .eq('business_id', business.id)
        .eq('phone', phone)
        .single();

      if (!customer) {
        const { data: newCustomer } = await supabaseAdmin
          .from('customers')
          .insert({ business_id: business.id, phone, name: customerName })
          .select().single();
        customer = newCustomer;
      }

      // 4. Find or create conversation
      let { data: conversation } = await supabaseAdmin
        .from('conversations')
        .select('*')
        .eq('business_id', business.id)
        .eq('customer_id', customer.id)
        .single();

      if (!conversation) {
        const { data: newConv } = await supabaseAdmin
          .from('conversations')
          .insert({ business_id: business.id, customer_id: customer.id, status: 'active' })
          .select().single();
        conversation = newConv;
      } else {
        await supabaseAdmin.from('conversations').update({ last_message_at: new Date().toISOString() }).eq('id', conversation.id);
      }

      // 5. Store inbound message
      let content = '';
      if (message.type === 'text') content = message.text?.body || '';
      else if (message.type === 'interactive' && message.interactive?.type === 'button_reply') content = message.interactive.button_reply?.title || '';
      else if (message.type === 'interactive' && message.interactive?.type === 'list_reply') content = message.interactive.list_reply?.title || '';
      else if (message.type === 'image') content = '[Image]';
      else if (message.type === 'audio') content = '[Audio]';

      const isOptOut = ['stop', 'unsubscribe', 'hiye', 'band karo'].includes(content.toLowerCase().trim());
      
      if (isOptOut) {
        await supabaseAdmin.from('customers').update({ is_blocked: true }).eq('id', customer.id);
        const optOutReply = "You have been unsubscribed. Reply START to re-enable.";
        const accessToken = business.access_token_encrypted ? decrypt(business.access_token_encrypted) : '';
        await whatsappClient.sendTextMessage(phone, optOutReply, phoneNumberId, accessToken);
        continue;
      }

      const { data: savedMessage } = await supabaseAdmin.from('messages').insert({
        conversation_id: conversation.id,
        business_id: business.id,
        direction: 'inbound',
        message_type: message.type,
        content: content,
        wa_message_id: message.id,
        is_ai_generated: false
      }).select().single();

      // Update visit count
      await supabaseAdmin.from('customers').update({ 
        total_visits: (customer.total_visits || 0) + 1,
        last_visit_at: new Date().toISOString()
      }).eq('id', customer.id);

      // 6. Call AI Brain
      if (conversation.is_human_taking_over || customer.is_blocked) continue;

      if (message.type === 'image') {
        const replyText = "Currently, I can only process text and voice notes. How else can I help you?";
        const accessToken = business.access_token_encrypted ? decrypt(business.access_token_encrypted) : '';
        await whatsappClient.sendTextMessage(phone, replyText, phoneNumberId, accessToken);
        continue;
      }

      // Handle text and audio
      let userText = content;
      if (message.type === 'audio' && message.audio?.id) {
        try {
           const accessToken = business.access_token_encrypted ? decrypt(business.access_token_encrypted) : '';
           const audioBuffer = await whatsappClient.downloadMedia(message.audio.id, accessToken);
           const transcription = await sarvamAI.speechToText(audioBuffer, 'audio/ogg');
           userText = transcription.transcript;
           await supabaseAdmin.from('messages').update({ content: userText }).eq('id', savedMessage.id);
        } catch (sttError) {
           console.error('STT_FAILED', sttError);
           userText = '[Audio could not be transcribed]';
        }
      }

      if (!userText) continue;

      // Call the Brain
      const { aiBrain } = await import('@/lib/ai/brain');
      const { data: history } = await supabaseAdmin
        .from('messages')
        .select('*')
        .eq('conversation_id', conversation.id)
        .order('sent_at', { ascending: false })
        .limit(10);

      const brainResult = await aiBrain.processMessage({
        message: userText,
        businessId: business.id,
        customerId: customer.id,
        conversationHistory: history || [],
        businessConfig: business,
        customerInfo: customer
      });

      // 7. Send AI Reply with DPDP Consent Footer if first time
      let finalReply = brainResult.reply;
      if (customer.total_visits === 0) {
        finalReply += `\n\n---\nBy continuing, you agree to context-sharing as per DPDP Act 2023. Reply STOP to opt-out.`;
      }

      const accessToken = business.access_token_encrypted ? decrypt(business.access_token_encrypted) : '';
      await whatsappClient.sendTextMessage(phone, finalReply, phoneNumberId, accessToken);

      // 8. Store outbound message
      await supabaseAdmin.from('messages').insert({
        conversation_id: conversation.id,
        business_id: business.id,
        direction: 'outbound',
        message_type: 'text',
        content: finalReply,
        ai_intent: brainResult.intent,
        ai_entities: brainResult.entitiesExtracted,
        is_ai_generated: true,
        processing_status: 'processed'
      });

      // 9. Update conversation status
      if (brainResult.shouldEscalateToHuman) {
        await supabaseAdmin.from('conversations').update({ is_human_taking_over: true, status: 'human_takeover' }).eq('id', conversation.id);
      }
    }

    return NextResponse.json({ status: 'ok' }, { status: 200 });

  } catch (error) {
    console.error('Webhook processing error:', error);
    // Always return 200 OK to WhatsApp so Meta doesn't retry
    return NextResponse.json({ status: 'error handled' }, { status: 200 }); 
  }
}
