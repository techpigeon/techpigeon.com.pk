'use client';
export const dynamic = 'force-dynamic';

import { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Footer from '../../../components/layout/Footer';
import Button from '../../../components/ui/Button';
import Alert from '../../../components/ui/Alert';
import { useTlds } from '../../../lib/useContent';
import { domainsApi, ordersApi } from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';

function parseDomains(raw) {
  if (!raw) return [];
  return raw
    .split(',')
    .map((d) => d.trim().toLowerCase())
    .filter(Boolean)
    .filter((d) => d.includes('.'));
}

export default function DomainsCheckoutPage() {
  const router = useRouter();
  const search = useSearchParams();
  const { tlds } = useTlds();
  const { isAuthenticated } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const raw = search.get('domains') || '';
  const selectedDomains = useMemo(() => parseDomains(raw), [raw]);

  const tldPrice = useMemo(() => {
    const map = {};
    for (const t of tlds || []) map[t.ext] = Number(t.price_pkr);
    return map;
  }, [tlds]);

  const items = useMemo(() => {
    return selectedDomains.map((full) => {
      const ext = '.' + full.split('.').slice(1).join('.');
      return {
        full,
        domain_name: full.split('.')[0],
        tld: ext,
        price: tldPrice[ext] || 3499,
      };
    });
  }, [selectedDomains, tldPrice]);

  const total = items.reduce((s, i) => s + i.price, 0);

  const proceed = async () => {
    setError('');
    if (!items.length) return setError('No domains selected for checkout.');

    if (!isAuthenticated) {
      const redirect = `/domains/checkout?domains=${encodeURIComponent(raw)}`;
      router.push(`/auth/login?redirect=${encodeURIComponent(redirect)}`);
      return;
    }

    setSubmitting(true);
    try {
      const created = [];
      for (const item of items) {
        const { data } = await domainsApi.register({
          domain_name: item.domain_name,
          tld: item.tld,
          years: 1,
          auto_renew: true,
          whois_privacy: true,
        });
        created.push(data.domain);
      }

      const orderItems = created.map((d) => ({
        type: 'domain',
        id: d.id,
        description: `${d.full_domain} — 1 Year Registration`,
        quantity: 1,
        unit_price: Number(d.price_pkr),
      }));

      const { data: orderRes } = await ordersApi.create(orderItems);
      const orderId = orderRes?.order?.id;
      router.push(orderId ? `/dashboard/billing?order=${orderId}` : '/dashboard/billing');
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to create domain order. Check selected TLD support.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      <section className="max-w-3xl mx-auto w-full px-5 pt-20 pb-12">
        <h1 style={{ fontFamily: "'Aleo',serif" }} className="text-3xl text-[#bba442] mb-2">Domain Checkout</h1>
        <p className="text-sm text-slate-500 mb-6">Review selected domains and continue to order/payment.</p>

        {error && <Alert type="error">{error}</Alert>}

        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          {!items.length ? (
            <p className="text-slate-500">No domains in cart. Please select domains first.</p>
          ) : (
            <>
              <div className="space-y-2">
                {items.map((i) => (
                  <div key={i.full} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-b-0">
                    <p className="text-sm font-semibold text-[#1d1d1d]">{i.full}</p>
                    <p className="text-sm text-[#bba442] font-semibold">Rs.{i.price.toLocaleString('en-PK')}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-slate-200 flex items-center justify-between">
                <p className="text-sm text-slate-500">Total ({items.length} domain{items.length > 1 ? 's' : ''})</p>
                <p className="text-2xl text-[#bba442]" style={{ fontFamily: "'Aleo',serif" }}>Rs.{total.toLocaleString('en-PK')}</p>
              </div>

              <div className="mt-5 p-4 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-600">
                Domains are added as pending and activated after payment confirmation.
              </div>

              <div className="mt-6 flex gap-3">
                <Button onClick={proceed} loading={submitting}>
                  {isAuthenticated ? 'Create Order & Continue' : 'Login / Register to Continue'}
                </Button>
                <Button variant="outline" onClick={() => router.push('/domains')}>Back</Button>
              </div>
            </>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
