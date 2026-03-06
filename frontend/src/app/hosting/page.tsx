'use client';
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { HOSTING_PLANS } from '@/lib/data';

export default function HostingPage() {
  const [billing,setBilling]=useState<'monthly'|'annual'>('monthly');
  return (
    <>
      <Navbar/>
      <section className="py-20 px-5 text-center" style={{background:'linear-gradient(155deg,#EAF6FD,#FAFBFF)'}}>
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold text-[#00A8E8] uppercase tracking-widest mb-2">Cloud Hosting Pakistan</p>
          <h1 className="text-3xl md:text-4xl text-[#0B1D3A] mb-3" style={{fontFamily:"'DM Serif Display',serif"}}>Hosting That Scales With You</h1>
          <p className="text-slate-500 mb-8">NVMe SSD · 99.9% uptime guaranteed · Free SSL on all plans</p>
          <div className="inline-flex bg-white border border-slate-200 rounded-full p-1 gap-1 mb-12">
            {(['monthly','annual'] as const).map(b=>(
              <button key={b} onClick={()=>setBilling(b)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all border-none cursor-pointer ${billing===b?'bg-[#00A8E8] text-white':'bg-transparent text-slate-500'}`}>
                {b==='monthly'?'Monthly':<>Annual <span className="bg-emerald-100 text-emerald-700 text-xs px-1.5 py-0.5 rounded-full ml-1">Save 25%</span></>}
              </button>
            ))}
          </div>
          <div className="grid md:grid-cols-3 gap-5 items-start max-w-4xl mx-auto text-left">
            {HOSTING_PLANS.map(p=>{
              const price=billing==='monthly'?p.price_m:p.price_a;
              return (
                <div key={p.id} className={`rounded-2xl p-8 relative transition-all ${p.featured?'bg-[#0B1D3A] text-white scale-[1.03] shadow-2xl':'bg-white border border-slate-200 shadow-sm'}`}>
                  {p.featured&&<div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#F59E0B] text-[#0B1D3A] text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">⭐ Most Popular</div>}
                  <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${p.featured?'text-white/40':'text-slate-400'}`}>{p.name}</p>
                  <div className={`text-4xl font-bold mb-1 ${p.featured?'text-white':'text-[#0B1D3A]'}`} style={{fontFamily:"'DM Serif Display',serif"}}>
                    Rs.{price.toLocaleString()}<sub className={`text-sm font-sans font-normal ml-0.5 ${p.featured?'text-white/40':'text-slate-400'}`}>/mo</sub>
                  </div>
                  <p className={`text-sm mb-6 ${p.featured?'text-white/55':'text-slate-500'}`}>{p.disk} · {p.bw} · {p.sites}</p>
                  <ul className="space-y-2.5 mb-7">
                    {p.features.map(f=>(
                      <li key={f} className={`flex items-center gap-2.5 text-sm ${p.featured?'text-white/80':'text-slate-600'}`}>
                        <span className={`font-bold flex-shrink-0 ${p.featured?'text-[#00C8B4]':'text-emerald-500'}`}>✓</span>{f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/auth/register">
                    {p.featured?<Button full variant="white">Get Started</Button>:<Button full>Get Started</Button>}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <Footer/>
    </>
  );
}
