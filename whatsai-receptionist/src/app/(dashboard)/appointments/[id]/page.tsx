export default async function AppointmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold tracking-tight text-slate-800">Appointment Details</h2>
      <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100">
         <p className="text-slate-500 mb-4">Viewing details for Booking ID: <span className="font-mono text-blue-600 px-2 py-1 bg-slate-50 border border-slate-100 rounded-lg">{resolvedParams.id}</span></p>
         <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
               <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">Customer</span>
               <span className="font-medium text-slate-800">Riya Singh</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
               <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">Status</span>
               <span className="font-semibold text-emerald-600">Confirmed ✨</span>
            </div>
         </div>
      </div>
    </div>
  )
}
