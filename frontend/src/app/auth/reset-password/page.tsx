'use client';
import { useState } from 'react';
import Link from 'next/link';
import Logo from '@/components/ui/Logo';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Alert from '@/components/ui/Alert';
export default function ResetPage() {
  const [email,setEmail]=useState(''); const [sent,setSent]=useState(false); const [loading,setLoading]=useState(false);
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-5">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-8">
        <div className="mb-6"><Logo href="/"/></div>
        <h2 className="text-2xl text-[#0B1D3A] mb-2" style={{fontFamily:"'DM Serif Display',serif"}}>Reset Password</h2>
        {sent ? <Alert type="success">Reset link sent to <b>{email}</b>. Check your inbox!</Alert> : (
          <>
            <p className="text-sm text-slate-500 mb-6">Enter your email and we'll send a reset link.</p>
            <Input label="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)}/>
            <Button full loading={loading} onClick={()=>{setLoading(true);setTimeout(()=>{setLoading(false);setSent(true);},800);}}>Send Reset Link</Button>
          </>
        )}
        <p className="text-center text-sm text-slate-400 mt-5"><Link href="/auth/login" className="text-[#00A8E8] no-underline">← Back to Sign In</Link></p>
      </div>
    </div>
  );
}
