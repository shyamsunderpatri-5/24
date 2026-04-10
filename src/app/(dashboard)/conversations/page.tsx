import { createClient } from '@/lib/supabase/server';
import { format } from 'date-fns';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  User,
  MoreVertical,
  Circle
} from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function ConversationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('owner_user_id', user.id)
    .single();

  if (!business) {
    redirect('/onboarding');
  }

  const { data: conversations } = await supabase
    .from('conversations')
    .select('*, customers(phone, name), messages(content, sent_at)')
    .eq('business_id', business.id)
    .order('last_message_at', { ascending: false });

  return (
    <div className="h-[calc(100vh-12rem)] flex bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] overflow-hidden">
      
      {/* Sidebar list */}
      <div className="w-96 border-r border-slate-100 flex flex-col bg-[#FCFDFE]">
        <div className="p-8 border-b border-slate-50 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-800 tracking-tight">Inbox</h3>
            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest leading-none">
              {conversations?.length || 0} Chats
            </span>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 font-bold" />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="w-full pl-11 pr-4 py-3 bg-slate-100/50 border-none rounded-2xl text-xs focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
          {conversations?.map((c: any) => (
            <Link 
              href={`/conversations/${c.id}`}
              key={c.id} 
              className="group flex items-center gap-4 p-4 rounded-3xl hover:bg-white hover:shadow-[0_8px_20px_rgba(0,0,0,0.04)] transition-all duration-300 cursor-pointer border border-transparent hover:border-slate-50"
            >
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center font-bold text-slate-500 group-hover:from-blue-500 group-hover:to-indigo-600 group-hover:text-white transition-all duration-300">
                  {c.customers?.name?.[0] || <User className="w-5 h-5" />}
                </div>
                {c.unread_count > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white">
                    {c.unread_count}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-bold text-slate-800 text-sm truncate uppercase tracking-tight">
                    {c.customers?.name || c.customers?.phone}
                  </h4>
                  <span className="text-[10px] font-black text-slate-300 uppercase shrink-0">
                    {c.last_message_at ? format(new Date(c.last_message_at), 'HH:mm') : ''}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium truncate leading-tight">
                  {c.last_message_preview || 'No messages recorded'}
                </p>
              </div>
            </Link>
          ))}
          {(!conversations || conversations.length === 0) && (
            <div className="py-20 text-center space-y-3">
              <MessageSquare className="w-10 h-10 text-slate-100 mx-auto" strokeWidth={3} />
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Quiet Inbox</p>
            </div>
          )}
        </div>
      </div>

      {/* Chat View Placeholder */}
      <div className="flex-1 flex flex-col bg-[#F8FAFC] items-center justify-center text-slate-300">
        <div className="max-w-sm text-center p-8">
           <div className="w-24 h-24 bg-white rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.03)] flex items-center justify-center mx-auto mb-8 border border-slate-50">
             <MessageSquare className="w-10 h-10 text-blue-500/20" strokeWidth={2.5} />
           </div>
           <h4 className="text-xl font-black text-slate-800 tracking-tight mb-2">Omnichannel Inbox</h4>
           <p className="text-sm font-medium text-slate-400">Select a communication thread from the left to start managing conversations with your customers.</p>
        </div>
      </div>
    </div>
  );
}
