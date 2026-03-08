'use client';
import Link from 'next/link';
import {usePathname, useRouter} from 'next/navigation';
import {useAuth} from '../../context/AuthContext';
const LINKS=[
  {href:'/admin',icon:'📊',label:'Overview'},
  {href:'/admin/users',icon:'👥',label:'Users'},
  {href:'/admin/orders',icon:'📦',label:'Orders'},
  {href:'/admin/payments',icon:'💳',label:'Payments'},
  {href:'/admin/domains',icon:'🌐',label:'Domains'},
  {href:'/admin/hosting',icon:'☁️',label:'Hosting'},
  {href:'/admin/courses',icon:'🎓',label:'Courses'},
  {href:'/admin/tickets',icon:'🎫',label:'Tickets'},
  {href:'/admin/content',icon:'📝',label:'Content'},
  {href:'/admin/settings',icon:'⚙️',label:'Site Settings'},
];
export default function AdminLayout({children}) {
  const pathname=usePathname();
  const router=useRouter();
  const {user, logout}=useAuth();

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  const displayName = user ? `${user.first_name} ${user.last_name}` : 'Admin';
  const displayEmail = user?.email || '';
  const initials = user ? `${(user.first_name||'')[0]||''}${(user.last_name||'')[0]||''}`.toUpperCase() : 'A';

  return (
    <div className="flex min-h-screen">
      <aside className="w-60 bg-[#0B1D3A] flex flex-col py-5 px-3 sticky top-0 h-screen overflow-y-auto flex-shrink-0">
        <div className="px-3 pb-4 mb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-full bg-[#5cc4eb] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{initials}</div>
            <div className="min-w-0">
              <div className="text-white font-bold text-sm truncate">{displayName}</div>
              <div className="text-xs text-white/40 truncate">{displayEmail}</div>
            </div>
          </div>
          <span className="inline-block text-[10px] font-semibold text-[#5cc4eb] bg-[#5cc4eb]/15 px-2 py-0.5 rounded-full mt-1.5 uppercase">{user?.role || 'admin'}</span>
        </div>
        <nav className="flex flex-col gap-0.5 flex-1">
          {LINKS.map(l=>(
            <Link key={l.href} href={l.href} className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm no-underline transition-all ${pathname===l.href?'bg-[#5cc4eb]/25 text-white font-semibold':'text-white/50 hover:bg-white/10 hover:text-white font-medium'}`}>
              <span>{l.icon}</span>{l.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/10 pt-3">
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded text-sm text-red-400 hover:bg-red-900/20 font-medium w-full bg-transparent border-none cursor-pointer text-left">
            <span>🚪</span>Sign Out
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8 bg-slate-50">{children}</main>
    </div>
  );
}
