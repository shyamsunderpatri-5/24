export default function SettingsPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-800">Settings</h2>
        <p className="text-sm text-slate-500">Configure your AI Receptionist and Business details.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar for settings */}
        <div className="space-y-1 col-span-1">
          {['General Profile', 'WhatsApp Connection', 'Business Hours', 'Services', 'Subscription'].map((item, i) => (
            <button key={i} className={`block w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${i===0 ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}>
              {item}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="md:col-span-3 space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Business Information</h3>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Business Name</label>
                <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-xl transition-all" defaultValue="Apollo Clinic" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Business Type</label>
                <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-xl transition-all">
                  <option>Clinic</option>
                  <option>Salon</option>
                  <option>Kirana</option>
                  <option>Medical Shop</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">AI Greeting Message</label>
                <textarea rows={3} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-xl transition-all resize-none" defaultValue="Namaste! Welcome to Apollo Clinic. How can I help you today?" />
                <p className="text-xs text-slate-500 mt-2">The AI strictly follows this greeting when starting new context.</p>
              </div>
              <div className="pt-4 flex items-center justify-end">
                  <button className="px-6 py-3 bg-blue-600 shadow-sm text-white rounded-xl font-medium hover:bg-blue-700 transition active:scale-[0.98]">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
