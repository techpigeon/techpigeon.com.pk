'use client';
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import Link from 'next/link';
import Logo from '../../../components/ui/Logo';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Alert from '../../../components/ui/Alert';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const submit = () => {
    if (!password || password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    setLoading(true); setError('');
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 900);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center"><Logo linkTo="/" /></div>
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          {success ? (
            <div className="text-center">
              <div className="text-5xl mb-4">✅</div>
              <h2 style={{ fontFamily: "'DM Serif Display',serif" }} className="text-2xl text-[#0B1D3A] mb-2">Password Reset!</h2>
              <p className="text-slate-500 mb-6 text-sm">Your password has been updated successfully.</p>
              <Link href="/auth/login">
                <Button full>Sign In Now</Button>
              </Link>
            </div>
          ) : (
            <>
              <h2 style={{ fontFamily: "'DM Serif Display',serif" }} className="text-2xl text-[#0B1D3A] mb-1">Reset Password</h2>
              <p className="text-sm text-slate-500 mb-6">Enter your new password below.</p>
              {error && <Alert type="error">{error}</Alert>}
              <Input label="New Password" type="password" value={password} onChange={setPassword} placeholder="Min. 8 characters" />
              <Input label="Confirm Password" type="password" value={confirm} onChange={setConfirm} placeholder="Repeat new password" />
              <Button full size="lg" loading={loading} onClick={submit}>Set New Password</Button>
              <p className="text-center text-sm text-slate-400 mt-4">
                <Link href="/auth/login" className="text-[#00A8E8] no-underline">Back to Sign In</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
