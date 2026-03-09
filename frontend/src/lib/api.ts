import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api'),
  timeout: 15000,
});
api.interceptors.request.use(cfg => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('tp_token');
    if (token) cfg.headers.Authorization = `Bearer ${token}`;
  }
  return cfg;
});
api.interceptors.response.use(r => r, err => {
  if (err.response?.status === 401 && typeof window !== 'undefined') {
    localStorage.removeItem('tp_token');
    window.location.href = '/auth/login';
  }
  return Promise.reject(err);
});

export const authApi = {
  login:    (email: string, pass: string) => api.post('/auth/login', { email, password: pass }),
  register: (data: any)                   => api.post('/auth/register', data),
  me:       ()                            => api.get('/auth/me'),
  forgot:   (email: string)               => api.post('/auth/forgot-password', { email }),
  reset:    (token: string, pass: string) => api.post('/auth/reset-password', { token, password: pass }),
};
export const domainsApi = {
  search:   (q: string, tld?: string) => api.get(`/domains/search?q=${q}${tld?`&tld=${tld}`:''}`),
  list:     ()                         => api.get('/domains'),
  register: (data: any)                => api.post('/domains/register', data),
  update:   (id: string, data: any)    => api.patch(`/domains/${id}`, data),
  renew:    (id: string)               => api.post(`/domains/${id}/renew`),
};
export const hostingApi = {
  plans:         ()           => api.get('/hosting/plans'),
  subscriptions: ()           => api.get('/hosting/subscriptions'),
  subscribe:     (data: any)  => api.post('/hosting/subscribe', data),
  update:        (id: string, data: any) => api.patch(`/hosting/subscriptions/${id}`, data),
  cancel:        (id: string) => api.patch(`/hosting/subscriptions/${id}/cancel`),
};
export const coursesApi = {
  list:        (params?: any) => api.get('/courses', { params }),
  get:         (slug: string) => api.get(`/courses/${slug}`),
  enroll:      (id: string)   => api.post(`/courses/${id}/enroll`),
  enrollments: ()             => api.get('/courses/my/enrollments'),
};
export const ordersApi = {
  list:   ()                                      => api.get('/orders'),
  create: (items: any[], coupon?: string)         => api.post('/orders', { items, coupon_code: coupon }),
  get:    (id: string)                            => api.get(`/orders/${id}`),
};
export const paymentsApi = {
  jazzcash:  (orderId: string, mobile: string)                 => api.post('/payments/jazzcash/initiate',  { order_id: orderId, mobile_number: mobile }),
  easypaisa: (orderId: string, mobile: string)                 => api.post('/payments/easypaisa/initiate', { order_id: orderId, mobile_number: mobile }),
  bank:      (orderId: string, bank: string, ref: string, screenshot?: any, screenshotName?: string)      => api.post('/payments/bank/initiate',      { order_id: orderId, bank_name: bank, transaction_ref: ref, screenshot_base64: screenshot || null, screenshot_name: screenshotName || null }),
  stripe:    (orderId: string)                                 => api.post('/payments/stripe/create-intent',{ order_id: orderId }),
};
export const dashboardApi = {
  get:     () => api.get('/dashboard'),
  readAll: () => api.post('/dashboard/notifications/read-all'),
};
export const ticketsApi = {
  list:   ()                        => api.get('/tickets'),
  create: (data: any)               => api.post('/tickets', data),
  get:    (id: string)              => api.get(`/tickets/${id}`),
  reply:  (id: string, msg: string) => api.post(`/tickets/${id}/reply`, { message: msg }),
};
export const adminApi = {
  stats:       ()                              => api.get('/admin/stats'),
  users:       (p?: any)                       => api.get('/admin/users', { params: p }),
  createUser:  (data: any)                     => api.post('/admin/users', data),
  updateUser:  (id: string, data: any)         => api.patch(`/admin/users/${id}`, data),
  deleteUser:  (id: string)                    => api.delete(`/admin/users/${id}`),
  userDetail:  (id: string)                    => api.get(`/admin/users/${id}`),
  resetUserPassword: (id: string, newPassword: string) => api.post(`/admin/users/${id}/reset-password`, { new_password: newPassword }),
  orders:      (p?: any)                       => api.get('/admin/orders', { params: p }),
  createOrder: (data: any)                     => api.post('/admin/orders', data),
  updateOrder: (id: string, data: any)         => api.patch(`/admin/orders/${id}`, data),
  deleteOrder: (id: string)                    => api.delete(`/admin/orders/${id}`),
  payments:    (p?: any)                       => api.get('/admin/payments', { params: p }),
  createPayment: (data: any)                   => api.post('/admin/payments', data),
  updatePayment: (id: string, data: any)       => api.patch(`/admin/payments/${id}`, data),
  deletePayment: (id: string)                  => api.delete(`/admin/payments/${id}`),
  confirmPay:  (id: string)                    => api.post(`/payments/admin/confirm/${id}`),
  domains:     (p?: any)                       => api.get('/admin/domains', { params: p }),
  createDomain:(data: any)                     => api.post('/admin/domains', data),
  updateDomain:(id: string, data: any)         => api.patch(`/admin/domains/${id}`, data),
  deleteDomain:(id: string)                    => api.delete(`/admin/domains/${id}`),
  hosting:     ()                              => api.get('/admin/hosting'),
  createHosting:(data: any)                    => api.post('/admin/hosting', data),
  updateHosting:(id: string, data: any)        => api.patch(`/admin/hosting/${id}`, data),
  deleteHosting:(id: string)                   => api.delete(`/admin/hosting/${id}`),
  projects:    (p?: any)                       => api.get('/admin/projects', { params: p }),
  createProject:(data: any)                    => api.post('/admin/projects', data),
  updateProject:(id: string, data: any)        => api.patch(`/admin/projects/${id}`, data),
  deleteProject:(id: string)                   => api.delete(`/admin/projects/${id}`),
  tickets:     (p?: any)                       => api.get('/admin/tickets', { params: p }),
  replyTicket: (id: string, msg: string, st: string) => api.post(`/admin/tickets/${id}/reply`, { message: msg, status: st }),
};

// ── CMS Content API (public, no auth) ──
export const contentApi = {
  getSettings:     ()                  => api.get('/content/settings'),
  getPage:         (page: string)      => api.get(`/content/page/${page}`),
  getServices:     ()                  => api.get('/content/services'),
  getVentures:     ()                  => api.get('/content/ventures'),
  getPartners:     ()                  => api.get('/content/partners'),
  getTlds:         ()                  => api.get('/content/tlds'),
  getNav:          ()                  => api.get('/content/nav'),
  getFooter:       ()                  => api.get('/content/footer'),
  getHostingPlans: ()                  => api.get('/content/hosting-plans'),
  getCourses:      ()                  => api.get('/content/courses'),
  getProjects:     (homepage?: boolean)=> api.get('/content/projects', { params: homepage === undefined ? {} : { homepage } }),
  verifyProject:   (projectId: string) => api.get(`/content/verification/${encodeURIComponent(projectId)}`),
};

// ── CMS Admin API (requires admin auth) ──
export const siteAdminApi = {
  // Settings
  getSettings:      ()                              => api.get('/admin/site/settings'),
  updateSetting:    (key: string, value: any)       => api.put(`/admin/site/settings/${key}`, { value }),
  bulkUpdateSettings: (settings: Record<string,any>) => api.put('/admin/site/settings', { settings }),
  // Page sections
  getSections:      (page?: string)                 => api.get('/admin/site/sections', { params: page ? { page } : {} }),
  updateSection:    (id: string, data: any)         => api.put(`/admin/site/sections/${id}`, data),
  createSection:    (data: any)                     => api.post('/admin/site/sections', data),
  deleteSection:    (id: string)                    => api.delete(`/admin/site/sections/${id}`),
  // Services
  getServices:      ()                              => api.get('/admin/site/services'),
  createService:    (data: any)                     => api.post('/admin/site/services', data),
  updateService:    (id: string, data: any)         => api.put(`/admin/site/services/${id}`, data),
  deleteService:    (id: string)                    => api.delete(`/admin/site/services/${id}`),
  // Ventures
  getVentures:      ()                              => api.get('/admin/site/ventures'),
  createVenture:    (data: any)                     => api.post('/admin/site/ventures', data),
  updateVenture:    (id: string, data: any)         => api.put(`/admin/site/ventures/${id}`, data),
  deleteVenture:    (id: string)                    => api.delete(`/admin/site/ventures/${id}`),
  // Partners
  getPartners:      ()                              => api.get('/admin/site/partners'),
  createPartner:    (data: any)                     => api.post('/admin/site/partners', data),
  updatePartner:    (id: string, data: any)         => api.put(`/admin/site/partners/${id}`, data),
  deletePartner:    (id: string)                    => api.delete(`/admin/site/partners/${id}`),
  // TLDs
  getTlds:          ()                              => api.get('/admin/site/tlds'),
  createTld:        (data: any)                     => api.post('/admin/site/tlds', data),
  updateTld:        (id: string, data: any)         => api.put(`/admin/site/tlds/${id}`, data),
  deleteTld:        (id: string)                    => api.delete(`/admin/site/tlds/${id}`),
  // Nav
  getNav:           ()                              => api.get('/admin/site/nav'),
  createNav:        (data: any)                     => api.post('/admin/site/nav', data),
  updateNav:        (id: string, data: any)         => api.put(`/admin/site/nav/${id}`, data),
  deleteNav:        (id: string)                    => api.delete(`/admin/site/nav/${id}`),
  // Pages
  getPages:         ()                              => api.get('/admin/site/pages'),
  createPage:       (data: any)                     => api.post('/admin/site/pages', data),
  updatePage:       (id: string, data: any)         => api.patch(`/admin/site/pages/${id}`, data),
  deletePage:       (id: string)                    => api.delete(`/admin/site/pages/${id}`),
  // Footer
  getFooter:        ()                              => api.get('/admin/site/footer'),
  updateFooter:     (id: string, data: any)         => api.put(`/admin/site/footer/${id}`, data),
};

export default api;

export { TLD_PRICES as TLDS, HOSTING_PLANS as PLANS, COURSES } from './data';
