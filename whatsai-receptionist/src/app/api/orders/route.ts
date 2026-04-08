import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const orderSchema = z.object({
  business_id: z.string().uuid(),
  customer_id: z.string().uuid(),
  delivery_type: z.enum(['pickup', 'delivery']).default('pickup'),
  total_inr: z.number().min(0),
  items: z.array(z.object({
    product_id: z.string().uuid(),
    product_name: z.string(),
    qty: z.number().int().min(1),
    price_inr: z.number().min(0)
  })).min(1)
});

export async function GET() {
   const supabase = await createClient();
   const { data } = await supabase.from('orders').select('*, customers(*)').order('created_at', { ascending: false });
   return NextResponse.json(data || []);
}

export async function POST(request: Request) {
   try {
     const supabase = await createClient();
     const payload = await request.json();
     const parsed = orderSchema.parse(payload);
     
     // Remove items from main order insert
     const { items, ...orderData } = parsed;
     
     const { data: order, error } = await supabase.from('orders').insert(orderData).select().single();
     if (error) throw error;
     
     // Logic for order_items would happen here inside a transaction
     
     return NextResponse.json(order);
   } catch (error: any) {
     if (error instanceof z.ZodError) {
       return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
     }
     return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
   }
}
