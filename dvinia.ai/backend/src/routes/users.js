const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const { authenticate } = require('../middleware/middleware_v2');

// GET current user profile
router.get('/me', authenticate, async (req, res, next) => {
  try {
    const { rows: [user] } = await pool.query(
      'SELECT id,first_name,last_name,email,phone,role,avatar_url,is_verified,created_at FROM users WHERE id=$1',
      [req.user.id]
    );
    res.json({ user });
  } catch (e) { next(e); }
});

// PATCH update profile
router.patch('/me', authenticate, async (req, res, next) => {
  try {
    const { first_name, last_name, phone } = req.body;
    const { rows: [user] } = await pool.query(
      `UPDATE users SET first_name=COALESCE($1,first_name), last_name=COALESCE($2,last_name),
       phone=COALESCE($3,phone), updated_at=NOW() WHERE id=$4
       RETURNING id,first_name,last_name,email,phone,role,avatar_url`,
      [first_name, last_name, phone, req.user.id]
    );
    res.json({ user });
  } catch (e) { next(e); }
});

module.exports = router;
