// ═══════════════════════════════════════════════════════════════
// PUBLIC CONTENT API — no auth required
// Serves all dynamic site data to the frontend
// ═══════════════════════════════════════════════════════════════
const router = require('express').Router();
const { pool } = require('../db');

let projectsReady = false;
async function ensureProjectsTable() {
  if (projectsReady) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS projects (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      project_id VARCHAR(50) UNIQUE NOT NULL,
      project_name VARCHAR(255) NOT NULL,
      project_start_date DATE,
      project_close_date DATE,
      project_status VARCHAR(30) NOT NULL DEFAULT 'active',
      project_url TEXT,
      is_published BOOLEAN DEFAULT true,
      is_archived BOOLEAN DEFAULT false,
      show_on_homepage BOOLEAN DEFAULT false,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      CONSTRAINT projects_status_check CHECK (project_status IN ('planning','active','on_hold','completed','cancelled'))
    )
  `);
  projectsReady = true;
}

// ── GET /api/content/settings — all site settings ──
router.get('/settings', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT key, value, category FROM site_settings ORDER BY key');
    const settings = {};
    for (const r of rows) {
      settings[r.key] = r.value;
    }
    res.json({ settings });
  } catch (e) { next(e); }
});

// ── GET /api/content/page/:page — all sections for a page ──
router.get('/page/:page', async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      'SELECT section_key, title, subtitle, content, data FROM page_sections WHERE page=$1 AND is_visible=true ORDER BY sort_order',
      [req.params.page]
    );
    const sections = {};
    for (const r of rows) {
      sections[r.section_key] = { title: r.title, subtitle: r.subtitle, content: r.content, data: r.data };
    }
    res.json({ sections });
  } catch (e) { next(e); }
});

// ── GET /api/content/services — visible services ──
router.get('/services', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT id, title, description, icon, href FROM services WHERE is_visible=true ORDER BY sort_order');
    res.json({ services: rows });
  } catch (e) { next(e); }
});

// ── GET /api/content/ventures — visible ventures ──
router.get('/ventures', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT id, name, tagline, description, category FROM ventures WHERE is_visible=true ORDER BY sort_order');
    res.json({ ventures: rows });
  } catch (e) { next(e); }
});

// ── GET /api/content/partners — visible partners ──
router.get('/partners', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT id, name, logo_url, website, description FROM partners WHERE is_visible=true ORDER BY sort_order');
    res.json({ partners: rows });
  } catch (e) { next(e); }
});

// ── GET /api/content/tlds — visible TLD prices ──
router.get('/tlds', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT id, ext, price_pkr FROM tld_prices WHERE is_visible=true ORDER BY sort_order');
    res.json({ tlds: rows });
  } catch (e) { next(e); }
});

// ── GET /api/content/nav — navigation links ──
router.get('/nav', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT id, label, href, position, parent_id, link_type, is_published, sort_order FROM nav_links WHERE is_visible=true AND COALESCE(is_published,true)=true ORDER BY sort_order');
    res.json({ links: rows });
  } catch (e) { next(e); }
});

// ── GET /api/content/footer — footer columns ──
router.get('/footer', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT id, title, links FROM footer_columns ORDER BY sort_order');
    res.json({ columns: rows });
  } catch (e) { next(e); }
});

// ── GET /api/content/hosting-plans — public hosting plans ──
router.get('/hosting-plans', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT id, name, slug, description, price_monthly_pkr, price_annual_pkr, disk_gb, bandwidth_gb, websites, email_accounts, databases, ssl_free, cdn_included, ddos_protection, daily_backups, support_level FROM hosting_plans WHERE is_active=true ORDER BY sort_order');
    res.json({ plans: rows });
  } catch (e) { next(e); }
});

// ── GET /api/content/courses — public published courses ──
router.get('/courses', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT id, title, slug, short_desc, level, category, thumbnail_url, price_pkr, duration_hours, total_modules, instructor_name, cert_included FROM courses WHERE is_published=true ORDER BY sort_order, created_at DESC');
    res.json({ courses: rows });
  } catch (e) { next(e); }
});

// ── GET /api/content/projects — public published projects ──
router.get('/projects', async (req, res, next) => {
  try {
    await ensureProjectsTable();
    const { homepage } = req.query;
    const params = [];
    let where = `is_published=true AND is_archived=false`;
    if (homepage === 'true') {
      where += ' AND show_on_homepage=true';
    }
    const { rows } = await pool.query(
      `SELECT id, project_id, project_name, project_start_date, project_close_date, project_status, project_url, show_on_homepage
       FROM projects WHERE ${where} ORDER BY created_at DESC`,
      params
    );
    res.json({ projects: rows });
  } catch (e) { next(e); }
});

// ── GET /api/content/verification/:projectId — project verification ──
router.get('/verification/:projectId', async (req, res, next) => {
  try {
    await ensureProjectsTable();
    const code = String(req.params.projectId || '').trim();
    if (!code) return res.status(400).json({ error: 'Project ID is required.' });
    const { rows } = await pool.query(
      `SELECT project_id, project_name, project_start_date, project_close_date, project_status, project_url
       FROM projects
       WHERE project_id=$1 AND is_published=true AND is_archived=false
       LIMIT 1`,
      [code]
    );
    if (!rows.length) return res.status(404).json({ error: 'Project not found or not published.' });
    res.json({ project: rows[0], verified: true });
  } catch (e) { next(e); }
});

module.exports = router;
