const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

const authenticate = async (req, res, next) => {
  try {
    const h = req.headers.authorization;
    if (!h?.startsWith('Bearer ')) return res.status(401).json({ error: 'Authentication required.' });
    const decoded = jwt.verify(h.split(' ')[1], process.env.JWT_SECRET);
    const { rows } = await pool.query('SELECT id,email,role,first_name,last_name,is_active FROM users WHERE id=$1',[decoded.sub]);
    if (!rows.length || !rows[0].is_active) return res.status(401).json({ error: 'User not found or inactive.' });
    req.user = rows[0];
    next();
  } catch (e) {
    if (e.name === 'JsonWebTokenError')  return res.status(401).json({ error: 'Invalid token.' });
    if (e.name === 'TokenExpiredError') return res.status(401).json({ error: 'Token expired.' });
    next(e);
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const h = req.headers.authorization;
    if (!h?.startsWith('Bearer ')) return next();
    const decoded = jwt.verify(h.split(' ')[1], process.env.JWT_SECRET);
    const { rows } = await pool.query('SELECT id,email,role FROM users WHERE id=$1',[decoded.sub]);
    if (rows.length) req.user = rows[0];
    next();
  } catch { next(); }
};

const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role))
    return res.status(403).json({ error: 'Insufficient permissions.' });
  next();
};

const errorHandler = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.path}:`, err.message);
  if (err.code === '23505') return res.status(409).json({ error: 'Record already exists.' });
  if (err.code === '23503') return res.status(400).json({ error: 'Referenced record not found.' });
  res.status(err.status || 500).json({ error: err.status === 500 || !err.status ? 'Internal server error.' : err.message });
};

module.exports = { authenticate, optionalAuth, requireRole, errorHandler };
