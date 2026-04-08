export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createPaymentLink } from '@/lib/payments/razorpay';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
   try {
     const body = await request.json();
     const supabase = await createClient();
     
     const link = await createPaymentLink({
        amount: body.amount,
        currency: 'INR',
        description: body.description,
        customer: {
          name: body.customerName || 'Customer',
          contact: body.customerPhone || ''
        }
     });

     if (body.orderId) {
        await supabase.from('orders').update({ razorpay_link: link.short_url }).eq('id', body.orderId);
     }
     
     return NextResponse.json({ success: true, link: link.short_url });
   } catch (error: any) {
     return NextResponse.json({ error: error.message }, { status: 500 });
   }
}
