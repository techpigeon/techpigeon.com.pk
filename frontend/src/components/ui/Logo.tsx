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
    sm: { w: 40, f: '1.05rem' },
    md: { w: 52, f: '1.4rem' },
    lg: { w: 64, f: '1.75rem' }
  }[size];

  const textColor   = variant === 'white' ? '#ffffff' : '#1d1d1d';
  const accentColor = variant === 'white' ? '#f5edc8' : '#bba442';

  const logoUrl = s('logo_url');
  const hasLogo = logoUrl && logoUrl.trim() !== ''; // Show logo if URL is provided and not empty

  const mark = (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: hasLogo ? 12 : 0, textDecoration: 'none' }}>
      {hasLogo && (
        <img
          src={logoUrl}
          width={dim.w}
          height={dim.w}
          alt={s('site_name', 'TechPigeon')}
          style={{ objectFit: 'contain' }}
        />
      )}
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
