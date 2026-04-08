import Link from 'next/link';

export default function OnboardingStep2() {
  return (
    <div className="max-w-2xl mx-auto py-12">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold mb-2">Step 2: Services & Hours</h2>
        <p className="text-slate-500 mb-6">What time are you open and what do you offer?</p>
        
        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Open Time</label>
              <input type="time" defaultValue="09:00" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-slate-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Close Time</label>
              <input type="time" defaultValue="20:00" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-slate-50" />
            </div>
          </div>
          
          <div>
             <label className="block text-sm font-medium text-slate-700 mb-2">List 3 main services (comma separated)</label>
             <input type="text" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-slate-50" placeholder="Consultation, Checkup, Follow-up" />
          </div>
          
          <div className="pt-4 flex justify-between border-t border-slate-100">
             <Link href="/onboarding" className="inline-block px-6 py-3 bg-slate-100 text-slate-600 font-medium rounded-xl hover:bg-slate-200 transition">
               ← Back
             </Link>
             <Link href="/onboarding/connect" className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition">
               Next Step →
             </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
