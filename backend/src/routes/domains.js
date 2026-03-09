const router = require('express').Router();
const { pool } = require('../db');
const { authenticate, optionalAuth } = require('../middleware/middleware_v2');
const TLD_PRICING = { '.com':{pkr:3499,usd:12.99}, '.net':{pkr:3199,usd:11.99}, '.org':{pkr:2999,usd:10.99}, '.pk':{pkr:1099,usd:3.99}, '.com.pk':{pkr:999,usd:3.49}, '.net.pk':{pkr:999,usd:3.49}, '.io':{pkr:10999,usd:39.99}, '.co':{pkr:6899,usd:24.99}, '.info':{pkr:2499,usd:8.99}, '.biz':{pkr:2799,usd:9.99} };

router.get('/search', async (req, res, next) => {
  try {
    const { q, tld } = req.query;
    if (!q) return res.status(400).json({ error: 'Query required.' });
    const name = q.toLowerCase().trim().replace(/[^a-z0-9-]/g,'');
    const exts = tld ? [tld] : Object.keys(TLD_PRICING);
    const results = await Promise.all(exts.map(async ext => {
      const taken = await pool.query('SELECT id FROM domains WHERE full_domain=$1', [name+ext]);
      const price = TLD_PRICING[ext] || { pkr:3499, usd:12.99 };
      return { domain: name+ext, tld: ext, available: !taken.rows.length, price_pkr: price.pkr, price_usd: price.usd };
    }));
    res.json({ query: name, results: results.sort((a,b) => b.available-a.available) });
  } catch(e) { next(e); }
});

router.get('/tlds', (req, res) => res.json({ tlds: Object.entries(TLD_PRICING).map(([ext,p]) => ({ext,...p})) }));
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { rows } = await pool.query(`SELECT *, expires_at < NOW()+INTERVAL '30 days' AS expiring_soon FROM domains WHERE user_id=$1 ORDER BY created_at DESC`, [req.user.id]);
    res.json({ domains: rows });
  } catch(e) { next(e); }
});
router.post('/register', authenticate, async (req, res, next) => {
  try {
    const { domain_name, tld, years=1, auto_renew=true, whois_privacy=true } = req.body;
    if (!domain_name||!tld) return res.status(400).json({ error: 'Domain name and TLD required.' });
    const full = domain_name.toLowerCase()+tld;
    const taken = await pool.query('SELECT id FROM domains WHERE full_domain=$1', [full]);
    if (taken.rows.length) return res.status(409).json({ error: `${full} is already registered.` });
    const price = TLD_PRICING[tld];
    if (!price) return res.status(400).json({ error: 'Unsupported TLD.' });
    const exp = new Date(); exp.setFullYear(exp.getFullYear()+years);
    const { rows } = await pool.query(
      `INSERT INTO domains(user_id,domain_name,tld,status,expires_at,auto_renew,whois_privacy,price_pkr,renewal_pkr)
       VALUES($1,$2,$3,'pending',$4,$5,$6,$7,$8) RETURNING *`,
      [
        req.user.id,
        domain_name.toLowerCase(),
        tld,
        exp,
        auto_renew,
        whois_privacy,
        price.pkr * years,
        price.pkr,
      ]
    );
    res.status(201).json({ domain: rows[0] });
  } catch(e) { next(e); }
});
router.get('/:id', authenticate, async (req,res,next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM domains WHERE id=$1 AND user_id=$2',[req.params.id,req.user.id]);
    if (!rows.length) return res.status(404).json({ error: 'Domain not found.' });
    res.json({ domain: rows[0] });
  } catch(e) { next(e); }
});
router.patch('/:id', authenticate, async (req,res,next) => {
  try {
    const { auto_renew, whois_privacy, nameservers } = req.body;
    const updates=[]; const params=[]; let i=1;
    if (auto_renew!==undefined) { updates.push(`auto_renew=$${i++}`); params.push(auto_renew); }
    if (whois_privacy!==undefined) { updates.push(`whois_privacy=$${i++}`); params.push(whois_privacy); }
    if (nameservers) { updates.push(`nameservers=$${i++}`); params.push(nameservers); }
    if (!updates.length) return res.status(400).json({ error: 'Nothing to update.' });
    params.push(req.params.id, req.user.id);
    const { rows } = await pool.query(`UPDATE domains SET ${updates.join(',')} WHERE id=$${i} AND user_id=$${i+1} RETURNING *`, params);
    if (!rows.length) return res.status(404).json({ error: 'Domain not found.' });
    res.json({ domain: rows[0] });
  } catch(e) { next(e); }
});
router.post('/:id/renew', authenticate, async (req,res,next) => {
  try {
    const { years=1 } = req.body;
    const { rows } = await pool.query('SELECT * FROM domains WHERE id=$1 AND user_id=$2',[req.params.id,req.user.id]);
    if (!rows.length) return res.status(404).json({ error: 'Domain not found.' });
    const exp = new Date(rows[0].expires_at); exp.setFullYear(exp.getFullYear()+years);
    const { rows: updated } = await pool.query("UPDATE domains SET expires_at=$1,status='active' WHERE id=$2 RETURNING *",[exp,rows[0].id]);
    res.json({ domain: updated[0] });
  } catch(e) { next(e); }
});
module.exports = router;
