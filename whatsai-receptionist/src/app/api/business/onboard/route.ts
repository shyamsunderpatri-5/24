export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
   const supabase = await createClient();
   const { data: { user } } = await supabase.auth.getUser();
   if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
   
   const body = await request.json();
   const baseDetails = {
      owner_user_id: user.id,
      name: body.name,
      type: body.type,
      onboarding_completed: true
   };
   
   const { data, error } = await supabase.from('businesses').insert(baseDetails).select().single();
   if (error) return NextResponse.json({ error: error.message }, { status: 400 });
   return NextResponse.json(data);
}
