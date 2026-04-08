export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const productSchema = z.object({
  business_id: z.string().uuid(),
  name: z.string().min(2).max(100),
  category: z.string().optional(),
  stock_qty: z.number().int().min(0),
  price_inr: z.number().min(0)
});

export async function GET() {
   const supabase = await createClient();
   const { data } = await supabase.from('products').select('*').order('name');
   return NextResponse.json(data || []);
}

export async function POST(request: Request) {
   try {
     const supabase = await createClient();
     const payload = await request.json();
     const parsed = productSchema.parse(payload);
     
     const { data, error } = await supabase.from('products').insert(parsed).select().single();
     if (error) throw error;
     return NextResponse.json(data);
   } catch (error: any) {
     if (error instanceof z.ZodError) {
       return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
     }
     return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
   }
}
