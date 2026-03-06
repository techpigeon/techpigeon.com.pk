'use client';
import Link from 'next/link';

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
      {/* Pigeon SVG — flying pigeon matching TechPigeon brand */}
      <svg width={dim.w} height={dim.w} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="TechPigeon logo">
        <rect width="44" height="44" rx="10" fill="#00A8E8"/>
        {/* Body */}
        <path d="M22 9C16 9 11 14 11 20.5C11 24.5 13.2 27.8 17 29.3L14.5 36L21.5 32C21.7 32 21.8 32 22 32C28 32 33 27 33 20.5C33 14 28 9 22 9Z" fill="white"/>
        {/* Wing */}
        <path d="M24.5 17C27 15 30.5 16 33 18L29 22.5C27.5 20 25.8 18.3 24.5 17Z" fill="#B3E5FC" opacity="0.9"/>
        {/* Tail */}
        <path d="M14.5 36L17 29.3C18.8 31.5 20.3 32 21.5 32L14.5 36Z" fill="#0077B6" opacity="0.7"/>
        {/* Eye */}
        <circle cx="18.5" cy="19.5" r="1.8" fill="#0B1D3A"/>
        <circle cx="19" cy="18.9" r="0.6" fill="white"/>
        {/* Beak */}
        <path d="M11 21L7.5 19L10.5 23Z" fill="#F59E0B"/>
        {/* Gold badge top-right */}
        <circle cx="35.5" cy="10.5" r="4.5" fill="#F59E0B"/>
        <path d="M35.5 7.5L36.5 9.8H39L37.1 11.3L37.8 13.5L35.5 12.1L33.2 13.5L33.9 11.3L32 9.8H34.5Z" fill="white" opacity="0.9"/>
      </svg>

      {/* Wordmark */}
      <span style={{
        fontFamily: "'DM Serif Display', serif",
        fontSize: dim.f,
        color: textColor,
        fontWeight: 400,
        letterSpacing: '-0.01em',
        lineHeight: 1,
        whiteSpace: 'nowrap',
      }}>
        tech
        <em style={{ color: accentColor, fontStyle: 'italic' }}>pigeon</em>
      </span>
    </span>
  );

  return href
    ? <Link href={href} style={{ textDecoration: 'none' }}>{mark}</Link>
    : mark;
}
