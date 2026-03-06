import Link from 'next/link';
import Logo from '../ui/Logo';
export default function Footer() {
  return (
    <footer className="bg-[#0B1D3A] text-white/60">
      <div className="max-w-7xl mx-auto px-5 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="mb-4"><Logo variant="white" size="md" linkTo="/"/></div>
          <p className="text-sm leading-relaxed text-white/45 max-w-[220px]">Pakistan's most trusted digital partner — domains, cloud hosting, and IT training.</p>
          <div className="mt-4 space-y-1">
            <p className="text-xs text-white/35">📧 info@techpigeon.org</p>
            <p className="text-xs text-white/35">📍 Rawalpindi, Punjab, Pakistan</p>
          </div>
        </div>
        {[['Services',[['Domains','/domains'],['Cloud Hosting','/hosting'],['IT Training','/training'],['SSL Certs','#']]],
          ['Company', [['About','#'],['Blog','#'],['Careers','#'],['Partners','#']]],
          ['Support',  [['Help Center','#'],['Contact','#'],['Status','#'],['API Docs','#']]]
        ].map(([t,links])=>(
          <div key={t}>
            <h4 className="text-white text-sm font-semibold mb-4">{t}</h4>
            {links.map(([l,h])=><Link key={l} href={h} className="block text-sm text-white/40 hover:text-white/80 mb-2.5 no-underline transition-colors">{l}</Link>)}
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 max-w-7xl mx-auto px-5 py-5 flex justify-between text-xs text-white/25">
        <span>© 2024 TechPigeon (TSN Pakistan). All rights reserved.</span>
        <span>Privacy · Terms</span>
      </div>
    </footer>
  );
}
