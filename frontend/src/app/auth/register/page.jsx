'use client';
export const dynamic = 'force-dynamic';
import {useState} from 'react';
import Link from 'next/link';
import Logo from '../../../components/ui/Logo';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Alert from '../../../components/ui/Alert';
export default function RegisterPage() {
  const [f,setF]=useState({fn:'',ln:'',email:'',phone:'',pass:'',pass2:'',terms:false});
  const [errs,setErrs]=useState({});const [loading,setLoading]=useState(false);
  const set=k=>e=>setF(p=>({...p,[k]:typeof e==='object'&&e?.target?e.target.value:e}));
  const validate=()=>{const e={};if(!f.fn.trim())e.fn='Required';if(!f.ln.trim())e.ln='Required';if(!f.email.includes('@'))e.email='Valid email required';if(f.pass.length<8)e.pass='Min 8 chars';if(f.pass!==f.pass2)e.pass2="Don't match";if(!f.terms)e.terms='Accept terms';setErrs(e);return!Object.keys(e).length;};
  const submit=()=>{if(!validate())return;setLoading(true);setTimeout(()=>{setLoading(false);window.location.href='/dashboard';},900);};
  return (
    <div className="min-h-screen flex bg-slate-50">
      <div className="hidden lg:flex flex-1 flex-col justify-center p-16 relative overflow-hidden" style={{background:'linear-gradient(155deg,#0B1D3A,#1E3A5F)'}}>
        <div className="relative">
          <div className="mb-10"><Logo variant="white" size="lg" linkTo="/"/></div>
          <h2 style={{fontFamily:"'DM Serif Display',serif"}} className="text-3xl text-white mb-4">Start Your Digital Journey</h2>
          <p className="text-white/60 mb-10 max-w-xs">Join 12,000+ businesses growing with TechPigeon.</p>
          {[['🌐','Domains from Rs.999/year'],['☁️','Hosting with 99.9% uptime'],['🎓','50+ IT courses'],['🛡️','Free SSL on all plans']].map(([i,t])=>(
            <div key={t} className="flex items-center gap-3 text-white/75 text-sm mb-4"><div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center">{i}</div>{t}</div>
          ))}
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8"><Logo linkTo="/"/></div>
          <h2 style={{fontFamily:"'DM Serif Display',serif"}} className="text-2xl text-[#0B1D3A] mb-1.5">Create Account</h2>
          <p className="text-sm text-slate-500 mb-6">Already registered? <Link href="/auth/login" className="text-[#00A8E8] font-semibold no-underline">Sign in →</Link></p>
          <div className="grid grid-cols-2 gap-3">
            <Input label="First Name" value={f.fn} onChange={set('fn')} placeholder="Ali" error={errs.fn}/>
            <Input label="Last Name" value={f.ln} onChange={set('ln')} placeholder="Khan" error={errs.ln}/>
          </div>
          <Input label="Email" type="email" value={f.email} onChange={set('email')} placeholder="ali@example.com" error={errs.email}/>
          <Input label="Phone (optional)" type="tel" value={f.phone} onChange={set('phone')} placeholder="+92 300 0000000"/>
          <Input label="Password" type="password" value={f.pass} onChange={set('pass')} placeholder="Min. 8 characters" error={errs.pass}/>
          <Input label="Confirm Password" type="password" value={f.pass2} onChange={set('pass2')} placeholder="Repeat password" error={errs.pass2}/>
          <div className="flex items-start gap-2.5 mb-5">
            <input type="checkbox" checked={f.terms} onChange={e=>setF(p=>({...p,terms:e.target.checked}))} className="mt-0.5 w-4 h-4 accent-[#00A8E8]"/>
            <label className="text-sm text-slate-500">I agree to the <Link href="#" className="text-[#00A8E8] no-underline">Terms</Link> and <Link href="#" className="text-[#00A8E8] no-underline">Privacy Policy</Link></label>
          </div>
          {errs.terms&&<Alert type="error">{errs.terms}</Alert>}
          <Button full size="lg" loading={loading} onClick={submit}>Create My Account</Button>
        </div>
      </div>
    </div>
  );
}
