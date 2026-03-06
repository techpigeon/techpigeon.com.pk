'use client';
import Link from 'next/link';
import Image from 'next/image';

export default function Logo({
  size = 'md',
  variant = 'dark',
  href = '/',
}: {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'dark' | 'white';
  href?: string;
}) {
  const dim = { sm: { w: 30, f: '1.05rem' }, md: { w: 38, f: '1.3rem' }, lg: { w: 48, f: '1.65rem' } }[size];
  const textColor   = variant === 'white' ? '#ffffff' : '#0B1D3A';
  const accentColor = variant === 'white' ? '#93C5FD' : '#00A8E8';

  const mark = (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
      
      {/* Your actual PNG logo */}
      <Image
        src="/logo.png"     // make sure logo.png is inside /public
        width={dim.w}
        height={dim.w}
        alt="TechPigeon"
        style={{ objectFit: 'contain' }}
        priority
      />

      {/* Wordmark */}
      <span
        style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: dim.f,
          color: textColor,
          fontWeight: 400,
          letterSpacing: '-0.01em',
          lineHeight: 1,
          whiteSpace: 'nowrap',
        }}
      >
        tech
        <em style={{ color: accentColor, fontStyle: 'italic' }}>pigeon</em>
      </span>
    </span>
  );

  return href ? <Link href={href} style={{ textDecoration: 'none' }}>{mark}</Link> : mark;
}