import { 
  Building2, 
  Smartphone, 
  Clock, 
  Briefcase, 
  CreditCard,
  Save,
  ChevronRight
} from 'lucide-react';

export default function SettingsPage() {
  const settingsNav = [
    { name: 'General Profile', icon: Building2, active: true },
    { name: 'WhatsApp Connection', icon: Smartphone },
    { name: 'Business Hours', icon: Clock },
    { name: 'Services', icon: Briefcase },
    { name: 'Subscription', icon: CreditCard },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">System Settings</h1>
        <p className="text-slate-500 font-medium">Configure your AI receptionist intelligence and business identity.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        
        {/* Navigation Sidebar for settings */}
        <div className="space-y-2 col-span-1">
          {settingsNav.map((item, i) => (
            <button 
              key={i} 
              className={`flex items-center gap-3 w-full text-left px-5 py-4 rounded-2xl text-sm font-bold transition-all duration-200 ${
                item.active 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                  : 'text-slate-500 hover:bg-white hover:text-blue-600 hover:shadow-sm'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-8">
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-4 mb-8">
               <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                 <Building2 className="w-6 h-6" />
               </div>
               <h3 className="text-xl font-black text-slate-800 tracking-tight">Business Profile</h3>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Business Name</label>
                  <input 
                    type="text" 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-sm font-bold text-slate-800 transition-all outline-none" 
                    defaultValue="Apollo Clinic" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Industry Vertical</label>
                  <select className="w-full px-5 py-4 bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-sm font-bold text-slate-800 transition-all outline-none appearance-none">
                    <option>Healthcare & Clinics</option>
                    <option>Retail & Pharmacy</option>
                    <option>Hospitality & Hotels</option>
                    <option>Professional Services</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">AI Agent Persona (Greeting)</label>
                <textarea 
                  rows={4} 
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-sm font-bold text-slate-800 transition-all outline-none resize-none" 
                  defaultValue="Namaste! Welcome to Apollo Clinic. I am your AI receptionist. How can I assist you with appointments or orders today?" 
                />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight ml-1">
                  This greeting sets the tone for all automated WhatsApp interactions.
                </p>
              </div>

              <div className="pt-8 flex items-center justify-end">
                  <button className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-[1.25rem] font-black text-sm shadow-xl shadow-blue-500/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all active:scale-[0.98]">
                    <Save className="w-4 h-4" />
                    Save Configuration
                  </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
