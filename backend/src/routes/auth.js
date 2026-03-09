const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { pool } = require('../db');
const { sendEmail } = require('../config/mailer');
const { authenticate } = require('../middleware/middleware_v2');

const sign = (id, role) => jwt.sign({ sub: id, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

router.post('/register', async (req, res, next) => {
  try {
    const { first_name, last_name, email, phone, password } = req.body;
    if (!first_name||!last_name||!email||!password) return res.status(400).json({ error: 'All fields required.' });
    if (password.length < 8) return res.status(400).json({ error: 'Password min 8 chars.' });
    const exists = await pool.query('SELECT id FROM users WHERE email=$1', [email.toLowerCase()]);
    if (exists.rows.length) return res.status(409).json({ error: 'Email already registered.' });
    const hash = await bcrypt.hash(password, 12);
    const vtoken = crypto.randomBytes(32).toString('hex');
    const { rows } = await pool.query(
      `INSERT INTO users(first_name,last_name,email,phone,password_hash,role) VALUES($1,$2,$3,$4,$5,'client') RETURNING id,first_name,last_name,email,role`,
      [first_name.trim(), last_name.trim(), email.toLowerCase().trim(), phone||null, hash]
    );
    await pool.query(`INSERT INTO tokens(user_id,token,type,expires_at) VALUES($1,$2,'email_verify',NOW()+INTERVAL '24 hours')`, [rows[0].id, vtoken]);
    try {
      await sendEmail({ to: email, subject: 'Verify your TechPigeon account', html: `<p>Hi ${first_name},</p><p>Welcome to TechPigeon!</p><p><a href="${process.env.FRONTEND_URL}/auth/verify?token=${vtoken}" style="background:#00A8E8;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block">Verify Email</a></p>` });
    } catch (mailErr) {
      console.error('Email send failed during register:', mailErr.message);
    }
    res.status(201).json({ message: 'Account created! Check your email to verify.', token: sign(rows[0].id, rows[0].role), user: rows[0] });
  } catch(e) { next(e); }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email||!password) return res.status(400).json({ error: 'Email and password required.' });
    const { rows } = await pool.query(`SELECT id,first_name,last_name,email,role,password_hash,is_active,is_verified FROM users WHERE email=$1`, [email.toLowerCase()]);
    if (!rows.length) return res.status(401).json({ error: 'Invalid email or password.' });
    if (!rows[0].is_active) return res.status(403).json({ error: 'Account suspended. Contact support.' });
    if (!await bcrypt.compare(password, rows[0].password_hash)) return res.status(401).json({ error: 'Invalid email or password.' });
    await pool.query('UPDATE users SET last_login_at=NOW() WHERE id=$1', [rows[0].id]);
    const { password_hash, ...user } = rows[0];
    res.json({ token: sign(user.id, user.role), user });
  } catch(e) { next(e); }
});

router.get('/verify', async (req, res, next) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ error: 'Token required.' });
    const { rows } = await pool.query(`SELECT * FROM tokens WHERE token=$1 AND type='email_verify' AND expires_at>NOW() AND used_at IS NULL`, [token]);
    if (!rows.length) return res.status(400).json({ error: 'Invalid or expired token.' });
    await pool.query('UPDATE users SET is_verified=true WHERE id=$1', [rows[0].user_id]);
    await pool.query('UPDATE tokens SET used_at=NOW() WHERE token=$1', [token]);
    res.json({ message: 'Email verified! You can now sign in.' });
  } catch(e) { next(e); }
});

router.post('/forgot-password', async (req, res, next) => {
  try {
    const { email } = req.body;
    const { rows } = await pool.query('SELECT id,first_name FROM users WHERE email=$1', [email?.toLowerCase()]);
    if (rows.length) {
      const t = crypto.randomBytes(32).toString('hex');
      await pool.query(`INSERT INTO tokens(user_id,token,type,expires_at) VALUES($1,$2,'password_reset',NOW()+INTERVAL '1 hour')`, [rows[0].id, t]);
      try {
        await sendEmail({ to: email, subject: 'Reset your TechPigeon password', html: `<p>Hi ${rows[0].first_name},</p><p><a href="${process.env.FRONTEND_URL}/auth/reset-password?token=${t}" style="background:#00A8E8;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block">Reset Password</a></p><p>Expires in 1 hour.</p>` });
      } catch (mailErr) {
        console.error('Email send failed during forgot-password:', mailErr.message);
      }
    }
    res.json({ message: 'If that email exists, a reset link has been sent.' });
  } catch(e) { next(e); }
});

router.post('/reset-password', async (req, res, next) => {
  try {
    const { token, password } = req.body;
    if (!token||!password||password.length<8) return res.status(400).json({ error: 'Valid token and password (8+ chars) required.' });
    const { rows } = await pool.query(`SELECT * FROM tokens WHERE token=$1 AND type='password_reset' AND expires_at>NOW() AND used_at IS NULL`, [token]);
    if (!rows.length) return res.status(400).json({ error: 'Invalid or expired token.' });
    await pool.query('UPDATE users SET password_hash=$1 WHERE id=$2', [await bcrypt.hash(password,12), rows[0].user_id]);
    await pool.query('UPDATE tokens SET used_at=NOW() WHERE token=$1', [token]);
    res.json({ message: 'Password reset successfully.' });
  } catch(e) { next(e); }
});

router.get('/me', authenticate, async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT id,first_name,last_name,email,phone,role,avatar_url,is_verified,created_at FROM users WHERE id=$1', [req.user.id]);
    if (!rows.length) return res.status(404).json({ error: 'User not found.' });
    res.json({ user: rows[0] });
  } catch(e) { next(e); }
});

router.patch('/me', authenticate, async (req, res, next) => {
  try {
    const { first_name, last_name, phone } = req.body;
    const { rows } = await pool.query(
      'UPDATE users SET first_name=COALESCE($1,first_name),last_name=COALESCE($2,last_name),phone=COALESCE($3,phone) WHERE id=$4 RETURNING id,first_name,last_name,email,phone,role',
      [first_name, last_name, phone, req.user.id]
    );
    res.json({ user: rows[0] });
  } catch(e) { next(e); }
});

router.post('/change-password', authenticate, async (req, res, next) => {
  try {
    const { current_password, new_password } = req.body;
    if (!current_password||!new_password||new_password.length<8) return res.status(400).json({ error: 'Valid passwords required.' });
    const { rows } = await pool.query('SELECT password_hash FROM users WHERE id=$1', [req.user.id]);
    if (!await bcrypt.compare(current_password, rows[0].password_hash)) return res.status(401).json({ error: 'Current password incorrect.' });
    await pool.query('UPDATE users SET password_hash=$1 WHERE id=$2', [await bcrypt.hash(new_password,12), req.user.id]);
    res.json({ message: 'Password updated.' });
  } catch(e) { next(e); }
});

module.exports = router;
