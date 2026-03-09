'use client';
import Link from 'next/link';
import { useSite } from '../../context/SiteContext';

export default function Logo({
  size = 'md',
  variant = 'dark',
  href = '/',
}: {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'dark' | 'white';
  href?: string;
}) {
  const { s } = useSite();
  const dim = {
    sm: { w: 140, h: 34, f: '1.05rem' },
    md: { w: 210, h: 48, f: '1.4rem' },
    lg: { w: 260, h: 58, f: '1.75rem' }
  }[size];

  const textColor   = variant === 'white' ? '#ffffff' : '#1d1d1d';
  const accentColor = variant === 'white' ? '#f5edc8' : '#bba442';

  const logoUrl = s('logo_url');
  const hasLogo = logoUrl && logoUrl.trim() !== ''; // Show logo if URL is provided and not empty

  const mark = hasLogo ? (
    <span style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>
      <img
        src={logoUrl}
        alt={s('site_name', 'TechPigeon')}
        style={{ width: dim.w, height: dim.h, objectFit: 'contain', objectPosition: 'left center' }}
      />
    </span>
  ) : (
    <span style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>
      <span
        style={{
          fontFamily: 'var(--font-heading, Aleo, serif)',
          fontSize: dim.f,
          color: textColor,
          fontWeight: 400,
          letterSpacing: '-0.01em',
          lineHeight: 1,
          whiteSpace: 'nowrap',
        }}
      >
        {String(s('site_name', 'TechPigeon')).toLowerCase().startsWith('tech') ? 'tech' : ''}
        <em style={{ color: accentColor, fontStyle: 'italic' }}>
          {String(s('site_name', 'TechPigeon')).toLowerCase().startsWith('tech')
            ? String(s('site_name', 'TechPigeon')).slice(4).toLowerCase() || 'pigeon'
            : s('site_name', 'TechPigeon')}
        </em>
      </span>
    </span>
  );

  return href ? <Link href={href} style={{ textDecoration: 'none' }}>{mark}</Link> : mark;
}
