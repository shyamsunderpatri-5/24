export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
   const resolvedParams = await params;
   const supabase = await createClient();
   const { data } = await supabase.from('appointments').select('*').eq('id', resolvedParams.id).single();
   return NextResponse.json(data || {});
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
   const resolvedParams = await params;
   const supabase = await createClient();
   const body = await request.json();
   const { data, error } = await supabase.from('appointments').update(body).eq('id', resolvedParams.id).select().single();
   if (error) return NextResponse.json({ error: error.message }, { status: 400 });
   return NextResponse.json(data);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
   const resolvedParams = await params;
   const supabase = await createClient();
   await supabase.from('appointments').delete().eq('id', resolvedParams.id);
   return NextResponse.json({ success: true });
}
