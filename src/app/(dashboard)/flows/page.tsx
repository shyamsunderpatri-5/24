'use client'

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  Plus, 
  Settings2, 
  Play, 
  Trash2, 
  Bot 
} from 'lucide-react';
import Link from 'next/link';

export default function FlowsPage() {
  const [flows, setFlows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchFlows();
  }, []);

  async function fetchFlows() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Get workspace first or assume one for now
    const { data: member } = await supabase
      .from('workspace_members')
      .select('workspace_id')
      .eq('user_id', user.id)
      .limit(1)
      .single();

    if (member) {
      const { data, error } = await supabase
        .from('flows')
        .select('*')
        .eq('workspace_id', member.workspace_id)
        .order('created_at', { ascending: false });

      if (!error) setFlows(data || []);
    }
    setLoading(false);
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Flow Builder</h2>
          <p className="text-slate-500 font-medium">Design automated conversation paths for your customers.</p>
        </div>
        <Link 
          href="/flows/new" 
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Create New Flow
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {flows.map((flow) => (
          <div key={flow.id} className="group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300">
            <div className="flex items-start justify-between mb-6">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <Bot className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-slate-300 hover:text-blue-600 transition-colors"><Settings2 className="w-4 h-4" /></button>
                <button className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <h4 className="text-lg font-bold text-slate-800 mb-1">{flow.name}</h4>
            <p className="text-xs text-slate-400 font-medium mb-6 line-clamp-2">{flow.description || 'No description provided.'}</p>
            
            <div className="flex items-center justify-between pt-6 border-t border-slate-50">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${flow.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                {flow.is_active ? 'Active' : 'Inactive'}
              </span>
              <Link 
                href={`/flows/${flow.id}`}
                className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Edit Flow
                <Play className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}

        {flows.length === 0 && !loading && (
          <div className="col-span-full py-20 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-6">
              <Bot className="w-10 h-10 text-slate-200" strokeWidth={2.5} />
            </div>
            <h4 className="text-xl font-bold text-slate-800 mb-2">No flows created yet</h4>
            <p className="text-sm text-slate-400 max-w-xs mx-auto mb-8">Start by creating your first automation flow to handle common customer inquiries 24/7.</p>
            <Link 
              href="/flows/new" 
              className="px-8 py-4 bg-white text-blue-600 font-bold rounded-2xl border border-slate-200 hover:border-blue-600 transition-all shadow-sm"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
