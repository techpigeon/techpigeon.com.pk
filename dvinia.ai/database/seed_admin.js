const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
require('dotenv').config({ path: '../backend/.env' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

async function seedAdmin() {
  try {
    const hash = await bcrypt.hash('Admin@TP2024!', 12);
    await pool.query(
      `INSERT INTO users (first_name, last_name, email, password_hash, role, is_verified, is_active)
       VALUES ('TechPigeon', 'Admin', 'admin@techpigeon.org', $1, 'admin', true, true)
       ON CONFLICT (email) DO UPDATE SET password_hash=$1, role='admin', is_verified=true, is_active=true`,
      [hash]);
    console.log('✅ Admin user seeded!');
    console.log('   Email:    admin@techpigeon.org');
    console.log('   Password: Admin@TP2024!');
    console.log('   ⚠️  Change this password immediately after first login!');
  } catch (e) { console.error('❌ Seed error:', e.message); }
  finally { await pool.end(); }
}
seedAdmin();
