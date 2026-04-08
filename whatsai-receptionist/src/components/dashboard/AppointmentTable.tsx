export function AppointmentTable() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 flex-1 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
      <h3 className="font-bold text-slate-800 mb-4 text-lg">Upcoming Appointments</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400">
              <th className="pb-3 font-semibold">Customer</th>
              <th className="pb-3 font-semibold">Date</th>
              <th className="pb-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition">
              <td className="py-4 font-medium text-slate-800">John Doe</td>
              <td className="py-4">Oct 12, 10:00 AM</td>
              <td><span className="bg-emerald-50 border border-emerald-100 text-emerald-600 px-2.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase">Confirmed</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
