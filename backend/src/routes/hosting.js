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
  try {
    const { plan_id, domain_id, billing_cycle = 'monthly' } = req.body;
    const { rows: [plan] } = await pool.query('SELECT * FROM hosting_plans WHERE id = $1', [plan_id]);
    if (!plan) return res.status(404).json({ error: 'Plan not found' });
    const price = billing_cycle === 'annual' ? plan.price_annual_pkr : plan.price_monthly_pkr;
    const orderNo = 'TP-' + Date.now().toString().slice(-8);
    const { rows: [order] } = await pool.query(
      'INSERT INTO orders (user_id, order_number, status, subtotal_pkr, total_pkr) VALUES ($1,$2,$3,$4,$4) RETURNING *',
      [req.user.id, orderNo, 'pending', price]
    );
    await pool.query(
      `INSERT INTO order_items (order_id, item_type, item_id, description, quantity, unit_price, total_price)
       VALUES ($1,'hosting',$2,$3,1,$4,$4)`,
      [order.id, plan_id, `${plan.name} Hosting — ${billing_cycle}`, price]
    );
    res.status(201).json({ order, message: 'Order created. Proceed to payment.' });
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
