'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
        router.push('/dashboard');
    }, 1000);
  };

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <div className="m-auto w-full max-w-md p-8 bg-white/70 backdrop-blur-xl border border-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">Get Started</h2>
        <p className="text-slate-500 mb-8">Setup your 24/7 AI Receptionist</p>

        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Business Name</label>
            <input 
              type="text" 
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-slate-800"
              placeholder="e.g. Apollo Clinic" 
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-slate-800"
              placeholder="owner@business.com" 
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-slate-800"
              placeholder="••••••••" 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium shadow-md transition-all active:scale-[0.98]"
          >
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-600">
          Already have an account? <Link href="/login" className="text-blue-600 font-semibold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
