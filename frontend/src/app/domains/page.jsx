'use client';
export const dynamic = 'force-dynamic';
import {useState} from 'react';
import Footer from '../../components/layout/Footer';
import Button from '../../components/ui/Button';
import {TLDS} from '../../lib/api';
export default function DomainsPage() {
  const [q,setQ]=useState('');const [tld,setTld]=useState('.com');const [results,setResults]=useState([]);const [loading,setLoading]=useState(false);const [searched,setSearched]=useState(false);
  const search=()=>{if(!q.trim())return;setLoading(true);setTimeout(()=>{const n=q.toLowerCase().replace(/[^a-z0-9-]/g,'');setResults(TLDS.map(t=>({full:n+t.ext,ext:t.ext,available:Math.random()>0.3,price:t.pkr})).sort((a,b)=>Number(b.available)-Number(a.available)));setSearched(true);setLoading(false);},800);};
  return (
    <div>
      <section className="relative overflow-hidden py-20 px-5 text-center" style={{background:'linear-gradient(135deg,#0B1D3A,#1E3A5F)'}}>
        <div className="max-w-2xl mx-auto relative">
          <p className="text-xs font-bold text-[#00C8B4] uppercase tracking-widest mb-3">Domain Registration</p>
          <h1 style={{fontFamily:"'DM Serif Display',serif"}} className="text-3xl md:text-4xl text-white mb-3">Find Your Perfect Domain</h1>
          <p className="text-white/55 mb-8">500+ extensions from Rs.999/year · Free WHOIS privacy included</p>
          <div className="flex bg-white rounded-xl overflow-hidden shadow-2xl max-w-xl mx-auto">
            <input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==='Enter'&&search()} placeholder="yourbusiness" className="flex-1 px-5 py-4 text-base text-[#0B1D3A] outline-none border-none"/>
            <select value={tld} onChange={e=>setTld(e.target.value)} className="border-l border-slate-200 px-3 text-sm text-slate-600 bg-white outline-none">
              {TLDS.map(t=><option key={t.ext} value={t.ext}>{t.ext}</option>)}
            </select>
            <button onClick={search} className="bg-[#00A8E8] hover:bg-[#0077B6] text-white px-6 font-semibold text-sm transition-colors border-none cursor-pointer">
              {loading?'⏳':'Search →'}
            </button>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-5">
            {TLDS.slice(0,6).map(t=>(
              <span key={t.ext} className="bg-white/10 border border-white/20 text-white text-xs px-3 py-1 rounded-full">
                {t.ext} <strong className="text-[#00C8B4]">Rs.{t.pkr.toLocaleString()}/yr</strong>
              </span>
            ))}
          </div>
        </div>
      </section>
      {searched&&(
        <section className="max-w-3xl mx-auto px-5 py-10">
          <p className="font-semibold text-[#0B1D3A] mb-4">Results for <span className="text-[#00A8E8]">{q}</span></p>
          <div className="flex flex-col gap-3">
            {results.map(r=>(
              <div key={r.ext} className={`flex items-center justify-between rounded-xl px-5 py-4 border transition-all ${r.available?'bg-emerald-50/60 border-emerald-200':'bg-white border-slate-200'}`}>
                <div><div className="font-semibold text-[#0B1D3A]">{r.full}</div><div className={`text-xs mt-1 ${r.available?'text-emerald-700':'text-slate-400'}`}>{r.available?'✓ Available':'✗ Not available'}</div></div>
                <div className="flex items-center gap-4">
                  <div className="text-right"><div style={{fontFamily:"'DM Serif Display',serif"}} className="text-xl text-[#0B1D3A]">Rs.{r.price.toLocaleString()}</div><div className="text-xs text-slate-400">/year</div></div>
                  {r.available?<Button size="sm">Add to Cart</Button>:<Button size="sm" variant="ghost" disabled>Taken</Button>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      <Footer/>
    </div>
  );
}
