const router = require('express').Router();
const { pool } = require('../config/db');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT o.*, json_agg(oi.*) items
       FROM orders o LEFT JOIN order_items oi ON o.id=oi.order_id
       WHERE o.user_id=$1 GROUP BY o.id ORDER BY o.created_at DESC`, [req.user.id]);
    res.json({ orders: rows });
  } catch (e) { next(e); }
});

router.post('/', authenticate, async (req, res, next) => {
  try {
    const { items, coupon_code } = req.body;
    if (!items?.length) return res.status(400).json({ error: 'No items provided.' });
    let subtotal = items.reduce((s, i) => s + (i.unit_price * (i.quantity || 1)), 0);
    let discount = 0;
    if (coupon_code) {
      const c = await pool.query(
        "SELECT * FROM coupons WHERE code=$1 AND is_active=true AND (valid_until IS NULL OR valid_until > NOW()) AND (max_uses IS NULL OR used_count < max_uses)",
        [coupon_code.toUpperCase()]);
      if (c.rows.length) {
        const cp = c.rows[0];
        discount = cp.discount_type === 'percent' ? subtotal * (cp.discount_value / 100) : cp.discount_value;
        await pool.query('UPDATE coupons SET used_count=used_count+1 WHERE id=$1', [cp.id]);
      }
    }
    const total = Math.max(0, subtotal - discount);
    const order_number = `TP-${Date.now()}`;
    const { rows: ord } = await pool.query(
      `INSERT INTO orders(user_id, order_number, subtotal_pkr, discount_pkr, total_pkr)
       VALUES($1,$2,$3,$4,$5) RETURNING *`,
      [req.user.id, order_number, subtotal, discount, total]);
    for (const item of items) {
      await pool.query(
        `INSERT INTO order_items(order_id, item_type, item_id, description, quantity, unit_price, total_price, meta)
         VALUES($1,$2,$3,$4,$5,$6,$7,$8)`,
        [ord[0].id, item.type, item.id || null, item.description, item.quantity || 1, item.unit_price, item.unit_price * (item.quantity || 1), JSON.stringify(item.meta || {})]);
    }
    res.status(201).json({ order: ord[0], order_number });
  } catch (e) { next(e); }
});

router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const o = await pool.query('SELECT * FROM orders WHERE id=$1 AND user_id=$2', [req.params.id, req.user.id]);
    if (!o.rows.length) return res.status(404).json({ error: 'Order not found.' });
    const items = await pool.query('SELECT * FROM order_items WHERE order_id=$1', [req.params.id]);
    const pays  = await pool.query('SELECT * FROM payments WHERE order_id=$1', [req.params.id]);
    res.json({ order: o.rows[0], items: items.rows, payments: pays.rows });
  } catch (e) { next(e); }
});

module.exports = router;
