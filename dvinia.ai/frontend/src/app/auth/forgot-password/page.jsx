'use client';
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import Link from 'next/link';
import Logo from '../../../components/ui/Logo';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Alert from '../../../components/ui/Alert';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = () => {
    if (!email.includes('@')) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 900);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center"><Logo href="/" /></div>
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          {sent ? (
            <div className="text-center">
              <div className="text-5xl mb-4">📧</div>
              <h2 style={{ fontFamily: "'Aleo',serif" }} className="text-2xl text-[#bba442] mb-2">Check Your Email</h2>
              <p className="text-slate-500 mb-6 text-sm">We sent a password reset link to <strong>{email}</strong></p>
              <Link href="/auth/login"><Button full variant="outline">Back to Sign In</Button></Link>
            </div>
          ) : (
            <>
              <h2 style={{ fontFamily: "'Aleo',serif" }} className="text-2xl text-[#bba442] mb-1">Forgot Password?</h2>
              <p className="text-sm text-slate-500 mb-6">Enter your email and we'll send a reset link.</p>
              <Input label="Email Address" type="email" value={email} onChange={setEmail} placeholder="you@example.com" icon="📧" />
              <Button full size="lg" loading={loading} onClick={submit}>Send Reset Link</Button>
              <p className="text-center text-sm text-slate-400 mt-4">
                <Link href="/auth/login" className="text-[#5cc4eb] no-underline">Back to Sign In</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
