import Link from 'next/link';
import { Building2, ArrowRight, ShieldCheck } from 'lucide-react';

export default function OnboardingStep1() {
  return (
    <div className="max-w-3xl mx-auto py-20 px-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="bg-white p-12 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <Building2 className="w-32 h-32" />
        </div>
        
        <header className="mb-10 relative">
          <div className="flex items-center gap-2 mb-4">
             <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full">Phase 01</span>
             <span className="text-slate-300">/ 03</span>
          </div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tight mb-2">Configure Business Intelligence</h2>
          <p className="text-slate-500 font-medium text-lg leading-relaxed">Let's fine-tune your AI receptionist's identity to match your professional brand.</p>
        </header>
        
        <form className="space-y-8 relative">
          <div className="space-y-3">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              Industry Vertical
            </label>
            <select className="w-full px-6 py-5 bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-500/10 rounded-[1.5rem] text-sm font-bold text-slate-800 transition-all outline-none appearance-none cursor-pointer">
              <option>Clinic / Healthcare Practice</option>
              <option>Salon / Spa & Wellness</option>
              <option>Retail / Fashion & Lifestyle</option>
              <option>Hospitality / Hotels & Cafes</option>
            </select>
          </div>

          <div className="space-y-3">
             <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Headquarters Address</label>
             <textarea rows={3} className="w-full px-6 py-5 bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-500/10 rounded-[1.5rem] text-sm font-bold text-slate-800 transition-all outline-none resize-none" placeholder="Provide your physical or digital HQ address..."></textarea>
          </div>
          
          <div className="pt-10 flex items-center justify-between border-t border-slate-50">
             <p className="text-xs text-slate-400 font-medium italic">All data is encrypted with AES-256 standards.</p>
             <Link href="/onboarding/setup" className="flex items-center gap-3 px-10 py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-[0.98] group">
               Continue Deployment
               <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
             </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
