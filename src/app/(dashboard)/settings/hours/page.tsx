export const dynamic = 'force-dynamic';
import { createClient } from '@/lib/supabase/server';

export default async function BusinessHoursPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('owner_user_id', user?.id)
    .single();

  if (!business) return <div>Business not found.</div>;

  const { data: hours } = await supabase
    .from('business_hours')
    .select('*')
    .eq('business_id', business.id)
    .order('day_of_week', { ascending: true });

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-800">Business Hours</h2>
        <p className="text-sm text-slate-500">Set your opening and closing times for AI scheduling.</p>
      </div>

      <div className="bg-white rounded-xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100 p-6">
        <div className="space-y-4">
          {days.map((day, index) => {
            const h = hours?.find(item => item.day_of_week === index);
            return (
              <div key={day} className="flex items-center justify-between p-4 rounded-xl border border-slate-50 bg-slate-50/30">
                <span className="font-semibold text-slate-700 w-32">{day}</span>
                <div className="flex items-center gap-4 flex-1 justify-end">
                   <div className="flex items-center gap-2">
                     <input 
                      type="time" 
                      defaultValue={h?.open_time || '09:00'} 
                      className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 outline-none"
                    />
                     <span className="text-slate-400">to</span>
                     <input 
                      type="time" 
                      defaultValue={h?.close_time || '18:00'} 
                      className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 outline-none"
                    />
                   </div>
                   <label className="relative inline-flex items-center cursor-pointer ml-4">
                      <input type="checkbox" defaultChecked={h?.is_open ?? true} className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                   </label>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-8 flex justify-end">
          <button className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition transform hover:-translate-y-0.5 active:translate-y-0">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
