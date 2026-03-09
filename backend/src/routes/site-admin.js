// ═══════════════════════════════════════════════════════════════
// ADMIN CMS API — site settings + content management
// All routes require admin authentication
// ═══════════════════════════════════════════════════════════════
const router = require('express').Router();
const { pool } = require('../db');
const { authenticate, requireRole } = require('../middleware/middleware_v2');

router.use(authenticate, requireRole('admin'));

let cmsMetaReady = false;
async function ensureCmsMetaTables() {
  if (cmsMetaReady) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS site_pages (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      slug VARCHAR(80) UNIQUE NOT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
      show_in_homepage BOOLEAN DEFAULT false,
      sort_order INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  await pool.query(`ALTER TABLE nav_links ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES nav_links(id) ON DELETE CASCADE`);
  await pool.query(`ALTER TABLE nav_links ADD COLUMN IF NOT EXISTS link_type VARCHAR(20) NOT NULL DEFAULT 'main'`);
  await pool.query(`ALTER TABLE nav_links ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true`);
  await pool.query(`ALTER TABLE page_sections ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'draft'`);
  await pool.query(`ALTER TABLE page_sections ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT false`);
  await pool.query(`ALTER TABLE page_sections ADD COLUMN IF NOT EXISTS show_on_homepage BOOLEAN DEFAULT false`);
  await pool.query(`ALTER TABLE page_sections ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ`);
  cmsMetaReady = true;
}

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
    await ensureCmsMetaTables();
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
    await ensureCmsMetaTables();
    const { title, subtitle, content, data, is_visible, sort_order, status, is_archived, show_on_homepage } = req.body;
    const { rows } = await pool.query(
      `UPDATE page_sections SET title=COALESCE($1,title), subtitle=COALESCE($2,subtitle),
       content=COALESCE($3,content), data=COALESCE($4,data), is_visible=COALESCE($5,is_visible),
       sort_order=COALESCE($6,sort_order), status=COALESCE($7,status),
       is_archived=COALESCE($8,is_archived), show_on_homepage=COALESCE($9,show_on_homepage),
       published_at=CASE WHEN COALESCE($7,status)='published' THEN COALESCE(published_at,NOW()) ELSE published_at END,
       updated_by=$10 WHERE id=$11 RETURNING *`,
      [title, subtitle, content, data ? JSON.stringify(data) : null, is_visible, sort_order, status, is_archived, show_on_homepage, req.user.id, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Section not found.' });
    res.json({ section: rows[0] });
  } catch (e) { next(e); }
});

router.post('/sections', async (req, res, next) => {
  try {
    await ensureCmsMetaTables();
    const { page, section_key, title, subtitle, content, data, is_visible, sort_order, status, is_archived, show_on_homepage } = req.body;
    if (!page || !section_key) return res.status(400).json({ error: 'Page and section_key required.' });
    const { rows } = await pool.query(
      `INSERT INTO page_sections(page, section_key, title, subtitle, content, data, is_visible, sort_order, status, is_archived, show_on_homepage, updated_by)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
      [page, section_key, title, subtitle, content, data ? JSON.stringify(data) : '{}', is_visible ?? true, sort_order || 0, status || 'draft', is_archived ?? false, show_on_homepage ?? false, req.user.id]
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
    await ensureCmsMetaTables();
    const { rows } = await pool.query('SELECT * FROM nav_links ORDER BY sort_order');
    res.json({ links: rows });
  } catch (e) { next(e); }
});

router.post('/nav', async (req, res, next) => {
  try {
    await ensureCmsMetaTables();
    const { label, href, position='primary', parent_id=null, link_type='main', is_visible=true, is_published=true, sort_order=0 } = req.body;
    if (!label || !href) return res.status(400).json({ error: 'label and href are required.' });
    const { rows } = await pool.query(
      `INSERT INTO nav_links(label,href,position,parent_id,link_type,is_visible,is_published,sort_order)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [label, href, position, parent_id, link_type, is_visible, is_published, sort_order]
    );
    res.status(201).json({ link: rows[0] });
  } catch (e) { next(e); }
});

router.put('/nav/:id', async (req, res, next) => {
  try {
    await ensureCmsMetaTables();
    const { label, href, position, parent_id, link_type, is_visible, is_published, sort_order } = req.body;
    const { rows } = await pool.query(
      `UPDATE nav_links SET label=COALESCE($1,label), href=COALESCE($2,href),
       position=COALESCE($3,position), parent_id=COALESCE($4,parent_id), link_type=COALESCE($5,link_type),
       is_visible=COALESCE($6,is_visible), is_published=COALESCE($7,is_published),
       sort_order=COALESCE($8,sort_order) WHERE id=$9 RETURNING *`,
      [label, href, position, parent_id, link_type, is_visible, is_published, sort_order, req.params.id]
    );
    res.json({ link: rows[0] });
  } catch (e) { next(e); }
});

router.delete('/nav/:id', async (req, res, next) => {
  try {
    await ensureCmsMetaTables();
    await pool.query('DELETE FROM nav_links WHERE id=$1', [req.params.id]);
    res.json({ message: 'Nav link deleted.' });
  } catch (e) { next(e); }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PAGES (blank pages + publish/archive)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

router.get('/pages', async (req, res, next) => {
  try {
    await ensureCmsMetaTables();
    const { rows } = await pool.query('SELECT * FROM site_pages ORDER BY sort_order, created_at DESC');
    res.json({ pages: rows });
  } catch (e) { next(e); }
});

router.post('/pages', async (req, res, next) => {
  try {
    await ensureCmsMetaTables();
    const { slug, title, description, status='draft', show_in_homepage=false, sort_order=0 } = req.body;
    if (!slug || !title) return res.status(400).json({ error: 'slug and title are required.' });
    const { rows } = await pool.query(
      `INSERT INTO site_pages(slug,title,description,status,show_in_homepage,sort_order)
       VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,
      [String(slug).trim().toLowerCase(), title, description || null, status, show_in_homepage, sort_order]
    );
    res.status(201).json({ page: rows[0] });
  } catch (e) { next(e); }
});

router.patch('/pages/:id', async (req, res, next) => {
  try {
    await ensureCmsMetaTables();
    const { slug, title, description, status, show_in_homepage, sort_order } = req.body;
    const { rows } = await pool.query(
      `UPDATE site_pages SET slug=COALESCE($1,slug), title=COALESCE($2,title),
       description=COALESCE($3,description), status=COALESCE($4,status),
       show_in_homepage=COALESCE($5,show_in_homepage), sort_order=COALESCE($6,sort_order),
       updated_at=NOW() WHERE id=$7 RETURNING *`,
      [slug ? String(slug).trim().toLowerCase() : null, title, description, status, show_in_homepage, sort_order, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Page not found.' });
    res.json({ page: rows[0] });
  } catch (e) { next(e); }
});

router.delete('/pages/:id', async (req, res, next) => {
  try {
    await ensureCmsMetaTables();
    const { rows } = await pool.query('SELECT slug FROM site_pages WHERE id=$1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Page not found.' });
    const slug = rows[0].slug;
    await pool.query('DELETE FROM page_sections WHERE page=$1', [slug]);
    await pool.query('DELETE FROM site_pages WHERE id=$1', [req.params.id]);
    res.json({ message: 'Page and related sections deleted.' });
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
