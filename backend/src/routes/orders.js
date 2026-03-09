const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const { authenticate } = require('../middleware/middleware_v2');

// GET my orders
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT o.*, COALESCE(json_agg(oi.*) FILTER (WHERE oi.id IS NOT NULL), '[]'::json) AS items
       FROM orders o LEFT JOIN order_items oi ON oi.order_id=o.id
       WHERE o.user_id=$1 GROUP BY o.id ORDER BY o.created_at DESC`,
      [req.user.id]
    );
    res.json({ orders: rows });
  } catch (e) { next(e); }
});

// GET single order
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const { rows: [order] } = await pool.query('SELECT * FROM orders WHERE id=$1 AND user_id=$2', [req.params.id, req.user.id]);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    const { rows: items } = await pool.query('SELECT * FROM order_items WHERE order_id=$1', [order.id]);
    res.json({ order: { ...order, items } });
  } catch (e) { next(e); }
});

// POST create order
router.post('/', authenticate, async (req, res, next) => {
  const client = await pool.connect();
  try {
    const { items, coupon_code } = req.body;
    if (!items || !items.length) return res.status(400).json({ error: 'No items provided' });
    await client.query('BEGIN');
    const subtotal = items.reduce((s, i) => s + (i.unit_price * (i.quantity || 1)), 0);
    let discount = 0;
    if (coupon_code) {
      const { rows: [cp] } = await client.query(
        `SELECT * FROM coupons WHERE code=$1 AND is_active=true AND (valid_until IS NULL OR valid_until>NOW()) AND (max_uses IS NULL OR used_count<max_uses)`,
        [coupon_code.toUpperCase()]
      );
      if (cp && subtotal >= (cp.min_order_pkr || 0)) {
        discount = cp.discount_type === 'percent' ? Math.round(subtotal * cp.discount_value / 100) : cp.discount_value;
        await client.query('UPDATE coupons SET used_count=used_count+1 WHERE id=$1', [cp.id]);
      }
    }
    const total = Math.max(0, subtotal - discount);
    const orderNo = 'TP-' + Date.now().toString().slice(-6);
    const { rows: [order] } = await client.query(
      `INSERT INTO orders (user_id, order_number, status, subtotal_pkr, discount_pkr, total_pkr)
       VALUES ($1,$2,'pending',$3,$4,$5) RETURNING *`,
      [req.user.id, orderNo, subtotal, discount, total]
    );
    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, item_type, item_id, description, quantity, unit_price, total_price)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [order.id, item.type, item.id || null, item.description, item.quantity || 1, item.unit_price, item.unit_price * (item.quantity || 1)]
      );
    }
    await client.query('COMMIT');
    res.status(201).json({ order });
  } catch (e) { await client.query('ROLLBACK'); next(e); } finally { client.release(); }
});

module.exports = router;
