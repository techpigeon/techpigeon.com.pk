'use client';

export const dynamic = 'force-dynamic';

import Link from 'next/link';
import Button from '../../components/ui/Button';
import Footer from '../../components/layout/Footer';
import { COMPANY, VENTURES, PARTNERS } from '../../lib/data';

/* ------------------------------------------------------------------ */
/*  About Page — TechPigeon (SMC-PRIVATE) LIMITED-PAKISTAN             */
/* ------------------------------------------------------------------ */

export default function AboutPage() {
  return (
    <>
      {/* ============================================================ */}
      {/* HERO SECTION                                                  */}
      {/* ============================================================ */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0B1D3A 0%, #122a4f 60%, #0B1D3A 100%)',
          padding: '100px 24px 80px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative accent bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '4px',
            background: 'linear-gradient(90deg, #5cc4eb, #bba442, #5cc4eb)',
          }}
        />

        <h1
          style={{
            fontFamily: "'Aleo', serif",
            fontSize: 'clamp(2rem, 5vw, 3.25rem)',
            color: '#bba442',
            marginBottom: '24px',
            letterSpacing: '0.5px',
          }}
        >
          About Techpigeon
        </h1>

        <p
          style={{
            fontFamily: "'Open Sans', sans-serif",
            fontSize: 'clamp(1rem, 2.2vw, 1.2rem)',
            color: '#d4d9e2',
            maxWidth: '820px',
            margin: '0 auto',
            lineHeight: 1.75,
          }}
        >
          {COMPANY?.description ||
            'Techpigeon offering Education Consulting & Custom Cloud Software development services. We offer services based on AI, Cloud Computing, Cloud App development for all major platforms (iOS, Android) & we run AI Bootcamps campaigns that allows learning and up-to-date hands-on experience on latest frameworks.'}
        </p>

        <p
          style={{
            fontFamily: "'Open Sans', sans-serif",
            fontSize: '0.95rem',
            color: '#8fa3bf',
            marginTop: '28px',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
          }}
        >
          {COMPANY?.name || 'TECHPIGEON (SMC-PRIVATE) LIMITED-PAKISTAN'}
        </p>
      </section>

      {/* ============================================================ */}
      {/* MISSION — WHAT WE DO                                         */}
      {/* ============================================================ */}
      <section
        style={{
          padding: '80px 24px',
          background: '#ffffff',
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2
            style={{
              fontFamily: "'Aleo', serif",
              fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)',
              color: '#bba442',
              textAlign: 'center',
              marginBottom: '16px',
            }}
          >
            What We Do
          </h2>

          <p
            style={{
              fontFamily: "'Open Sans', sans-serif",
              color: '#1d1d1d',
              textAlign: 'center',
              maxWidth: '640px',
              margin: '0 auto 48px',
              lineHeight: 1.7,
              fontSize: '1.05rem',
            }}
          >
            We empower businesses, students, and startups through three
            core pillars — each built on modern cloud-first technology and
            driven by real-world impact.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '32px',
            }}
          >
            {/* Pillar 1 — Education Consulting */}
            <div
              style={{
                background: '#f7f9fc',
                borderRadius: '12px',
                padding: '36px 28px',
                borderTop: '4px solid #5cc4eb',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '14px' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#5cc4eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </div>
              <h3
                style={{
                  fontFamily: "'Aleo', serif",
                  fontSize: '1.25rem',
                  color: '#0B1D3A',
                  marginBottom: '10px',
                }}
              >
                Education Consulting
              </h3>
              <p
                style={{
                  fontFamily: "'Open Sans', sans-serif",
                  color: '#1d1d1d',
                  lineHeight: 1.65,
                  fontSize: '0.95rem',
                }}
              >
                Strategic guidance for institutions and students navigating
                the evolving landscape of technology education, career
                readiness, and global academic opportunities.
              </p>
            </div>

            {/* Pillar 2 — Cloud Software Development */}
            <div
              style={{
                background: '#f7f9fc',
                borderRadius: '12px',
                padding: '36px 28px',
                borderTop: '4px solid #bba442',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '14px' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#bba442" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
                </svg>
              </div>
              <h3
                style={{
                  fontFamily: "'Aleo', serif",
                  fontSize: '1.25rem',
                  color: '#0B1D3A',
                  marginBottom: '10px',
                }}
              >
                Custom Cloud Software
              </h3>
              <p
                style={{
                  fontFamily: "'Open Sans', sans-serif",
                  color: '#1d1d1d',
                  lineHeight: 1.65,
                  fontSize: '0.95rem',
                }}
              >
                End-to-end cloud application development for iOS, Android, and
                web — powered by AI, scalable infrastructure, and modern
                DevOps practices across all major platforms.
              </p>
            </div>

            {/* Pillar 3 — AI Bootcamps */}
            <div
              style={{
                background: '#f7f9fc',
                borderRadius: '12px',
                padding: '36px 28px',
                borderTop: '4px solid #5cc4eb',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '14px' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#5cc4eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
                  <rect x="9" y="9" width="6" height="6" />
                  <line x1="9" y1="1" x2="9" y2="4" />
                  <line x1="15" y1="1" x2="15" y2="4" />
                  <line x1="9" y1="20" x2="9" y2="23" />
                  <line x1="15" y1="20" x2="15" y2="23" />
                  <line x1="20" y1="9" x2="23" y2="9" />
                  <line x1="20" y1="14" x2="23" y2="14" />
                  <line x1="1" y1="9" x2="4" y2="9" />
                  <line x1="1" y1="14" x2="4" y2="14" />
                </svg>
              </div>
              <h3
                style={{
                  fontFamily: "'Aleo', serif",
                  fontSize: '1.25rem',
                  color: '#0B1D3A',
                  marginBottom: '10px',
                }}
              >
                AI Bootcamps
              </h3>
              <p
                style={{
                  fontFamily: "'Open Sans', sans-serif",
                  color: '#1d1d1d',
                  lineHeight: 1.65,
                  fontSize: '0.95rem',
                }}
              >
                Hands-on campaigns that deliver up-to-date experience on the
                latest AI and machine learning frameworks — turning
                participants into job-ready practitioners.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* VENTURES SECTION                                              */}
      {/* ============================================================ */}
      <section
        style={{
          padding: '80px 24px',
          background: 'linear-gradient(180deg, #f0f4f8 0%, #ffffff 100%)',
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2
            style={{
              fontFamily: "'Aleo', serif",
              fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)',
              color: '#bba442',
              textAlign: 'center',
              marginBottom: '16px',
            }}
          >
            Our Ventures
          </h2>

          <p
            style={{
              fontFamily: "'Open Sans', sans-serif",
              color: '#1d1d1d',
              textAlign: 'center',
              maxWidth: '600px',
              margin: '0 auto 48px',
              lineHeight: 1.7,
              fontSize: '1.05rem',
            }}
          >
            Product-driven initiatives built to solve real problems across
            healthcare and the startup ecosystem.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '36px',
            }}
          >
            {/* Venture 1 — KCUOG */}
            <div
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '40px 32px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                border: '1px solid #e8ecf1',
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.06)';
              }}
            >
              {/* Accent strip */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '5px',
                  background: 'linear-gradient(90deg, #5cc4eb, #3ba8d4)',
                }}
              />

              <span
                style={{
                  display: 'inline-block',
                  fontFamily: "'Open Sans', sans-serif",
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  color: '#5cc4eb',
                  background: 'rgba(92,196,235,0.1)',
                  padding: '4px 12px',
                  borderRadius: '4px',
                  marginBottom: '18px',
                }}
              >
                Healthcare
              </span>

              <h3
                style={{
                  fontFamily: "'Aleo', serif",
                  fontSize: '1.5rem',
                  color: '#0B1D3A',
                  marginBottom: '6px',
                }}
              >
                {VENTURES?.kcuog?.name || 'Kashmir CareU OnGo (KCUOG)'}
              </h3>

              <p
                style={{
                  fontFamily: "'Open Sans', sans-serif",
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#bba442',
                  marginBottom: '16px',
                  letterSpacing: '0.3px',
                }}
              >
                {VENTURES?.kcuog?.tagline || 'All One Stop Healthcare Solution'}
              </p>

              <p
                style={{
                  fontFamily: "'Open Sans', sans-serif",
                  color: '#1d1d1d',
                  lineHeight: 1.7,
                  fontSize: '0.95rem',
                }}
              >
                {VENTURES?.kcuog?.description ||
                  'New smart tech venture by Techpigeon \u2014 an all-in-one healthcare solution that helps care seekers access free advice from doctors and get appointments via mobile applications.'}
              </p>
            </div>

            {/* Venture 2 — Startup Network */}
            <div
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '40px 32px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                border: '1px solid #e8ecf1',
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.06)';
              }}
            >
              {/* Accent strip */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '5px',
                  background: 'linear-gradient(90deg, #bba442, #d4bf5e)',
                }}
              />

              <span
                style={{
                  display: 'inline-block',
                  fontFamily: "'Open Sans', sans-serif",
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  color: '#bba442',
                  background: 'rgba(187,164,66,0.1)',
                  padding: '4px 12px',
                  borderRadius: '4px',
                  marginBottom: '18px',
                }}
              >
                Startups
              </span>

              <h3
                style={{
                  fontFamily: "'Aleo', serif",
                  fontSize: '1.5rem',
                  color: '#0B1D3A',
                  marginBottom: '6px',
                }}
              >
                {VENTURES?.startupNetwork?.name || 'Techpigeon Startup Network'}
              </h3>

              <p
                style={{
                  fontFamily: "'Open Sans', sans-serif",
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#5cc4eb',
                  marginBottom: '16px',
                  letterSpacing: '0.3px',
                }}
              >
                Connecting Startups with Domain Experts
              </p>

              <p
                style={{
                  fontFamily: "'Open Sans', sans-serif",
                  color: '#1d1d1d',
                  lineHeight: 1.7,
                  fontSize: '0.95rem',
                }}
              >
                {VENTURES?.startupNetwork?.description ||
                  'Techpigeon Startup Network brings Startups and Domain Experts on one Platform \u2014 accelerating growth through mentorship, collaboration, and shared resources.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* TRUSTED BY SECTION                                            */}
      {/* ============================================================ */}
      <section
        style={{
          padding: '80px 24px',
          background: '#ffffff',
        }}
      >
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <h2
            style={{
              fontFamily: "'Aleo', serif",
              fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)',
              color: '#bba442',
              marginBottom: '16px',
            }}
          >
            Trusted By
          </h2>

          <p
            style={{
              fontFamily: "'Open Sans', sans-serif",
              color: '#1d1d1d',
              maxWidth: '620px',
              margin: '0 auto 40px',
              lineHeight: 1.7,
              fontSize: '1.05rem',
            }}
          >
            Teams of every size, shape and kind have already trust the
            techpigeon Pk where their work happens.
          </p>

          {/* Partner logos area */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '40px',
              padding: '32px',
              background: '#f7f9fc',
              borderRadius: '16px',
              border: '1px solid #e8ecf1',
            }}
          >
            {/* University of AJK - Primary partner */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0B1D3A, #1a3a66)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 16px rgba(11,29,58,0.2)',
                }}
              >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#bba442" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
              </div>
              <span
                style={{
                  fontFamily: "'Open Sans', sans-serif",
                  fontWeight: 600,
                  color: '#0B1D3A',
                  fontSize: '0.95rem',
                }}
              >
                {PARTNERS?.primary || 'The University of AJK'}
              </span>
            </div>

            {/* Placeholder partner logos */}
            {(PARTNERS?.logos || []).length > 0
              ? PARTNERS.logos.map((partner, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <div
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: '#e8ecf1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {partner.logo ? (
                        <img
                          src={partner.logo}
                          alt={partner.name}
                          style={{
                            width: '50px',
                            height: '50px',
                            objectFit: 'contain',
                          }}
                        />
                      ) : (
                        <span
                          style={{
                            fontFamily: "'Aleo', serif",
                            fontSize: '1.2rem',
                            color: '#8fa3bf',
                          }}
                        >
                          {partner.name?.[0] || '?'}
                        </span>
                      )}
                    </div>
                    <span
                      style={{
                        fontFamily: "'Open Sans', sans-serif",
                        fontWeight: 600,
                        color: '#0B1D3A',
                        fontSize: '0.85rem',
                      }}
                    >
                      {partner.name}
                    </span>
                  </div>
                ))
              : /* Placeholder slots when no logos are loaded */
                [1, 2, 3].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      background: '#e8ecf1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0.5,
                    }}
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8fa3bf" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* ADDRESS STRIP                                                 */}
      {/* ============================================================ */}
      <section
        style={{
          padding: '36px 24px',
          background: '#f7f9fc',
          textAlign: 'center',
          borderTop: '1px solid #e8ecf1',
          borderBottom: '1px solid #e8ecf1',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            flexWrap: 'wrap',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5cc4eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <p
            style={{
              fontFamily: "'Open Sans', sans-serif",
              color: '#1d1d1d',
              fontSize: '0.95rem',
              margin: 0,
            }}
          >
            St 49, G-7/4, Islamabad, 44000, Pakistan
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/* CTA SECTION                                                   */}
      {/* ============================================================ */}
      <section
        style={{
          padding: '80px 24px',
          background: 'linear-gradient(135deg, #0B1D3A 0%, #122a4f 60%, #0B1D3A 100%)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle background pattern */}
        <div
          style={{
            position: 'absolute',
            top: '-50%',
            right: '-10%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(92,196,235,0.06) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-30%',
            left: '-5%',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(187,164,66,0.06) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <h2
          style={{
            fontFamily: "'Aleo', serif",
            fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)',
            color: '#bba442',
            marginBottom: '16px',
            position: 'relative',
          }}
        >
          Ready to Build Something Great?
        </h2>

        <p
          style={{
            fontFamily: "'Open Sans', sans-serif",
            color: '#d4d9e2',
            maxWidth: '540px',
            margin: '0 auto 36px',
            lineHeight: 1.7,
            fontSize: '1.05rem',
            position: 'relative',
          }}
        >
          Whether you need cloud software, education consulting, or want to
          join our AI Bootcamp — we are here to help you succeed.
        </p>

        <Link href="/contact" style={{ textDecoration: 'none', position: 'relative' }}>
          <Button
            style={{
              fontFamily: "'Open Sans', sans-serif",
              fontSize: '1.05rem',
              fontWeight: 600,
              padding: '14px 44px',
              background: 'linear-gradient(135deg, #5cc4eb, #3ba8d4)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              letterSpacing: '0.5px',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              boxShadow: '0 4px 20px rgba(92,196,235,0.35)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 28px rgba(92,196,235,0.45)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(92,196,235,0.35)';
            }}
          >
            Get Started
          </Button>
        </Link>
      </section>

      {/* ============================================================ */}
      {/* FOOTER                                                        */}
      {/* ============================================================ */}
      <Footer />
    </>
  );
}
