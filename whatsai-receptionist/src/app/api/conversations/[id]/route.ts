import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
   const resolvedParams = await params;
   const supabase = await createClient();
   const { data } = await supabase.from('messages').select('*').eq('conversation_id', resolvedParams.id).order('sent_at', { ascending: true });
   return NextResponse.json(data || []);
}
