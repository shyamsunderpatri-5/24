import Link from 'next/link';

export default function OnboardingStep1() {
  return (
    <div className="max-w-2xl mx-auto py-12">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold mb-2">Step 1: Business Details</h2>
        <p className="text-slate-500 mb-6">Let's get your AI receptionist configured.</p>
        
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">What best describes your business?</label>
            <select className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-slate-50">
              <option>Clinic / Medical Practice</option>
              <option>Salon / Spa</option>
              <option>Kirana / Grocery</option>
              <option>Pharmacy / Medical Shop</option>
            </select>
          </div>
          <div>
             <label className="block text-sm font-medium text-slate-700 mb-2">Business Address</label>
             <textarea rows={3} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-slate-50" placeholder="123 Main St..."></textarea>
          </div>
          
          <div className="pt-4 text-right border-t border-slate-100">
             <Link href="/onboarding/setup" className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition">
               Next Step →
             </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
