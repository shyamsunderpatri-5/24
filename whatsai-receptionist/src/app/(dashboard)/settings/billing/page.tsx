import { createClient } from '@/lib/supabase/server';
import { format } from 'date-fns';

export default async function BillingSettings() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: business } = await supabase
    .from('businesses')
    .select('*, subscriptions(*)')
    .eq('owner_user_id', user?.id)
    .single();

  if (!business) return <div>Business not found.</div>;

  const subscription = business.subscriptions?.[0];
  const isTrial = !subscription && business.subscription_tier === 'trial';

  return (
    <div className="max-w-3xl mt-6 lg:mt-0">
      <h3 className="text-xl font-bold text-slate-800 mb-6">Subscription & Billing</h3>
      <div className="bg-white p-8 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100 flex flex-col items-start gap-4">
         <div className="w-full flex justify-between items-start mb-2">
            <div>
               <p className="font-bold text-slate-800 text-lg">
                 {subscription ? `${subscription.tier.charAt(0).toUpperCase() + subscription.tier.slice(1)} Plan` : `Trial Mode`} 
                 {subscription && ` (₹${subscription.amount_inr}/mo)`}
               </p>
               <p className="text-sm text-slate-500 mt-1">
                 {subscription 
                   ? `Next billing date: ${format(new Date(subscription.current_period_end), 'MMM dd, yyyy')}`
                   : isTrial 
                     ? `Trial ends on: ${format(new Date(business.trial_ends_at), 'MMM dd, yyyy')}`
                     : 'No active subscription'}
               </p>
            </div>
            <span className={`px-3 py-1 border text-xs font-bold rounded-full uppercase tracking-wide ${
              (subscription?.status === 'active' || isTrial) ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-700'
            }`}>
              {subscription?.status || (isTrial ? 'Active' : 'Inactive')}
            </span>
         </div>
         <p className="text-sm text-slate-600 leading-relaxed border-t border-b border-slate-50 py-5 w-full">
           {subscription?.tier === 'premium' || business.subscription_tier === 'premium' 
             ? 'Includes Voice Notes (STT), Unlimited messaging, Multilingual Fallback, and Dedicated Support.'
             : 'Upgrade to Premium for Voice Notes, AI multi-agent logic, and detailed analytics.'}
         </p>
         <button className="px-6 py-3 bg-slate-800 text-white font-medium text-sm rounded-xl hover:bg-slate-900 transition shadow-sm active:scale-[0.98] mt-2">
           {subscription ? 'Manage via Razorpay' : 'Upgrade Now'}
         </button>
      </div>
    </div>
  );
}
