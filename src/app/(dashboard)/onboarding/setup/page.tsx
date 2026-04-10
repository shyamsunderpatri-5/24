import { Clock, Briefcase, ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function OnboardingStep2() {
  return (
    <div className="max-w-3xl mx-auto py-20 px-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="bg-white p-12 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-100 relative overflow-hidden">
        <header className="mb-10 relative">
          <div className="flex items-center gap-2 mb-4">
             <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full">Phase 02</span>
             <span className="text-slate-300">/ 03</span>
          </div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tight mb-2">Operational Hours & Services</h2>
          <p className="text-slate-500 font-medium text-lg leading-relaxed">Tell your AI receptionist when you're open so it can book appointments accurately.</p>
        </header>

        <form className="space-y-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                <Clock className="w-3 h-3 text-blue-500" />
                Opens At
              </label>
              <input type="time" defaultValue="09:00" className="w-full px-6 py-5 bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-500/10 rounded-[1.5rem] text-sm font-bold text-slate-800 transition-all outline-none" />
            </div>
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                <Clock className="w-3 h-3 text-rose-500" />
                Closes At
              </label>
              <input type="time" defaultValue="18:00" className="w-full px-6 py-5 bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-500/10 rounded-[1.5rem] text-sm font-bold text-slate-800 transition-all outline-none" />
            </div>
          </div>

          <div className="space-y-3">
             <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
               <Briefcase className="w-3 h-3 text-indigo-500" />
               Primary Services
             </label>
             <input type="text" className="w-full px-6 py-5 bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-500/10 rounded-[1.5rem] text-sm font-bold text-slate-800 transition-all outline-none" placeholder="e.g. Consultation, Tooth Extraction, Scaling" />
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight ml-1">Comma-separated list of your top 3 services.</p>
          </div>

          <div className="pt-10 flex items-center justify-between border-t border-slate-50">
             <Link href="/onboarding" className="flex items-center gap-2 text-slate-400 hover:text-slate-600 font-bold transition-colors">
               <ArrowLeft className="w-4 h-4" />
               Back to Basics
             </Link>
             <Link href="/onboarding/connect" className="flex items-center gap-3 px-10 py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-[0.98] group">
               Save Operations
               <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
             </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
