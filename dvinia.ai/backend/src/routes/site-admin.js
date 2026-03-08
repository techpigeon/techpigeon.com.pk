// ═══════════════════════════════════════════════════════════════
// ADMIN CMS API — site settings + content management
// All routes require admin authentication
// ═══════════════════════════════════════════════════════════════
const router = require('express').Router();
const { pool } = require('../db');
const { authenticate, requireRole } = require('../middleware/middleware_v2');

router.use(authenticate, requireRole('admin'));

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SITE SETTINGS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// GET all settings (grouped by category)
router.get('/settings', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT id, key, value, category FROM site_settings ORDER BY category, key');
    res.json({ settings: rows });
  } catch (e) { next(e); }
});

// PUT update a single setting
router.put('/settings/:key', async (req, res, next) => {
  try {
    const { value } = req.body;
    if (value === undefined) return res.status(400).json({ error: 'Value required.' });
    const { rows } = await pool.query(
      'UPDATE site_settings SET value=$1, updated_by=$2, updated_at=NOW() WHERE key=$3 RETURNING *',
      [JSON.stringify(value), req.user.id, req.params.key]
    );
    if (!rows.length) {
      // Create if doesn't exist
      const ins = await pool.query(
        'INSERT INTO site_settings(key, value, category, updated_by) VALUES($1, $2, $3, $4) RETURNING *',
        [req.params.key, JSON.stringify(value), req.body.category || 'general', req.user.id]
      );
      return res.json({ setting: ins.rows[0] });
    }
    res.json({ setting: rows[0] });
  } catch (e) { next(e); }
});

// PUT bulk update settings
router.put('/settings', async (req, res, next) => {
  try {
    const { settings } = req.body;
    if (!settings || typeof settings !== 'object') return res.status(400).json({ error: 'Settings object required.' });
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const [key, value] of Object.entries(settings)) {
        await client.query(
          `INSERT INTO site_settings(key, value, updated_by) VALUES($1, $2, $3)
           ON CONFLICT(key) DO UPDATE SET value=$2, updated_by=$3, updated_at=NOW()`,
          [key, JSON.stringify(value), req.user.id]
        );
      }
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
    res.json({ message: 'Settings updated.', count: Object.keys(settings).length });
  } catch (e) { next(e); }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PAGE SECTIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

router.get('/sections', async (req, res, next) => {
  try {
    const { page } = req.query;
    let q = 'SELECT * FROM page_sections';
    const params = [];
    if (page) { q += ' WHERE page=$1'; params.push(page); }
    q += ' ORDER BY page, sort_order';
    const { rows } = await pool.query(q, params);
    res.json({ sections: rows });
  } catch (e) { next(e); }
});

router.put('/sections/:id', async (req, res, next) => {
  try {
    const { title, subtitle, content, data, is_visible, sort_order } = req.body;
    const { rows } = await pool.query(
      `UPDATE page_sections SET title=COALESCE($1,title), subtitle=COALESCE($2,subtitle),
       content=COALESCE($3,content), data=COALESCE($4,data), is_visible=COALESCE($5,is_visible),
       sort_order=COALESCE($6,sort_order), updated_by=$7 WHERE id=$8 RETURNING *`,
      [title, subtitle, content, data ? JSON.stringify(data) : null, is_visible, sort_order, req.user.id, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Section not found.' });
    res.json({ section: rows[0] });
  } catch (e) { next(e); }
});

router.post('/sections', async (req, res, next) => {
  try {
    const { page, section_key, title, subtitle, content, data, is_visible, sort_order } = req.body;
    if (!page || !section_key) return res.status(400).json({ error: 'Page and section_key required.' });
    const { rows } = await pool.query(
      `INSERT INTO page_sections(page, section_key, title, subtitle, content, data, is_visible, sort_order, updated_by)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [page, section_key, title, subtitle, content, data ? JSON.stringify(data) : '{}', is_visible ?? true, sort_order || 0, req.user.id]
    );
    res.status(201).json({ section: rows[0] });
  } catch (e) { next(e); }
});

router.delete('/sections/:id', async (req, res, next) => {
  try {
    await pool.query('DELETE FROM page_sections WHERE id=$1', [req.params.id]);
    res.json({ message: 'Section deleted.' });
  } catch (e) { next(e); }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SERVICES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

router.get('/services', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM services ORDER BY sort_order');
    res.json({ services: rows });
  } catch (e) { next(e); }
});

router.post('/services', async (req, res, next) => {
  try {
    const { title, description, icon, href, is_visible, sort_order } = req.body;
    if (!title) return res.status(400).json({ error: 'Title required.' });
    const { rows } = await pool.query(
      'INSERT INTO services(title, description, icon, href, is_visible, sort_order) VALUES($1,$2,$3,$4,$5,$6) RETURNING *',
      [title, description, icon, href || '#', is_visible ?? true, sort_order || 0]
    );
    res.status(201).json({ service: rows[0] });
  } catch (e) { next(e); }
});

router.put('/services/:id', async (req, res, next) => {
  try {
    const { title, description, icon, href, is_visible, sort_order } = req.body;
    const { rows } = await pool.query(
      `UPDATE services SET title=COALESCE($1,title), description=COALESCE($2,description),
       icon=COALESCE($3,icon), href=COALESCE($4,href), is_visible=COALESCE($5,is_visible),
       sort_order=COALESCE($6,sort_order) WHERE id=$7 RETURNING *`,
      [title, description, icon, href, is_visible, sort_order, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Service not found.' });
    res.json({ service: rows[0] });
  } catch (e) { next(e); }
});

router.delete('/services/:id', async (req, res, next) => {
  try {
    await pool.query('DELETE FROM services WHERE id=$1', [req.params.id]);
    res.json({ message: 'Service deleted.' });
  } catch (e) { next(e); }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// VENTURES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

router.get('/ventures', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM ventures ORDER BY sort_order');
    res.json({ ventures: rows });
  } catch (e) { next(e); }
});

router.post('/ventures', async (req, res, next) => {
  try {
    const { name, tagline, description, category, is_visible, sort_order } = req.body;
    if (!name) return res.status(400).json({ error: 'Name required.' });
    const { rows } = await pool.query(
      'INSERT INTO ventures(name, tagline, description, category, is_visible, sort_order) VALUES($1,$2,$3,$4,$5,$6) RETURNING *',
      [name, tagline, description, category, is_visible ?? true, sort_order || 0]
    );
    res.status(201).json({ venture: rows[0] });
  } catch (e) { next(e); }
});

router.put('/ventures/:id', async (req, res, next) => {
  try {
    const { name, tagline, description, category, is_visible, sort_order } = req.body;
    const { rows } = await pool.query(
      `UPDATE ventures SET name=COALESCE($1,name), tagline=COALESCE($2,tagline),
       description=COALESCE($3,description), category=COALESCE($4,category),
       is_visible=COALESCE($5,is_visible), sort_order=COALESCE($6,sort_order) WHERE id=$7 RETURNING *`,
      [name, tagline, description, category, is_visible, sort_order, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Venture not found.' });
    res.json({ venture: rows[0] });
  } catch (e) { next(e); }
});

router.delete('/ventures/:id', async (req, res, next) => {
  try {
    await pool.query('DELETE FROM ventures WHERE id=$1', [req.params.id]);
    res.json({ message: 'Venture deleted.' });
  } catch (e) { next(e); }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PARTNERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

router.get('/partners', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM partners ORDER BY sort_order');
    res.json({ partners: rows });
  } catch (e) { next(e); }
});

router.post('/partners', async (req, res, next) => {
  try {
    const { name, logo_url, website, description, is_visible, sort_order } = req.body;
    if (!name) return res.status(400).json({ error: 'Name required.' });
    const { rows } = await pool.query(
      'INSERT INTO partners(name, logo_url, website, description, is_visible, sort_order) VALUES($1,$2,$3,$4,$5,$6) RETURNING *',
      [name, logo_url, website, description, is_visible ?? true, sort_order || 0]
    );
    res.status(201).json({ partner: rows[0] });
  } catch (e) { next(e); }
});

router.put('/partners/:id', async (req, res, next) => {
  try {
    const { name, logo_url, website, description, is_visible, sort_order } = req.body;
    const { rows } = await pool.query(
      `UPDATE partners SET name=COALESCE($1,name), logo_url=COALESCE($2,logo_url),
       website=COALESCE($3,website), description=COALESCE($4,description),
       is_visible=COALESCE($5,is_visible), sort_order=COALESCE($6,sort_order) WHERE id=$7 RETURNING *`,
      [name, logo_url, website, description, is_visible, sort_order, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Partner not found.' });
    res.json({ partner: rows[0] });
  } catch (e) { next(e); }
});

router.delete('/partners/:id', async (req, res, next) => {
  try {
    await pool.query('DELETE FROM partners WHERE id=$1', [req.params.id]);
    res.json({ message: 'Partner deleted.' });
  } catch (e) { next(e); }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TLD PRICES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

router.get('/tlds', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM tld_prices ORDER BY sort_order');
    res.json({ tlds: rows });
  } catch (e) { next(e); }
});

router.post('/tlds', async (req, res, next) => {
  try {
    const { ext, price_pkr, is_visible, sort_order } = req.body;
    if (!ext || !price_pkr) return res.status(400).json({ error: 'Extension and price required.' });
    const { rows } = await pool.query(
      'INSERT INTO tld_prices(ext, price_pkr, is_visible, sort_order) VALUES($1,$2,$3,$4) RETURNING *',
      [ext, price_pkr, is_visible ?? true, sort_order || 0]
    );
    res.status(201).json({ tld: rows[0] });
  } catch (e) { next(e); }
});

router.put('/tlds/:id', async (req, res, next) => {
  try {
    const { ext, price_pkr, is_visible, sort_order } = req.body;
    const { rows } = await pool.query(
      `UPDATE tld_prices SET ext=COALESCE($1,ext), price_pkr=COALESCE($2,price_pkr),
       is_visible=COALESCE($3,is_visible), sort_order=COALESCE($4,sort_order) WHERE id=$5 RETURNING *`,
      [ext, price_pkr, is_visible, sort_order, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'TLD not found.' });
    res.json({ tld: rows[0] });
  } catch (e) { next(e); }
});

router.delete('/tlds/:id', async (req, res, next) => {
  try {
    await pool.query('DELETE FROM tld_prices WHERE id=$1', [req.params.id]);
    res.json({ message: 'TLD deleted.' });
  } catch (e) { next(e); }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// NAV LINKS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

router.get('/nav', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM nav_links ORDER BY sort_order');
    res.json({ links: rows });
  } catch (e) { next(e); }
});

router.put('/nav/:id', async (req, res, next) => {
  try {
    const { label, href, position, is_visible, sort_order } = req.body;
    const { rows } = await pool.query(
      `UPDATE nav_links SET label=COALESCE($1,label), href=COALESCE($2,href),
       position=COALESCE($3,position), is_visible=COALESCE($4,is_visible),
       sort_order=COALESCE($5,sort_order) WHERE id=$6 RETURNING *`,
      [label, href, position, is_visible, sort_order, req.params.id]
    );
    res.json({ link: rows[0] });
  } catch (e) { next(e); }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FOOTER COLUMNS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

router.get('/footer', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM footer_columns ORDER BY sort_order');
    res.json({ columns: rows });
  } catch (e) { next(e); }
});

router.put('/footer/:id', async (req, res, next) => {
  try {
    const { title, links, sort_order } = req.body;
    const { rows } = await pool.query(
      `UPDATE footer_columns SET title=COALESCE($1,title), links=COALESCE($2,links),
       sort_order=COALESCE($3,sort_order) WHERE id=$4 RETURNING *`,
      [title, links ? JSON.stringify(links) : null, sort_order, req.params.id]
    );
    res.json({ column: rows[0] });
  } catch (e) { next(e); }
});

module.exports = router;
