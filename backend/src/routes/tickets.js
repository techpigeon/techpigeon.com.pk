const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const { authenticate } = require('../middleware/middleware_v2');

// GET my tickets
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT t.*, (SELECT COUNT(*) FROM ticket_messages tm WHERE tm.ticket_id=t.id) AS message_count
       FROM tickets t WHERE t.user_id=$1 ORDER BY t.created_at DESC`,
      [req.user.id]
    );
    res.json({ tickets: rows });
  } catch (e) { next(e); }
});

// GET single ticket with messages
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const { rows: [ticket] } = await pool.query('SELECT * FROM tickets WHERE id=$1 AND user_id=$2', [req.params.id, req.user.id]);
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
    const { rows: messages } = await pool.query(
      `SELECT tm.*, u.first_name, u.last_name FROM ticket_messages tm
       JOIN users u ON u.id=tm.sender_id WHERE tm.ticket_id=$1 ORDER BY tm.created_at ASC`,
      [ticket.id]
    );
    res.json({ ticket: { ...ticket, messages } });
  } catch (e) { next(e); }
});

// POST create ticket
router.post('/', authenticate, async (req, res, next) => {
  const client = await pool.connect();
  try {
    const { subject, department = 'General', priority = 'medium', message } = req.body;
    if (!subject || !message) return res.status(400).json({ error: 'Subject and message are required' });
    await client.query('BEGIN');
    const ticketNo = 'TCK-' + Date.now().toString().slice(-6);
    const { rows: [ticket] } = await client.query(
      `INSERT INTO tickets (user_id, ticket_no, subject, department, priority, status)
       VALUES ($1,$2,$3,$4,$5,'open') RETURNING *`,
      [req.user.id, ticketNo, subject, department, priority]
    );
    await client.query(
      'INSERT INTO ticket_messages (ticket_id, sender_id, message, is_staff) VALUES ($1,$2,$3,false)',
      [ticket.id, req.user.id, message]
    );
    await client.query('COMMIT');
    res.status(201).json({ ticket });
  } catch (e) { await client.query('ROLLBACK'); next(e); } finally { client.release(); }
});

// POST reply to ticket
router.post('/:id/reply', authenticate, async (req, res, next) => {
  try {
    const { message } = req.body;
    const { rows: [ticket] } = await pool.query('SELECT * FROM tickets WHERE id=$1 AND user_id=$2', [req.params.id, req.user.id]);
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
    await pool.query(
      'INSERT INTO ticket_messages (ticket_id, sender_id, message, is_staff) VALUES ($1,$2,$3,false)',
      [ticket.id, req.user.id, message]
    );
    if (ticket.status === 'resolved') {
      await pool.query('UPDATE tickets SET status=$1, updated_at=NOW() WHERE id=$2', ['open', ticket.id]);
    }
    res.json({ success: true });
  } catch (e) { next(e); }
});

module.exports = router;
