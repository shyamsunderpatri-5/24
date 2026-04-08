export const dynamic = 'force-dynamic';
import { createClient } from '@/lib/supabase/server';
import { format } from 'date-fns';

export default async function DashboardOverview() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // 1. Fetch Business
  const { data: business } = await supabase
    .from('businesses')
    .select('id, name')
    .eq('owner_user_id', user?.id)
    .single();

  if (!business) return <div>Please complete onboarding.</div>;

  // 2. Fetch Stats
  const today = new Date().toISOString().split('T')[0];
  
  const { count: appointmentsCount } = await supabase
    .from('appointments')
    .select('*', { count: 'exact', head: true })
    .eq('business_id', business.id)
    .gte('appointment_at', `${today}T00:00:00Z`)
    .lte('appointment_at', `${today}T23:59:59Z`);

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
    .lte('stock_qty', 5); // Example reorder level

  const stats = [
    { label: "Today's Appointments", value: appointmentsCount?.toString() || '0', trend: 'Live' },
    { label: "Revenue (Today)", value: `₹${totalRevenue}`, trend: 'Confirmed' },
    { label: "Unread Messages", value: unreadCount?.toString() || '0', trend: 'Action needed' },
    { label: "Low Stock Items", value: lowStockCount?.toString() || '0', trend: 'Alert' },
  ];

  // 3. Fetch Recent Appointments
  const { data: recentAppointments } = await supabase
    .from('appointments')
    .select('*, customers(name)')
    .eq('business_id', business.id)
    .gte('appointment_at', new Date().toISOString())
    .order('appointment_at', { ascending: true })
    .limit(5);

  // 4. Fetch Recent Conversations
  const { data: recentConversations } = await supabase
    .from('conversations')
    .select('*, customers(phone, name), messages(content, sent_at)')
    .eq('business_id', business.id)
    .order('last_message_at', { ascending: false })
    .limit(4);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-md transition-shadow">
            <p className="text-sm font-medium text-slate-500 mb-1">{s.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-bold text-slate-800">{s.value}</h3>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">{s.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
           <h3 className="text-lg font-bold text-slate-800 mb-4">Upcoming Appointments</h3>
           <div className="space-y-4">
              {recentAppointments?.map((apt: any) => (
                <div key={apt.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-50 bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="px-3 py-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center font-bold text-xs">
                      {format(new Date(apt.appointment_at), 'HH:mm')}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800">{apt.customers?.name || 'Walk-in'}</h4>
                      <p className="text-sm text-slate-500">{apt.notes || 'Service Appointment'}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${
                    apt.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                  }`}>
                    {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                  </span>
                </div>
              ))}
              {(!recentAppointments || recentAppointments.length === 0) && (
                <p className="text-slate-500 text-sm text-center py-8">No upcoming appointments found.</p>
              )}
           </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
           <h3 className="text-lg font-bold text-slate-800 mb-4">Recent AI Chats</h3>
           <div className="space-y-4">
              {recentConversations?.map((conv: any) => (
                <div key={conv.id} className="flex items-start gap-4 group cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    {conv.customers?.name?.[0] || 'WA'}
                  </div>
                  <div className="flex-1 min-w-0 border-b border-slate-50 pb-4">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-semibold text-slate-800 text-sm truncate">{conv.customers?.phone}</h4>
                      <span className="text-xs text-slate-400">
                        {conv.last_message_at ? format(new Date(conv.last_message_at), 'HH:mm') : 'Just now'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 truncate">
                      {conv.messages?.[0]?.content || 'Starting conversation...'}
                    </p>
                  </div>
                </div>
              ))}
              {(!recentConversations || recentConversations.length === 0) && (
                <p className="text-slate-500 text-sm text-center py-8">No recent chats.</p>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
