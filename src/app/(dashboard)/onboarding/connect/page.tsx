import { Smartphone, ShieldCheck, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function OnboardingStep3() {
  return (
    <div className="max-w-3xl mx-auto py-20 px-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="bg-white p-12 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-100 relative overflow-hidden">
        <header className="mb-10 relative">
          <div className="flex items-center gap-2 mb-4">
             <span className="px-3 py-1 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full">Phase 03</span>
             <span className="text-slate-300">/ 03</span>
          </div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tight mb-2">Activate AI Consciousness</h2>
          <p className="text-slate-500 font-medium text-lg leading-relaxed">Connect your WhatsApp Business Number to bring your enterprise receptionist to life.</p>
        </header>

        <div className="space-y-8 relative">
          <div className="p-10 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-[2rem] relative overflow-hidden group">
             <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
               <Smartphone className="w-40 h-40" />
             </div>
             
             <div className="relative z-10">
               <div className="flex items-center gap-3 mb-4">
                 <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm">
                   <ShieldCheck className="w-6 h-6" />
                 </div>
                 <h3 className="text-xl font-black text-emerald-900 tracking-tight">Official Meta Integration</h3>
               </div>
               
               <p className="text-emerald-700/70 font-medium mb-8 max-w-md">
                 We use the official WhatsApp Cloud API. This ensures 100% compliance with Meta policies and zero risk of numbers being blocked.
               </p>
               
               <button className="flex items-center gap-3 px-8 py-4 bg-[#25D366] text-white font-black rounded-2xl hover:bg-[#1DA851] transition-all shadow-xl shadow-emerald-500/20 active:scale-[0.98]">
                 Connect Business Number
                 <ArrowRight className="w-5 h-5" />
               </button>
             </div>
          </div>

          <div className="pt-10 flex items-center justify-between border-t border-slate-50">
             <Link href="/onboarding/setup" className="flex items-center gap-2 text-slate-400 hover:text-slate-600 font-bold transition-colors">
               <ArrowLeft className="w-4 h-4" />
               Refine Operations
             </Link>
             
             <Link href="/dashboard" className="flex items-center gap-3 px-10 py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-black transition-all shadow-xl shadow-slate-900/10 active:scale-[0.98] group">
               Launch Dashboard
               <Sparkles className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform" />
             </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
