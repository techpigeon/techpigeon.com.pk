'use client';
import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '@/components/ui/Logo';

const LINKS = [
  { href:'/dashboard',               icon:'📊', label:'Overview' },
  { href:'/dashboard/domains',       icon:'🌐', label:'My Domains' },
  { href:'/dashboard/hosting',       icon:'☁️',  label:'Hosting' },
  { href:'/dashboard/training',      icon:'🎓', label:'Training' },
  { href:'/dashboard/billing',       icon:'💳', label:'Billing' },
  { href:'/dashboard/tickets',       icon:'🎫', label:'Support' },
  { href:'/dashboard/notifications', icon:'🔔', label:'Notifications' },
  { href:'/dashboard/settings',      icon:'⚙️',  label:'Settings' },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="w-60 bg-white border-r border-slate-200 flex flex-col py-5 px-3 sticky top-0 h-screen overflow-y-auto flex-shrink-0">
        <div className="px-2 pb-5 mb-2">
          <Logo size="sm" href="/"/>
        </div>
        <div className="px-3 pb-4 mb-3 border-b border-slate-100">
          <div className="w-9 h-9 bg-[#00A8E8] rounded-xl flex items-center justify-center text-white font-bold text-sm mb-2">A</div>
          <div className="font-semibold text-sm text-[#0B1D3A]">Ali Khan</div>
          <div className="text-xs text-slate-400">Client Account</div>
        </div>
        <nav className="flex flex-col gap-0.5 flex-1">
          {LINKS.map(l => (
            <Link key={l.href} href={l.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm no-underline transition-all
                ${pathname===l.href?'bg-[#EAF6FD] text-[#00A8E8] font-semibold':'text-slate-500 hover:bg-slate-100 hover:text-[#0B1D3A] font-medium'}`}>
              <span>{l.icon}</span>{l.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-slate-100 pt-3 mt-2">
          <Link href="/auth/login" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-50 font-medium no-underline transition-all">
            <span>🚪</span>Sign Out
          </Link>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
