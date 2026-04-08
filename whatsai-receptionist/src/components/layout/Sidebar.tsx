import Link from "next/link";
import { MessageSquare, Calendar, Package, Settings, BarChart2, Users } from "lucide-react";

export function Sidebar() {
  const tabs = [
    { name: "Dashboard", href: "/dashboard", icon: BarChart2 },
    { name: "Conversations", href: "/conversations", icon: MessageSquare },
    { name: "Appointments", href: "/appointments", icon: Calendar },
    { name: "Inventory", href: "/inventory", icon: Package },
    { name: "Customers", href: "/customers", icon: Users },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-slate-100 bg-white shadow-sm h-screen fixed">
      <div className="h-16 flex items-center px-6 border-b border-slate-50">
        <div className="text-xl font-black bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent italic">Selvo</div>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Link key={tab.name} href={tab.href} className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 font-medium hover:bg-slate-50 hover:text-emerald-600 transition-colors">
              <Icon className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
              {tab.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
