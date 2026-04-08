import { createClient } from '@/lib/supabase/server';

export default async function ServicesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('owner_user_id', user?.id)
    .single();

  if (!business) return <div>Business not found.</div>;

  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('business_id', business.id)
    .order('name', { ascending: true });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">Services</h2>
          <p className="text-sm text-slate-500">List the services your AI receptionist should handle.</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition">
          + Add Service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services?.map((svc: any) => (
          <div key={svc.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800">{svc.name}</h3>
                <p className="text-sm text-slate-500">{svc.duration_mins} minutes</p>
              </div>
              <span className="text-xl font-bold text-blue-600">₹{svc.price_inr}</span>
            </div>
            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-50">
              <button className="text-slate-400 hover:text-red-500 transition text-sm font-medium">Delete</button>
              <button className="text-blue-600 hover:text-blue-700 transition text-sm font-bold">Edit Settings</button>
            </div>
          </div>
        ))}
        {(!services || services.length === 0) && (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-2xl border border-dashed border-slate-200">
            No services added yet.
          </div>
        )}
      </div>
    </div>
  );
}
