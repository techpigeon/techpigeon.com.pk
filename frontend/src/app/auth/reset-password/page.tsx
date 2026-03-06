'use client';
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const [email, setEmail]     = useState('');
  const [sent, setSent]       = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = () => {
    if (!email.includes('@')) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-5">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-md border border-slate-200 p-8">

        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-2 no-underline mb-6">
          <div className="w-9 h-9 bg-[#00A8E8] rounded-xl flex items-center justify-center">
            <span className="text-white text-lg">🐦</span>
          </div>
          <span className="font-bold text-[#0B1D3A] text-xl" style={{fontFamily:"'DM Serif Display',serif"}}>
            tech<em className="not-italic text-[#00A8E8]">pigeon</em>
          </span>
        </Link>

        <h2 className="text-2xl text-[#0B1D3A] mb-2" style={{fontFamily:"'DM Serif Display',serif"}}>
          Reset Password
        </h2>

        {sent ? (
          <div className="flex items-start gap-2 p-3 rounded-xl border text-sm mb-4 bg-emerald-50 border-emerald-200 text-emerald-800">
            <div>Reset link sent to <b>{email}</b>. Check your inbox!</div>
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-500 mb-6">Enter your email and we'll send a reset link.</p>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && submit()}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm text-[#0B1D3A] bg-white outline-none transition-all focus:border-[#00A8E8] focus:ring-4 focus:ring-[#00A8E8]/10"
              />
            </div>

            <button
              onClick={submit}
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 font-semibold rounded-xl px-7 py-3.5 text-base bg-[#00A8E8] hover:bg-[#0077B6] text-white shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed border-none cursor-pointer"
            >
              {loading ? (
                <><span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block"/>Sending...</>
              ) : 'Send Reset Link'}
            </button>
          </>
        )}

        <p className="text-center text-sm text-slate-400 mt-5">
          <Link href="/auth/login" className="text-[#00A8E8] no-underline">← Back to Sign In</Link>
        </p>
      </div>
    </div>
  );
}
