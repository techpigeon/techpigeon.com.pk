'use client';
import '../styles/globals.css';
import Navbar from '../components/layout/Navbar';
export const metadata = { title: { default:'TechPigeon — Domains, Hosting & IT Training', template:'%s | TechPigeon' } };
export default function RootLayout({children}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"/>
      </head>
      <body><Navbar/>{children}</body>
    </html>
  );
}
