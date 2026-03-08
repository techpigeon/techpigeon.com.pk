'use client';
export const dynamic = 'force-dynamic';
import { useState, FormEvent } from 'react';
import Link from 'next/link';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';
import Alert from '../../../../components/ui/Alert';
import Logo from '../../../../components/ui/Logo';

// ─── Validation ────────────────────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ─── Component ─────────────────────────────────────────────────────
export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Validate
    if (!email.trim()) {
      setError('Email address is required');
      return;
    }
    if (!EMAIL_RE.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 900);
  };

  // ─── Render ──────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen flex items-center justify-center px-5 py-12"
      style={{
        fontFamily: "'Open Sans', sans-serif",
        background: 'linear-gradient(170deg, #e8f6fc 0%, #f5edc8 50%, #e8f6fc 100%)',
      }}
    >
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 px-8 py-10 sm:px-10 sm:py-12">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Logo variant="dark" size="md" href="/" />
          </div>

          {/* ── Success state ────────────────────────────────────── */}
          {sent ? (
            <div className="text-center">
              <Alert variant="success">
                Password reset link has been sent successfully!
              </Alert>

              <div className="mt-6">
                {/* Envelope icon */}
                <div
                  className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-5"
                  style={{ background: '#e8f6fc' }}
                >
                  <svg
                    width="28"
                    height="28"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#5cc4eb"
                    strokeWidth={1.6}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                    />
                  </svg>
                </div>

                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ fontFamily: "'Aleo', serif", color: '#1d1d1d' }}
                >
                  Check Your Email
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-8">
                  We&apos;ve sent a password reset link to{' '}
                  <span className="font-semibold text-[#1d1d1d]">{email}</span>. Please check your
                  inbox and spam folder.
                </p>

                <Link
                  href="/auth/login"
                  className="inline-flex items-center gap-2 text-sm font-semibold hover:underline"
                  style={{ color: '#5cc4eb' }}
                >
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                  </svg>
                  Back to Login
                </Link>
              </div>
            </div>
          ) : (
            /* ── Request state ─────────────────────────────────── */
            <>
              <div className="text-center mb-8">
                <h2
                  className="text-2xl mb-2"
                  style={{ fontFamily: "'Aleo', serif", color: '#bba442', fontWeight: 700 }}
                >
                  Reset Your Password
                </h2>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Enter the email address linked to your account and we&apos;ll send you a link to reset
                  your password.
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-[#1d1d1d] mb-1.5">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    error={error || undefined}
                  />
                  {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
                </div>

                <Button type="submit" variant="primary" size="lg" full loading={loading}>
                  Send Reset Link
                </Button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-xs text-slate-400">or</span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              {/* Back to login link */}
              <div className="text-center">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center gap-2 text-sm font-semibold hover:underline"
                  style={{ color: '#5cc4eb' }}
                >
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                  </svg>
                  Back to Login
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Footer below card */}
        <p className="text-center text-xs text-slate-400 mt-6">
          &copy; {new Date().getFullYear()} TechPigeon &middot; techpigeon.org
        </p>
      </div>
    </div>
  );
}
