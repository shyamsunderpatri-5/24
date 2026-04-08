export function AppointmentCalendar() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] h-72 flex flex-col items-center justify-center">
      <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mb-4">
        <span className="text-2xl">📅</span>
      </div>
      <p className="text-slate-400 font-medium tracking-wide">Calendar View Integration Hub</p>
      <p className="text-xs text-slate-400 mt-2">Connects to react-big-calendar</p>
    </div>
  );
}
