'use client';
export const dynamic = 'force-dynamic';

import Link from 'next/link';
import Button from '../../components/ui/Button';
import Footer from '../../components/layout/Footer';
import { useSite } from '../../context/SiteContext';
import { usePageContent, useVentures, usePartners } from '../../lib/useContent';

export default function AboutPage() {
  const { s } = useSite();
  const { sections } = usePageContent('about');
  const { ventures } = useVentures();
  const { partners } = usePartners();
  const hero = sections.hero || {};
  const mission = sections.mission || {};
  const cta = sections.cta || {};
  const pillars = mission.data?.pillars || [];

  return (
    <>
      <section className="relative overflow-hidden text-center px-6 py-24" style={{ background: 'linear-gradient(135deg, #0B1D3A 0%, #122a4f 60%, #0B1D3A 100%)' }}>
        <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'linear-gradient(90deg, #5cc4eb, #bba442, #5cc4eb)' }} />
        <h1 className="text-4xl md:text-5xl text-[#bba442] mb-6" style={{ fontFamily: 'var(--font-heading, Aleo, serif)' }}>
          {hero.title || 'About Techpigeon'}
        </h1>
        <p className="text-white/80 max-w-3xl mx-auto leading-8 text-base md:text-lg">
          {s('site_description', hero.subtitle || '')}
        </p>
        <p className="text-xs tracking-[0.2em] uppercase text-white/50 mt-8">{s('site_full_name', 'TECHPIGEON (SMC-PRIVATE) LIMITED')}</p>
      </section>

      <section className="bg-white px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl text-[#bba442] text-center mb-3" style={{ fontFamily: 'var(--font-heading, Aleo, serif)' }}>
            {mission.title || 'What We Do'}
          </h2>
          <p className="text-slate-700 text-center max-w-2xl mx-auto mb-12 leading-7">
            {mission.subtitle || 'We empower businesses, students, and startups through practical technology solutions.'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map((pillar, i) => (
              <div key={pillar.title || i} className="bg-slate-50 rounded-2xl p-8 border-t-4 transition-all hover:-translate-y-1 hover:shadow-lg" style={{ borderTopColor: i === 1 ? '#bba442' : '#5cc4eb' }}>
                <h3 className="text-xl text-[#0B1D3A] mb-3" style={{ fontFamily: 'var(--font-heading, Aleo, serif)' }}>{pillar.title}</h3>
                <p className="text-sm text-slate-600 leading-7">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20" style={{ background: 'linear-gradient(180deg, #f0f4f8 0%, #ffffff 100%)' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl text-[#bba442] text-center mb-3" style={{ fontFamily: 'var(--font-heading, Aleo, serif)' }}>Our Ventures</h2>
          <p className="text-slate-700 text-center max-w-2xl mx-auto mb-12 leading-7">Product-driven initiatives built to solve real problems across healthcare and the startup ecosystem.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ventures.map((venture) => (
              <div key={venture.id} className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
                <span className="inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4" style={{ color: venture.category === 'Startups' ? '#bba442' : '#5cc4eb', background: venture.category === 'Startups' ? 'rgba(187,164,66,0.12)' : 'rgba(92,196,235,0.12)' }}>
                  {venture.category}
                </span>
                <h3 className="text-2xl text-[#0B1D3A] mb-2" style={{ fontFamily: 'var(--font-heading, Aleo, serif)' }}>{venture.name}</h3>
                <p className="text-sm font-semibold text-[#bba442] mb-4">{venture.tagline}</p>
                <p className="text-sm text-slate-600 leading-7">{venture.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-20">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl text-[#bba442] mb-3" style={{ fontFamily: 'var(--font-heading, Aleo, serif)' }}>Trusted By</h2>
          <p className="text-slate-700 max-w-2xl mx-auto mb-12 leading-7">Teams of every size already trust TechPigeon where their work happens.</p>
          <div className="flex flex-wrap justify-center gap-6 bg-slate-50 rounded-2xl border border-slate-200 p-8">
            {partners.map((partner) => (
              <div key={partner.id} className="flex flex-col items-center gap-3 min-w-[120px]">
                <div className="w-16 h-16 rounded-full bg-[#0B1D3A] text-[#bba442] flex items-center justify-center text-xl font-bold">
                  {partner.name?.[0] || 'P'}
                </div>
                <span className="text-sm font-semibold text-[#0B1D3A] text-center">{partner.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 border-y border-slate-200 px-6 py-8 text-center">
        <p className="text-sm text-slate-700">{s('site_address', 'St 49, G-7/4, Islamabad, 44000, Pakistan')}</p>
      </section>

      <section className="relative overflow-hidden text-center px-6 py-20" style={{ background: 'linear-gradient(135deg, #0B1D3A 0%, #122a4f 60%, #0B1D3A 100%)' }}>
        <h2 className="text-3xl text-[#bba442] mb-4 relative" style={{ fontFamily: 'var(--font-heading, Aleo, serif)' }}>
          {cta.title || 'Ready to Build Something Great?'}
        </h2>
        <p className="text-white/80 max-w-2xl mx-auto mb-8 leading-7 relative">
          {cta.subtitle || 'Whether you need cloud software, education consulting, or want to join our AI Bootcamp — we are here to help you succeed.'}
        </p>
        <Link href="/contact" className="relative inline-block no-underline">
          <Button size="lg">Get Started</Button>
        </Link>
      </section>

      <Footer />
    </>
  );
}
