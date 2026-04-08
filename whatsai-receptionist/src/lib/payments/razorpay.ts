import crypto from 'crypto';

export async function createPaymentLink(params: any): Promise<any> {
  const auth = Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString('base64');
  
  const res = await fetch('https://api.razorpay.com/v1/payment_links', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${auth}`
    },
    body: JSON.stringify({
      amount: Math.round(params.amount * 100), // convert to paise
      currency: params.currency || 'INR',
      description: params.description,
      customer: params.customer
    })
  });
  
  if (!res.ok) throw new Error('Failed to create payment link');
  return res.json();
}

export async function createSubscription(planId: string, totalCount: number): Promise<any> {
  const auth = Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString('base64');
  
  const res = await fetch('https://api.razorpay.com/v1/subscriptions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${auth}`
    },
    body: JSON.stringify({
      plan_id: planId,
      total_count: totalCount,
      customer_notify: 1
    })
  });
  
  if (!res.ok) throw new Error('Failed to create subscription');
  return res.json();
}

export function verifyWebhookSignature(body: string, signature: string): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return false;
  
  const expectedSignature = crypto.createHmac('sha256', secret).update(body).digest('hex');
  return expectedSignature === signature;
}
