'use client';
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import Link from 'next/link';
import Footer from '../../components/layout/Footer';
import { useCourses, usePageContent } from '../../lib/useContent';

// ─── Derived look-ups ──────────────────────────────────────────────
const INSTRUCTOR_MAP = {
  Cloud:      'Muhammad Ali Khan',
  Security:   'Sara Ahmed',
  Networking: 'Usman Tariq',
  Linux:      'Muhammad Ali Khan',
  DevOps:     'Sara Ahmed',
};

const CATEGORY_GRADIENTS = {
  Cloud:      'linear-gradient(135deg, #e8f6fc, #DBEAFE)',
  Security:   'linear-gradient(135deg, #FEE2E2, #FECACA)',
  Networking: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
  Linux:      'linear-gradient(135deg, #FEF9C3, #FDE68A)',
  DevOps:     'linear-gradient(135deg, #DBEAFE, #BFDBFE)',
};

const CATEGORY_COLORS = {
  Cloud:      '#5cc4eb',
  Security:   '#ef4444',
  Networking: '#bba442',
  DevOps:     '#3b82f6',
  Linux:      '#f59e0b',
};

const LEVEL_STYLES = {
  Beginner:     { bg: '#dcfce7', color: '#16a34a', border: '#bbf7d0' },
  Intermediate: { bg: '#fef9c3', color: '#ca8a04', border: '#fde68a' },
  Advanced:     { bg: '#fee2e2', color: '#dc2626', border: '#fecaca' },
};

const CATEGORIES = ['All', 'Cloud', 'Security', 'Networking', 'DevOps', 'Linux'];

// ─── Main Page Component ───────────────────────────────────────────
export default function TrainingCatalogPage() {
  const { courses } = useCourses();
  const { sections } = usePageContent('training');
  const hero = sections.hero || {};
  const [activeCat, setActiveCat] = useState('All');

  const filtered =
    activeCat === 'All'
      ? courses
      : courses.filter((c) => c.category === activeCat);

  return (
    <main>
      {/* ── Hero / Header Section ──────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(155deg, #faf8f0, #FFFFFF)' }}
      >
        {/* Decorative blobs */}
        <div
          className="absolute -top-32 -right-24 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(187,164,66,0.08), transparent 70%)',
          }}
        />
        <div
          className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(92,196,235,0.06), transparent 70%)',
          }}
        />

        <div className="max-w-7xl mx-auto px-5 py-20 relative">
          {/* Subtitle */}
          <p
            className="text-sm font-bold uppercase tracking-widest mb-3"
            style={{ color: '#5cc4eb', fontFamily: 'var(--font-body, Open Sans, sans-serif)' }}
          >
            {hero.data?.badge || 'IT Training & Certification'}
          </p>

          {/* Heading */}
          <h1
            className="text-4xl md:text-5xl leading-tight mb-4"
            style={{ fontFamily: 'var(--font-heading, Aleo, serif)', color: '#bba442' }}
          >
            {hero.title || 'Learn From Industry Experts'}
          </h1>

          <p
            className="text-base leading-relaxed mb-10 max-w-xl"
            style={{ fontFamily: 'var(--font-body, Open Sans, sans-serif)', color: '#1d1d1d' }}
          >
            {hero.subtitle || 'Hands-on courses in cloud computing, cybersecurity, networking, Linux, and DevOps — taught by certified professionals in Pakistan.'}
          </p>

          {/* Category Filter Pills */}
          <div className="flex gap-2.5 flex-wrap">
            {CATEGORIES.map((cat) => {
              const isActive = activeCat === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCat(cat)}
                  className="px-5 py-2 rounded-full border text-sm font-semibold cursor-pointer transition-all duration-200"
                  style={{
                    background: isActive ? '#e8f6fc' : '#ffffff',
                    borderColor: isActive ? '#5cc4eb' : '#e2e8f0',
                    color: isActive ? '#5cc4eb' : '#64748b',
                    fontFamily: 'var(--font-body, Open Sans, sans-serif)',
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Course Cards Grid ──────────────────────────────────── */}
      <section className="py-16 px-5">
        <div className="max-w-7xl mx-auto">
          {filtered.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center">
              <div className="text-5xl mb-4">🎓</div>
              <h3
                  className="font-semibold text-lg mb-2"
                  style={{ fontFamily: 'var(--font-heading, Aleo, serif)', color: '#bba442' }}
                >
                  No courses found
                </h3>
              <p
                className="text-sm"
                style={{
                    fontFamily: 'var(--font-body, Open Sans, sans-serif)',
                    color: '#64748b',
                  }}
                >
                No courses available in this category yet. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((course) => {
                const instructor =
                  course.instructor_name || INSTRUCTOR_MAP[course.category] || 'TechPigeon Instructor';
                const modules = course.total_modules || Math.max(1, Math.round(Number(course.duration_hours || 0) * 0.6));
                const bg =
                  CATEGORY_GRADIENTS[course.category] ||
                  'linear-gradient(135deg, #f1f5f9, #e2e8f0)';
                const catColor =
                  CATEGORY_COLORS[course.category] || '#5cc4eb';
                const normalizedLevel = course.level ? course.level.charAt(0).toUpperCase() + course.level.slice(1) : 'Beginner';
                const levelStyle = LEVEL_STYLES[normalizedLevel] || LEVEL_STYLES.Beginner;

                return (
                  <Link
                    key={course.id}
                    href="/auth/register"
                    className="no-underline group"
                  >
                    <div
                      className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col h-full"
                    >
                      {/* ── Emoji Header Area ───────────────── */}
                      <div
                        className="h-36 flex items-center justify-center text-5xl relative"
                        style={{ background: bg }}
                      >
                          <span className="drop-shadow-sm">{course.thumbnail_url ? '🖼️' : '🎓'}</span>
                      </div>

                      {/* ── Card Body ────────────────────────── */}
                      <div className="p-5 flex flex-col flex-1">
                        {/* Badges */}
                        <div className="flex items-center gap-2 mb-3">
                          {/* Level Badge */}
                          <span
                            className="text-xs font-bold px-2.5 py-0.5 rounded-full border"
                            style={{
                              background: levelStyle.bg,
                              color: levelStyle.color,
                              borderColor: levelStyle.border,
                            }}
                          >
                            {normalizedLevel}
                          </span>

                          {/* Category Badge */}
                          <span
                            className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                            style={{
                              background: catColor + '18',
                              color: catColor,
                            }}
                          >
                            {course.category}
                          </span>
                        </div>

                        {/* Title */}
                        <h3
                          className="text-base font-bold leading-snug mb-2"
                          style={{
                              fontFamily: 'var(--font-heading, Aleo, serif)',
                              color: '#1d1d1d',
                            }}
                          >
                          {course.title}
                        </h3>

                        {/* Instructor */}
                        <p
                          className="text-xs mb-4"
                          style={{
                              fontFamily: 'var(--font-body, Open Sans, sans-serif)',
                              color: '#64748b',
                            }}
                          >
                          <span className="mr-1.5">👤</span>
                          {instructor}
                        </p>

                        {/* Spacer pushes bottom content down */}
                        <div className="flex-1" />

                        {/* Hours + Modules row */}
                        <div
                          className="flex items-center gap-4 text-xs mb-4 pb-4 border-b border-slate-100"
                          style={{
                              fontFamily: 'var(--font-body, Open Sans, sans-serif)',
                              color: '#64748b',
                            }}
                          >
                          <span className="flex items-center gap-1.5">
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <circle cx="12" cy="12" r="10" />
                              <path d="M12 6v6l4 2" />
                            </svg>
                            {course.duration_hours} Hours
                          </span>
                          <span className="flex items-center gap-1.5">
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path d="M4 6h16M4 12h16M4 18h10" />
                            </svg>
                            {modules} Modules
                          </span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center justify-between">
                          <div>
                            <span
                              className="text-xl font-bold"
                              style={{
                                fontFamily: 'var(--font-heading, Aleo, serif)',
                                color: '#bba442',
                              }}
                            >
                              Rs.{Number(course.price_pkr).toLocaleString()}
                            </span>
                            <span
                              className="text-xs ml-1"
                              style={{
                                fontFamily: 'var(--font-body, Open Sans, sans-serif)',
                                color: '#94a3b8',
                              }}
                            >
                              PKR
                            </span>
                          </div>
                          <span
                            className="text-xs font-semibold transition-colors duration-200 group-hover:text-[#5cc4eb]"
                            style={{
                                fontFamily: 'var(--font-body, Open Sans, sans-serif)',
                                color: '#bba442',
                              }}
                            >
                            Enroll Now &rarr;
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <Footer />
    </main>
  );
}
