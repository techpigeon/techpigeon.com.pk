const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const { authenticate, requireRole } = require('../middleware/middleware_v2');

// GET all hosting plans (public)
router.get('/plans', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM hosting_plans WHERE is_active = true ORDER BY sort_order');
    res.json({ plans: rows });
  } catch (e) { next(e); }
});

// GET user's subscriptions
router.get('/subscriptions', authenticate, async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT hs.*, hp.name AS plan_name, hp.disk_gb, hp.bandwidth_gb, d.full_domain
       FROM hosting_subscriptions hs
       JOIN hosting_plans hp ON hs.plan_id = hp.id
       LEFT JOIN domains d ON hs.domain_id = d.id
       WHERE hs.user_id = $1 ORDER BY hs.created_at DESC`,
      [req.user.id]
    );
    res.json({ subscriptions: rows });
  } catch (e) { next(e); }
});

// POST subscribe to a plan (creates order)
router.post('/subscribe', authenticate, async (req, res, next) => {
  const client = await pool.connect();
  try {
    const { plan_id, domain_id, billing_cycle = 'monthly' } = req.body;
    const { rows: [plan] } = await client.query('SELECT * FROM hosting_plans WHERE id = $1', [plan_id]);
    if (!plan) return res.status(404).json({ error: 'Plan not found' });

    await client.query('BEGIN');

    let domainToAttach = domain_id || null;
    if (domainToAttach) {
      const { rows: [dom] } = await client.query('SELECT id FROM domains WHERE id=$1 AND user_id=$2', [domainToAttach, req.user.id]);
      if (!dom) domainToAttach = null;
    }

    const periodEnd = new Date();
    if (billing_cycle === 'annual') periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    else periodEnd.setMonth(periodEnd.getMonth() + 1);

    const { rows: [sub] } = await client.query(
      `INSERT INTO hosting_subscriptions(user_id,plan_id,status,billing_cycle,domain_id,current_period_end,auto_renew)
       VALUES($1,$2,'pending',$3,$4,$5,true) RETURNING *`,
      [req.user.id, plan_id, billing_cycle, domainToAttach, periodEnd]
    );

    const price = billing_cycle === 'annual' ? plan.price_annual_pkr : plan.price_monthly_pkr;
    const orderNo = 'TP-' + Date.now().toString().slice(-8);
    const { rows: [order] } = await client.query(
      'INSERT INTO orders (user_id, order_number, status, subtotal_pkr, total_pkr) VALUES ($1,$2,$3,$4,$4) RETURNING *',
      [req.user.id, orderNo, 'pending', price]
    );
    await client.query(
      `INSERT INTO order_items (order_id, item_type, item_id, description, quantity, unit_price, total_price)
       VALUES ($1,'hosting',$2,$3,1,$4,$4)`,
      [order.id, sub.id, `${plan.name} Hosting — ${billing_cycle}`, price]
    );

    await client.query('COMMIT');
    res.status(201).json({ order, message: 'Order created. Proceed to payment.' });
  } catch (e) {
    try { await client.query('ROLLBACK'); } catch {}
    next(e);
  } finally {
    client.release();
  }
});

// PATCH cancel subscription
router.patch('/subscriptions/:id', authenticate, async (req, res, next) => {
  try {
    const { auto_renew } = req.body;
    if (auto_renew === undefined) return res.status(400).json({ error: 'Nothing to update.' });
    const { rows: [sub] } = await pool.query(
      'UPDATE hosting_subscriptions SET auto_renew=$1,updated_at=NOW() WHERE id=$2 AND user_id=$3 RETURNING *',
      [auto_renew, req.params.id, req.user.id]
    );
    if (!sub) return res.status(404).json({ error: 'Subscription not found' });
    res.json({ subscription: sub });
  } catch (e) { next(e); }
});

// PATCH cancel subscription
router.patch('/subscriptions/:id/cancel', authenticate, async (req, res, next) => {
  try {
    const { rows: [sub] } = await pool.query(
      'UPDATE hosting_subscriptions SET status=$1,updated_at=NOW() WHERE id=$2 AND user_id=$3 RETURNING *',
      ['cancelled', req.params.id, req.user.id]
    );
    if (!sub) return res.status(404).json({ error: 'Subscription not found' });
    res.json({ subscription: sub });
  } catch (e) { next(e); }
});

module.exports = router;
