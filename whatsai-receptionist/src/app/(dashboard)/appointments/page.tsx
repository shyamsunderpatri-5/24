import { createClient } from '@/lib/supabase/server';
import { format } from 'date-fns';
import { AddAppointmentButton } from '@/components/dashboard/AddAppointmentButton';

export default async function AppointmentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return <div>Unauthorized</div>;

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('owner_user_id', user.id)
    .single();

  if (!business) return <div>Please complete onboarding first.</div>;

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">Appointments</h2>
          <p className="text-sm text-slate-500">Manage your daily schedule and bookings.</p>
        </div>
        <AddAppointmentButton services={services || []} />
      </div>

      <div className="bg-white rounded-xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
            <tr>
              <th className="px-6 py-4">Date & Time</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Service</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments?.map((apt: any) => (
              <tr key={apt.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition">
                <td className="px-6 py-4 font-medium text-slate-800">
                  {format(new Date(apt.appointment_at), 'dd MMM yyyy, hh:mm a')}
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-700">{apt.customers?.name || 'Unknown'}</div>
                  <div className="text-xs text-slate-400">{apt.customers?.phone}</div>
                </td>
                <td className="px-6 py-4">{apt.services?.name || 'General'}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                    apt.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                    apt.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                    'bg-slate-50 text-slate-600 border-slate-100'
                  }`}>
                    {apt.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-blue-600 font-medium hover:text-blue-700 transition">Edit</button>
                </td>
              </tr>
            ))}
            {(!appointments || appointments.length === 0) && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                  No appointments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
