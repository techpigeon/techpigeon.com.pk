'use client';
export const dynamic = 'force-dynamic';
import Link from 'next/link';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';
import {PLANS,COURSES,TLDS} from '../lib/data';

function HeroSection() {
  return (
    <section className="relative overflow-hidden" style={{background:'linear-gradient(155deg,#EAF6FD 0%,#FAFBFF 50%,#E8F7FD 100%)'}}>
      <div className="absolute -top-32 -right-24 w-[500px] h-[500px] rounded-full" style={{background:'radial-gradient(circle,rgba(0,168,232,0.1),transparent 70%)'}}/>
      <div className="max-w-7xl mx-auto px-5 py-20 grid md:grid-cols-2 gap-16 items-center relative">
        <div>
          <div className="inline-flex items-center gap-2 bg-white border border-slate-200 shadow-sm px-3 py-1.5 rounded-full text-xs font-medium text-[#0077B6] mb-6">
            <span className="bg-[#00A8E8] text-white px-2 py-0.5 rounded-full text-xs font-bold">NEW</span>
            Cloud VPS from Rs.1,399/mo · Free .pk Domain
          </div>
          <h1 style={{fontFamily:"'DM Serif Display',serif"}} className="text-4xl md:text-5xl leading-tight text-[#0B1D3A] mb-5">
            Pakistan's Most Trusted<br/>
            <em className="not-italic" style={{color:'#00A8E8'}}>Digital Partner</em>
          </h1>
          <p className="text-base text-slate-500 leading-relaxed mb-8 max-w-md">Domains, cloud hosting, and expert IT training — everything your business needs to grow online.</p>
          <div className="flex gap-3 flex-wrap">
            <Link href="/domains"><Button size="lg">🔍 Find Your Domain</Button></Link>
            <Link href="/hosting"><Button size="lg" variant="outline">View Hosting Plans</Button></Link>
          </div>
          <div className="flex gap-8 mt-10 pt-8 border-t border-slate-200">
            {[['50K+','Domains Registered'],['12K+','Happy Clients'],['99.9%','Uptime SLA']].map(([n,l])=>(
              <div key={l}><div style={{fontFamily:"'DM Serif Display',serif"}} className="text-2xl text-[#0B1D3A]">{n}</div><div className="text-xs text-slate-400 mt-0.5">{l}</div></div>
            ))}
          </div>
        </div>
        <div className="hidden md:flex flex-col gap-4">
          {[
            {t:'Domain Status',c:<><div className="font-semibold text-[#0B1D3A]">techpigeon.org</div><div className="flex justify-between mt-2"><span className="text-xs text-slate-400">Expires Dec 2026</span><span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">✓ Active</span></div></>,d:'0s'},
            {t:'Cloud Pro Hosting',c:<div className="flex justify-between"><div><div className="text-sm text-slate-500">CPU <b>34%</b> · RAM <b>1.2 GB</b></div><div className="text-xs text-emerald-600 mt-1">▲ All systems operational</div></div><div style={{fontFamily:"'DM Serif Display',serif"}} className="text-xl text-[#0B1D3A]">Rs.3,599<span className="text-xs text-slate-400 font-sans">/mo</span></div></div>,d:'-1.3s'},
            {t:'Course Progress',c:<><div className="font-semibold text-[#0B1D3A] mb-2">AWS Cloud Practitioner</div><div className="bg-slate-200 rounded-full h-2"><div className="bg-[#00A8E8] h-2 rounded-full w-[72%]"/></div><div className="flex justify-between text-xs text-slate-400 mt-1.5"><span>72% complete</span><span>Module 9/12</span></div></>,d:'-2.6s'},
          ].map((card,i)=>(
            <div key={i} className="bg-white rounded-2xl p-5 shadow-lg border border-slate-200" style={{animation:`float 4s ease-in-out ${card.d} infinite`}}>
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2.5">{card.t}</div>
              {card.c}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesSection() {
  const SERVICES=[
    {icon:'🌐',title:'Domain Registration',desc:'500+ TLD extensions. Free WHOIS privacy and DNS manager.',href:'/domains'},
    {icon:'☁️',title:'Cloud Hosting',desc:'NVMe SSD servers with free SSL, CDN, and 24/7 monitoring.',href:'/hosting'},
    {icon:'🎓',title:'IT Training & Certs',desc:'Expert-led courses in cloud, networking, and security.',href:'/training'},
    {icon:'🔒',title:'SSL Certificates',desc:'DV, OV, EV certs with auto-renewal and one-click install.',href:'#'},
    {icon:'📧',title:'Business Email',desc:'Professional email with your own domain. MS365 ready.',href:'#'},
    {icon:'🛡️',title:'DDoS Protection',desc:'Enterprise-grade protection to keep services online.',href:'#'},
  ];
  return (
    <section className="py-20 px-5">
      <div className="max-w-7xl mx-auto">
        <p className="text-xs font-bold text-[#00A8E8] uppercase tracking-widest mb-2">What We Offer</p>
        <h2 style={{fontFamily:"'DM Serif Display',serif"}} className="text-3xl md:text-4xl text-[#0B1D3A] mb-3">Everything Your Business Needs Online</h2>
        <p className="text-slate-500 mb-12 max-w-xl">From your first domain to scaling your infrastructure — we have you covered.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map(s=>(
            <Link key={s.title} href={s.href} className="no-underline group">
              <div className="bg-white border border-slate-200 rounded-2xl p-7 transition-all duration-300 cursor-pointer hover:border-[#00A8E8] hover:shadow-xl hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-[#EAF6FD] flex items-center justify-center text-2xl mb-5">{s.icon}</div>
                <h3 className="font-semibold text-base text-[#0B1D3A] mb-2.5">{s.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">{s.desc}</p>
                <span className="text-sm text-[#00A8E8] font-semibold">Learn more →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="relative overflow-hidden text-center py-20 px-5" style={{background:'linear-gradient(135deg,#0B1D3A,#1E3A5F)'}}>
      <div className="absolute inset-0" style={{backgroundImage:'radial-gradient(circle,rgba(0,168,232,0.07) 1px,transparent 1px)',backgroundSize:'40px 40px'}}/>
      <div className="max-w-lg mx-auto relative">
        <p className="text-xs font-bold text-[#00C8B4] uppercase tracking-widest mb-3">Limited Offer</p>
        <h2 style={{fontFamily:"'DM Serif Display',serif"}} className="text-3xl md:text-4xl text-white mb-4">Free .pk Domain with Any Hosting Plan</h2>
        <p className="text-white/60 leading-relaxed mb-8">Sign up today and receive a free .pk domain for 1 year. Over 12,000 businesses trust TechPigeon.</p>
        <Link href="/auth/register"><Button size="lg" variant="white">Claim Your Free Domain →</Button></Link>
      </div>
    </section>
  );
}

export default function HomePage() {
  return <main><HeroSection/><ServicesSection/><CTASection/><Footer/></main>;
}
