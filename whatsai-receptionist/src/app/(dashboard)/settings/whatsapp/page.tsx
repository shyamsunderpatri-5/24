export const dynamic = 'force-dynamic';
export default function WhatsAppSettings() {
  return (
    <div className="max-w-3xl mt-6 lg:mt-0">
      <h3 className="text-xl font-bold text-slate-800 mb-6">WhatsApp Connection</h3>
      <div className="bg-white p-8 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100">
        <div className="flex items-center gap-4 mb-6">
           <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center font-bold text-xl border border-emerald-100">WA</div>
           <div>
              <p className="font-bold text-slate-800">Status: <span className="text-emerald-600">Connected</span></p>
              <p className="text-sm text-slate-500">Phone Number: +91 98765 43210</p>
           </div>
        </div>
        <button className="px-5 py-2.5 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 text-sm font-semibold transition-colors">Disconnect Business API</button>
      </div>
    </div>
  )
}
