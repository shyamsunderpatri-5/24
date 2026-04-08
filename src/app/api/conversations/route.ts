export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
   const supabase = await createClient();
   const { data } = await supabase.from('conversations').select('*, customers(*)').order('last_message_at', { ascending: false });
   return NextResponse.json(data || []);
}
