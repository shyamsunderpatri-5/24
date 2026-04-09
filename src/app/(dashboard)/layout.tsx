import Link from 'next/link';
import { 
  LayoutDashboard, 
  Calendar, 
  MessageSquare, 
  Package, 
  Settings, 
  LogOut,
  Bell,
  Search,
  User
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Appointments', href: '/appointments', icon: Calendar },
    { name: 'Conversations', href: '/conversations', icon: MessageSquare },
    { name: 'Inventory', href: '/inventory', icon: Package },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col hidden md:flex shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="p-8 pb-10">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform">
              <div className="w-3 h-3 bg-white rounded-sm"></div>
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-800">
              Selvo<span className="text-blue-600">.ai</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href} 
              className="flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-200 group"
            >
              <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button className="flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold rounded-xl text-red-500 hover:bg-red-50 transition-all">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-10">
          <div className="flex items-center gap-4 bg-slate-100/50 px-4 py-2 rounded-full border border-slate-200/50 w-72">
            <Search className="w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search anything..." className="bg-transparent border-none text-sm outline-none w-full" />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-400 hover:text-blue-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800 leading-tight">Admin User</p>
                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Business Owner</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-sm font-bold shadow-lg shadow-blue-500/20 ring-2 ring-white">
                <User className="w-5 h-5" />
              </div>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
