'use client';
export const dynamic = 'force-dynamic';

import { FormEvent, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Alert from '@/components/ui/Alert';
import Logo from '@/components/ui/Logo';
import { authApi } from '@/lib/api';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get('token') || '', [searchParams]);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Reset token is missing or invalid. Please request a new reset link.');
      return;
    }
    if (!password || password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await authApi.reset(token, password);
      setDone(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Unable to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-12" style={{ background: 'linear-gradient(170deg, #e8f6fc 0%, #f5edc8 50%, #e8f6fc 100%)' }}>
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 px-8 py-10 sm:px-10 sm:py-12">
          <div className="flex justify-center mb-8">
            <Logo variant="dark" size="md" href="/" />
          </div>

          {done ? (
            <div className="text-center">
              <Alert type="success">Your password has been reset successfully.</Alert>
              <p className="text-sm text-slate-500 mt-4 mb-6">You can now sign in with your new password.</p>
              <Link href="/auth/login" className="inline-flex items-center gap-2 text-sm font-semibold text-[#5cc4eb] hover:underline">
                Back to Login
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl mb-2 text-[#bba442]" style={{ fontFamily: "'Aleo', serif", fontWeight: 700 }}>
                  Set New Password
                </h2>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Enter your new password below to complete reset.
                </p>
              </div>

              {!token && <Alert type="error">Invalid reset link. Please request a new one.</Alert>}
              {error && <Alert type="error">{error}</Alert>}

              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <Input
                  type="password"
                  placeholder="New password"
                  value={password}
                  onChange={setPassword}
                />
                <Input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                />

                <Button type="submit" variant="primary" size="lg" full loading={loading}>
                  Reset Password
                </Button>
              </form>

              <div className="text-center mt-6">
                <Link href="/auth/login" className="inline-flex items-center gap-2 text-sm font-semibold text-[#5cc4eb] hover:underline">
                  Back to Login
                </Link>
              </div>
            </>
          )}
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          &copy; {new Date().getFullYear()} TechPigeon
        </p>
      </div>
    </div>
  );
}
