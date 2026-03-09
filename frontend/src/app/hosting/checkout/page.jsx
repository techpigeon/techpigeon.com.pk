'use client';
export const dynamic = 'force-dynamic';

import { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Footer from '../../../components/layout/Footer';
import Button from '../../../components/ui/Button';
import Alert from '../../../components/ui/Alert';
import { useHostingPlans } from '../../../lib/useContent';
import { hostingApi } from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';

export default function HostingCheckoutPage() {
  const router = useRouter();
  const search = useSearchParams();
  const { plans, loading } = useHostingPlans();
  const { isAuthenticated } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const billing = search.get('billing') === 'annual' ? 'annual' : 'monthly';
  const planParam = search.get('plan') || '';

  const plan = useMemo(() => {
    if (!plans?.length) return null;
    return plans.find((p) => p.slug === planParam || p.id === planParam) || plans[0];
  }, [plans, planParam]);

  const amount = plan ? Number(billing === 'annual' ? plan.price_annual_pkr : plan.price_monthly_pkr) : 0;

  const proceed = async () => {
    setError('');
    if (!plan) return setError('Hosting plan not found.');

    if (!isAuthenticated) {
      const redirect = `/hosting/checkout?plan=${encodeURIComponent(planParam)}&billing=${billing}`;
      router.push(`/auth/login?redirect=${encodeURIComponent(redirect)}`);
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await hostingApi.subscribe({ plan_id: plan.id, billing_cycle: billing });
      const orderId = data?.order?.id;
      router.push(orderId ? `/dashboard/billing?order=${orderId}` : '/dashboard/billing');
    } catch (e) {
      setError(e.response?.data?.error || 'Unable to create hosting order.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      <section className="max-w-3xl mx-auto w-full px-5 pt-20 pb-12">
        <h1 style={{ fontFamily: "'Aleo',serif" }} className="text-3xl text-[#bba442] mb-2">Hosting Checkout</h1>
        <p className="text-sm text-slate-500 mb-6">Review plan details and continue to payment.</p>

        {error && <Alert type="error">{error}</Alert>}

        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          {loading && <p className="text-slate-400">Loading plan details...</p>}
          {!loading && !plan && <p className="text-red-500">Plan not found.</p>}
          {!loading && plan && (
            <>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#5cc4eb] mb-1">Selected Plan</p>
                  <h2 className="text-2xl text-[#1d1d1d]" style={{ fontFamily: "'Aleo',serif" }}>{plan.name}</h2>
                  <p className="text-sm text-slate-500 mt-1">Billing: <b>{billing}</b></p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Total</p>
                  <p className="text-2xl text-[#bba442]" style={{ fontFamily: "'Aleo',serif" }}>Rs.{amount.toLocaleString('en-PK')}</p>
                </div>
              </div>

              <div className="mt-5 p-4 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-600">
                After creating order, you can pay from Billing using JazzCash, EasyPaisa, Stripe, or bank transfer.
              </div>

              <div className="mt-6 flex gap-3">
                <Button onClick={proceed} loading={submitting}>
                  {isAuthenticated ? 'Create Order & Continue' : 'Login / Register to Continue'}
                </Button>
                <Button variant="outline" onClick={() => router.push('/hosting')}>Back</Button>
              </div>
            </>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
