const router = require('express').Router();
const { pool } = require('../config/db');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, async (req, res, next) => {
  try {
    const uid = req.user.id;
    const [domains, hosting, training, recentOrders, tickets, notifications] = await Promise.all([
      pool.query(`SELECT COUNT(*) FILTER(WHERE status='active') active, COUNT(*) FILTER(WHERE expires_at < NOW()+INTERVAL '30 days' AND status='active') expiring FROM domains WHERE user_id=$1`, [uid]),
      pool.query(`SELECT COUNT(*) FILTER(WHERE status='active') active FROM hosting_subscriptions WHERE user_id=$1`, [uid]),
      pool.query(`SELECT COUNT(*) total, COALESCE(ROUND(AVG(progress_pct)),0) avg_progress FROM enrollments WHERE user_id=$1`, [uid]),
      pool.query(`SELECT order_number, total_pkr, status, created_at FROM orders WHERE user_id=$1 ORDER BY created_at DESC LIMIT 5`, [uid]),
      pool.query(`SELECT COUNT(*) FILTER(WHERE status IN ('open','in_progress')) open FROM tickets WHERE user_id=$1`, [uid]),
      pool.query(`SELECT * FROM notifications WHERE user_id=$1 ORDER BY created_at DESC LIMIT 10`, [uid]),
    ]);
    res.json({
      stats: { domains: domains.rows[0], hosting: hosting.rows[0], training: training.rows[0], tickets: tickets.rows[0] },
      recent_orders: recentOrders.rows,
      notifications: notifications.rows,
    });
  } catch (e) { next(e); }
});

router.post('/notifications/:id/read', authenticate, async (req, res, next) => {
  try {
    await pool.query('UPDATE notifications SET read_at=NOW() WHERE id=$1 AND user_id=$2', [req.params.id, req.user.id]);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

router.post('/notifications/read-all', authenticate, async (req, res, next) => {
  try {
    await pool.query('UPDATE notifications SET read_at=NOW() WHERE user_id=$1 AND read_at IS NULL', [req.user.id]);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

module.exports = router;
