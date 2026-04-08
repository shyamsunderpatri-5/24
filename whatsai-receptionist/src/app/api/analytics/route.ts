export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
   const supabase = await createClient();
   const { count: autoReplies } = await supabase.from('messages').select('*', { count: 'exact', head: true }).eq('is_ai_generated', true);
   const { count: appointments } = await supabase.from('appointments').select('*', { count: 'exact', head: true });
   return NextResponse.json({ autoReplies, appointments });
}
