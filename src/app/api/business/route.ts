export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
   const supabase = await createClient();
   const { data: { user } } = await supabase.auth.getUser();
   if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
   
   const { data } = await supabase.from('businesses').select('*').eq('owner_user_id', user.id).single();
   return NextResponse.json(data || {});
}

export async function PATCH(request: Request) {
   const supabase = await createClient();
   const { data: { user } } = await supabase.auth.getUser();
   if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
   
   const body = await request.json();
   const { data, error } = await supabase.from('businesses').update(body).eq('owner_user_id', user.id).select().single();
   if (error) return NextResponse.json({ error: error.message }, { status: 400 });
   return NextResponse.json(data);
}
