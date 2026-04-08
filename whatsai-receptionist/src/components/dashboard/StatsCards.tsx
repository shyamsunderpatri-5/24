export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
        <h3 className="text-sm font-medium text-slate-500">Total Bookings</h3>
        <p className="text-3xl font-black text-slate-800 mt-2 tracking-tight">124</p>
      </div>
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
        <h3 className="text-sm font-medium text-slate-500">Active Chats</h3>
        <p className="text-3xl font-black text-slate-800 mt-2 tracking-tight">18</p>
      </div>
    </div>
  );
}
