import Link from "next/link";
import { MessageSquare, Calendar, Package, BarChart2 } from "lucide-react";

export function MobileNav() {
  const mobileTabs = [
    { name: "Home", href: "/dashboard", icon: BarChart2 },
    { name: "Chat", href: "/conversations", icon: MessageSquare },
    { name: "Bookings", href: "/appointments", icon: Calendar },
    { name: "Stock", href: "/inventory", icon: Package },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex justify-around items-center z-50">
      {mobileTabs.map(tab => {
        const Icon = tab.icon;
        return (
          <Link key={tab.name} href={tab.href} className="flex flex-col items-center justify-center w-full h-full text-slate-500 hover:text-emerald-600">
            <Icon className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-semibold">{tab.name}</span>
          </Link>
        )
      })}
    </div>
  );
}
