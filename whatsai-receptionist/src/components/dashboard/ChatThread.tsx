export function ChatThread() {
  return (
    <div className="flex-1 bg-slate-50/50 flex flex-col h-[calc(100vh-4rem)] lg:h-auto overflow-hidden">
      <div className="p-4 bg-white border-b border-slate-100 shrink-0">
        <h3 className="font-bold text-slate-800 text-lg">Jane Smith</h3>
        <p className="text-xs text-slate-400 relative top-[-2px]">+91 98765 43210</p>
      </div>
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div className="max-w-[85%] lg:max-w-[70%] bg-white border border-slate-100 rounded-2xl rounded-tl-sm p-4 shadow-sm text-sm text-slate-700 leading-relaxed">
           Hello, is 10am free?
        </div>
        <div className="max-w-[85%] lg:max-w-[70%] ml-auto bg-emerald-600 text-white rounded-2xl rounded-tr-sm p-4 shadow-sm text-sm leading-relaxed">
           Yes! I have booked you in for 10:00 AM.
        </div>
      </div>
    </div>
  );
}
