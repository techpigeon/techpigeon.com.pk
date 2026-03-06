const router = require('express').Router();
const { pool } = require('../config/db');
const { authenticate } = require('../middleware/auth');

// GET all active plans (public)
router.get('/plans', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM hosting_plans WHERE is_active=true ORDER BY sort_order');
    res.json({ plans: rows });
  } catch (e) { next(e); }
});

// GET user subscriptions
router.get('/subscriptions', authenticate, async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT hs.*, hp.name plan_name, hp.slug, hp.disk_gb, hp.bandwidth_gb, d.full_domain
       FROM hosting_subscriptions hs
       JOIN hosting_plans hp ON hs.plan_id = hp.id
       LEFT JOIN domains d ON hs.domain_id = d.id
       WHERE hs.user_id = $1 ORDER BY hs.created_at DESC`, [req.user.id]);
    res.json({ subscriptions: rows });
  } catch (e) { next(e); }
});

// POST subscribe to a plan
router.post('/subscribe', authenticate, async (req, res, next) => {
  try {
    const { plan_id, billing_cycle = 'monthly', domain_id } = req.body;
    if (!plan_id) return res.status(400).json({ error: 'plan_id is required.' });
    const plan = await pool.query('SELECT * FROM hosting_plans WHERE id=$1 AND is_active=true', [plan_id]);
    if (!plan.rows.length) return res.status(404).json({ error: 'Plan not found.' });
    const end = new Date();
    billing_cycle === 'annual' ? end.setFullYear(end.getFullYear() + 1) : end.setMonth(end.getMonth() + 1);
    const cpanel_user = 'u' + req.user.id.replace(/-/g, '').substring(0, 8);
    const { rows } = await pool.query(
      `INSERT INTO hosting_subscriptions(user_id, plan_id, status, billing_cycle, domain_id, cpanel_username, current_period_end)
       VALUES($1,$2,'pending',$3,$4,$5,$6) RETURNING *`,
      [req.user.id, plan_id, billing_cycle, domain_id || null, cpanel_user, end]);
    res.status(201).json({ subscription: rows[0] });
  } catch (e) { next(e); }
});

// PATCH cancel
router.patch('/subscriptions/:id/cancel', authenticate, async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      "UPDATE hosting_subscriptions SET status='cancelled', auto_renew=false WHERE id=$1 AND user_id=$2 RETURNING *",
      [req.params.id, req.user.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found.' });
    res.json({ subscription: rows[0] });
  } catch (e) { next(e); }
});

module.exports = router;
