"use client";
import './globals.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FilePieChart, UserCircle, Wind } from 'lucide-react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // "Monitoring" dihapus karena sudah digabung ke Dashboard (/)
  const menuItems = [
    { href: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { href: '/reports', icon: <FilePieChart size={20} />, label: 'Reports' },
    { href: '/about', icon: <UserCircle size={20} />, label: 'About' },
  ];

  return (
    <html lang="en">
      <body className="bg-[#020617] text-slate-100 flex min-h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r border-slate-800 p-6 hidden md:flex flex-col">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="p-2 bg-blue-600 rounded-lg text-white"><Wind size={24} /></div>
            <h2 className="text-xl font-bold tracking-tight">AirSense <span className="text-blue-500 text-sm block">System</span></h2>
          </div>
          
          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 p-3.5 rounded-2xl transition-all ${
                  pathname === item.href 
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="font-semibold">{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="pt-6 border-t border-slate-800 text-[10px] text-slate-500 px-2 font-mono uppercase">
            Agna Putra Prawira<br/>NIM: 2341720065
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-[#020617]">
          {children}
        </main>
      </body>
    </html>
  );
}