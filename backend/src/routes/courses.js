const router = require('express').Router();
const { pool } = require('../config/db');
const { authenticate, optionalAuth } = require('../middleware/auth');

// GET all courses
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const { category, level, search } = req.query;
    let where = ['c.is_published=true']; const params = []; let i = 1;
    if (category) { where.push(`c.category=$${i++}`); params.push(category); }
    if (level)    { where.push(`c.level=$${i++}`);    params.push(level); }
    if (search)   { where.push(`c.title ILIKE $${i}`); params.push(`%${search}%`); i++; }
    const { rows } = await pool.query(
      `SELECT c.*, (SELECT COUNT(*) FROM enrollments e WHERE e.course_id=c.id) enrollment_count
       FROM courses c WHERE ${where.join(' AND ')} ORDER BY c.created_at DESC`, params);
    res.json({ courses: rows });
  } catch (e) { next(e); }
});

// GET my enrollments
router.get('/my/enrollments', authenticate, async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT e.*, c.title, c.slug, c.thumbnail_url, c.duration_hours, c.total_modules, c.instructor_name, c.level
       FROM enrollments e JOIN courses c ON e.course_id=c.id
       WHERE e.user_id=$1 ORDER BY e.enrolled_at DESC`, [req.user.id]);
    res.json({ enrollments: rows });
  } catch (e) { next(e); }
});

// GET single course by slug
router.get('/:slug', optionalAuth, async (req, res, next) => {
  try {
    const { rows } = await pool.query("SELECT * FROM courses WHERE slug=$1 AND is_published=true", [req.params.slug]);
    if (!rows.length) return res.status(404).json({ error: 'Course not found.' });
    res.json({ course: rows[0] });
  } catch (e) { next(e); }
});

// POST enroll
router.post('/:id/enroll', authenticate, async (req, res, next) => {
  try {
    const exists = await pool.query('SELECT id FROM enrollments WHERE user_id=$1 AND course_id=$2', [req.user.id, req.params.id]);
    if (exists.rows.length) return res.status(409).json({ error: 'Already enrolled.' });
    const { rows } = await pool.query(
      "INSERT INTO enrollments(user_id, course_id, status) VALUES($1,$2,'active') RETURNING *",
      [req.user.id, req.params.id]);
    res.status(201).json({ enrollment: rows[0] });
  } catch (e) { next(e); }
});

module.exports = router;
