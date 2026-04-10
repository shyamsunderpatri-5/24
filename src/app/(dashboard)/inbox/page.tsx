'use client'

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  Search, 
  MessageSquare, 
  User, 
  Send, 
  MoreVertical,
  CheckCheck,
  Tag,
  UserPlus
} from 'lucide-react';
import { format } from 'date-fns';

export default function InboxPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchConversations();
    
    // Realtime subscription for new messages
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
          handleIncomingMessage(payload.new);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat.id);
    }
  }, [selectedChat]);

  async function fetchConversations() {
    const { data, error } = await supabase
      .from('conversations')
      .select('*, contacts(name, phone), whatsapp_numbers(phone_number)')
      .order('last_message_at', { ascending: false });

    if (!error) setConversations(data || []);
    setLoading(false);
  }

  async function fetchMessages(conversationId: string) {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (!error) setMessages(data || []);
  }

  function handleIncomingMessage(msg: any) {
    // If message belongs to current chat, update message list
    if (selectedChat && msg.conversation_id === selectedChat.id) {
       setMessages(prev => [...prev, msg]);
    }
    // Update conversation list last message preview
    fetchConversations();
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    const msg = newMessage;
    setNewMessage('');

    // Insert locally first (optimistic - ideally) or just wait for DB
    const { data, error } = await supabase.from('messages').insert({
       conversation_id: selectedChat.id,
       workspace_id: selectedChat.workspace_id,
       direction: 'outbound',
       sender_type: 'agent',
       content: msg,
       message_type: 'text'
    });

    if (error) console.error('Send error:', error);
  }

  return (
    <div className="h-[calc(100vh-10rem)] flex bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 border-r border-slate-100 flex flex-col bg-slate-50/30">
        <div className="p-6 border-b border-slate-100 space-y-4">
          <h3 className="text-xl font-bold text-slate-800">Inbox</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search chats..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/10"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {conversations.map((c) => (
            <div 
              key={c.id}
              onClick={() => setSelectedChat(c)}
              className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-white transition-all ${selectedChat?.id === c.id ? 'bg-white shadow-sm ring-1 ring-blue-500/5' : ''}`}
            >
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">
                {c.contacts?.name?.charAt(0) || <User className="w-5 h-5" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-bold text-slate-700 truncate">{c.contacts?.name || c.contacts?.phone}</span>
                  <span className="text-[10px] text-slate-400">{c.last_message_at ? format(new Date(c.last_message_at), 'HH:mm') : ''}</span>
                </div>
                <p className="text-xs text-slate-500 truncate">{c.id === selectedChat?.id ? 'Active' : 'No message preview'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                  {selectedChat.contacts?.name?.charAt(0) || <User className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">{selectedChat.contacts?.name || selectedChat.contacts?.phone}</h4>
                  <p className="text-xs text-slate-400">{selectedChat.whatsapp_numbers?.phone_number}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Tag className="w-5 h-5" /></button>
                <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><UserPlus className="w-5 h-5" /></button>
                <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><MoreVertical className="w-5 h-5" /></button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/20">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] p-4 rounded-2xl shadow-sm text-sm ${m.direction === 'outbound' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border border-slate-100 rounded-tl-none'}`}>
                    <p>{m.content}</p>
                    <div className={`text-[10px] mt-1 flex items-center gap-1 ${m.direction === 'outbound' ? 'text-blue-100 justify-end' : 'text-slate-400'}`}>
                      {format(new Date(m.created_at), 'HH:mm')}
                      {m.direction === 'outbound' && <CheckCheck className="w-3 h-3" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <form onSubmit={sendMessage} className="p-6 border-t border-slate-100 flex gap-4">
              <input 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-slate-100 border-none rounded-2xl px-6 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
              />
              <button 
                type="submit"
                className="bg-blue-600 text-white p-3 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-300 gap-4">
            <MessageSquare className="w-16 h-16 opacity-10" />
            <p className="font-medium">Selected a chat to start conversation</p>
          </div>
        )}
      </div>
    </div>
  );
}
