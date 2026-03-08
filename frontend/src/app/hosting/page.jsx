'use client';
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import Link from 'next/link';
import Button from '../../components/ui/Button';
import Footer from '../../components/layout/Footer';
import { useHostingPlans, usePageContent } from '../../lib/useContent';

// ─── Checkmark icon ────────────────────────────────────────────────
function Check() {
  return (
    <svg
      className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={3}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

// ─── Spec row inside a card ────────────────────────────────────────
function Spec({ label, value, dark }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-dashed last:border-b-0"
      style={{ borderColor: dark ? 'rgba(255,255,255,0.1)' : '#e2e8f0' }}>
      <span className="text-xs" style={{ color: dark ? 'rgba(255,255,255,0.5)' : '#64748b' }}>
        {label}
      </span>
      <span className="text-sm font-semibold" style={{ color: dark ? '#ffffff' : '#1d1d1d' }}>
        {value}
      </span>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────
export default function HostingPage() {
  const { plans } = useHostingPlans();
  const { sections } = usePageContent('hosting');
  const hero = sections.hero || {};
  const [billing, setBilling] = useState('monthly');
  const isAnnual = billing === 'annual';

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: 'var(--font-body, Open Sans, sans-serif)', color: '#1d1d1d' }}>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section
        className="pt-28 pb-16 px-5"
        style={{ background: 'linear-gradient(155deg,#faf8f0,#FFFFFF)' }}
      >
        <div className="max-w-4xl mx-auto text-center">
          {/* Subtitle */}
          <p
            className="text-sm font-semibold tracking-widest uppercase mb-3"
            style={{ color: '#5cc4eb' }}
          >
            {hero.data?.badge || 'Cloud Hosting Pakistan'}
          </p>

          {/* Heading */}
          <h1
            className="text-4xl md:text-5xl font-bold leading-tight mb-5"
            style={{ fontFamily: 'var(--font-heading, Aleo, serif)', color: '#bba442' }}
          >
            {hero.title || 'Hosting That Scales With You'}
          </h1>

          <p className="text-base md:text-lg max-w-2xl mx-auto mb-10" style={{ color: '#64748b' }}>
            {hero.subtitle || 'Blazing-fast NVMe cloud servers in Lahore & Karachi. Free SSL, daily backups, and 24/7 local support — all at prices built for Pakistan.'}
          </p>

          {/* ── Billing toggle ───────────────────────────────────── */}
          <div className="inline-flex items-center bg-slate-100 rounded-full p-1 gap-0">
            <button
              onClick={() => setBilling('monthly')}
              className={`px-5 py-2 text-sm font-semibold rounded-full border-none cursor-pointer transition-all duration-200 ${
                !isAnnual ? 'text-white shadow-md' : 'bg-transparent text-slate-500'
              }`}
              style={!isAnnual ? { backgroundColor: '#5cc4eb' } : {}}
            >
              Monthly
            </button>

            <button
              onClick={() => setBilling('annual')}
              className={`relative px-5 py-2 text-sm font-semibold rounded-full border-none cursor-pointer transition-all duration-200 ${
                isAnnual ? 'text-white shadow-md' : 'bg-transparent text-slate-500'
              }`}
              style={isAnnual ? { backgroundColor: '#5cc4eb' } : {}}
            >
              Annual
              {/* Save badge */}
              <span className="absolute -top-2.5 -right-4 bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none whitespace-nowrap">
                Save 25%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* ── Pricing cards ────────────────────────────────────────── */}
      <section className="flex-1 px-5 pb-20 -mt-2" style={{ background: 'linear-gradient(155deg,#faf8f0,#FFFFFF)' }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-7 items-start">
          {plans.map((plan) => {
            const dark = plan.is_featured;
            const price = isAnnual ? Number(plan.price_annual_pkr) : Number(plan.price_monthly_pkr);
            const features = Array.isArray(plan.features) ? plan.features : [];

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-7 flex flex-col transition-all duration-300 ${
                  dark
                    ? 'scale-[1.03] shadow-2xl text-white'
                    : 'border border-slate-200 shadow-md hover:shadow-lg'
                }`}
                style={{
                  backgroundColor: dark ? '#0B1D3A' : '#ffffff',
                }}
              >
                {/* "Most Popular" badge for featured */}
                {dark && (
                  <div
                    className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-xs font-bold px-4 py-1 rounded-full"
                    style={{ backgroundColor: '#bba442', color: '#ffffff' }}
                  >
                    Most Popular
                  </div>
                )}

                {/* Plan name */}
                <h3
                  className="text-lg font-bold mb-1"
                  style={{
                    fontFamily: 'var(--font-heading, Aleo, serif)',
                    color: dark ? '#ffffff' : '#1d1d1d',
                  }}
                >
                  {plan.name}
                </h3>

                {/* Price */}
                <div className="flex items-end gap-1 mb-5 mt-2">
                  <span
                    className="text-4xl font-extrabold leading-none"
                    style={{ fontFamily: 'var(--font-heading, Aleo, serif)', color: dark ? '#F8D313' : '#bba442' }}
                  >
                    Rs.{price.toLocaleString()}
                  </span>
                  <span
                    className="text-sm mb-1"
                    style={{ color: dark ? 'rgba(255,255,255,0.5)' : '#94a3b8' }}
                  >
                    /mo
                  </span>
                </div>

                {isAnnual && (
                  <p className="text-xs mb-4" style={{ color: dark ? 'rgba(255,255,255,0.4)' : '#94a3b8' }}>
                    Billed Rs.{(price * 12).toLocaleString()} / year
                  </p>
                )}

                {/* Specs */}
                <div className="mb-5">
                  <Spec label="Storage" value={`${plan.disk_gb} GB`} dark={dark} />
                  <Spec label="Bandwidth" value={plan.bandwidth_gb ? `${plan.bandwidth_gb} GB` : 'Unlimited'} dark={dark} />
                  <Spec label="Websites" value={plan.websites || 'Unlimited'} dark={dark} />
                </div>

                {/* Features */}
                <ul className="flex-1 space-y-2.5 mb-7 list-none p-0 m-0">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm" style={{ color: dark ? 'rgba(255,255,255,0.75)' : '#475569' }}>
                      <Check />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link href={`/hosting/checkout?plan=${plan.slug || plan.id}&billing=${billing}`} className="no-underline">
                  <Button
                    variant={dark ? 'gold' : 'primary'}
                    size="lg"
                    full
                  >
                    Get {plan.name}
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <Footer />
    </div>
  );
}
