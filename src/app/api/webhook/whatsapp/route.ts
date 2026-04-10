export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { verifyWebhookSignature, parseMessages, WebhookPayload } from '@/lib/whatsapp/webhook-parser';
import { whatsappClient } from '@/lib/whatsapp/client';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
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
      return NextResponse.json({ status: 'ok' }, { status: 200 });
    }

    const supabase = getSupabaseAdmin();

    for (const { phoneNumberId, message, customerName } of parsedMessages) {
      // 1. Deduplicate
      const { data: existingMsg } = await supabase
        .from('messages')
        .select('id')
        .eq('wa_message_id', message.id)
        .single();
        
      if (existingMsg) continue;

      // 2. Find WhatsApp Number and Workspace
      const { data: waNumber, error: waError } = await supabase
        .from('whatsapp_numbers')
        .select('*, workspaces(*)')
        .eq('phone_number_id', phoneNumberId)
        .single();

      if (!waNumber || waError) {
         console.error(`WEBHOOK_ERROR: WhatsApp Number not found for phone_number_id=${phoneNumberId}`);
         continue;
      }
      
      const workspaceId = waNumber.workspace_id;
      const phone = message.from; 

      // 3. Find or create contact
      let { data: contact } = await supabase
        .from('contacts')
        .select('*')
        .eq('workspace_id', workspaceId)
        .eq('phone', phone)
        .single();

      if (!contact) {
        const { data: newContact } = await supabase
          .from('contacts')
          .insert({ 
            workspace_id: workspaceId, 
            phone, 
            name: customerName || 'New Contact' 
          })
          .select().single();
        contact = newContact;
      }

      // 4. Find or create conversation
      let { data: conversation } = await supabase
        .from('conversations')
        .select('*')
        .eq('workspace_id', workspaceId)
        .eq('contact_id', contact.id)
        .eq('whatsapp_number_id', waNumber.id)
        .single();

      if (!conversation) {
        const { data: newConv } = await supabase
          .from('conversations')
          .insert({ 
            workspace_id: workspaceId, 
            contact_id: contact.id, 
            whatsapp_number_id: waNumber.id,
            status: 'active' 
          })
          .select().single();
        conversation = newConv;
      } else {
        await supabase.from('conversations')
          .update({ last_message_at: new Date().toISOString() })
          .eq('id', conversation.id);
      }

      // 5. Store inbound message
      let content = '';
      if (message.type === 'text') content = message.text?.body || '';
      else if (message.type === 'interactive' && message.interactive?.type === 'button_reply') content = message.interactive.button_reply?.title || '';
      else if (message.type === 'interactive' && message.interactive?.type === 'list_reply') content = message.interactive.list_reply?.title || '';
      else if (message.type === 'image') content = '[Image]';
      else if (message.type === 'audio') content = '[Audio]';

      await supabase.from('messages').insert({
        workspace_id: workspaceId,
        conversation_id: conversation.id,
        direction: 'inbound',
        sender_type: 'contact',
        message_type: message.type,
        content: content,
        wa_message_id: message.id
      });

      // 6. Update contact last activities
      await supabase.from('contacts').update({ 
        last_message_at: new Date().toISOString()
      }).eq('id', contact.id);

      // 7. AI Brain processing (if enabled)
      if (waNumber.ai_enabled && conversation.status === 'active') {
        const { aiBrain } = await import('@/lib/ai/brain');
        const { data: history } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conversation.id)
          .order('created_at', { ascending: false })
          .limit(10);

        const brainResult = await aiBrain.processMessage({
          message: content,
          workspaceId: workspaceId,
          contactId: contact.id,
          conversationHistory: history || [],
          workspaceConfig: waNumber.workspaces, // Access the joined info
          contactInfo: contact
        });

        // 8. Send AI Reply
        const accessToken = waNumber.access_token; // Assumes it's decrypted or handled
        await whatsappClient.sendTextMessage(phone, brainResult.reply, phoneNumberId, accessToken);

        // 9. Store outbound message
        await supabase.from('messages').insert({
          workspace_id: workspaceId,
          conversation_id: conversation.id,
          direction: 'outbound',
          sender_type: 'bot',
          message_type: 'text',
          content: brainResult.reply,
          is_ai_generated: true
        });

        // 10. Escalate if needed
        if (brainResult.shouldEscalateToHuman) {
          await supabase.from('conversations')
            .update({ status: 'human_takeover' })
            .eq('id', conversation.id);
        }
      }
    }

    return NextResponse.json({ status: 'ok' }, { status: 200 });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ status: 'error handled' }, { status: 200 }); 
  }
}
