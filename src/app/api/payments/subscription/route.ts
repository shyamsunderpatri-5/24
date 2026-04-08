export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createSubscription } from '@/lib/payments/razorpay';

export async function POST(request: Request) {
   try {
     const body = await request.json();
     const subscription = await createSubscription(body.planId, body.totalCount);
     return NextResponse.json({ success: true, subscriptionId: subscription.id });
   } catch (error: any) {
     return NextResponse.json({ error: error.message }, { status: 500 });
   }
}
