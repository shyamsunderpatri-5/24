export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const appointmentSchema = z.object({
  business_id: z.string().uuid(),
  customer_id: z.string().uuid(),
  staff_id: z.string().uuid().optional(),
  service_id: z.string().uuid().optional(),
  appointment_at: z.string().datetime(),
  duration_mins: z.number().int().min(15).max(480).optional()
});

export async function GET() {
   try {
     const supabase = await createClient();
     const { data } = await supabase.from('appointments').select('*');
     return NextResponse.json(data || []);
   } catch (error: any) {
     return NextResponse.json({ error: error.message }, { status: 500 });
   }
}

export async function POST(request: Request) {
   try {
     const supabase = await createClient();
     const payload = await request.json();
     const parsed = appointmentSchema.parse(payload);
     
     const { data, error } = await supabase.from('appointments').insert(parsed).select().single();
     if (error) return NextResponse.json({ error: error.message }, { status: 400 });
     return NextResponse.json(data);
   } catch (error: any) {
     if (error instanceof z.ZodError) {
       return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
     }
     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
   }
}
