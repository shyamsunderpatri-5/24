export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
   const resolvedParams = await params;
   const supabase = await createClient();
   const { data, error } = await supabase.from('conversations').update({ is_human_taking_over: true, status: 'human_takeover' }).eq('id', resolvedParams.id).select().single();
   if (error) return NextResponse.json({ error: error.message }, { status: 400 });
   return NextResponse.json(data);
}
