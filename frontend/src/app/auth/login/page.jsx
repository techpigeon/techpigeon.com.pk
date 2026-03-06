'use client';
export const dynamic = 'force-dynamic';
import {useState} from 'react';
import Link from 'next/link';
import Logo from '../../../components/ui/Logo';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Alert from '../../../components/ui/Alert';
export default function LoginPage() {
  const [email,setEmail]=useState('');const [pass,setPass]=useState('');const [error,setError]=useState('');const [loading,setLoading]=useState(false);
  const submit=()=>{
    if(!email||!pass){setError('Please fill in all fields.');return;}
    setLoading(true);setError('');
    setTimeout(()=>{setLoading(false);if(pass.length>=8)window.location.href=email.includes('admin')?'/admin':'/dashboard';else setError('Invalid credentials. Demo: any email + password "demo1234"');},900);
  };
  return (
    <div className="min-h-screen flex bg-slate-50">
      <div className="hidden lg:flex flex-1 flex-col justify-center p-16 relative overflow-hidden" style={{background:'linear-gradient(155deg,#0B1D3A,#1E3A5F)'}}>
        <div className="relative">
          <div className="mb-10"><Logo variant="white" size="lg" linkTo="/"/></div>
          <h2 style={{fontFamily:"'DM Serif Display',serif"}} className="text-3xl text-white mb-4">Welcome back!</h2>
          <p className="text-white/60 mb-10 max-w-xs">Sign in to manage your domains, hosting, and training courses.</p>
          {[['📊','Real-time hosting metrics'],['🔔','Domain renewal reminders'],['🎯','Certification progress tracking'],['🤝','24/7 live support']].map(([i,t])=>(
            <div key={t} className="flex items-center gap-3 text-white/75 text-sm mb-4">
              <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center">{i}</div>{t}
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8"><Logo linkTo="/"/></div>
          <h2 style={{fontFamily:"'DM Serif Display',serif"}} className="text-2xl text-[#0B1D3A] mb-1.5">Sign In</h2>
          <p className="text-sm text-slate-500 mb-6">No account? <Link href="/auth/register" className="text-[#00A8E8] font-semibold no-underline">Sign up free →</Link></p>
          <Alert type="info"><b>Demo:</b> Any email + password <b>demo1234</b> &nbsp; Admin: include "admin" in email</Alert>
          {error&&<Alert type="error">{error}</Alert>}
          <Input label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" icon="📧"/>
          <div className="mb-5">
            <div className="flex justify-between mb-1.5">
              <label className="text-sm font-semibold text-slate-700">Password</label>
              <Link href="#" className="text-xs text-[#00A8E8] no-underline">Forgot password?</Link>
            </div>
            <input type="password" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==='Enter'&&submit()} placeholder="••••••••" className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm outline-none focus:border-[#00A8E8] transition-all"/>
          </div>
          <Button full size="lg" loading={loading} onClick={submit}>Sign In to Dashboard</Button>
          <div className="flex items-center gap-3 my-5"><div className="flex-1 h-px bg-slate-200"/><span className="text-xs text-slate-400">or</span><div className="flex-1 h-px bg-slate-200"/></div>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" full>🔵 Google</Button>
            <Button variant="outline" full>⚫ GitHub</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
