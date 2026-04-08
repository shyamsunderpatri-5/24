export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/payments/razorpay';

export async function POST(request: Request) {
   try {
     const signature = request.headers.get('x-razorpay-signature');
     const rawBody = await request.text();
     
     if (!signature || !verifyWebhookSignature(rawBody, signature)) {
       return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
     }
     
     const event = JSON.parse(rawBody);
     // Handle event.event === 'payment_link.paid'
     // Handle event.event === 'subscription.charged'
     
     return NextResponse.json({ success: true });
   } catch (error: any) {
     return NextResponse.json({ error: error.message }, { status: 500 });
   }
}
