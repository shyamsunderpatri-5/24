import { createClient } from '@/lib/supabase/server';
import { format } from 'date-fns';
import { 
  TrendingUp, 
  Users, 
  MessageSquare, 
  AlertCircle,
  Clock,
  ArrowRight,
  Send,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import AnalyticsCharts from '@/components/dashboard/AnalyticsCharts';

export default async function DashboardOverview() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data: workspace } = await supabase
    .from('workspaces')
    .select('id, name')
    .eq('owner_id', user?.id)
    .single();

  if (!workspace) return (
     <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-800">Complete your setup</h3>
        <p className="text-slate-500 mb-6">You need to set up your workspace profile before accessing the dashboard.</p>
        <Link href="/onboarding" className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">
          Start Onboarding
        </Link>
     </div>
  );

  const { count: contactsCount } = await supabase
    .from('contacts')
    .select('*', { count: 'exact', head: true })
    .eq('workspace_id', workspace.id);

  const { count: activeConvCount } = await supabase
    .from('conversations')
    .select('*', { count: 'exact', head: true })
    .eq('workspace_id', workspace.id)
    .eq('status', 'active');

  const { count: msgSentCount } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('workspace_id', workspace.id)
    .eq('direction', 'outbound');

  const stats = [
    { label: "Total Contacts", value: contactsCount?.toString() || '0', trend: '+5.2%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: "Active Chats", value: activeConvCount?.toString() || '0', trend: 'Live', icon: MessageSquare, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: "Messages Sent", value: msgSentCount?.toString() || '0', trend: 'High', icon: Send, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: "Resolution Rate", value: "94%", trend: 'Target', icon: CheckCircle2, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Enterprise Overview</h1>
          <p className="text-slate-500 font-medium">Monitoring {workspace.name} in real-time.</p>
        </div>
        <div className="flex items-center gap-3">
           <span className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold shadow-sm flex items-center gap-2">
             <Clock className="w-4 h-4 text-blue-500" />
             {format(new Date(), 'EEEE, MMMM do')}
           </span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <div key={i} className="group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-4 rounded-2xl ${s.bg} ${s.color} transition-transform group-hover:scale-110 duration-300`}>
                <s.icon className="w-6 h-6" />
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-1">{s.trend}</span>
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 mb-1">{s.label}</p>
              <h3 className="text-3xl font-black text-slate-800 tracking-tighter">{s.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
           <div className="flex items-center justify-between mb-8">
             <div>
               <h3 className="text-xl font-black text-slate-800 tracking-tight">Message Analytics</h3>
               <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Sent vs Received (Last 7 Days)</p>
             </div>
             <button className="text-xs font-black text-slate-300 uppercase hover:text-blue-600 transition-colors">Details</button>
           </div>
           
           <AnalyticsCharts />
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm h-full">
           <h3 className="text-xl font-black text-slate-800 tracking-tight mb-8">Recent Activity</h3>
           <div className="flex flex-col items-center justify-center h-64 text-slate-300">
              <MessageSquare className="w-12 h-12 mb-4 opacity-10" />
              <p className="text-sm font-bold uppercase tracking-widest">Active Monitoring</p>
           </div>
        </div>
      </div>
    </div>
  );
}
