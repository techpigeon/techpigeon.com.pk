'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Logo from '../ui/Logo';
import Button from '../ui/Button';
import { NAV_LINKS } from '../../lib/data';
import { useAuth } from '../../context/AuthContext';

const PRIMARY_LINKS = NAV_LINKS.slice(0, 5);   // Home → Training
const SECONDARY_LINKS = NAV_LINKS.slice(5);     // About, Contact

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, logout, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isActive = (href) =>
    href === '/'
      ? pathname === '/'
      : pathname === href || pathname.startsWith(href + '/');

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    router.push('/auth/login');
  };

  const initials = user ? `${(user.first_name||'')[0]||''}${(user.last_name||'')[0]||''}`.toUpperCase() : '';
  const dashboardHref = isAdmin ? '/admin' : '/dashboard';

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-5 flex items-center justify-between h-16">
        {/* ── Logo ── */}
        <Logo size="md" />

        {/* ── Primary nav links (desktop) ── */}
        <div className="hidden md:flex items-center gap-1">
          {PRIMARY_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3.5 py-2 rounded text-sm font-semibold no-underline transition-all ${
                isActive(l.href)
                  ? 'text-[#bba442] bg-[#f5edc8]/30'
                  : 'text-[#1d1d1d] hover:text-[#bba442] hover:bg-slate-100'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* ── Secondary links + auth (desktop) ── */}
        <div className="hidden md:flex items-center gap-3">
          {SECONDARY_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-2.5 py-2 rounded text-sm font-semibold no-underline transition-all ${
                isActive(l.href)
                  ? 'text-[#bba442]'
                  : 'text-[#1d1d1d]/70 hover:text-[#bba442]'
              }`}
            >
              {l.label}
            </Link>
          ))}
          <span className="w-px h-5 bg-slate-200" />
          {!loading && isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-all bg-transparent border-none cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-[#5cc4eb] flex items-center justify-center text-white text-xs font-bold">{initials}</div>
                <span className="text-sm font-semibold text-[#1d1d1d] max-w-[120px] truncate">{user?.first_name}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
              </button>
              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                  <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <div className="text-sm font-semibold text-[#1d1d1d]">{user?.first_name} {user?.last_name}</div>
                      <div className="text-xs text-slate-400 truncate">{user?.email}</div>
                    </div>
                    <Link href={dashboardHref} className="block px-4 py-2 text-sm text-[#1d1d1d] hover:bg-slate-50 no-underline" onClick={() => setDropdownOpen(false)}>
                      {isAdmin ? 'Admin Panel' : 'Dashboard'}
                    </Link>
                    <Link href="/dashboard/settings" className="block px-4 py-2 text-sm text-[#1d1d1d] hover:bg-slate-50 no-underline" onClick={() => setDropdownOpen(false)}>
                      Settings
                    </Link>
                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 bg-transparent border-none cursor-pointer">
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : !loading ? (
            <>
              <Link href="/auth/login">
                <Button variant="outline" size="sm">Sign In</Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          ) : null}
        </div>

        {/* ── Hamburger (mobile) ── */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 bg-transparent border-none cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          <span className={`block w-5 h-0.5 bg-slate-600 transition-all ${open ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-0.5 bg-slate-600 transition-all ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-slate-600 transition-all ${open ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* ── Mobile drawer ── */}
      {open && (
        <div className="md:hidden border-t border-slate-100 bg-white px-5 py-4 flex flex-col gap-2">
          {PRIMARY_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`py-2 text-sm font-semibold no-underline ${
                isActive(l.href) ? 'text-[#bba442]' : 'text-[#1d1d1d]'
              }`}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <hr className="my-2 border-slate-100" />
          {SECONDARY_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`py-2 text-sm font-semibold no-underline ${
                isActive(l.href) ? 'text-[#bba442]' : 'text-[#1d1d1d]/70'
              }`}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <hr className="my-2 border-slate-100" />
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-2 py-2">
                <div className="w-7 h-7 rounded-full bg-[#5cc4eb] flex items-center justify-center text-white text-xs font-bold">{initials}</div>
                <span className="text-sm font-semibold text-[#1d1d1d]">{user?.first_name} {user?.last_name}</span>
              </div>
              <Link href={dashboardHref} onClick={() => setOpen(false)}>
                <Button full variant="outline" size="sm">{isAdmin ? 'Admin Panel' : 'Dashboard'}</Button>
              </Link>
              <Button full variant="danger" size="sm" onClick={() => { handleLogout(); setOpen(false); }}>Sign Out</Button>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button full variant="outline" size="sm">Sign In</Button>
              </Link>
              <Link href="/auth/register">
                <Button full size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
