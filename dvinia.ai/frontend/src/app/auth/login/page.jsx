'use client';
export const dynamic = 'force-dynamic';
import {useState} from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Logo from '../../../components/ui/Logo';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Alert from '../../../components/ui/Alert';
import { useAuth } from '../../../context/AuthContext';
import { authApi } from '../../../lib/api';
export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [email,setEmail]=useState('');const [pass,setPass]=useState('');const [error,setError]=useState('');const [loading,setLoading]=useState(false);
  const submit = async () => {
    if(!email||!pass){setError('Please fill in all fields.');return;}
    setLoading(true);setError('');
    try {
      const { data } = await authApi.login(email, pass);
      login(data.user, data.token);
      const redirect = searchParams.get('redirect');
      if (data.user.role === 'admin' || data.user.role === 'support') {
        router.push(redirect || '/admin');
      } else {
        router.push(redirect || '/dashboard');
      }
    } catch (err) {
      const msg = err.response?.data?.error || 'Invalid credentials. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex bg-slate-50">
      <div className="hidden lg:flex flex-1 flex-col justify-center p-16 relative overflow-hidden" style={{background:'linear-gradient(155deg,#0B1D3A,#1E3A5F)'}}>
        <div className="relative">
          <div className="mb-10"><Logo variant="white" size="lg" href="/"/></div>
          <h2 style={{fontFamily:"'Aleo',serif"}} className="text-3xl text-white mb-4">Welcome back!</h2>
          <p className="text-white/60 mb-10 max-w-xs">Sign in to manage your domains, hosting, and training courses.</p>
          {[['📊','Real-time hosting metrics'],['🔔','Domain renewal reminders'],['🎯','Certification progress tracking'],['🤝','24/7 live support']].map(([i,t])=>(
            <div key={t} className="flex items-center gap-3 text-white/75 text-sm mb-4">
              <div className="w-9 h-9 bg-white/10 rounded flex items-center justify-center">{i}</div>{t}
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8"><Logo href="/"/></div>
          <h2 style={{fontFamily:"'Aleo',serif"}} className="text-2xl text-[#bba442] mb-1.5">Sign In</h2>
          <p className="text-sm text-slate-500 mb-6">No account? <Link href="/auth/register" className="text-[#5cc4eb] font-semibold no-underline">Sign up free →</Link></p>
          {error&&<Alert type="error">{error}</Alert>}
          <Input label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" icon="📧"/>
          <div className="mb-5">
            <div className="flex justify-between mb-1.5">
              <label className="text-sm font-semibold text-slate-700">Password</label>
              <Link href="/auth/forgot-password" className="text-xs text-[#5cc4eb] no-underline">Forgot password?</Link>
            </div>
            <input type="password" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==='Enter'&&submit()} placeholder="••••••••" className="w-full px-4 py-3 border-2 border-slate-200 rounded text-sm outline-none focus:border-[#5cc4eb] transition-all"/>
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
