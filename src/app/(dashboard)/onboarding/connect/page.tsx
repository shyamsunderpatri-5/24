export const dynamic = 'force-dynamic';
import Link from 'next/link';

export default function OnboardingStep3() {
  return (
    <div className="max-w-2xl mx-auto py-12">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold mb-2">Step 3: Connect WhatsApp</h2>
        <p className="text-slate-500 mb-6">Link your WhatsApp Business API to activate the AI.</p>
        
        <div className="space-y-6">
          <div className="p-8 bg-blue-50 border border-blue-100 rounded-2xl text-center">
             <h3 className="font-bold text-blue-800 mb-2 text-lg">WhatsApp Business Login</h3>
             <p className="text-sm text-blue-600 mb-6">You will be redirected to Facebook to securely link your WhatsApp number.</p>
             <button className="px-8 py-3 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#1DA851] transition shadow-md mx-auto block">
                Connect via Meta
             </button>
          </div>
          
          <div className="pt-4 flex justify-between items-center border-t border-slate-100 mt-6 pt-6">
             <Link href="/onboarding/setup" className="inline-block px-6 py-3 bg-slate-100 text-slate-600 font-medium rounded-xl hover:bg-slate-200 transition">
               ← Back
             </Link>
             <Link href="/dashboard" className="inline-block px-6 py-3 bg-slate-800 text-white font-medium rounded-xl hover:bg-slate-900 transition flex items-center gap-2">
               Complete Setup ✨
             </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
