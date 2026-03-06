'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
const LINKS=[
  {href:'/admin',icon:'📊',label:'Overview'},
  {href:'/admin/users',icon:'👥',label:'Users'},
  {href:'/admin/orders',icon:'📦',label:'Orders'},
  {href:'/admin/payments',icon:'💳',label:'Payments'},
  {href:'/admin/domains',icon:'🌐',label:'Domains'},
  {href:'/admin/hosting',icon:'☁️',label:'Hosting'},
  {href:'/admin/courses',icon:'🎓',label:'Courses'},
  {href:'/admin/tickets',icon:'🎫',label:'Tickets'},
];
export default function AdminLayout({children}) {
  const pathname=usePathname();
  return (
    <div className="flex min-h-screen">
      <aside className="w-60 bg-[#0B1D3A] flex flex-col py-5 px-3 sticky top-0 h-screen overflow-y-auto flex-shrink-0">
        <div className="px-3 pb-4 mb-3 border-b border-white/10">
          <div className="text-white font-bold text-sm">TechPigeon Admin</div>
          <div className="text-xs text-white/40 mt-0.5">admin@techpigeon.org</div>
        </div>
        <nav className="flex flex-col gap-0.5 flex-1">
          {LINKS.map(l=>(
            <Link key={l.href} href={l.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm no-underline transition-all ${pathname===l.href?'bg-[#00A8E8]/25 text-white font-semibold':'text-white/50 hover:bg-white/10 hover:text-white font-medium'}`}>
              <span>{l.icon}</span>{l.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/10 pt-3">
          <Link href="/auth/login" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-900/20 font-medium no-underline">
            <span>🚪</span>Sign Out
          </Link>
        </div>
      </aside>
      <main className="flex-1 p-8 bg-slate-50">{children}</main>
    </div>
  );
}
