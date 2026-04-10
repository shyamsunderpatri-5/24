import { createClient } from '@/lib/supabase/server';
import { format } from 'date-fns';
import { AddAppointmentButton } from '@/components/dashboard/AddAppointmentButton';
import { Calendar, User, Clock, MoreHorizontal, ChevronRight } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function AppointmentsPage() {
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

  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('business_id', business.id);

  const { data: appointments } = await supabase
    .from('appointments')
    .select('*, customers(name, phone), services(name)')
    .eq('business_id', business.id)
    .order('appointment_at', { ascending: true });

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Appointments</h1>
          <p className="text-slate-500 font-medium">Coordinate your schedule and manage customer bookings.</p>
        </div>
        <AddAppointmentButton services={services || []} />
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Schedule</th>
                <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Customer</th>
                <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Service</th>
                <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {appointments?.map((apt: any) => (
                <tr key={apt.id} className="group hover:bg-blue-50/30 transition-colors duration-200">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 tabular-nums">
                          {format(new Date(apt.appointment_at), 'hh:mm a')}
                        </p>
                        <p className="text-[11px] font-black text-slate-400 uppercase">
                          {format(new Date(apt.appointment_at), 'dd MMM yyyy')}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center font-bold text-sm">
                        {apt.customers?.name?.[0] || 'C'}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{apt.customers?.name || 'Walk-in'}</p>
                        <p className="text-xs text-slate-400 font-medium">{apt.customers?.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-4 py-1.5 bg-slate-50 text-slate-600 rounded-full text-xs font-bold border border-slate-100 group-hover:bg-white group-hover:border-blue-100 transition-all">
                      {apt.services?.name || 'Standard Service'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full border ${
                      apt.status === 'confirmed' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                        : apt.status === 'pending'
                        ? 'bg-amber-50 text-amber-600 border-amber-100'
                        : 'bg-slate-50 text-slate-500 border-slate-100'
                    }`}>
                      {apt.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-white rounded-lg transition-all">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {(!appointments || appointments.length === 0) && (
          <div className="text-center py-24">
             <div className="w-16 h-16 bg-slate-50 text-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
               <Calendar className="w-8 h-8" />
             </div>
             <p className="text-slate-400 font-bold">No appointments found.</p>
             <p className="text-xs text-slate-400 mt-1">New bookings will appear here automatically.</p>
          </div>
        )}
      </div>
    </div>
  );
}
