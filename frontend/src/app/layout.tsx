import type { Metadata } from 'next';
import '../styles/globals.css';
export const metadata: Metadata = {
  title: { default: 'TechPigeon — Domains, Hosting & IT Training', template: '%s | TechPigeon' },
  description: "Pakistan's most trusted digital partner for domain registration, cloud hosting, and IT certification training.",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
