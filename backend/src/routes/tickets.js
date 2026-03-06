const router = require('express').Router();
const { pool } = require('../config/db');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM tickets WHERE user_id=$1 ORDER BY created_at DESC', [req.user.id]);
    res.json({ tickets: rows });
  } catch (e) { next(e); }
});

router.post('/', authenticate, async (req, res, next) => {
  try {
    const { subject, department = 'general', priority = 'medium', message } = req.body;
    if (!subject || !message) return res.status(400).json({ error: 'Subject and message are required.' });
    const ticket_no = `TCK-${Date.now()}`;
    const { rows } = await pool.query(
      `INSERT INTO tickets(user_id, ticket_no, subject, department, priority, status)
       VALUES($1,$2,$3,$4,$5,'open') RETURNING *`,
      [req.user.id, ticket_no, subject, department, priority]);
    await pool.query(
      'INSERT INTO ticket_messages(ticket_id, sender_id, message, is_staff) VALUES($1,$2,$3,false)',
      [rows[0].id, req.user.id, message]);
    res.status(201).json({ ticket: rows[0] });
  } catch (e) { next(e); }
});

router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const t = await pool.query('SELECT * FROM tickets WHERE id=$1 AND user_id=$2', [req.params.id, req.user.id]);
    if (!t.rows.length) return res.status(404).json({ error: 'Ticket not found.' });
    const msgs = await pool.query(
      `SELECT tm.*, u.first_name, u.last_name, u.role
       FROM ticket_messages tm JOIN users u ON tm.sender_id=u.id
       WHERE tm.ticket_id=$1 ORDER BY tm.created_at`, [req.params.id]);
    res.json({ ticket: t.rows[0], messages: msgs.rows });
  } catch (e) { next(e); }
});

router.post('/:id/reply', authenticate, async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message required.' });
    await pool.query(
      'INSERT INTO ticket_messages(ticket_id, sender_id, message, is_staff) VALUES($1,$2,$3,false)',
      [req.params.id, req.user.id, message]);
    await pool.query("UPDATE tickets SET status='in_progress', updated_at=NOW() WHERE id=$1 AND user_id=$2",
      [req.params.id, req.user.id]);
    res.json({ message: 'Reply sent.' });
  } catch (e) { next(e); }
});

module.exports = router;
