import axios from 'axios';
const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api', timeout: 15000 });
api.interceptors.request.use(cfg => {
  if (typeof window !== 'undefined') { const t=localStorage.getItem('tp_token'); if(t) cfg.headers.Authorization=`Bearer ${t}`; }
  return cfg;
});
api.interceptors.response.use(r=>r, err=>{
  if(err.response?.status===401&&typeof window!=='undefined'){localStorage.removeItem('tp_token');window.location.href='/auth/login';}
  return Promise.reject(err);
});
export const authApi    = { login:(e,p)=>api.post('/auth/login',{email:e,password:p}), register:(d)=>api.post('/auth/register',d), me:()=>api.get('/auth/me'), changePassword:(d)=>api.post('/auth/change-password',d), forgot:(e)=>api.post('/auth/forgot-password',{email:e}) };
export const domainsApi = { search:(q,tld)=>api.get(`/domains/search?q=${q}${tld?`&tld=${tld}`:''}`), tlds:()=>api.get('/domains/tlds'), list:()=>api.get('/domains'), register:(d)=>api.post('/domains/register',d) };
export const hostingApi = { plans:()=>api.get('/hosting/plans'), subscriptions:()=>api.get('/hosting/subscriptions'), subscribe:(d)=>api.post('/hosting/subscribe',d) };
export const coursesApi = { list:(p)=>api.get('/courses',{params:p}), enroll:(id)=>api.post(`/courses/${id}/enroll`), enrollments:()=>api.get('/courses/my/enrollments') };
export const ordersApi  = { list:()=>api.get('/orders'), create:(items,coupon)=>api.post('/orders',{items,coupon_code:coupon}) };
export const paymentsApi= { stripeIntent:(id)=>api.post('/payments/stripe/create-intent',{order_id:id}), jazzcash:(id,m)=>api.post('/payments/jazzcash/initiate',{order_id:id,mobile_number:m}), easypaisa:(id,m)=>api.post('/payments/easypaisa/initiate',{order_id:id,mobile_number:m}), bank:(id,b,r)=>api.post('/payments/bank/initiate',{order_id:id,bank_name:b,transaction_ref:r}) };
export const dashboardApi={ get:()=>api.get('/dashboard') };
export const ticketsApi = { list:()=>api.get('/tickets'), create:(d)=>api.post('/tickets',d), reply:(id,m)=>api.post(`/tickets/${id}/reply`,{message:m}) };
export const adminApi   = { stats:()=>api.get('/admin/stats'), users:(p)=>api.get('/admin/users',{params:p}), updateUser:(id,d)=>api.patch(`/admin/users/${id}`,d), orders:(p)=>api.get('/admin/orders',{params:p}), payments:(p)=>api.get('/admin/payments',{params:p}), confirmPay:(id)=>api.post(`/payments/admin/confirm/${id}`), tickets:(p)=>api.get('/admin/tickets',{params:p}), replyTicket:(id,m,st)=>api.post(`/admin/tickets/${id}/reply`,{message:m,status:st}), notifyAll:(d)=>api.post('/admin/notify-all',d) };
export const TLDS=[{ext:'.com',pkr:3499},{ext:'.net',pkr:3199},{ext:'.org',pkr:2999},{ext:'.pk',pkr:1099},{ext:'.com.pk',pkr:999},{ext:'.io',pkr:10999},{ext:'.co',pkr:6899},{ext:'.info',pkr:2499}];
export const PLANS=[
  {id:'p1',name:'Starter',price_m:1399,price_a:1049,disk:'10 GB NVMe',bw:'100 GB',sites:'1 Website',features:['cPanel Access','Free SSL','Daily Backups','5 Emails','2 Databases','99.9% Uptime']},
  {id:'p2',name:'Pro',price_m:3599,price_a:2699,disk:'50 GB NVMe',bw:'Unlimited',sites:'5 Websites',featured:true,features:['cPanel Access','Free SSL + CDN','Daily Backups','25 Emails','10 Databases','Priority Support','Free .pk Domain','99.9% Uptime']},
  {id:'p3',name:'Business',price_m:8399,price_a:6299,disk:'200 GB NVMe',bw:'Unlimited',sites:'Unlimited',features:['cPanel + DDoS','Hourly Backups','Unlimited Emails/DBs','Dedicated IP','24/7 Premium Support','99.99% Uptime']},
];
export const COURSES=[
  {id:'c1',slug:'aws',title:'AWS Cloud Practitioner Essentials',level:'Beginner',cat:'Cloud',emoji:'☁️',bg:'#EAF6FD',hrs:18,mods:12,price:8999,instructor:'Usman Tariq'},
  {id:'c2',slug:'sec',title:'CompTIA Security+ Full Prep',level:'Intermediate',cat:'Security',emoji:'🛡️',bg:'#ECFDF5',hrs:32,mods:20,price:12999,instructor:'Ayesha Raza'},
  {id:'c3',slug:'ccna',title:'CCNA: Cisco Networking Bootcamp',level:'Intermediate',cat:'Networking',emoji:'🌐',bg:'#F5F3FF',hrs:40,mods:24,price:14999,instructor:'Bilal Ahmad'},
  {id:'c4',slug:'linux',title:'Linux System Administration',level:'Beginner',cat:'Linux',emoji:'🐧',bg:'#FFF7ED',hrs:22,mods:15,price:8999,instructor:'Tariq Mehmood'},
  {id:'c5',slug:'docker',title:'Docker & Kubernetes Mastery',level:'Advanced',cat:'DevOps',emoji:'🐳',bg:'#F0FDFA',hrs:28,mods:18,price:11999,instructor:'Sana Sheikh'},
  {id:'c6',slug:'hacking',title:'Ethical Hacking & Pen Testing',level:'Intermediate',cat:'Security',emoji:'🔐',bg:'#FFF1F2',hrs:36,mods:22,price:15999,instructor:'Hassan Ali'},
];
export default api;
