'use client';
export const dynamic = 'force-dynamic';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Footer from '../../components/layout/Footer';
import Button from '../../components/ui/Button';
import { useTlds, usePageContent } from '../../lib/useContent';

/* ── helpers ── */
function formatPKR(n) {
  return 'Rs.' + Number(n).toLocaleString('en-PK');
}

function simulateSearch(query, tld, tlds) {
  const targetExts = tld
    ? tlds.filter((t) => t.ext === tld)
    : tlds.slice(0, 10);

  return targetExts.map((t) => ({
    domain: query.replace(/\s+/g, '').toLowerCase() + t.ext,
    ext: t.ext,
    available: Math.random() > 0.35,
    pkr: Number(t.price_pkr),
  }));
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   DOMAINS PAGE
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function DomainsPage() {
  const { tlds: TLDS } = useTlds();
  const { sections } = usePageContent('domains');
  const hero = sections.hero || {};
  const [q, setQ] = useState('');
  const [tld, setTld] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [cart, setCart] = useState([]);
  const resultsRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = q.trim();
    if (!trimmed) return;

    setLoading(true);
    setSearched(false);
    setResults([]);

    setTimeout(() => {
      const res = simulateSearch(trimmed, tld, TLDS);
      setResults(res);
      setLoading(false);
      setSearched(true);

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }, 800);
  };

  const toggleCart = (domain) => {
    setCart((prev) =>
      prev.includes(domain) ? prev.filter((d) => d !== domain) : [...prev, domain],
    );
  };

  /* ━━━━━━━━━━  RENDER  ━━━━━━━━━━ */
  return (
    <main className="min-h-screen flex flex-col">
      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(155deg, #0B1D3A 0%, #1E3A5F 100%)',
        }}
      >
        {/* decorative grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(187,164,66,0.06) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        {/* decorative orbs */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-30 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(92,196,235,0.18), transparent 70%)' }}
        />
        <div className="absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full opacity-30 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(187,164,66,0.14), transparent 70%)' }}
        />

        <div className="max-w-4xl mx-auto px-5 pt-20 pb-24 relative text-center">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#bba442] mb-4">
            {hero.data?.badge || 'Domain Registration'}
          </span>

          <h1
            className="text-4xl md:text-5xl lg:text-6xl text-white mb-5 leading-tight"
            style={{ fontFamily: "var(--font-heading, 'Aleo', serif)" }}
          >
            {hero.title ? <>{hero.title.split('Perfect Domain')[0]}<em className="not-italic text-[#5cc4eb]">Perfect Domain</em></> : <>Find Your <em className="not-italic text-[#5cc4eb]">Perfect Domain</em></>}
          </h1>

          <p className="text-white/55 text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            {hero.subtitle || 'Search from 500+ TLD extensions. Free WHOIS privacy, DNS management, and email forwarding included.'}
          </p>

          {/* ── search bar ── */}
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row items-stretch gap-3 max-w-2xl mx-auto"
          >
            <input
              type="text"
              placeholder="Type your desired domain name…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="flex-1 px-5 py-4 rounded text-[#1d1d1d] text-base outline-none border-2 border-transparent focus:border-[#5cc4eb] transition-colors placeholder:text-slate-400"
              style={{ fontFamily: "'Open Sans', sans-serif" }}
            />
            <select
              value={tld}
              onChange={(e) => setTld(e.target.value)}
              className="px-4 py-4 rounded bg-white text-[#1d1d1d] text-sm font-semibold outline-none border-2 border-transparent focus:border-[#5cc4eb] cursor-pointer transition-colors"
            >
              <option value="">All TLDs</option>
              {TLDS.map((t) => (
                <option key={t.ext} value={t.ext}>
                  {t.ext}
                </option>
              ))}
            </select>
            <Button
              type="submit"
              size="lg"
              variant="primary"
              loading={loading}
              className="whitespace-nowrap"
            >
              {loading ? 'Searching…' : 'Search Domain'}
            </Button>
          </form>

          {/* ── TLD price pills ── */}
          <div className="flex flex-wrap justify-center gap-2.5 mt-8">
            {TLDS.slice(0, 8).map((t) => (
              <button
                key={t.ext}
                type="button"
                onClick={() => {
                  setTld(t.ext);
                  if (q.trim()) handleSearch({ preventDefault: () => {} });
                }}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border-none cursor-pointer ${
                  tld === t.ext
                    ? 'bg-[#5cc4eb]/25 text-[#5cc4eb]'
                    : 'bg-white/10 text-white/70 hover:bg-white/15 hover:text-white'
                }`}
              >
                {t.ext}{' '}
                <span className="text-[#bba442] ml-1">{formatPKR(t.price_pkr)}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEARCH RESULTS ── */}
      <section
        ref={resultsRef}
        className="flex-1"
        style={{ background: 'linear-gradient(180deg, #f0f8fc 0%, #ffffff 100%)' }}
      >
        <div className="max-w-4xl mx-auto px-5 py-16">
          {/* loading skeleton */}
          {loading && (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse flex items-center gap-4"
                >
                  <div className="h-5 w-48 bg-slate-200 rounded" />
                  <div className="flex-1" />
                  <div className="h-5 w-20 bg-slate-200 rounded" />
                  <div className="h-10 w-28 bg-slate-200 rounded" />
                </div>
              ))}
            </div>
          )}

          {/* results */}
          {searched && !loading && (
            <>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-xs font-bold text-[#5cc4eb] uppercase tracking-widest mb-1">
                    Search Results
                  </p>
                  <h2
                    className="text-2xl md:text-3xl text-[#bba442]"
                    style={{ fontFamily: "'Aleo', serif" }}
                  >
                    Results for &ldquo;
                    <span className="text-[#1d1d1d]">{q.trim()}</span>&rdquo;
                  </h2>
                </div>
                {cart.length > 0 && (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-500">
                      {cart.length} domain{cart.length > 1 ? 's' : ''} selected
                    </span>
                    <Link
                      href={`/domains/checkout?domains=${encodeURIComponent(cart.join(','))}`}
                      className="no-underline"
                    >
                      <Button size="sm" variant="gold">
                        Checkout &rarr;
                      </Button>
                    </Link>
                  </div>
                )}
              </div>

              {results.length === 0 && (
                <div className="text-center py-16">
                  <div className="text-5xl mb-4">🔍</div>
                  <p className="text-slate-500 text-lg">No results found. Try a different search term.</p>
                </div>
              )}

              <div className="space-y-3">
                {results.map((r) => {
                  const inCart = cart.includes(r.domain);
                  return (
                    <div
                      key={r.domain}
                      className={`flex flex-col sm:flex-row sm:items-center gap-4 bg-white rounded-2xl p-5 md:p-6 border transition-all duration-200 ${
                        r.available
                          ? 'border-emerald-200 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-50'
                          : 'border-slate-200 opacity-70'
                      }`}
                    >
                      {/* domain name */}
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${
                            r.available
                              ? 'bg-emerald-50 text-emerald-600'
                              : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          {r.available ? '✓' : '✕'}
                        </div>
                        <div className="min-w-0">
                          <p
                            className="text-base md:text-lg font-semibold text-[#1d1d1d] truncate"
                            style={{ fontFamily: "'Open Sans', sans-serif" }}
                          >
                            {r.domain}
                          </p>
                          <p
                            className={`text-xs font-semibold mt-0.5 ${
                              r.available ? 'text-emerald-600' : 'text-slate-400'
                            }`}
                          >
                            {r.available ? 'Available' : 'Not Available'}
                          </p>
                        </div>
                      </div>

                      {/* price */}
                      <div className="text-right shrink-0">
                        {r.available ? (
                          <>
                            <p
                              className="text-lg font-bold text-[#bba442]"
                              style={{ fontFamily: "'Aleo', serif" }}
                            >
                              {formatPKR(r.pkr)}
                            </p>
                            <p className="text-xs text-slate-400">/year</p>
                          </>
                        ) : (
                          <p className="text-sm text-slate-400 italic">—</p>
                        )}
                      </div>

                      {/* action */}
                      <div className="shrink-0">
                        {r.available ? (
                          <Button
                            size="sm"
                            variant={inCart ? 'outline' : 'primary'}
                            onClick={() => toggleCart(r.domain)}
                            className="min-w-[130px]"
                          >
                            {inCart ? 'Remove' : 'Add to Cart'}
                          </Button>
                        ) : (
                          <Button size="sm" variant="ghost" disabled className="min-w-[130px]">
                            Unavailable
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* bulk pricing note */}
              {results.some((r) => r.available) && (
                <div className="mt-10 bg-[#f5edc8]/40 border border-[#bba442]/20 rounded-2xl p-6 text-center">
                  <p
                    className="text-sm font-semibold text-[#bba442] mb-1"
                    style={{ fontFamily: "'Aleo', serif" }}
                  >
                    Bulk Discount Available
                  </p>
                  <p className="text-sm text-slate-500">
                    Register 3 or more domains and get <strong>10% off</strong> your total.
                    Free WHOIS privacy and DNS management included with every domain.
                  </p>
                </div>
              )}
            </>
          )}

          {/* empty state before search */}
          {!searched && !loading && (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[#e8f6fc] flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-[#5cc4eb]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3
                className="text-xl text-[#bba442] mb-2"
                style={{ fontFamily: "'Aleo', serif" }}
              >
                Ready to find your domain?
              </h3>
              <p className="text-slate-500 text-sm max-w-sm mx-auto">
                Enter a name above and we&apos;ll check availability across all popular extensions instantly.
              </p>

              {/* popular TLDs feature cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-2xl mx-auto">
                {TLDS.slice(0, 4).map((t) => (
                  <div
                    key={t.ext}
                    className="bg-white border border-slate-200 rounded-2xl p-5 text-center hover:border-[#bba442] hover:shadow-lg transition-all duration-200 cursor-pointer"
                    onClick={() => {
                      setTld(t.ext);
                    }}
                  >
                    <p
                      className="text-2xl font-bold text-[#1d1d1d] mb-1"
                      style={{ fontFamily: "'Aleo', serif" }}
                    >
                      {t.ext}
                    </p>
                    <p className="text-sm font-semibold text-[#bba442]">
                      {formatPKR(t.price_pkr)}
                      <span className="text-xs text-slate-400 font-normal">/yr</span>
                    </p>
                  </div>
                ))}
              </div>

              {/* trust signals */}
              <div className="flex flex-wrap justify-center gap-8 mt-14 pt-8 border-t border-slate-200">
                {[
                  ['500+', 'TLD Extensions'],
                  ['Free', 'WHOIS Privacy'],
                  ['24/7', 'DNS Management'],
                  ['Instant', 'Activation'],
                ].map(([n, l]) => (
                  <div key={l}>
                    <div
                      className="text-xl font-bold text-[#bba442]"
                      style={{ fontFamily: "'Aleo', serif" }}
                    >
                      {n}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">{l}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <Footer />
    </main>
  );
}
