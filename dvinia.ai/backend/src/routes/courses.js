const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const { authenticate, optionalAuth } = require('../middleware/middleware_v2');

// GET all courses (public)
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const { category, level, search } = req.query;
    let q = 'SELECT c.*, (SELECT COUNT(*) FROM enrollments e WHERE e.course_id=c.id) AS enrolled_count FROM courses c WHERE c.is_published=true';
    const params = [];
    if (category) { params.push(category); q += ` AND c.category=$${params.length}`; }
    if (level)    { params.push(level);    q += ` AND c.level=$${params.length}`; }
    if (search)   { params.push(`%${search}%`); q += ` AND (c.title ILIKE $${params.length} OR c.description ILIKE $${params.length})`; }
    q += ' ORDER BY c.is_featured DESC, c.created_at DESC';
    const { rows } = await pool.query(q, params);
    res.json({ courses: rows });
  } catch (e) { next(e); }
});

// GET single course
router.get('/:slug', optionalAuth, async (req, res, next) => {
  try {
    const { rows: [course] } = await pool.query('SELECT * FROM courses WHERE slug=$1 AND is_published=true', [req.params.slug]);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json({ course });
  } catch (e) { next(e); }
});

// GET my enrollments
router.get('/my/enrollments', authenticate, async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT e.*, c.title, c.slug, c.thumbnail_url, c.total_modules
       FROM enrollments e JOIN courses c ON e.course_id=c.id
       WHERE e.user_id=$1 ORDER BY e.enrolled_at DESC`,
      [req.user.id]
    );
    res.json({ enrollments: rows });
  } catch (e) { next(e); }
});

// POST enroll (creates order)
router.post('/:id/enroll', authenticate, async (req, res, next) => {
  try {
    const { rows: [course] } = await pool.query('SELECT * FROM courses WHERE id=$1', [req.params.id]);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    const { rows: [exists] } = await pool.query('SELECT id FROM enrollments WHERE user_id=$1 AND course_id=$2', [req.user.id, course.id]);
    if (exists) return res.status(400).json({ error: 'Already enrolled' });
    const { rows: [order] } = await pool.query(
      'INSERT INTO orders (user_id, status, subtotal_pkr, total_pkr) VALUES ($1,$2,$3,$3) RETURNING *',
      [req.user.id, 'pending', course.price_pkr]
    );
    await pool.query(
      `INSERT INTO order_items (order_id, item_type, item_id, description, quantity, unit_price, total_price)
       VALUES ($1,'course',$2,$3,1,$4,$4)`,
      [order.id, course.id, course.title, course.price_pkr]
    );
    res.status(201).json({ order, message: 'Order created. Proceed to payment.' });
  } catch (e) { next(e); }
});

module.exports = router;
