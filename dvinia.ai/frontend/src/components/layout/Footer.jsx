'use client';
import Link from 'next/link';
import Logo from '../ui/Logo';
import { useSite } from '../../context/SiteContext';
import { useFooterColumns } from '../../lib/useContent';

export default function Footer() {
  const { s } = useSite();
  const { columns } = useFooterColumns();

  return (
    <footer className="bg-[#0B1D3A] text-white/60">
      <div className="max-w-7xl mx-auto px-5 py-14 grid grid-cols-1 md:grid-cols-5 gap-10">
        <div className="md:col-span-1">
          <div className="mb-4"><Logo variant="white" size="md" href="/" /></div>
          <p className="text-sm leading-relaxed text-white/45 max-w-[220px]">{s('site_name', 'TechPigeon')}</p>
          <p className="mt-3 text-xs text-white/35 leading-relaxed max-w-[220px]">{s('site_address', '')}</p>
          <div className="mt-5 flex items-center gap-4">
            <a href={s('social_facebook', '#')} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-white/30 hover:text-white/80 transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12z"/></svg>
            </a>
            <a href={s('social_linkedin', '#')} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-white/30 hover:text-white/80 transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a href={s('social_twitter', '#')} target="_blank" rel="noopener noreferrer" aria-label="Twitter / X" className="text-white/30 hover:text-white/80 transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.id}>
            <h4 className="text-white text-xs font-semibold tracking-wider mb-4 uppercase" style={{ fontFamily: "var(--font-heading, 'Aleo', serif)" }}>{col.title}</h4>
            {(Array.isArray(col.links) ? col.links : []).map(([label, href]) => (
              <Link key={label} href={href} className="block text-sm text-white/40 hover:text-white/80 mb-2.5 no-underline transition-colors">{label}</Link>
            ))}
          </div>
        ))}
      </div>

      <div className="border-t border-white/10 max-w-7xl mx-auto px-5 py-5 flex flex-col sm:flex-row justify-between gap-2 text-xs text-white/25">
        <span>{s('site_copyright', '')}</span>
        <span>{s('site_legal', '')}</span>
      </div>
    </footer>
  );
}
