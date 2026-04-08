import { createClient } from '@/lib/supabase/server';
import { AddProductButton } from '@/components/dashboard/AddProductButton';

export default async function InventoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('owner_user_id', user?.id)
    .single();

  if (!business) return <div>Business not found.</div>;

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('business_id', business.id)
    .order('name', { ascending: true });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">Inventory</h2>
          <p className="text-sm text-slate-500">Manage your products and stock for AI replies.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition shadow-sm">
            Import CSV
          </button>
          <AddProductButton />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
            <tr>
              <th className="px-6 py-4">Item Name</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((p: any) => (
              <tr key={p.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition">
                <td className="px-6 py-4 font-medium text-slate-800">{p.name}</td>
                <td className="px-6 py-4">
                   <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-xs font-medium">{p.category || 'General'}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`font-semibold flex items-center gap-1.5 ${p.stock_qty < 10 ? 'text-red-500' : 'text-emerald-600'}`}>
                    {p.stock_qty < 10 && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse inline-block"></span>}
                    {p.stock_qty} {p.unit || 'units'}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium">₹{p.price_inr}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-blue-600 font-medium hover:text-blue-700 transition">Edit</button>
                </td>
              </tr>
            ))}
            {(!products || products.length === 0) && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                  No products found. Start by adding one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
