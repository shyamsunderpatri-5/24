import { createClient } from '@/lib/supabase/server';

export async function buildContext(businessId: string, customerId: string) {
   const supabase = await createClient();
   const { data: recentMessages } = await supabase.from('messages')
      .select('*')
      .eq('conversation_id', customerId) // simple mapping
      .order('sent_at', { ascending: false })
      .limit(5);

   const { data: business } = await supabase.from('businesses')
      .select('*')
      .eq('id', businessId)
      .single();
      
   return {
      history: recentMessages,
      business
   };
}
