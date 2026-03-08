'use client';
export const dynamic = 'force-dynamic';
import Link from 'next/link';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';
import { useSite } from '../context/SiteContext';
import { usePageContent, useServices, useVentures, usePartners } from '../lib/useContent';

/* ── Icon map for FontAwesome class names → emoji fallbacks ── */
const SERVICE_ICONS = {
  'fas fa-shapes':                     '🎓',
  'fas fa-compress-arrows-alt':        '☁️',
  'fas fa-crop-alt':                   '📱',
  'fas fa-external-link-square-alt':   '🌐',
  'fas fa-shield-alt':                 '🛡️',
  'fas fa-code':                       '💻',
};

function HeroSection() {
  const { s } = useSite();
  const { sections } = usePageContent('home');
  const hero = sections.hero || {};
  const data = hero.data || {};
  const stats = data.stats || [{ value: 'AI', label: 'Boot Camps' }, { value: 'Cloud', label: 'App Development' }, { value: '99.9%', label: 'Uptime SLA' }];
  const ctaPrimary = data.cta_primary || { text: 'Courses Registration', href: '/training' };
  const ctaSecondary = data.cta_secondary || { text: 'Register your Startup', href: '/auth/register' };

  return (
    <section className="relative overflow-hidden" style={{ background: 'linear-gradient(155deg,#faf8f0 0%,#FFFFFF 50%,#f0f8fc 100%)' }}>
      <div className="absolute -top-32 -right-24 w-[500px] h-[500px] rounded-full" style={{ background: 'radial-gradient(circle,rgba(187,164,66,0.08),transparent 70%)' }} />
      <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full" style={{ background: 'radial-gradient(circle,rgba(92,196,235,0.06),transparent 70%)' }} />

      <div className="max-w-7xl mx-auto px-5 py-20 grid md:grid-cols-2 gap-16 items-center relative">
        <div>
          <div className="inline-flex items-center gap-2 bg-white border border-slate-200 shadow-sm px-3 py-1.5 rounded-full text-xs font-semibold text-[#bba442] mb-6">
            <span className="bg-[#bba442] text-white px-2 py-0.5 rounded-full text-xs font-bold">PAKISTAN</span>
            {s('site_full_name', 'TECHPIGEON (SMC-PRIVATE) LIMITED')}
          </div>

          <h1 style={{ fontFamily: "var(--font-heading, 'Aleo', serif)" }} className="text-4xl md:text-5xl leading-tight text-[#bba442] mb-5">
            {hero.title ? hero.title.split('/').map((part, i) => (
              <span key={i}>{i > 0 && <br />}{i === 1 ? <em className="not-italic" style={{ color: '#5cc4eb' }}>{part.trim()}</em> : part.trim()}</span>
            )) : <>We arrange High Tech /<br /><em className="not-italic" style={{ color: '#5cc4eb' }}>AI Boot camps and AI Classes</em><br />Nationwide.</>}
          </h1>

          <p className="text-base text-slate-500 leading-relaxed mb-4 max-w-lg">
            {hero.subtitle || 'AI Boot Camps, Tech Seminars, Capacity Building Trainings, High End Cloud Courses.'}
          </p>
          <p className="text-sm text-slate-400 leading-relaxed mb-8 max-w-lg">
            {s('site_description', '')}
          </p>

          <div className="flex gap-3 flex-wrap">
            <Link href={ctaPrimary.href}><Button size="lg">{ctaPrimary.text}</Button></Link>
            <Link href={ctaSecondary.href}><Button size="lg" variant="outline">{ctaSecondary.text}</Button></Link>
          </div>

          <div className="flex gap-8 mt-10 pt-8 border-t border-slate-200">
            {stats.map((st) => (
              <div key={st.label}>
                <div style={{ fontFamily: "var(--font-heading, 'Aleo', serif)" }} className="text-2xl text-[#bba442]">{st.value}</div>
                <div className="text-xs text-slate-400 mt-0.5">{st.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — floating cards */}
        <div className="hidden md:flex flex-col gap-4">
          {[
            { t: 'Company', c: (<><div className="font-semibold text-[#1d1d1d]">{s('site_full_name', 'TECHPIGEON (SMC-PRIVATE) LIMITED')}</div><div className="flex justify-between mt-2"><span className="text-xs text-slate-400">Pakistan</span><span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">Active</span></div></>), d: '0s' },
            { t: 'Venture — KCUOG', c: (<div className="flex justify-between items-start"><div><div className="text-sm text-slate-500 font-medium">Kashmir CareU OnGo</div><div className="text-xs text-emerald-600 mt-1">All One Stop Healthcare Solution</div></div><span className="bg-[#5cc4eb]/10 text-[#5cc4eb] text-xs font-semibold px-2.5 py-0.5 rounded-full">Healthcare</span></div>), d: '-1.3s' },
            { t: 'AI Boot Camp', c: (<><div className="font-semibold text-[#1d1d1d] mb-2">AI &amp; Cloud Computing</div><div className="bg-slate-200 rounded-full h-2"><div className="bg-[#5cc4eb] h-2 rounded-full w-[65%]" /></div><div className="flex justify-between text-xs text-slate-400 mt-1.5"><span>Capacity Building</span><span>Nationwide</span></div></>), d: '-2.6s' },
          ].map((card, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-lg border border-slate-200" style={{ animation: `float 4s ease-in-out ${card.d} infinite` }}>
              <div className="text-xs text-[#bba442] font-semibold uppercase tracking-wider mb-2.5">{card.t}</div>
              {card.c}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesSection() {
  const { sections } = usePageContent('home');
  const sec = sections.services || {};
  const { services } = useServices();

  return (
    <section id="services" className="py-20 px-5">
      <div className="max-w-7xl mx-auto">
        <p className="text-xs font-bold text-[#5cc4eb] uppercase tracking-widest mb-2">{sec.data?.badge || 'What We Offer'}</p>
        <h2 style={{ fontFamily: "var(--font-heading, 'Aleo', serif)" }} className="text-3xl md:text-4xl text-[#bba442] mb-3">
          {sec.title || 'Everything Your Business Needs'}
        </h2>
        <p className="text-slate-500 mb-12 max-w-xl">{sec.subtitle || 'From AI boot camps to cloud hosting and custom software development — we have you covered.'}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s) => (
            <Link key={s.id} href={s.href || '#'} className="no-underline group">
              <div className="bg-white border border-slate-200 rounded-2xl p-7 transition-all duration-300 cursor-pointer hover:border-[#bba442] hover:shadow-xl hover:-translate-y-1 h-full">
                <div className="w-12 h-12 rounded bg-[#f5edc8]/40 flex items-center justify-center text-2xl mb-5">
                  {SERVICE_ICONS[s.icon] || '⚡'}
                </div>
                <h3 className="font-semibold text-base text-[#1d1d1d] mb-2.5" style={{ fontFamily: "var(--font-heading, 'Aleo', serif)" }}>{s.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">{s.description}</p>
                <span className="text-sm text-[#bba442] font-semibold">Learn more &rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function VenturesSection() {
  const { sections } = usePageContent('home');
  const sec = sections.ventures || {};
  const { ventures } = useVentures();

  return (
    <section className="py-20 px-5" style={{ background: 'linear-gradient(180deg,#f9f7ef 0%,#ffffff 100%)' }}>
      <div className="max-w-7xl mx-auto">
        <p className="text-xs font-bold text-[#5cc4eb] uppercase tracking-widest mb-2">{sec.data?.badge || 'Our Ventures'}</p>
        <h2 style={{ fontFamily: "var(--font-heading, 'Aleo', serif)" }} className="text-3xl md:text-4xl text-[#bba442] mb-3">{sec.title || 'Innovation-Driven Platforms'}</h2>
        <p className="text-slate-500 mb-12 max-w-xl">{sec.subtitle || 'Building products that solve real problems in healthcare, startups, and education.'}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ventures.map((v) => (
            <div key={v.id} className="bg-white border border-slate-200 rounded-2xl p-8 transition-all duration-300 hover:border-[#bba442] hover:shadow-xl hover:-translate-y-1">
              <div className="inline-block bg-[#5cc4eb]/10 text-[#5cc4eb] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">{v.tagline}</div>
              <h3 className="font-semibold text-xl text-[#1d1d1d] mb-3" style={{ fontFamily: "var(--font-heading, 'Aleo', serif)" }}>{v.name}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{v.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const { sections } = usePageContent('home');
  const sec = sections.testimonials || {};
  const { partners } = usePartners();

  return (
    <section className="relative overflow-hidden py-20 px-5" style={{ background: '#0B1D3A' }}>
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle,rgba(187,164,66,0.05) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-14">
          <p className="text-xs font-bold text-[#bba442] uppercase tracking-widest mb-2">{sec.data?.badge || 'Testimonials'}</p>
          <h2 style={{ fontFamily: "var(--font-heading, 'Aleo', serif)" }} className="text-3xl md:text-4xl text-white mb-3">{sec.title || 'Trusted by the Clients'}</h2>
          <p className="text-white/50 max-w-lg mx-auto leading-relaxed">{sec.subtitle || ''}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {partners.map((p) => (
            <div key={p.id} className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-7 text-center transition-all duration-300 hover:bg-white/10 hover:-translate-y-1">
              <div className="w-14 h-14 rounded-full bg-[#bba442]/15 flex items-center justify-center text-xl text-[#bba442] mx-auto mb-4">{p.name.charAt(0)}</div>
              <h4 className="text-white font-semibold text-base mb-2" style={{ fontFamily: "var(--font-heading, 'Aleo', serif)" }}>{p.name}</h4>
              <p className="text-white/40 text-sm">{p.description || 'Trusted Partner'}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const { sections } = usePageContent('home');
  const sec = sections.cta || {};
  const data = sec.data || {};
  const ctaPrimary = data.cta_primary || { text: 'Courses Registration', href: '/training' };
  const ctaSecondary = data.cta_secondary || { text: 'Get Started', href: '/auth/register' };

  return (
    <section className="relative overflow-hidden text-center py-20 px-5" style={{ background: 'linear-gradient(135deg,#0B1D3A,#1E3A5F)' }}>
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle,rgba(187,164,66,0.07) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="max-w-lg mx-auto relative">
        <p className="text-xs font-bold text-[#bba442] uppercase tracking-widest mb-3">{data.badge || 'Get Started Today'}</p>
        <h2 style={{ fontFamily: "var(--font-heading, 'Aleo', serif)" }} className="text-3xl md:text-4xl text-white mb-4">{sec.title || 'Join the AI Revolution with TechPigeon'}</h2>
        <p className="text-white/60 leading-relaxed mb-8">{sec.subtitle || ''}</p>
        <div className="flex gap-3 flex-wrap justify-center">
          <Link href={ctaPrimary.href}><Button size="lg" variant="gold">{ctaPrimary.text} &rarr;</Button></Link>
          <Link href={ctaSecondary.href}><Button size="lg" variant="white">{ctaSecondary.text}</Button></Link>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <ServicesSection />
      <VenturesSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </main>
  );
}
