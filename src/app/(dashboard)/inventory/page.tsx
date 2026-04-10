import { createClient } from '@/lib/supabase/server';
import { AddProductButton } from '@/components/dashboard/AddProductButton';
import { 
  Package, 
  Search, 
  Filter, 
  ArrowUpRight, 
  MoreVertical,
  AlertTriangle,
  FileDown
} from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function InventoryPage() {
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

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('business_id', business.id)
    .order('name', { ascending: true });

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Inventory</h1>
          <p className="text-slate-500 font-medium">Manage your products and AI-powered sales catalog.</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all shadow-sm">
            <FileDown className="w-4 h-4" />
            Export CSV
          </button>
          <AddProductButton />
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Product Name</th>
                <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Category</th>
                <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Stock Status</th>
                <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Unit Price</th>
                <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {products?.map((p: any) => (
                <tr key={p.id} className="group hover:bg-blue-50/30 transition-all duration-300">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-white group-hover:border-blue-100 transition-colors">
                        <Package className="w-6 h-6 text-slate-300 group-hover:text-blue-500" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{p.name}</p>
                        <p className="text-[10px] font-black text-slate-300 uppercase shrink-0">SKU: SEL-{p.id.slice(0, 4)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-4 py-1.5 bg-slate-50 text-slate-500 rounded-full text-xs font-bold border border-slate-100 group-hover:bg-white transition-all">
                      {p.category || 'Standard'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-bold tabular-nums ${p.stock_qty < 10 ? 'text-rose-600' : 'text-slate-800'}`}>
                        {p.stock_qty} {p.unit || 'Items'}
                      </span>
                      {p.stock_qty < 10 && (
                        <div className="flex items-center gap-1 text-[10px] font-black text-rose-500 bg-rose-50 px-2 py-1 rounded-lg">
                          <AlertTriangle className="w-3 h-3" />
                          LOW
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-black text-slate-800 tracking-tight text-lg">
                      ₹{p.price_inr.toLocaleString()}
                    </p>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-3 text-slate-400 hover:text-blue-600 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-100">
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {(!products || products.length === 0) && (
          <div className="text-center py-24 px-8">
             <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
               <Package className="w-10 h-10" strokeWidth={2.5} />
             </div>
             <h3 className="text-xl font-black text-slate-800 tracking-tight">Your catalog is empty</h3>
             <p className="text-sm text-slate-400 font-medium max-w-xs mx-auto mt-2">Add products to your inventory so your AI receptionist can help customers with orders.</p>
          </div>
        )}
      </div>
    </div>
  );
}
