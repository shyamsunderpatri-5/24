'use client'

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  Megaphone, 
  Send, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  BarChart3,
  Users,
  Plus
} from 'lucide-react';
import { format } from 'date-fns';

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchCampaigns();
  }, []);

  async function fetchCampaigns() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: member } = await supabase
      .from('workspace_members')
      .select('workspace_id')
      .eq('user_id', user.id)
      .limit(1)
      .single();

    if (member) {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('workspace_id', member.workspace_id)
        .order('created_at', { ascending: false });

      if (!error) setCampaigns(data || []);
    }
    setLoading(false);
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Campaigns</h2>
          <p className="text-slate-500 font-medium">Broadcast personalized messages to your audience.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95">
          <Plus className="w-5 h-5" />
          New Campaign
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Sent', value: '0', icon: Send, color: 'blue' },
          { label: 'Delivered', value: '0%', icon: CheckCircle2, color: 'emerald' },
          { label: 'Read Rate', value: '0%', icon: CheckCircle2, color: 'indigo' },
          { label: 'Failed', value: '0', icon: AlertCircle, color: 'red' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className={`w-10 h-10 rounded-xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600 mb-4`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-none mb-2">{stat.label}</p>
            <h4 className="text-2xl font-black text-slate-800">{stat.value}</h4>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
          <h3 className="text-lg font-bold text-slate-800">Recent Campaigns</h3>
          <div className="flex gap-2">
             <button className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-slate-600 bg-white border border-slate-100 rounded-xl">All</button>
             <button className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-slate-600 bg-white border border-slate-100 rounded-xl">Sent</button>
             <button className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-slate-600 bg-white border border-slate-100 rounded-xl">Scheduled</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/10 border-b border-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <th className="px-8 py-5">Campaign Name</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Recipients</th>
                <th className="px-8 py-5">Sent At</th>
                <th className="px-8 py-5 text-right">Performance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {campaigns.map((camp) => (
                <tr key={camp.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                        <Megaphone className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{camp.name}</p>
                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-tight">{camp.template_name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      camp.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 
                      camp.status === 'sending' ? 'bg-blue-50 text-blue-600 animate-pulse' :
                      'bg-slate-50 text-slate-400'
                    }`}>
                      {camp.status}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-xs font-black text-slate-600 flex items-center gap-2">
                       <Users className="w-4 h-4 text-slate-300" />
                       0
                    </p>
                  </td>
                  <td className="px-8 py-5 text-xs text-slate-400 font-medium">
                    {camp.scheduled_at ? format(new Date(camp.scheduled_at), 'MMM dd, HH:mm') : 'Draft'}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2 text-slate-300 hover:text-blue-600"><BarChart3 className="w-5 h-5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {campaigns.length === 0 && !loading && (
            <div className="py-20 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                <Megaphone className="w-8 h-8 text-slate-200" />
              </div>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">No campaigns yet</p>
              <p className="text-slate-300 text-xs max-w-xs mx-auto">Reach your entire audience at once with personalized WhatsApp broadcasts.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
