'use client';
import Link from 'next/link';
import {usePathname, useRouter} from 'next/navigation';
import Logo from '../ui/Logo';
import {useAuth} from '../../context/AuthContext';
const LINKS=[
  {href:'/dashboard',icon:'📊',label:'Overview'},
  {href:'/dashboard/domains',icon:'🌐',label:'My Domains'},
  {href:'/dashboard/hosting',icon:'☁️',label:'Hosting'},
  {href:'/dashboard/training',icon:'🎓',label:'Training'},
  {href:'/dashboard/billing',icon:'💳',label:'Billing'},
  {href:'/dashboard/tickets',icon:'🎫',label:'Support Tickets'},
  {href:'/dashboard/notifications',icon:'🔔',label:'Notifications'},
  {href:'/dashboard/settings',icon:'⚙️',label:'Settings'},
];
export default function DashboardLayout({children}) {
  const pathname=usePathname();
  const router=useRouter();
  const {user, logout}=useAuth();

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  const displayName = user ? `${user.first_name} ${user.last_name}` : 'My Account';
  const displayEmail = user?.email || '';
  const initials = user ? `${(user.first_name||'')[0]||''}${(user.last_name||'')[0]||''}`.toUpperCase() : 'U';

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="w-60 bg-white border-r border-slate-200 flex flex-col py-5 px-3 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto flex-shrink-0">
        <div className="px-3 pb-4 mb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#5cc4eb] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{initials}</div>
            <div className="min-w-0">
              <div className="font-semibold text-sm text-[#1d1d1d] truncate">{displayName}</div>
              <div className="text-xs text-slate-400 truncate">{displayEmail}</div>
            </div>
          </div>
        </div>
        <nav className="flex flex-col gap-0.5 flex-1">
          {LINKS.map(l=>(
            <Link key={l.href} href={l.href} className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm no-underline transition-all ${pathname===l.href?'bg-[#e8f6fc] text-[#5cc4eb] font-semibold':'text-slate-500 hover:bg-slate-100 hover:text-[#1d1d1d] font-medium'}`}>
              <span>{l.icon}</span>{l.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-slate-100 pt-3">
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded text-sm text-red-400 hover:bg-red-50 font-medium w-full bg-transparent border-none cursor-pointer text-left">
            <span>🚪</span>Sign Out
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
