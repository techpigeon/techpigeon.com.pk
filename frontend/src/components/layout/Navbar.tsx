'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '@/components/ui/Logo';
import Button from '@/components/ui/Button';

const LINKS = [
  { href: '/',         label: 'Home' },
  { href: '/domains',  label: 'Domains' },
  { href: '/hosting',  label: 'Hosting' },
  { href: '/training', label: 'Training' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-5 flex items-center justify-between h-16">
        <Logo size="md" />
        <div className="hidden md:flex items-center gap-1">
          {LINKS.map(l => (
            <Link key={l.href} href={l.href}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all no-underline
                ${pathname === l.href ? 'text-[#00A8E8] bg-[#EAF6FD]' : 'text-slate-500 hover:text-[#0B1D3A] hover:bg-slate-100'}`}>
              {l.label}
            </Link>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-3">
          <Link href="/auth/login"><Button variant="outline" size="sm">Sign In</Button></Link>
          <Link href="/auth/register"><Button size="sm">Get Started</Button></Link>
        </div>
        <button className="md:hidden flex flex-col gap-1.5 p-2 border-none bg-transparent cursor-pointer" onClick={() => setOpen(!open)}>
          <span className={`block w-5 h-0.5 bg-slate-600 transition-all ${open ? 'rotate-45 translate-y-2' : ''}`}/>
          <span className={`block w-5 h-0.5 bg-slate-600 transition-all ${open ? 'opacity-0' : ''}`}/>
          <span className={`block w-5 h-0.5 bg-slate-600 transition-all ${open ? '-rotate-45 -translate-y-2' : ''}`}/>
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-slate-100 bg-white px-5 py-4 flex flex-col gap-2">
          {LINKS.map(l => <Link key={l.href} href={l.href} className="py-2 text-sm font-medium text-slate-600 no-underline" onClick={() => setOpen(false)}>{l.label}</Link>)}
          <hr className="my-2 border-slate-100"/>
          <Link href="/auth/login"    onClick={() => setOpen(false)}><Button full variant="outline" size="sm">Sign In</Button></Link>
          <Link href="/auth/register" onClick={() => setOpen(false)}><Button full size="sm">Get Started</Button></Link>
        </div>
      )}
    </nav>
  );
}
