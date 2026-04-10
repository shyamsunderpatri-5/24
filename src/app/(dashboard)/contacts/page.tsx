'use client'

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  Search, 
  Filter, 
  Download, 
  Upload, 
  MoreHorizontal,
  User,
  Phone,
  Calendar,
  Tag as TagIcon
} from 'lucide-react';
import { format } from 'date-fns';

export default function ContactsPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const supabase = createClient();

  useEffect(() => {
    fetchContacts();
  }, []);

  async function fetchContacts() {
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
        .from('contacts')
        .select('*')
        .eq('workspace_id', member.workspace_id)
        .order('last_message_at', { ascending: false });

      if (!error) setContacts(data || []);
    }
    setLoading(false);
  }

  const filteredContacts = contacts.filter(c => 
    (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Contacts</h2>
          <p className="text-slate-500 font-medium">Manage and segment your combined WhatsApp audience.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white text-slate-600 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-all shadow-sm">
            <Upload className="w-4 h-4" />
            Import CSV
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95">
            <User className="w-4 h-4" />
            Add Contact
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name or phone..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
              <Filter className="w-4 h-4" />
              Filters
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/30 border-b border-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <th className="px-8 py-5">Contact</th>
                <th className="px-8 py-5">Tags</th>
                <th className="px-8 py-5">Last Message</th>
                <th className="px-8 py-5">Date Added</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredContacts.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center text-blue-600 font-bold group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:text-white transition-all duration-300">
                        {c.name?.[0] || <User className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{c.name || 'Anonymous Contact'}</p>
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {c.phone}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-wrap gap-1">
                      {c.tags?.map((tag: string) => (
                        <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-500 rounded-md text-[10px] font-bold uppercase tracking-wider">
                          {tag}
                        </span>
                      ))}
                      {!c.tags?.length && <span className="text-slate-300 text-[10px] font-bold uppercase tracking-wider">No Tags</span>}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-xs font-bold text-slate-600 flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-300" />
                      {c.last_message_at ? format(new Date(c.last_message_at), 'MMM dd, yyyy') : 'Never'}
                    </p>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-xs font-medium text-slate-400">
                      {format(new Date(c.created_at), 'MMM dd, yyyy')}
                    </p>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors"><MoreHorizontal className="w-5 h-5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredContacts.length === 0 && !loading && (
            <div className="py-20 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-8 h-8 text-slate-200" />
              </div>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">No contacts found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
