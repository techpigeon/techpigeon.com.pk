const router = require('express').Router();
const { pool } = require('../config/db');
const { authenticate } = require('../middleware/auth');

router.get('/profile', authenticate, async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, first_name, last_name, email, phone, role, avatar_url, is_verified, created_at FROM users WHERE id=$1',
      [req.user.id]);
    if (!rows.length) return res.status(404).json({ error: 'User not found.' });
    res.json({ user: rows[0] });
  } catch (e) { next(e); }
});

module.exports = router;
