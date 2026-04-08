import { createClient } from '@/lib/supabase/server';
import { format } from 'date-fns';

export default async function CustomersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('owner_user_id', user?.id)
    .single();

  if (!business) return <div>Business not found.</div>;

  const { data: customers } = await supabase
    .from('customers')
    .select('*')
    .eq('business_id', business.id)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">Customers</h2>
          <p className="text-sm text-slate-500">View and manage your custom database built by AI interactions.</p>
        </div>
        <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition shadow-sm">
          Export CSV
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
            <tr>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">WhatsApp Number</th>
              <th className="px-6 py-4">Total Visits</th>
              <th className="px-6 py-4">Last Active</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers?.map((c: any) => (
              <tr key={c.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition">
                <td className="px-6 py-4 font-medium text-slate-800">{c.name || 'New Customer'}</td>
                <td className="px-6 py-4 font-mono text-xs">{c.phone}</td>
                <td className="px-6 py-4">
                   <span className="font-semibold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-xs">{c.total_visits || 0}</span>
                </td>
                <td className="px-6 py-4 text-slate-500 text-xs">
                  {c.last_visit_at ? format(new Date(c.last_visit_at), 'dd MMM, hh:mm a') : 'Recently joined'}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-blue-600 font-medium hover:text-blue-700 transition">View Details</button>
                </td>
              </tr>
            ))}
            {(!customers || customers.length === 0) && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                  No customers found yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
