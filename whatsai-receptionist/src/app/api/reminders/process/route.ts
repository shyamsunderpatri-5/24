import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { whatsappClient } from '@/lib/whatsapp/client';
import { format } from 'date-fns';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // Protect with cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { data: reminders, error } = await supabaseAdmin
      .from('reminders')
      .select('*, appointments(*, customers(*), businesses(*, access_token_encrypted, phone_number_id))')
      .eq('status', 'pending')
      .lte('scheduled_for', new Date().toISOString())
      .limit(50);

    if (error) throw error;
    if (!reminders || reminders.length === 0) return NextResponse.json({ processed: 0 });

    let processedCount = 0;
    
    for (const reminder of reminders) {
      // Due to the join, appointments is fetched but Typescript doesn't know its inner schema easily without typegen
      const appointment = reminder.appointments as any;
      const customer = appointment.customers;
      const business = appointment.businesses;
      
      const timeStr = format(new Date(appointment.appointment_at), 'hh:mm a, dd MMM yyyy');

      let message = `Reminder: Your appointment with ${business.name} is coming up at ${timeStr}.`;
      if (reminder.type === '2h') message = `Hi ${customer.name || ''}, just a quick reminder for your appointment at ${timeStr} with ${business.name}. See you soon!`;
      else if (reminder.type === '24h') message = `Hi ${customer.name || ''}, this is a reminder for your appointment tomorrow at ${timeStr} with ${business.name}.`;

      try {
        await whatsappClient.sendTextMessage(
          customer.phone,
          message,
          business.phone_number_id,
          business.access_token_encrypted || ''
        );
        
        await supabaseAdmin.from('reminders').update({ status: 'sent', sent_at: new Date().toISOString() }).eq('id', reminder.id);
        
        // Also update the appointment boolean
        if (reminder.type === '24h') await supabaseAdmin.from('appointments').update({ reminder_24h_sent: true }).eq('id', appointment.id);
        if (reminder.type === '2h') await supabaseAdmin.from('appointments').update({ reminder_2h_sent: true }).eq('id', appointment.id);

        processedCount++;
      } catch (err) {
        console.error(`Failed sending reminder ${reminder.id}`, err);
        await supabaseAdmin.from('reminders').update({ status: 'failed' }).eq('id', reminder.id);
      }
    }

    return NextResponse.json({ processed: processedCount }, { status: 200 });
  } catch (error) {
    console.error('Reminder Processing Error', error);
    return NextResponse.json({ error: 'Failed to process reminders' }, { status: 500 });
  }
}
