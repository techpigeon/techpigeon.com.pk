/* ── shared catalogue data ── */

// ─── Company info (synced from techpigeon.org) ────────────────────
export const COMPANY = {
  name:      'TECHPIGEON (SMC-PRIVATE) LIMITED',
  short:     'TechPigeon',
  tagline:   'We arrange High Tech / AI Boot camps and AI Classes Nationwide.',
  desc:      'Techpigeon offering Education Consulting & Custom Cloud Software development services. We offer services based on AI, Cloud Computing, Cloud App development for all major platforms (iOS, Android) & we run AI Bootcamps campaigns that allows learning and up-to-date hands-on experience on latest frameworks.',
  address:   'St 49, G-7/4, Islamabad, 44000, Pakistan',
  phone:     '+1 (786) 8226386',
  email:     'info@techpigeon.org',
  social: {
    facebook: 'https://facebook.com/techpigeon',
    linkedin: 'https://linkedin.com/company/techpigeon',
    twitter:  'https://twitter.com/techpigeon.pk',
  },
  logo:       'https://assets.softr-files.com/applications/13a6d5f4-cfee-4521-bc3c-908b851667e1/assets/44874b8d-0bdf-4b3e-b1f1-f8c31561487d.png',
  favicon:    'https://assets.softr-files.com/applications/13a6d5f4-cfee-4521-bc3c-908b851667e1/assets/2787cbdc-4a2c-473c-8259-40364e7cf45a.png',
  copyright:  '© 2024 Techpigeon SMC Private Limited. All rights reserved.',
  legal:      '© 2024 Techpigeon. All rights reserved. Various trademarks held their respective owners.',
};

// ─── Services (synced from techpigeon.org) ────────────────────────
export const SERVICES = [
  { icon: 'fas fa-shapes',                title: 'Boot Camps & Trainings',         desc: 'High Tech Boot Camps for AI Classes, Capacity Building Trainings for Educational Institutions, Tech firms Nationwide.', href: '/training' },
  { icon: 'fas fa-compress-arrows-alt',   title: 'Cloud Apps Development',         desc: 'Follow what is important to you in your company, projects, issue types or find important information in an easily searchable cloud apps.', href: '#' },
  { icon: 'fas fa-crop-alt',              title: 'Mobile Friendly Dashboards UX',  desc: 'Stay connected with your team through iOS and Android apps, integrations and extensions for desktop.', href: '#' },
  { icon: 'fas fa-external-link-square-alt', title: 'Domain Registration',         desc: '500+ TLD extensions with free WHOIS privacy and DNS manager included.', href: '/domains' },
  { icon: 'fas fa-shield-alt',            title: 'Cloud Hosting',                  desc: 'NVMe SSD servers with free SSL, CDN, and 24/7 monitoring for your business.', href: '/hosting' },
  { icon: 'fas fa-code',                  title: 'Website Design & Development',   desc: 'Custom websites and web applications designed to grow your business online.', href: '#' },
];

// ─── Ventures (synced from techpigeon.org) ────────────────────────
export const VENTURES = [
  { name: 'Kashmir CareU OnGo (KCUOG)', desc: 'New smart tech venture by Techpigeon — an all-in-one healthcare solution that helps care seekers access free advice from doctors and get appointments via mobile applications.', tagline: 'All One Stop Healthcare Solution' },
  { name: 'Techpigeon Startup Network', desc: 'Techpigeon Startup Network brings Startups and Domain Experts on one Platform.', tagline: 'See how with Connect' },
];

// ─── Trusted Partners (synced from techpigeon.org) ────────────────
export const PARTNERS = [
  { name: 'The University of AJK' },
  { name: 'DSA AJKU' },
  { name: 'Start Invest LLC' },
];

// ─── Nav links (synced from techpigeon.org) ───────────────────────
export const NAV_LINKS = [
  { href: '/',         label: 'Home' },
  { href: '/#services',label: 'Solutions' },
  { href: '/domains',  label: 'Domains' },
  { href: '/hosting',  label: 'Cloud Hosting' },
  { href: '/training', label: 'Training' },
  { href: '/about',    label: 'About' },
  { href: '/contact',  label: 'Contact' },
];

// ─── Footer columns (synced from techpigeon.org) ─────────────────
export const FOOTER_COLS = [
  { title: 'PRODUCT', links: [['Features','#'],['Enterprise','#'],['Security','#'],['Trust','#']] },
  { title: 'SERVICES', links: [['Cloud Hosting','/hosting'],['Domain Registration','/domains'],['IT Training','/training'],['Cloud Apps','#'],['Web Development','#']] },
  { title: 'RESOURCES', links: [['Library','#'],['Tips','#'],['Events','#'],['Help Center','#']] },
  { title: 'COMPANY', links: [['Team','/about'],['News','/blog'],['Contact','/contact'],['C-CAP (AJK)','#']] },
];

export const TLDS = [
  { ext: '.com',     pkr: 3499 },
  { ext: '.net',     pkr: 3199 },
  { ext: '.org',     pkr: 3299 },
  { ext: '.pk',      pkr: 2499 },
  { ext: '.com.pk',  pkr: 1999 },
  { ext: '.net.pk',  pkr: 1999 },
  { ext: '.org.pk',  pkr: 1999 },
  { ext: '.info',    pkr: 2999 },
  { ext: '.io',      pkr: 8999 },
  { ext: '.co',      pkr: 5499 },
  { ext: '.dev',     pkr: 4299 },
  { ext: '.app',     pkr: 4299 },
  { ext: '.tech',    pkr: 2799 },
  { ext: '.online',  pkr: 1499 },
  { ext: '.store',   pkr: 1799 },
  { ext: '.site',    pkr: 1299 },
  { ext: '.xyz',     pkr: 999  },
  { ext: '.cloud',   pkr: 3599 },
  { ext: '.ai',      pkr: 14999 },
  { ext: '.me',      pkr: 3799 },
];

export const PLANS = [
  {
    id: 'starter', name: 'Starter', price_m: 1399, price_a: 1049,
    disk: '10 GB NVMe', bw: '50 GB', sites: 1, featured: false,
    features: [
      'Free SSL Certificate', '1 Email Account', 'Weekly Backups',
      'cPanel Access', 'Softaculous Installer', '99.9% Uptime SLA',
    ],
  },
  {
    id: 'pro', name: 'Pro', price_m: 3599, price_a: 2699,
    disk: '40 GB NVMe', bw: '200 GB', sites: 5, featured: true,
    features: [
      'Free SSL Certificate', '25 Email Accounts', 'Daily Backups',
      'cPanel Access', 'Softaculous Installer', '99.9% Uptime SLA',
      'Free Domain (1st Year)', 'Priority Support', 'Staging Environment',
    ],
  },
  {
    id: 'business', name: 'Business', price_m: 7499, price_a: 5624,
    disk: '100 GB NVMe', bw: 'Unlimited', sites: 20, featured: false,
    features: [
      'Free SSL Certificate', 'Unlimited Email Accounts', 'Daily + Off-site Backups',
      'cPanel + WHM Access', 'Softaculous Installer', '99.99% Uptime SLA',
      'Free Domain (1st Year)', 'Dedicated Support Agent', 'Staging Environment',
      'DDoS Protection', 'CDN Included',
    ],
  },
];

export const COURSES = [
  { id: 'c1', slug: 'aws-cloud-practitioner',      title: 'AWS Cloud Practitioner',       level: 'Beginner',     cat: 'Cloud',      emoji: '☁️',  price: 24999, hrs: 18 },
  { id: 'c2', slug: 'ccna-networking',              title: 'CCNA Networking',              level: 'Intermediate', cat: 'Networking',  emoji: '🌐',  price: 29999, hrs: 40 },
  { id: 'c3', slug: 'comptia-security-plus',        title: 'CompTIA Security+',            level: 'Intermediate', cat: 'Security',    emoji: '🛡️', price: 27999, hrs: 32 },
  { id: 'c4', slug: 'linux-sysadmin',               title: 'Linux System Administration',  level: 'Beginner',     cat: 'Linux',       emoji: '🐧',  price: 22999, hrs: 22 },
  { id: 'c5', slug: 'docker-and-kubernetes',         title: 'Docker & Kubernetes',          level: 'Advanced',     cat: 'DevOps',      emoji: '🐳',  price: 32999, hrs: 28 },
  { id: 'c6', slug: 'ethical-hacking',               title: 'Ethical Hacking',              level: 'Intermediate', cat: 'Security',    emoji: '🕵️', price: 34999, hrs: 36 },
  { id: 'c7', slug: 'azure-fundamentals',            title: 'Azure Cloud Fundamentals',     level: 'Beginner',     cat: 'Cloud',       emoji: '⚡',  price: 21999, hrs: 16 },
  { id: 'c8', slug: 'devops-ci-cd-pipelines',        title: 'DevOps & CI/CD Pipelines',     level: 'Advanced',     cat: 'DevOps',      emoji: '🔄',  price: 32999, hrs: 30 },
  { id: 'c9', slug: 'network-security-firewalls',    title: 'Network Security & Firewalls', level: 'Advanced',     cat: 'Networking',  emoji: '🔥',  price: 31999, hrs: 34 },
];
