'use client';
export const dynamic = 'force-dynamic';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Alert from '@/components/ui/Alert';
import Logo from '@/components/ui/Logo';
import { useAuth } from '@/context/AuthContext';
import { authApi } from '@/lib/api';

// ─── Feature bullets for left panel ────────────────────────────────
const FEATURES = [
  {
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a17.92 17.92 0 0 1-8.716-2.247m0 0A8.966 8.966 0 0 1 3 12c0-1.264.26-2.466.73-3.558" />
      </svg>
    ),
    title: 'Premium Hosting',
    desc: 'Blazing-fast SSD servers with 99.9% uptime guarantee',
  },
  {
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21" />
      </svg>
    ),
    title: 'Domain Registration',
    desc: '.pk, .com, .org and 500+ TLDs at the best prices',
  },
  {
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84 50.717 50.717 0 0 0-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
      </svg>
    ),
    title: 'IT Training & Courses',
    desc: 'Industry-led certifications to accelerate your career',
  },
  {
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
    title: '24/7 Expert Support',
    desc: 'Dedicated Pakistan-based team ready whenever you need help',
  },
];

// ─── Validation helpers ────────────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(f) {
  const e = {};
  if (!f.firstName.trim()) e.firstName = 'First name is required';
  if (!f.lastName.trim()) e.lastName = 'Last name is required';
  if (!f.email.trim()) e.email = 'Email is required';
  else if (!EMAIL_RE.test(f.email)) e.email = 'Enter a valid email address';
  if (!f.password) e.password = 'Password is required';
  else if (f.password.length < 8) e.password = 'Password must be at least 8 characters';
  if (!f.confirmPassword) e.confirmPassword = 'Please confirm your password';
  else if (f.password !== f.confirmPassword) e.confirmPassword = 'Passwords do not match';
  if (!f.terms) e.terms = 'You must accept the terms and conditions';
  return e;
}

// ─── Component ─────────────────────────────────────────────────────
export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    terms: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const set = (key, value) => {
    setForm((p) => ({ ...p, [key]: value }));
    if (errors[key]) setErrors((p) => { const n = { ...p }; delete n[key]; return n; });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setApiError('');
    try {
      const { data } = await authApi.register({
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
        phone: form.phone || undefined,
        password: form.password,
      });
      login(data.user, data.token);
      router.push('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.error || 'Registration failed. Please try again.';
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  // ─── Render ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col lg:flex-row" style={{ fontFamily: "'Open Sans', sans-serif" }}>
      {/* ── Left panel ───────────────────────────────────────────── */}
      <div
        className="hidden lg:flex lg:w-[480px] xl:w-[520px] flex-col justify-between p-10 xl:p-12 relative overflow-hidden flex-shrink-0"
        style={{ background: 'linear-gradient(160deg, #0B1D3A 0%, #1E3A5F 100%)' }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full opacity-[0.04]" style={{ background: '#5cc4eb' }} />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full opacity-[0.04]" style={{ background: '#bba442' }} />

        {/* Top: logo */}
        <div>
          <Logo variant="white" size="md" href="/" />
        </div>

        {/* Middle: heading + features */}
        <div className="flex-1 flex flex-col justify-center -mt-4">
          <h1
            className="text-3xl xl:text-[2.1rem] leading-tight mb-3"
            style={{ fontFamily: "'Aleo', serif", color: '#ffffff', fontWeight: 700 }}
          >
            Start Your Digital Journey
          </h1>
          <p className="text-white/60 text-sm mb-10 leading-relaxed max-w-[340px]">
            Join 12,000+ businesses across Pakistan who trust TechPigeon for hosting, domains & IT solutions.
          </p>

          <div className="space-y-5">
            {FEATURES.map((f, i) => (
              <div key={i} className="flex items-start gap-4">
                <span
                  className="flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0 text-white"
                  style={{ background: 'rgba(255,255,255,0.10)' }}
                >
                  {f.icon}
                </span>
                <div>
                  <div className="text-white text-sm font-semibold leading-snug">{f.title}</div>
                  <div className="text-white/50 text-xs mt-0.5 leading-relaxed">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: copyright */}
        <p className="text-white/30 text-xs">
          &copy; {new Date().getFullYear()} TechPigeon &middot; techpigeon.org
        </p>
      </div>

      {/* ── Right panel ──────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-5 py-10 sm:px-8 lg:px-12 bg-white">
        <div className="w-full max-w-[520px]">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8">
            <Logo variant="dark" size="md" href="/" />
          </div>

          {/* Heading */}
          <h2
            className="text-2xl sm:text-[1.75rem] mb-1"
            style={{ fontFamily: "'Aleo', serif", color: '#bba442', fontWeight: 700 }}
          >
            Create Account
          </h2>
          <p className="text-sm text-slate-500 mb-8">
            Already registered?{' '}
            <Link href="/auth/login" className="font-semibold hover:underline" style={{ color: '#5cc4eb' }}>
              Sign in
            </Link>
          </p>

          {/* API error */}
          {apiError && <Alert type="error">{apiError}</Alert>}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* First + Last name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1d1d1d] mb-1.5">
                  First Name <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Ahmed"
                  value={form.firstName}
                  onChange={(val) => set('firstName', val)}
                  error={errors.firstName}
                />
                {errors.firstName && (
                  <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1d1d1d] mb-1.5">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Khan"
                  value={form.lastName}
                  onChange={(val) => set('lastName', val)}
                  error={errors.lastName}
                />
                {errors.lastName && (
                  <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-[#1d1d1d] mb-1.5">
                Email Address <span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(val) => set('email', val)}
                error={errors.email}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Phone (optional) */}
            <div>
              <label className="block text-xs font-semibold text-[#1d1d1d] mb-1.5">
                Phone Number <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <Input
                type="tel"
                placeholder="+92 300 1234567"
                value={form.phone}
                onChange={(val) => set('phone', val)}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-[#1d1d1d] mb-1.5">
                Password <span className="text-red-500">*</span>
              </label>
              <Input
                type="password"
                placeholder="Minimum 8 characters"
                value={form.password}
                onChange={(val) => set('password', val)}
                error={errors.password}
              />
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-[#1d1d1d] mb-1.5">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <Input
                type="password"
                placeholder="Re-enter your password"
                value={form.confirmPassword}
                onChange={(val) => set('confirmPassword', val)}
                error={errors.confirmPassword}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms checkbox */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.terms}
                  onChange={(e) => set('terms', e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 cursor-pointer flex-shrink-0"
                  style={{ accentColor: '#bba442' }}
                />
                <span className="text-xs text-slate-600 leading-relaxed">
                  I agree to the{' '}
                  <Link href="/terms" className="underline hover:no-underline" style={{ color: '#5cc4eb' }}>
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="underline hover:no-underline" style={{ color: '#5cc4eb' }}>
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {errors.terms && (
                <p className="text-xs text-red-500 mt-1.5 ml-7">{errors.terms}</p>
              )}
            </div>

            {/* Submit */}
            <Button type="submit" variant="primary" size="lg" full loading={loading}>
              Create My Account
            </Button>
          </form>

          {/* Footer */}
          <p className="text-center text-xs text-slate-400 mt-8">
            By registering you agree to receive service-related communications from TechPigeon.
          </p>
        </div>
      </div>
    </div>
  );
}
