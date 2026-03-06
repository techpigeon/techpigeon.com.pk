'use client';
export const dynamic = 'force-dynamic';
import {useState} from 'react';
import Link from 'next/link';
import Footer from '../../components/layout/Footer';
import {COURSES} from '../../lib/data';
const CATS=['All','Cloud','Security','Networking','DevOps','Linux'];
const LEVEL={'Beginner':'text-emerald-700 bg-emerald-50','Intermediate':'text-amber-700 bg-amber-50','Advanced':'text-red-600 bg-red-50'};
export default function TrainingPage() {
  const [filter,setFilter]=useState('All');
  const visible=filter==='All'?COURSES:COURSES.filter(c=>c.cat===filter);
  return (
    <div>
      <section className="py-16 px-5" style={{background:'linear-gradient(155deg,#EAF6FD,#FAFBFF)'}}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div><p className="text-xs font-bold text-[#00A8E8] uppercase tracking-widest mb-1">IT Training & Certification</p><h1 style={{fontFamily:"'DM Serif Display',serif"}} className="text-3xl md:text-4xl text-[#0B1D3A]">Learn From Industry Experts</h1></div>
            <div className="flex flex-wrap gap-2">{CATS.map(c=><button key={c} onClick={()=>setFilter(c)} className={`px-4 py-1.5 rounded-full border text-xs font-semibold cursor-pointer transition-all ${filter===c?'bg-[#EAF6FD] border-[#00A8E8] text-[#00A8E8]':'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}>{c}</button>)}</div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {visible.map(c=>(
              <Link key={c.id} href="/auth/register" className="no-underline">
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all cursor-pointer">
                  <div className="h-36 flex items-center justify-center text-5xl" style={{background:c.bg}}>{c.emoji}</div>
                  <div className="p-5">
                    <div className="flex justify-between items-center mb-2">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${LEVEL[c.level]}`}>{c.level}</span>
                      <span className="text-xs font-semibold text-[#0077B6] bg-[#EAF6FD] px-2.5 py-0.5 rounded-full">{c.cat}</span>
                    </div>
                    <h3 className="font-semibold text-sm text-[#0B1D3A] mb-2 leading-snug">{c.title}</h3>
                    <p className="text-xs text-slate-400 mb-3">👤 {c.instructor}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <span className="text-xs text-slate-400">⏱ {c.hrs}h · {c.mods} modules</span>
                      <span className="font-bold text-[#0B1D3A] text-sm">Rs.{c.price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer/>
    </div>
  );
}
