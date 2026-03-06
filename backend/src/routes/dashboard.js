const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const { authenticate } = require('../middleware/auth');

// GET dashboard overview
router.get('/', authenticate, async (req, res, next) => {
  try {
    const uid = req.user.id;
    const [domains, hosting, enrollments, orders, notifications] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM domains WHERE user_id=$1 AND status=$2', [uid, 'active']),
      pool.query('SELECT COUNT(*) FROM hosting_subscriptions WHERE user_id=$1 AND status=$2', [uid, 'active']),
      pool.query('SELECT COUNT(*) FROM enrollments WHERE user_id=$1', [uid]),
      pool.query(`SELECT * FROM orders WHERE user_id=$1 AND status='pending' ORDER BY created_at DESC LIMIT 1`, [uid]),
      pool.query('SELECT * FROM notifications WHERE user_id=$1 ORDER BY created_at DESC LIMIT 10', [uid]),
    ]);
    res.json({
      stats: {
        active_domains:  parseInt(domains.rows[0].count),
        active_hosting:  parseInt(hosting.rows[0].count),
        enrollments:     parseInt(enrollments.rows[0].count),
        pending_invoice: orders.rows[0] || null,
      },
      notifications: notifications.rows,
    });
  } catch (e) { next(e); }
});

// POST mark notification read
router.post('/notifications/:id/read', authenticate, async (req, res, next) => {
  try {
    await pool.query('UPDATE notifications SET read_at=NOW() WHERE id=$1 AND user_id=$2', [req.params.id, req.user.id]);
    res.json({ success: true });
  } catch (e) { next(e); }
});

// POST mark all notifications read
router.post('/notifications/read-all', authenticate, async (req, res, next) => {
  try {
    await pool.query('UPDATE notifications SET read_at=NOW() WHERE user_id=$1 AND read_at IS NULL', [req.user.id]);
    res.json({ success: true });
  } catch (e) { next(e); }
});

module.exports = router;
