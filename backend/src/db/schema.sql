-- ═══════════════════════════════════════════════════════════════
-- TechPigeon (SMC-Private) — PostgreSQL Database Schema v2.0
-- ═══════════════════════════════════════════════════════════════
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- USERS
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name    VARCHAR(100) NOT NULL,
  last_name     VARCHAR(100) NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  phone         VARCHAR(20),
  password_hash TEXT NOT NULL,
  role          VARCHAR(20) DEFAULT 'client' CHECK (role IN ('client','admin','reseller','support')),
  avatar_url    TEXT,
  is_verified   BOOLEAN DEFAULT false,
  is_active     BOOLEAN DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- TOKENS (verify email, password reset, refresh)
CREATE TABLE tokens (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token      TEXT UNIQUE NOT NULL,
  type       VARCHAR(30) NOT NULL CHECK (type IN ('email_verify','password_reset','refresh')),
  expires_at TIMESTAMPTZ NOT NULL,
  used_at    TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- DOMAINS
CREATE TABLE domains (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID NOT NULL REFERENCES users(id),
  domain_name    VARCHAR(253) NOT NULL,
  tld            VARCHAR(20) NOT NULL,
  full_domain    VARCHAR(255) GENERATED ALWAYS AS (domain_name || tld) STORED,
  status         VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending','active','expired','transferred','cancelled','suspended')),
  registered_at  TIMESTAMPTZ DEFAULT NOW(),
  expires_at     TIMESTAMPTZ NOT NULL,
  auto_renew     BOOLEAN DEFAULT true,
  whois_privacy  BOOLEAN DEFAULT true,
  lock_status    BOOLEAN DEFAULT true,
  nameservers    JSONB DEFAULT '["ns1.techpigeon.org","ns2.techpigeon.org"]',
  dns_records    JSONB DEFAULT '[]',
  price_pkr      DECIMAL(10,2) NOT NULL,
  renewal_pkr    DECIMAL(10,2),
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_domains_user     ON domains(user_id);
CREATE INDEX idx_domains_full     ON domains(full_domain);
CREATE INDEX idx_domains_expires  ON domains(expires_at);
CREATE INDEX idx_domains_status   ON domains(status);

-- HOSTING PLANS
CREATE TABLE hosting_plans (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name             VARCHAR(100) NOT NULL,
  slug             VARCHAR(50) UNIQUE NOT NULL,
  description      TEXT,
  price_monthly_pkr DECIMAL(10,2) NOT NULL,
  price_annual_pkr  DECIMAL(10,2) NOT NULL,
  disk_gb          INTEGER NOT NULL,
  bandwidth_gb     INTEGER,
  websites         INTEGER,
  email_accounts   INTEGER,
  databases        INTEGER,
  ssl_free         BOOLEAN DEFAULT true,
  cdn_included     BOOLEAN DEFAULT false,
  ddos_protection  BOOLEAN DEFAULT false,
  dedicated_ip     BOOLEAN DEFAULT false,
  daily_backups    BOOLEAN DEFAULT true,
  support_level    VARCHAR(30) DEFAULT 'standard',
  is_active        BOOLEAN DEFAULT true,
  sort_order       INTEGER DEFAULT 0,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- HOSTING SUBSCRIPTIONS
CREATE TABLE hosting_subscriptions (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               UUID NOT NULL REFERENCES users(id),
  plan_id               UUID NOT NULL REFERENCES hosting_plans(id),
  status                VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending','active','suspended','cancelled','expired')),
  billing_cycle         VARCHAR(10) DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly','annual')),
  domain_id             UUID REFERENCES domains(id),
  server_ip             VARCHAR(45),
  cpanel_username       VARCHAR(50),
  cpanel_password_enc   TEXT,
  started_at            TIMESTAMPTZ DEFAULT NOW(),
  current_period_start  TIMESTAMPTZ DEFAULT NOW(),
  current_period_end    TIMESTAMPTZ NOT NULL,
  auto_renew            BOOLEAN DEFAULT true,
  disk_used_gb          DECIMAL(10,2) DEFAULT 0,
  bandwidth_used_gb     DECIMAL(10,2) DEFAULT 0,
  uptime_percent        DECIMAL(5,2) DEFAULT 100,
  notes                 TEXT,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_hosting_user    ON hosting_subscriptions(user_id);
CREATE INDEX idx_hosting_expires ON hosting_subscriptions(current_period_end);
CREATE INDEX idx_hosting_status  ON hosting_subscriptions(status);

-- COURSES
CREATE TABLE courses (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title            VARCHAR(255) NOT NULL,
  slug             VARCHAR(255) UNIQUE NOT NULL,
  description      TEXT,
  short_desc       VARCHAR(500),
  level            VARCHAR(20) CHECK (level IN ('beginner','intermediate','advanced')),
  category         VARCHAR(50),
  thumbnail_url    TEXT,
  price_pkr        DECIMAL(10,2) NOT NULL,
  duration_hours   DECIMAL(5,1),
  total_modules    INTEGER DEFAULT 0,
  total_lessons    INTEGER DEFAULT 0,
  instructor_name  VARCHAR(100),
  cert_included    BOOLEAN DEFAULT true,
  is_published     BOOLEAN DEFAULT false,
  tags             TEXT[],
  sort_order       INTEGER DEFAULT 0,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- COURSE MODULES
CREATE TABLE course_modules (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id  UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title      VARCHAR(255) NOT NULL,
  sort_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- COURSE LESSONS
CREATE TABLE course_lessons (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id     UUID NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
  course_id     UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title         VARCHAR(255) NOT NULL,
  content_type  VARCHAR(20) CHECK (content_type IN ('video','text','quiz','lab')),
  video_url     TEXT,
  duration_min  INTEGER,
  sort_order    INTEGER NOT NULL,
  is_free       BOOLEAN DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ENROLLMENTS
CREATE TABLE enrollments (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID NOT NULL REFERENCES users(id),
  course_id      UUID NOT NULL REFERENCES courses(id),
  status         VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active','completed','dropped')),
  progress_pct   INTEGER DEFAULT 0 CHECK (progress_pct BETWEEN 0 AND 100),
  enrolled_at    TIMESTAMPTZ DEFAULT NOW(),
  completed_at   TIMESTAMPTZ,
  cert_issued_at TIMESTAMPTZ,
  cert_url       TEXT,
  UNIQUE(user_id, course_id)
);

-- LESSON PROGRESS
CREATE TABLE lesson_progress (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES users(id),
  lesson_id    UUID NOT NULL REFERENCES course_lessons(id),
  completed    BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, lesson_id)
);

-- ORDERS
CREATE TABLE orders (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID NOT NULL REFERENCES users(id),
  order_number   VARCHAR(30) UNIQUE NOT NULL,
  status         VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','paid','failed','refunded','cancelled')),
  subtotal_pkr   DECIMAL(12,2) NOT NULL,
  tax_pkr        DECIMAL(12,2) DEFAULT 0,
  discount_pkr   DECIMAL(12,2) DEFAULT 0,
  total_pkr      DECIMAL(12,2) NOT NULL,
  notes          TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  paid_at        TIMESTAMPTZ,
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ORDER ITEMS
CREATE TABLE order_items (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id     UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  item_type    VARCHAR(20) NOT NULL CHECK (item_type IN ('domain','hosting','course','ssl','email','renewal')),
  item_id      UUID,
  description  VARCHAR(500) NOT NULL,
  quantity     INTEGER DEFAULT 1,
  unit_price   DECIMAL(10,2) NOT NULL,
  total_price  DECIMAL(10,2) NOT NULL,
  meta         JSONB DEFAULT '{}'
);

-- PAYMENTS
CREATE TABLE payments (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id          UUID NOT NULL REFERENCES orders(id),
  user_id           UUID NOT NULL REFERENCES users(id),
  method            VARCHAR(30) CHECK (method IN ('jazzcash','easypaisa','bank_transfer','stripe','sadapay','card')),
  amount_pkr        DECIMAL(12,2) NOT NULL,
  status            VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','completed','failed','refunded','partially_refunded')),
  transaction_id    VARCHAR(255),
  gateway_ref       VARCHAR(255),
  gateway_response  JSONB DEFAULT '{}',
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at      TIMESTAMPTZ
);
CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_payments_user  ON payments(user_id);

-- SUPPORT TICKETS
CREATE TABLE tickets (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES users(id),
  assigned_to UUID REFERENCES users(id),
  subject     VARCHAR(255) NOT NULL,
  department  VARCHAR(50) CHECK (department IN ('domains','hosting','billing','training','general','technical')),
  priority    VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low','medium','high','urgent')),
  status      VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open','in_progress','waiting','resolved','closed')),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

CREATE TABLE ticket_messages (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id  UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  sender_id  UUID NOT NULL REFERENCES users(id),
  message    TEXT NOT NULL,
  is_staff   BOOLEAN DEFAULT false,
  attachments JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- NOTIFICATIONS
CREATE TABLE notifications (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type       VARCHAR(50) NOT NULL,
  title      VARCHAR(255) NOT NULL,
  message    TEXT,
  link       TEXT,
  read_at    TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_notifications_user   ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, read_at) WHERE read_at IS NULL;

-- ACTIVITY LOG (admin audit trail)
CREATE TABLE activity_log (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID REFERENCES users(id),
  action     VARCHAR(100) NOT NULL,
  entity     VARCHAR(50),
  entity_id  UUID,
  details    JSONB DEFAULT '{}',
  ip_address VARCHAR(45),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AUTO-UPDATE TRIGGERS
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated    BEFORE UPDATE ON users                 FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_domains_updated  BEFORE UPDATE ON domains               FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_hosting_updated  BEFORE UPDATE ON hosting_subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_orders_updated   BEFORE UPDATE ON orders                FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_tickets_updated  BEFORE UPDATE ON tickets               FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─────────────────────────────────────────────────────────────
-- SEED DATA
-- ─────────────────────────────────────────────────────────────

-- Admin user (password: Admin@TechPigeon2024)
-- bcrypt hash of "Admin@TechPigeon2024"
INSERT INTO users (first_name, last_name, email, phone, password_hash, role, is_verified, is_active) VALUES
('Admin', 'TechPigeon', 'admin@techpigeon.org', '+92-300-0000000',
 '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMqJqhCanMFi1SrqmQFDV1pFAa',
 'admin', true, true);

-- Hosting Plans (PKR pricing)
INSERT INTO hosting_plans (name, slug, description, price_monthly_pkr, price_annual_pkr, disk_gb, bandwidth_gb, websites, email_accounts, databases, ssl_free, cdn_included, ddos_protection, daily_backups, support_level, sort_order) VALUES
('Starter',  'starter',  'Perfect for personal websites and blogs.',        1399,  10490, 10,  100,  1, 5,  2,  true, false, false, true, 'standard',  1),
('Pro',       'pro',      'Ideal for growing businesses and professionals.', 3599,  26990, 50,  NULL, 5, 25, 10, true, true,  false, true, 'priority',  2),
('Business', 'business', 'For agencies and high-traffic applications.',     8399,  62990, 200, NULL, NULL, NULL, NULL, true, true, true, true, 'premium', 3);

-- Courses
INSERT INTO courses (title, slug, short_desc, level, category, price_pkr, duration_hours, total_modules, instructor_name, cert_included, is_published) VALUES
('AWS Cloud Practitioner Essentials', 'aws-cloud-practitioner', 'Master AWS fundamentals for the CLF-C02 exam.', 'beginner', 'Cloud', 8999, 18, 12, 'Muhammad Ali Khan', true, true),
('CompTIA Security+ Full Prep', 'comptia-security-plus', 'Full cybersecurity prep covering threats and risk management.', 'intermediate', 'Security', 12999, 32, 20, 'Sara Ahmed', true, true),
('CCNA Cisco Networking Bootcamp', 'ccna-networking', 'Routing, switching and protocols for CCNA 200-301.', 'intermediate', 'Networking', 14999, 40, 24, 'Usman Tariq', true, true),
('Linux System Administration', 'linux-sysadmin', 'Command line, servers, and user management from scratch.', 'beginner', 'Linux', 8999, 22, 15, 'Muhammad Ali Khan', true, true),
('Docker & Kubernetes Mastery', 'docker-kubernetes', 'Container orchestration for production environments.', 'advanced', 'DevOps', 11999, 28, 18, 'Sara Ahmed', true, true),
('Ethical Hacking & Penetration Testing', 'ethical-hacking', 'Offensive security tools and methodologies for pentesters.', 'intermediate', 'Security', 15999, 36, 22, 'Usman Tariq', true, true);
