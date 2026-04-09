import { createClient } from '@/lib/supabase/server';
import { format } from 'date-fns';
import { 
  TrendingUp, 
  Users, 
  MessageSquare, 
  AlertCircle,
  Calendar,
  IndianRupee,
  Clock,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default async function DashboardOverview() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data: business } = await supabase
    .from('businesses')
    .select('id, name')
    .eq('owner_user_id', user?.id)
    .single();

  if (!business) return (
     <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-800">Complete your setup</h3>
        <p className="text-slate-500 mb-6">You need to set up your business profile before accessing the dashboard.</p>
        <Link href="/onboarding" className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">
          Start Onboarding
        </Link>
     </div>
  );

  const today = new Date().toISOString().split('T')[0];
  
  const { count: appointmentsCount } = await supabase
    .from('appointments')
    .select('*', { count: 'exact', head: true })
    .eq('business_id', business.id)
    .gte('appointment_at', `${today}T00:00:00Z`);

  const { data: apptRevenue } = await supabase
    .from('appointments')
    .select('amount_inr')
    .eq('business_id', business.id)
    .eq('status', 'confirmed')
    .gte('appointment_at', `${today}T00:00:00Z`);

  const { data: orderRevenue } = await supabase
    .from('orders')
    .select('amount_inr')
    .eq('business_id', business.id)
    .in('status', ['completed', 'Delivered'])
    .gte('created_at', `${today}T00:00:00Z`);

  const totalRevenue = (apptRevenue?.reduce((acc: number, curr: any) => acc + (Number(curr.amount_inr) || 0), 0) || 0) +
                       (orderRevenue?.reduce((acc: number, curr: any) => acc + (Number(curr.amount_inr) || 0), 0) || 0);

  const { count: unreadCount } = await supabase
    .from('conversations')
    .select('*', { count: 'exact', head: true })
    .eq('business_id', business.id)
    .gt('unread_count', 0);

  const { count: lowStockCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('business_id', business.id)
    .lte('stock_qty', 5);

  const { data: recentAppointments } = await supabase
    .from('appointments')
    .select('*, customers(name)')
    .eq('business_id', business.id)
    .gte('appointment_at', new Date().toISOString())
    .order('appointment_at', { ascending: true })
    .limit(5);

  const { data: recentConversations } = await supabase
    .from('conversations')
    .select('*, customers(phone, name), messages(content, sent_at)')
    .eq('business_id', business.id)
    .order('last_message_at', { ascending: false })
    .limit(4);

  const stats = [
    { label: "Today's Revenue", value: `₹${totalRevenue.toLocaleString()}`, trend: '+12.5%', icon: IndianRupee, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: "Appointments", value: appointmentsCount?.toString() || '0', trend: 'Live', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: "Unread Leads", value: unreadCount?.toString() || '0', trend: 'Priority', icon: MessageSquare, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: "Inventory Alerts", value: lowStockCount?.toString() || '0', trend: 'Check', icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Enterprise Overview</h1>
          <p className="text-slate-500 font-medium">Monitoring {business.name} in real-time.</p>
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
          <div key={i} className="group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300">
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
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-[0_8px_30px_rgba(0,0,0,0.02)] overflow-hidden relative">
           <div className="flex items-center justify-between mb-8">
             <h3 className="text-xl font-black text-slate-800 tracking-tight">Next Appointments</h3>
             <Link href="/appointments" className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors">
               View Schedule <ArrowRight className="w-4 h-4" />
             </Link>
           </div>
           
           <div className="space-y-4">
              {recentAppointments?.map((apt: any) => (
                <div key={apt.id} className="group flex items-center justify-between p-5 rounded-2xl border border-slate-50 bg-slate-50/30 hover:bg-blue-50/30 hover:border-blue-100 hover:translate-x-1 transition-all duration-300">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex flex-col items-center justify-center border border-slate-100 group-hover:border-blue-200">
                      <span className="text-xs font-black text-blue-600 uppercase tabular-nums">
                        {format(new Date(apt.appointment_at), 'HH:mm')}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{apt.customers?.name || 'Walk-in Guest'}</h4>
                      <p className="text-sm text-slate-400 font-medium">{apt.notes || 'No description provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-4 py-1.5 text-[11px] font-black uppercase tracking-widest rounded-full border ${
                      apt.status === 'confirmed' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                        : 'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      {apt.status}
                    </span>
                  </div>
                </div>
              ))}
              {(!recentAppointments || recentAppointments.length === 0) && (
                <div className="text-center py-12 flex flex-col items-center">
                  <div className="w-12 h-12 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-4">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <p className="text-slate-400 text-sm font-bold tracking-tight">No upcoming events scheduled</p>
                </div>
              )}
           </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
           <h3 className="text-xl font-black text-slate-800 tracking-tight mb-8">AI Brain Insight</h3>
           <div className="space-y-6">
              {recentConversations?.map((conv: any) => (
                <div key={conv.id} className="flex items-start gap-4 group cursor-pointer">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-100 flex items-center justify-center shrink-0 group-hover:from-blue-50 group-hover:to-indigo-50 group-hover:border-blue-100 transition-all duration-300">
                    <span className="text-sm font-black text-slate-400 group-hover:text-blue-600">
                      {conv.customers?.name?.[0] || 'W'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 border-b border-slate-50 pb-5 last:border-0 group-hover:border-blue-50 transition-colors">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-bold text-slate-800 text-sm truncate">{conv.customers?.phone}</h4>
                      <span className="text-[10px] font-black text-slate-300 uppercase">
                        {conv.last_message_at ? format(new Date(conv.last_message_at), 'HH:mm') : 'NOW'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-medium truncate leading-relaxed">
                      {conv.messages?.[0]?.content || 'Analysis in progress...'}
                    </p>
                  </div>
                </div>
              ))}
              {(!recentConversations || recentConversations.length === 0) && (
                <div className="text-center py-12 flex flex-col items-center">
                   <MessageSquare className="w-6 h-6 text-slate-200 mb-3" />
                   <p className="text-slate-400 text-sm font-bold tracking-tight">No active conversations</p>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
