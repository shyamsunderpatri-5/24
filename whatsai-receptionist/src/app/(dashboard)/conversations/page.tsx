import { createClient } from '@/lib/supabase/server';
import { format } from 'date-fns';

export default async function ConversationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('owner_user_id', user?.id)
    .single();

  if (!business) return <div>Business not found.</div>;

  const { data: conversations } = await supabase
    .from('conversations')
    .select('*, customers(phone, name), messages(content, sent_at)')
    .eq('business_id', business.id)
    .order('last_message_at', { ascending: false });

  return (
    <div className="h-[calc(100vh-8rem)] flex border border-slate-200 bg-white rounded-xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] overflow-hidden">
      
      {/* Sidebar list */}
      <div className="w-1/3 border-r border-slate-200 flex flex-col bg-slate-50/30">
        <div className="p-4 border-b border-slate-200 bg-white">
          <h3 className="font-bold text-slate-800">Inbox</h3>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations?.map((c: any) => (
            <div key={c.id} className="p-4 border-b border-slate-100 hover:bg-white cursor-pointer flex justify-between items-start transition-colors">
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-slate-800 truncate">{c.customers?.name || c.customers?.phone}</h4>
                <p className="text-sm text-slate-500 truncate">{c.last_message_preview || 'No messages yet'}</p>
              </div>
              <div className="flex flex-col items-end ml-2 shrink-0">
                <span className="text-[10px] text-slate-400 mb-1">
                  {c.last_message_at ? format(new Date(c.last_message_at), 'HH:mm') : '-'}
                </span>
                {c.unread_count > 0 && (
                  <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm">
                    {c.unread_count}
                  </span>
                )}
              </div>
            </div>
          ))}
          {(!conversations || conversations.length === 0) && (
            <div className="p-8 text-center text-slate-500 text-sm">No conversations found.</div>
          )}
        </div>
      </div>

      {/* Chat View (Placeholder for now) */}
      <div className="flex-1 flex flex-col bg-slate-50/50 items-center justify-center text-slate-400">
        <div className="text-center p-8">
           <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
             </svg>
           </div>
           <h4 className="font-bold text-slate-600">Select a conversation</h4>
           <p className="text-sm">Choose a customer chat from the list on the left to view messages.</p>
        </div>
      </div>
    </div>
  );
}
