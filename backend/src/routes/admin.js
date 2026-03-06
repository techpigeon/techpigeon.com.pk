const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');
const { authenticate, requireRole } = require('../middleware/auth');

router.use(authenticate, requireRole('admin'));

// ── DASHBOARD STATS ──────────────────────────────────────────
router.get('/stats', async (req, res, next) => {
  try {
    const [users, revenue, domains, hosting, tickets, payments] = await Promise.all([
      pool.query(`SELECT COUNT(*) total, COUNT(*) FILTER(WHERE created_at>NOW()-INTERVAL '30 days') new_this_month, COUNT(*) FILTER(WHERE is_active=true) active FROM users WHERE role='client'`),
      pool.query(`SELECT COALESCE(SUM(total_pkr),0) total, COALESCE(SUM(total_pkr) FILTER(WHERE created_at>NOW()-INTERVAL '30 days'),0) this_month, COUNT(*) FILTER(WHERE status='paid') paid_orders, COUNT(*) FILTER(WHERE status='pending') pending_orders FROM orders`),
      pool.query(`SELECT COUNT(*) total, COUNT(*) FILTER(WHERE status='active') active, COUNT(*) FILTER(WHERE expires_at<NOW()+INTERVAL '30 days' AND status='active') expiring FROM domains`),
      pool.query(`SELECT COUNT(*) total, COUNT(*) FILTER(WHERE status='active') active FROM hosting_subscriptions`),
      pool.query(`SELECT COUNT(*) total, COUNT(*) FILTER(WHERE status='open') open, COUNT(*) FILTER(WHERE status='in_progress') in_progress, COUNT(*) FILTER(WHERE priority='urgent') urgent FROM tickets`),
      pool.query(`SELECT method, COUNT(*) count, COALESCE(SUM(amount_pkr),0) total FROM payments WHERE status='completed' GROUP BY method`),
    ]);
    res.json({
      users: users.rows[0], revenue: revenue.rows[0], domains: domains.rows[0],
      hosting: hosting.rows[0], tickets: tickets.rows[0], payments_by_method: payments.rows,
    });
  } catch(e) { next(e); }
});

// ── USERS ────────────────────────────────────────────────────
router.get('/users', async (req, res, next) => {
  try {
    const { page=1, limit=20, search, role, status } = req.query;
    const offset = (page-1)*limit;
    let where = ['1=1'];
    const params = [];
    let i=1;
    if (search) { where.push(`(email ILIKE $${i} OR first_name ILIKE $${i} OR last_name ILIKE $${i})`); params.push(`%${search}%`); i++; }
    if (role)   { where.push(`role=$${i++}`); params.push(role); }
    if (status === 'active')   { where.push('is_active=true'); }
    if (status === 'inactive') { where.push('is_active=false'); }
    const total = await pool.query(`SELECT COUNT(*) FROM users WHERE ${where.join(' AND ')}`, params);
    const { rows } = await pool.query(`SELECT id,first_name,last_name,email,phone,role,is_verified,is_active,last_login,created_at FROM users WHERE ${where.join(' AND ')} ORDER BY created_at DESC LIMIT $${i} OFFSET $${i+1}`, [...params, limit, offset]);
    res.json({ users: rows, total: parseInt(total.rows[0].count), page: parseInt(page), limit: parseInt(limit) });
  } catch(e) { next(e); }
});

router.get('/users/:id', async (req, res, next) => {
  try {
    const user = await pool.query('SELECT id,first_name,last_name,email,phone,role,is_verified,is_active,last_login,created_at FROM users WHERE id=$1', [req.params.id]);
    if (!user.rows.length) return res.status(404).json({ error: 'User not found.' });
    const [domains, hosting, orders, enrollments] = await Promise.all([
      pool.query('SELECT * FROM domains WHERE user_id=$1 ORDER BY created_at DESC', [req.params.id]),
      pool.query('SELECT hs.*,hp.name plan_name FROM hosting_subscriptions hs JOIN hosting_plans hp ON hs.plan_id=hp.id WHERE hs.user_id=$1', [req.params.id]),
      pool.query('SELECT * FROM orders WHERE user_id=$1 ORDER BY created_at DESC', [req.params.id]),
      pool.query('SELECT e.*,c.title FROM enrollments e JOIN courses c ON e.course_id=c.id WHERE e.user_id=$1', [req.params.id]),
    ]);
    res.json({ user: user.rows[0], domains: domains.rows, hosting: hosting.rows, orders: orders.rows, enrollments: enrollments.rows });
  } catch(e) { next(e); }
});

router.patch('/users/:id', async (req, res, next) => {
  try {
    const { role, is_active, is_verified } = req.body;
    const { rows } = await pool.query(
      'UPDATE users SET role=COALESCE($1,role),is_active=COALESCE($2,is_active),is_verified=COALESCE($3,is_verified) WHERE id=$4 RETURNING id,first_name,email,role,is_active',
      [role, is_active, is_verified, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'User not found.' });
    res.json({ user: rows[0] });
  } catch(e) { next(e); }
});

router.post('/users/:id/reset-password', async (req, res, next) => {
  try {
    const { new_password } = req.body;
    if (!new_password || new_password.length < 8) return res.status(400).json({ error: 'Password min 8 chars.' });
    await pool.query('UPDATE users SET password_hash=$1 WHERE id=$2', [await bcrypt.hash(new_password,12), req.params.id]);
    res.json({ message: 'Password reset by admin.' });
  } catch(e) { next(e); }
});

// ── ORDERS ───────────────────────────────────────────────────
router.get('/orders', async (req, res, next) => {
  try {
    const { page=1, limit=20, status, search } = req.query;
    const offset = (page-1)*limit;
    let where = ['1=1']; const params = []; let i=1;
    if (status) { where.push(`o.status=$${i++}`); params.push(status); }
    if (search) { where.push(`(o.order_number ILIKE $${i} OR u.email ILIKE $${i})`); params.push(`%${search}%`); i++; }
    const total = await pool.query(`SELECT COUNT(*) FROM orders o JOIN users u ON o.user_id=u.id WHERE ${where.join(' AND ')}`, params);
    const { rows } = await pool.query(`SELECT o.*,u.first_name,u.last_name,u.email FROM orders o JOIN users u ON o.user_id=u.id WHERE ${where.join(' AND ')} ORDER BY o.created_at DESC LIMIT $${i} OFFSET $${i+1}`, [...params, limit, offset]);
    res.json({ orders: rows, total: parseInt(total.rows[0].count) });
  } catch(e) { next(e); }
});

router.patch('/orders/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    const { rows } = await pool.query('UPDATE orders SET status=$1 WHERE id=$2 RETURNING *', [status, req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Order not found.' });
    res.json({ order: rows[0] });
  } catch(e) { next(e); }
});

// ── PAYMENTS ─────────────────────────────────────────────────
router.get('/payments', async (req, res, next) => {
  try {
    const { page=1, limit=20, status, method } = req.query;
    const offset = (page-1)*limit;
    let where = ['1=1']; const params=[]; let i=1;
    if (status) { where.push(`p.status=$${i++}`); params.push(status); }
    if (method) { where.push(`p.method=$${i++}`); params.push(method); }
    const { rows } = await pool.query(`SELECT p.*,u.email,u.first_name,u.last_name,o.order_number FROM payments p JOIN users u ON p.user_id=u.id JOIN orders o ON p.order_id=o.id WHERE ${where.join(' AND ')} ORDER BY p.created_at DESC LIMIT $${i} OFFSET $${i+1}`, [...params,limit,offset]);
    res.json({ payments: rows });
  } catch(e) { next(e); }
});

// ── DOMAINS ──────────────────────────────────────────────────
router.get('/domains', async (req, res, next) => {
  try {
    const { page=1, limit=20, status, search } = req.query;
    const offset=(page-1)*limit; let where=['1=1']; const params=[]; let i=1;
    if (status) { where.push(`d.status=$${i++}`); params.push(status); }
    if (search) { where.push(`d.full_domain ILIKE $${i++}`); params.push(`%${search}%`); }
    const { rows } = await pool.query(`SELECT d.*,u.email,u.first_name,u.last_name FROM domains d JOIN users u ON d.user_id=u.id WHERE ${where.join(' AND ')} ORDER BY d.created_at DESC LIMIT $${i} OFFSET $${i+1}`, [...params,limit,offset]);
    res.json({ domains: rows });
  } catch(e) { next(e); }
});

router.patch('/domains/:id', async (req, res, next) => {
  try {
    const { status, expires_at, notes } = req.body;
    const { rows } = await pool.query('UPDATE domains SET status=COALESCE($1,status),expires_at=COALESCE($2,expires_at),notes=COALESCE($3,notes) WHERE id=$4 RETURNING *', [status,expires_at,notes,req.params.id]);
    res.json({ domain: rows[0] });
  } catch(e) { next(e); }
});

// ── HOSTING ──────────────────────────────────────────────────
router.get('/hosting', async (req, res, next) => {
  try {
    const { rows } = await pool.query(`SELECT hs.*,hp.name plan_name,u.email,u.first_name,u.last_name FROM hosting_subscriptions hs JOIN hosting_plans hp ON hs.plan_id=hp.id JOIN users u ON hs.user_id=u.id ORDER BY hs.created_at DESC LIMIT 100`);
    res.json({ subscriptions: rows });
  } catch(e) { next(e); }
});

router.patch('/hosting/:id', async (req, res, next) => {
  try {
    const { status, server_ip, cpanel_username, notes } = req.body;
    const { rows } = await pool.query('UPDATE hosting_subscriptions SET status=COALESCE($1,status),server_ip=COALESCE($2,server_ip),cpanel_username=COALESCE($3,cpanel_username),notes=COALESCE($4,notes) WHERE id=$5 RETURNING *', [status,server_ip,cpanel_username,notes,req.params.id]);
    res.json({ subscription: rows[0] });
  } catch(e) { next(e); }
});

// ── COURSES ──────────────────────────────────────────────────
router.get('/courses', async (req, res, next) => {
  try {
    const { rows } = await pool.query(`SELECT c.*,(SELECT COUNT(*) FROM enrollments e WHERE e.course_id=c.id) enrollments FROM courses c ORDER BY c.sort_order,c.created_at DESC`);
    res.json({ courses: rows });
  } catch(e) { next(e); }
});

router.post('/courses', async (req, res, next) => {
  try {
    const { title,slug,description,short_desc,level,category,price_pkr,price_usd,duration_hours,total_modules,instructor_name,cert_included,is_published,is_featured,tags } = req.body;
    const { rows } = await pool.query(`INSERT INTO courses(title,slug,description,short_desc,level,category,price_pkr,price_usd,duration_hours,total_modules,instructor_name,cert_included,is_published,is_featured,tags) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *`,
      [title,slug,description,short_desc,level,category,price_pkr,price_usd,duration_hours,total_modules,instructor_name,cert_included??true,is_published??false,is_featured??false,tags]);
    res.status(201).json({ course: rows[0] });
  } catch(e) { next(e); }
});

router.patch('/courses/:id', async (req, res, next) => {
  try {
    const fields = ['title','slug','description','short_desc','level','category','price_pkr','duration_hours','total_modules','instructor_name','cert_included','is_published','is_featured'];
    const updates=[]; const params=[]; let i=1;
    for (const f of fields) { if (req.body[f]!==undefined) { updates.push(`${f}=$${i++}`); params.push(req.body[f]); } }
    if (!updates.length) return res.status(400).json({ error: 'No fields to update.' });
    params.push(req.params.id);
    const { rows } = await pool.query(`UPDATE courses SET ${updates.join(',')} WHERE id=$${i} RETURNING *`, params);
    res.json({ course: rows[0] });
  } catch(e) { next(e); }
});

// ── TICKETS ──────────────────────────────────────────────────
router.get('/tickets', async (req, res, next) => {
  try {
    const { status, priority } = req.query;
    let where=['1=1']; const params=[]; let i=1;
    if (status)   { where.push(`t.status=$${i++}`);   params.push(status); }
    if (priority) { where.push(`t.priority=$${i++}`); params.push(priority); }
    const { rows } = await pool.query(`SELECT t.*,u.email,u.first_name,u.last_name FROM tickets t JOIN users u ON t.user_id=u.id WHERE ${where.join(' AND ')} ORDER BY CASE t.priority WHEN 'urgent' THEN 0 WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END, t.created_at DESC`, params);
    res.json({ tickets: rows });
  } catch(e) { next(e); }
});

router.post('/tickets/:id/reply', async (req, res, next) => {
  try {
    const { message, status } = req.body;
    await pool.query(`INSERT INTO ticket_messages(ticket_id,sender_id,message,is_staff) VALUES($1,$2,$3,true)`, [req.params.id, req.user.id, message]);
    if (status) await pool.query('UPDATE tickets SET status=$1 WHERE id=$2', [status, req.params.id]);
    const { rows } = await pool.query('SELECT user_id,subject FROM tickets WHERE id=$1', [req.params.id]);
    if (rows.length) await pool.query(`INSERT INTO notifications(user_id,type,title,message,link) VALUES($1,'ticket','Support Reply','Admin replied to your ticket: ${rows[0].subject}','/dashboard')`, [rows[0].user_id]);
    res.json({ message: 'Reply sent.' });
  } catch(e) { next(e); }
});

// ── HOSTING PLANS MGMT ───────────────────────────────────────
router.post('/plans', async (req, res, next) => {
  try {
    const { name,slug,description,price_monthly_pkr,price_annual_pkr,disk_gb,bandwidth_gb,websites,features,is_active,is_featured,sort_order } = req.body;
    const { rows } = await pool.query(`INSERT INTO hosting_plans(name,slug,description,price_monthly_pkr,price_annual_pkr,disk_gb,bandwidth_gb,websites,features,is_active,is_featured,sort_order) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
      [name,slug,description,price_monthly_pkr,price_annual_pkr,disk_gb,bandwidth_gb||null,websites||null,features||[],is_active??true,is_featured??false,sort_order||0]);
    res.status(201).json({ plan: rows[0] });
  } catch(e) { next(e); }
});

router.patch('/plans/:id', async (req, res, next) => {
  try {
    const fields = ['name','description','price_monthly_pkr','price_annual_pkr','disk_gb','bandwidth_gb','websites','features','is_active','is_featured','sort_order'];
    const updates=[]; const params=[]; let i=1;
    for (const f of fields) { if (req.body[f]!==undefined) { updates.push(`${f}=$${i++}`); params.push(req.body[f]); } }
    params.push(req.params.id);
    const { rows } = await pool.query(`UPDATE hosting_plans SET ${updates.join(',')} WHERE id=$${i} RETURNING *`, params);
    res.json({ plan: rows[0] });
  } catch(e) { next(e); }
});

// ── NOTIFICATIONS BROADCAST ──────────────────────────────────
router.post('/notify-all', async (req, res, next) => {
  try {
    const { title, message, link, type } = req.body;
    const { rows: users } = await pool.query('SELECT id FROM users WHERE is_active=true AND role=$1', ['client']);
    for (const u of users) {
      await pool.query('INSERT INTO notifications(user_id,type,title,message,link) VALUES($1,$2,$3,$4,$5)', [u.id, type||'announcement', title, message, link||'/dashboard']);
    }
    res.json({ message: `Notified ${users.length} users.` });
  } catch(e) { next(e); }
});

module.exports = router;
