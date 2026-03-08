'use client';
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Alert from '../../components/ui/Alert';
import Footer from '../../components/layout/Footer';
import { useSite } from '../../context/SiteContext';
import { usePageContent } from '../../lib/useContent';

export default function ContactPage() {
  const { s } = useSite();
  const { sections } = usePageContent('contact');
  const hero = sections.hero || {};
  const [formData, setFormData] = useState({ fullName: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const set = (key, value) => setFormData((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSubmitted(false);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitted(true);
      setFormData({ fullName: '', email: '', message: '' });
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="w-full py-20 px-4" style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e8f4f8 50%, #f5f0e0 100%)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading, Aleo, serif)', color: '#bba442' }}>
            {hero.title || 'Contact Us'}
          </h1>
          <p className="text-lg md:text-xl text-[#1d1d1d]">{hero.subtitle || 'Send us a message'}</p>
        </div>
      </section>

      <section className="w-full py-16 px-4 bg-[#0B1D3A]" style={{ fontFamily: 'var(--font-body, Open Sans, sans-serif)' }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="rounded-2xl p-8 md:p-10 bg-white/5 border border-white/10">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[#bba442]" style={{ fontFamily: 'var(--font-heading, Aleo, serif)' }}>Get In Touch</h2>

            {submitted && <div className="mb-6"><Alert type="success">Thank you for getting in touch!</Alert></div>}
            {error && <div className="mb-6"><Alert type="error">{error}</Alert></div>}

            <form onSubmit={handleSubmit} className="space-y-2">
              <Input type="text" placeholder="Full Name" value={formData.fullName} onChange={(val) => set('fullName', val)} required />
              <Input type="email" placeholder="Email" value={formData.email} onChange={(val) => set('email', val)} required />
              <div>
                <textarea
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={(e) => set('message', e.target.value)}
                  required
                  rows={6}
                  className="w-full rounded-lg px-4 py-3 resize-none outline-none border-2 border-slate-200 focus:border-[#5cc4eb]"
                />
              </div>
              <Button type="submit" loading={loading} className="w-full">{loading ? 'Sending...' : 'Submit Inquiry'}</Button>
            </form>
          </div>

          <div className="space-y-6">
            {[
              { title: 'Our Address', value: s('site_address', 'St 49, G-7/4, Islamabad, 44000, Pakistan') },
              { title: 'Phone', value: s('site_phone', '+1 (786) 8226386'), href: `tel:${s('site_phone', '+17868226386')}` },
              { title: 'Email', value: s('site_email', 'contact@techpigeon.org'), href: `mailto:${s('site_email', 'contact@techpigeon.org')}` },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl p-6 flex items-start gap-4 bg-white/5 border border-white/10">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center bg-[#5cc4eb]/15 text-[#5cc4eb]">•</div>
                <div>
                  <h3 className="text-lg font-bold mb-1 text-[#bba442]" style={{ fontFamily: 'var(--font-heading, Aleo, serif)' }}>{item.title}</h3>
                  {item.href ? (
                    <a href={item.href} className="text-white/80 hover:text-[#5cc4eb] transition-colors">{item.value}</a>
                  ) : (
                    <p className="text-white/80">{item.value}</p>
                  )}
                </div>
              </div>
            ))}

            <div className="rounded-2xl p-6 bg-white/5 border border-white/10">
              <h3 className="text-lg font-bold mb-4 text-[#bba442]" style={{ fontFamily: 'var(--font-heading, Aleo, serif)' }}>Follow Us</h3>
              <div className="flex items-center gap-4">
                <a href={s('social_facebook', '#')} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-lg flex items-center justify-center bg-[#5cc4eb]/15 text-[#5cc4eb] hover:bg-[#5cc4eb]/30 transition-colors">f</a>
                <a href={s('social_linkedin', '#')} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-lg flex items-center justify-center bg-[#5cc4eb]/15 text-[#5cc4eb] hover:bg-[#5cc4eb]/30 transition-colors">in</a>
                <a href={s('social_twitter', '#')} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-lg flex items-center justify-center bg-[#5cc4eb]/15 text-[#5cc4eb] hover:bg-[#5cc4eb]/30 transition-colors">x</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
