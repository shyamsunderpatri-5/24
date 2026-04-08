import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const navItems = [
    { name: 'Overview', href: '/dashboard' },
    { name: 'Appointments', href: '/dashboard/appointments' },
    { name: 'Conversations', href: '/dashboard/conversations' },
    { name: 'Inventory', href: '/dashboard/inventory' },
    { name: 'Settings', href: '/dashboard/settings' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <Link href="/dashboard" className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 italic">
            Selvo
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link key={item.name} href={item.href} className="flex items-center px-4 py-3 text-sm font-medium rounded-xl text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-all">
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <h2 className="text-lg font-semibold text-slate-800">Dashboard</h2>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 text-white flex items-center justify-center text-sm font-bold shadow-sm">
              O
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
