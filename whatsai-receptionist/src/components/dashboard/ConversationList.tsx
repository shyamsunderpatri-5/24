export function ConversationList() {
  return (
    <div className="w-full lg:w-80 border-r border-slate-100 bg-white flex flex-col h-[calc(100vh-4rem)]">
      <div className="p-4 border-b border-slate-100">
         <h2 className="font-bold text-slate-800 text-lg">Chats</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <div className="p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-emerald-50 transition border border-transparent hover:border-emerald-100">
           <div className="flex justify-between items-start mb-1">
             <p className="font-bold text-slate-800 text-sm">Jane Smith</p>
             <span className="text-[10px] text-slate-400">10:42 AM</span>
           </div>
           <p className="text-xs text-slate-500 truncate">Hello, is 10am free?</p>
        </div>
      </div>
    </div>
  );
}
