import Link from 'next/link';
export default function Logo({ size='md', variant='dark', linkTo='/' }) {
  const d = { sm:{w:28,t:'1.1rem'}, md:{w:36,t:'1.35rem'}, lg:{w:46,t:'1.7rem'} }[size];
  const textColor = variant==='white'?'#fff':'#0B1D3A';
  const mark = (
    <span style={{display:'flex',alignItems:'center',gap:10,textDecoration:'none'}}>
      <svg width={d.w} height={d.w} viewBox="0 0 44 44" fill="none">
        <rect width="44" height="44" rx="11" fill="#00A8E8"/>
        <path d="M22 10C17 10 12 14.5 12 20C12 23.5 14 26.5 17.5 28L15 34L21 31C21.3 31 21.7 31 22 31C28 31 33 26.5 33 20C33 14.5 28 10 22 10Z" fill="white"/>
        <path d="M25 18C27 16.5 30 17 32 18.5L28 22C27 20 26 19 25 18Z" fill="#00A8E8" opacity="0.7"/>
        <path d="M15 34L17.5 28C19 30 20 31 21 31L15 34Z" fill="#0077B6" opacity="0.6"/>
        <circle cx="19" cy="19" r="1.5" fill="#0B1D3A"/>
        <circle cx="19.5" cy="18.5" r="0.5" fill="white"/>
        <path d="M13 20L10 18L12 21Z" fill="#F59E0B"/>
        <circle cx="35" cy="11" r="4" fill="#F59E0B"/>
        <path d="M33 11L35 9L37 11L35 13Z" fill="white" opacity="0.9"/>
      </svg>
      <span style={{fontFamily:"'DM Serif Display',serif",fontSize:d.t,color:textColor,fontWeight:400,letterSpacing:'-0.01em',lineHeight:1}}>
        tech<span style={{color:variant==='white'?'#93C5FD':'#00A8E8',fontStyle:'italic'}}>pigeon</span>
      </span>
    </span>
  );
  return linkTo ? <Link href={linkTo} style={{textDecoration:'none'}}>{mark}</Link> : mark;
}
