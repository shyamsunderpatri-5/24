'use client'

import { useState } from 'react';
import { 
  Building2, 
  Users, 
  Phone, 
  CreditCard, 
  ShieldCheck,
  ChevronRight,
  Globe,
  Bell,
  Key
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('workspace');

  const tabs = [
    { id: 'workspace', label: 'Workspace', icon: Building2 },
    { id: 'team', label: 'Team Members', icon: Users },
    { id: 'whatsapp', label: 'WhatsApp Numbers', icon: Phone },
    { id: 'billing', label: 'Billing & Plans', icon: CreditCard },
    { id: 'security', label: 'Security', icon: ShieldCheck },
  ];

  return (
    <div className="flex gap-10">
      {/* Sidebar Navigation */}
      <div className="w-64 space-y-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
              activeTab === tab.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-sm animate-in fade-in slide-in-from-right-4 duration-500">
        {activeTab === 'workspace' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Workspace Profile</h3>
                <p className="text-slate-400 text-sm font-medium">Manage your business identity and general settings.</p>
              </div>
              <button className="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl text-sm">Save Changes</button>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Workspace Name</label>
                <input type="text" placeholder="e.g. Acme SaaS" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/5 transition-all text-sm font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Primary Contact Email</label>
                <input type="email" placeholder="admin@acme.com" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/5 transition-all text-sm font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Timezone</label>
                <select className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/5 transition-all text-sm font-bold">
                  <option>Asia/Kolkata (GMT+5:30)</option>
                  <option>UTC (GMT+0:00)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Language</label>
                <select className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/5 transition-all text-sm font-bold">
                  <option>English (US)</option>
                  <option>Hindi (India)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">Active Plan</h3>
              <p className="text-slate-400 text-sm font-medium">Manage your subscription and usage limits.</p>
            </div>

            <div className="p-8 bg-blue-600 rounded-[2rem] text-white flex items-center justify-between shadow-xl shadow-blue-500/20">
              <div>
                <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest">Current Plan</span>
                <h4 className="text-3xl font-black mt-2 tracking-tighter">Enterprise Pro</h4>
                <p className="text-blue-100 text-sm font-medium mt-1">Billed annually • Next renewal Apr 2026</p>
              </div>
              <button className="px-6 py-3 bg-white text-blue-600 font-black rounded-2xl text-sm shadow-lg active:scale-95 transition-all">Manage Billing</button>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {[
                { label: 'Messages', value: '45k / 100k', percent: 45 },
                { label: 'Contacts', value: '12k / Unlimited', percent: 12 },
                { label: 'Team Members', value: '8 / 20', percent: 40 },
              ].map((limit, i) => (
                <div key={i} className="p-6 border border-slate-100 rounded-3xl">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{limit.label}</p>
                  <h5 className="text-xl font-black text-slate-800 mb-4">{limit.value}</h5>
                  <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${limit.percent}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'team' && (
          <div className="space-y-8">
             <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Team Members</h3>
                <p className="text-slate-400 text-sm font-medium">Invite colleagues to help manage your inbox.</p>
              </div>
              <button className="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl text-sm">Add Member</button>
            </div>

            <div className="divide-y divide-slate-50">
               {[
                 { name: 'Admin User', email: 'admin@selvo.ai', role: 'Owner' },
                 { name: 'Support Agent 1', email: 'support@selvo.ai', role: 'Agent' },
               ].map((member, i) => (
                 <div key={i} className="py-4 flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-400">
                        {member.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{member.name}</p>
                        <p className="text-xs text-slate-400">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="px-3 py-1 bg-slate-50 text-slate-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                        {member.role}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-100 group-hover:text-slate-300 transition-colors" />
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
