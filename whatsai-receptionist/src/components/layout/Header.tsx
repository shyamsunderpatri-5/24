export function Header() {
  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40">
      <div className="lg:hidden">
        <h1 className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">WhatsAI</h1>
      </div>
      <div className="hidden lg:block">
        <h2 className="text-lg font-semibold text-slate-800">Dashboard Overview</h2>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
           <p className="text-sm font-bold text-slate-800">Demo Clinic</p>
           <p className="text-xs text-slate-500">Free Trial</p>
        </div>
        <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm shadow-sm">
          D
        </div>
      </div>
    </header>
  );
}
