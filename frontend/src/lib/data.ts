export const TLD_PRICES = [
  { ext:'.com',pkr:3499 },{ ext:'.net',pkr:3199 },{ ext:'.org',pkr:2999 },
  { ext:'.pk',pkr:1099 },{ ext:'.com.pk',pkr:999 },{ ext:'.io',pkr:10999 },
  { ext:'.co',pkr:6899 },{ ext:'.info',pkr:2499 },
];

export const HOSTING_PLANS = [
  { id:'p1', name:'Starter', price_m:1399, price_a:1049, disk:'10 GB NVMe', bw:'100 GB', sites:'1 Website',
    features:['cPanel Access','Free SSL','Daily Backups','5 Email Accounts','2 Databases','99.9% Uptime'] },
  { id:'p2', name:'Pro', price_m:3599, price_a:2699, disk:'50 GB NVMe', bw:'Unlimited', sites:'5 Websites', featured:true,
    features:['cPanel + CDN','Free SSL + DDoS Protection','Daily Backups + Restore','25 Email Accounts','10 Databases','Priority Support','Free .pk Domain'] },
  { id:'p3', name:'Business', price_m:8399, price_a:6299, disk:'200 GB NVMe', bw:'Unlimited', sites:'Unlimited',
    features:['Dedicated IP + CDN','Wildcard SSL','Hourly Backups','Unlimited Emails & DBs','99.99% Uptime','24/7 Premium Support'] },
];

export const COURSES = [
  { id:'c1', slug:'aws',     title:'AWS Cloud Practitioner Essentials', level:'Beginner',     cat:'Cloud',     emoji:'☁️',  price:8999,  hrs:18 },
  { id:'c2', slug:'sec',     title:'CompTIA Security+ Full Prep',       level:'Intermediate', cat:'Security',  emoji:'🛡️', price:12999, hrs:32 },
  { id:'c3', slug:'ccna',    title:'CCNA: Cisco Networking Bootcamp',   level:'Intermediate', cat:'Networking',emoji:'🌐',  price:14999, hrs:40 },
  { id:'c4', slug:'linux',   title:'Linux System Administration',       level:'Beginner',     cat:'Linux',     emoji:'🐧',  price:8999,  hrs:22 },
  { id:'c5', slug:'docker',  title:'Docker & Kubernetes Mastery',       level:'Advanced',     cat:'DevOps',    emoji:'🐳',  price:11999, hrs:28 },
  { id:'c6', slug:'hacking', title:'Ethical Hacking & Pen Testing',     level:'Intermediate', cat:'Security',  emoji:'🔐',  price:15999, hrs:36 },
];

// Aliases for backward compatibility
export { TLD_PRICES as TLDS, HOSTING_PLANS as PLANS };
