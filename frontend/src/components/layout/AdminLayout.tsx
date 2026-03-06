'use client';
import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href:'/admin',          icon:'📊', label:'Overview' },
  { href:'/admin/users',    icon:'👥', label:'Users' },
  { href:'/admin/orders',   icon:'📦', label:'Orders' },
  { href:'/admin/payments', icon:'💳', label:'Payments' },
  { href:'/admin/domains',  icon:'🌐', label:'Domains' },
  { href:'/admin/hosting',  icon:'☁️',  label:'Hosting' },
  { href:'/admin/courses',  icon:'🎓', label:'Courses' },
  { href:'/admin/tickets',  icon:'🎫', label:'Tickets' },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="flex min-h-screen">
      <aside className="w-60 bg-[#0B1D3A] flex flex-col py-5 px-3 sticky top-0 h-screen overflow-y-auto flex-shrink-0">
        <div className="px-3 pb-4 mb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-[#00A8E8] rounded-xl flex items-center justify-center text-white font-bold text-base">T</div>
            <div>
              <div className="text-white text-sm font-bold" style={{fontFamily:"'DM Serif Display',serif"}}>
                tech<em style={{color:'#93C5FD',fontStyle:'italic'}}>pigeon</em>
              </div>
              <div className="text-white/40 text-xs">Admin Panel</div>
            </div>
          </div>
        </div>
        <nav className="flex flex-col gap-0.5 flex-1">
          {LINKS.map(l => (
            <Link key={l.href} href={l.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm no-underline transition-all
                ${pathname===l.href?'bg-[#00A8E8]/20 text-white font-semibold':'text-white/45 hover:bg-white/10 hover:text-white font-medium'}`}>
              <span>{l.icon}</span>{l.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/10 pt-3">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:bg-white/10 font-medium no-underline mb-1">
            <span>👤</span>Client View
          </Link>
          <Link href="/auth/login" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-900/20 font-medium no-underline">
            <span>🚪</span>Sign Out
          </Link>
        </div>
      </aside>
      <main className="flex-1 p-8 bg-slate-50 overflow-y-auto">{children}</main>
    </div>
  );
}
