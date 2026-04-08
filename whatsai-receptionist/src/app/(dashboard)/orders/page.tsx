export const dynamic = 'force-dynamic';
import { createClient } from '@/lib/supabase/server';
import { AddOrderButton } from '@/components/dashboard/AddOrderButton';
import { format } from 'date-fns';

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('owner_user_id', user?.id)
    .single();

  if (!business) return <div>Business not found.</div>;

  const { data: orders } = await supabase
    .from('orders')
    .select('*, customers(name, phone)')
    .eq('business_id', business.id)
    .order('created_at', { ascending: false });

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('business_id', business.id);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">Orders</h2>
          <p className="text-sm text-slate-500">Manage incoming orders and walk-in sales.</p>
        </div>
        <AddOrderButton products={products || []} />
      </div>

      <div className="bg-white rounded-xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
            <tr>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Items</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((o: any) => (
              <tr key={o.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition">
                <td className="px-6 py-4 font-medium text-slate-400">
                  {format(new Date(o.created_at), 'dd MMM, hh:mm a')}
                </td>
                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-700">{o.customers?.name || 'Walk-in'}</div>
                  <div className="text-xs text-slate-400">{o.customers?.phone}</div>
                </td>
                <td className="px-6 py-4">
                   <div className="max-w-[200px] truncate text-xs">
                     {(o.metadata?.items || []).map((item: any) => `${item.qty}x ${item.name}`).join(', ')}
                   </div>
                </td>
                <td className="px-6 py-4">
                   <span className={`font-semibold px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wide border ${
                     o.status === 'completed' || o.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                     'bg-amber-50 text-amber-600 border-amber-100'
                   }`}>
                     {o.status}
                   </span>
                </td>
                <td className="px-6 py-4 font-bold text-slate-900">₹{o.amount_inr}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-400 hover:text-blue-600 transition font-medium">Update</button>
                </td>
              </tr>
            ))}
            {(!orders || orders.length === 0) && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
