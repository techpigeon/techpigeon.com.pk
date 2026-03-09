require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.NODE_ENV==='production'?{rejectUnauthorized:false}:false });

async function seed() {
  const hash = await bcrypt.hash('Admin@TP2024!', 12);
  await pool.query(
    `INSERT INTO users (first_name, last_name, email, password_hash, role, is_verified, is_active)
     VALUES ('Admin','TechPigeon','admin@techpigeon.org',$1,'admin',true,true)
     ON CONFLICT (email) DO UPDATE SET password_hash=$1, role='admin', is_verified=true, is_active=true`,
    [hash]
  );
  console.log('Admin seeded: admin@techpigeon.org / Admin@TP2024!');
  await pool.end();
}
seed().catch(console.error);
