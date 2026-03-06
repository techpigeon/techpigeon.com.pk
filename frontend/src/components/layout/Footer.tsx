import Link from 'next/link';
import Logo from '@/components/ui/Logo';
export default function Footer() {
  return (
    <footer className="bg-[#0B1D3A] text-white/60">
      <div className="max-w-7xl mx-auto px-5 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="mb-4"><Logo variant="white" size="md" href="/"/></div>
          <p className="text-sm leading-relaxed text-white/40 max-w-[220px]">Pakistan's most trusted partner for domains, cloud hosting, and IT training.</p>
          <div className="mt-4 space-y-1.5 text-xs text-white/30">
            <p>📧 info@techpigeon.org</p>
            <p>📞 +92 300 0000000</p>
            <p>📍 Rawalpindi, Punjab, Pakistan</p>
          </div>
        </div>
        {[
          ['Services',  [['Domain Registration','/domains'],['Cloud Hosting','/hosting'],['IT Training','/training'],['SSL Certificates','#'],['Business Email','#']]],
          ['Company',   [['About Us','#'],['Blog','#'],['Careers','#'],['Partners','#'],['Contact','#']]],
          ['Support',   [['Help Center','#'],['Status Page','#'],['API Docs','#'],['Billing FAQ','#'],['Community','#']]],
        ].map(([title, links]) => (
          <div key={title as string}>
            <h4 className="text-white text-sm font-semibold mb-4">{title as string}</h4>
            {(links as [string,string][]).map(([label, href]) => (
              <Link key={label} href={href} className="block text-sm text-white/35 hover:text-white/70 mb-2.5 no-underline transition-colors">{label}</Link>
            ))}
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 max-w-7xl mx-auto px-5 py-5 flex flex-col md:flex-row justify-between text-xs text-white/25 gap-2">
        <span>© {new Date().getFullYear()} TechPigeon (TSN Pakistan). All rights reserved.</span>
        <span className="flex gap-4">
          <Link href="#" className="text-white/25 hover:text-white/50 no-underline">Privacy Policy</Link>
          <Link href="#" className="text-white/25 hover:text-white/50 no-underline">Terms of Service</Link>
        </span>
      </div>
    </footer>
  );
}
