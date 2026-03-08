import '../styles/globals.css';
import Navbar from '../components/layout/Navbar';
import { Providers } from './providers';

export const metadata = {
  title: {
    default: 'TechPigeon — AI Boot Camps, Cloud Computing & IT Training',
    template: '%s | TechPigeon',
  },
  description: "TECHPIGEON (SMC-PRIVATE) LIMITED — Education Consulting, Custom Cloud Software Development, AI Boot Camps Nationwide.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Aleo:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&family=Open+Sans:wght@300;400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
