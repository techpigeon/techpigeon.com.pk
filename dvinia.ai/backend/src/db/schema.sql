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

-- ═══════════════════════════════════════════════════════════════
-- CMS TABLES — Site Settings + Dynamic Content
-- ═══════════════════════════════════════════════════════════════

-- SITE SETTINGS (key-value store for all website configuration)
CREATE TABLE site_settings (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key        VARCHAR(100) UNIQUE NOT NULL,
  value      JSONB NOT NULL DEFAULT '{}',
  category   VARCHAR(50) NOT NULL DEFAULT 'general',
  updated_by UUID REFERENCES users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_settings_key ON site_settings(key);
CREATE INDEX idx_settings_cat ON site_settings(category);

-- PAGE SECTIONS (editable content blocks for any page)
CREATE TABLE page_sections (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page        VARCHAR(50) NOT NULL,
  section_key VARCHAR(100) NOT NULL,
  title       TEXT,
  subtitle    TEXT,
  content     TEXT,
  data        JSONB DEFAULT '{}',
  is_visible  BOOLEAN DEFAULT true,
  sort_order  INTEGER DEFAULT 0,
  updated_by  UUID REFERENCES users(id),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(page, section_key)
);
CREATE INDEX idx_sections_page ON page_sections(page);

-- SERVICES (homepage services section)
CREATE TABLE services (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  icon        VARCHAR(100),
  href        VARCHAR(255) DEFAULT '#',
  is_visible  BOOLEAN DEFAULT true,
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- VENTURES
CREATE TABLE ventures (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        VARCHAR(255) NOT NULL,
  tagline     VARCHAR(255),
  description TEXT,
  category    VARCHAR(100),
  is_visible  BOOLEAN DEFAULT true,
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- PARTNERS / TESTIMONIALS
CREATE TABLE partners (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        VARCHAR(255) NOT NULL,
  logo_url    TEXT,
  website     VARCHAR(255),
  description TEXT,
  is_visible  BOOLEAN DEFAULT true,
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- TLD PRICES
CREATE TABLE tld_prices (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ext         VARCHAR(20) UNIQUE NOT NULL,
  price_pkr   DECIMAL(10,2) NOT NULL,
  is_visible  BOOLEAN DEFAULT true,
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- NAV LINKS (editable navigation)
CREATE TABLE nav_links (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  label       VARCHAR(100) NOT NULL,
  href        VARCHAR(255) NOT NULL,
  position    VARCHAR(20) DEFAULT 'primary' CHECK (position IN ('primary','secondary')),
  is_visible  BOOLEAN DEFAULT true,
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- FOOTER COLUMNS
CREATE TABLE footer_columns (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       VARCHAR(100) NOT NULL,
  links       JSONB DEFAULT '[]',
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER trg_sections_updated BEFORE UPDATE ON page_sections FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_services_updated BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_ventures_updated BEFORE UPDATE ON ventures FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_partners_updated BEFORE UPDATE ON partners FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─────────────────────────────────────────────────────────────
-- SEED DATA
-- ─────────────────────────────────────────────────────────────

-- Admin user (password: Admin@TechPigeon2024)
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

-- Site Settings
INSERT INTO site_settings (key, value, category) VALUES
('site_name', '"TechPigeon"', 'general'),
('site_full_name', '"TECHPIGEON (SMC-PRIVATE) LIMITED"', 'general'),
('site_tagline', '"We arrange High Tech / AI Boot camps and AI Classes Nationwide."', 'general'),
('site_description', '"Techpigeon offering Education Consulting & Custom Cloud Software development services. We offer services based on AI, Cloud Computing, Cloud App development for all major platforms (iOS, Android) & we run AI Bootcamps campaigns that allows learning and up-to-date hands-on experience on latest frameworks."', 'general'),
('site_address', '"St 49, G-7/4, Islamabad, 44000, Pakistan"', 'general'),
('site_phone', '"+1 (786) 8226386"', 'general'),
('site_email', '"info@techpigeon.org"', 'general'),
('site_copyright', '"© 2024 Techpigeon SMC Private Limited. All rights reserved."', 'general'),
('site_legal', '"© 2024 Techpigeon. All rights reserved. Various trademarks held their respective owners."', 'general'),
('logo_url', '"https://assets.softr-files.com/applications/13a6d5f4-cfee-4521-bc3c-908b851667e1/assets/44874b8d-0bdf-4b3e-b1f1-f8c31561487d.png"', 'branding'),
('favicon_url', '"https://assets.softr-files.com/applications/13a6d5f4-cfee-4521-bc3c-908b851667e1/assets/2787cbdc-4a2c-473c-8259-40364e7cf45a.png"', 'branding'),
('primary_color', '"#5cc4eb"', 'branding'),
('secondary_color', '"#bba442"', 'branding'),
('navy_color', '"#0B1D3A"', 'branding'),
('text_color', '"#1d1d1d"', 'branding'),
('heading_font', '"Aleo"', 'branding'),
('body_font', '"Open Sans"', 'branding'),
('social_facebook', '"https://facebook.com/techpigeon"', 'social'),
('social_linkedin', '"https://linkedin.com/company/techpigeon"', 'social'),
('social_twitter', '"https://twitter.com/techpigeon.pk"', 'social'),
('meta_title', '"TechPigeon - AI Boot Camps, Cloud Hosting & IT Training"', 'seo'),
('meta_description', '"Pakistan''s leading platform for AI Boot Camps, Cloud Hosting, Domain Registration, and IT Training."', 'seo'),
('meta_keywords', '"techpigeon, AI bootcamp, cloud hosting, domain registration, IT training, Pakistan"', 'seo'),
('custom_head_code', '""', 'code'),
('custom_body_code', '""', 'code'),
('google_analytics_id', '""', 'code'),
('google_tag_manager_id', '""', 'code'),
('facebook_pixel_id', '""', 'code');

-- Services
INSERT INTO services (title, description, icon, href, sort_order) VALUES
('Boot Camps & Trainings', 'High Tech Boot Camps for AI Classes, Capacity Building Trainings for Educational Institutions, Tech firms Nationwide.', 'fas fa-shapes', '/training', 1),
('Cloud Apps Development', 'Follow what is important to you in your company, projects, issue types or find important information in an easily searchable cloud apps.', 'fas fa-compress-arrows-alt', '#', 2),
('Mobile Friendly Dashboards UX', 'Stay connected with your team through iOS and Android apps, integrations and extensions for desktop.', 'fas fa-crop-alt', '#', 3),
('Domain Registration', '500+ TLD extensions with free WHOIS privacy and DNS manager included.', 'fas fa-external-link-square-alt', '/domains', 4),
('Cloud Hosting', 'NVMe SSD servers with free SSL, CDN, and 24/7 monitoring for your business.', 'fas fa-shield-alt', '/hosting', 5),
('Website Design & Development', 'Custom websites and web applications designed to grow your business online.', 'fas fa-code', '#', 6);

-- Ventures
INSERT INTO ventures (name, tagline, description, category, sort_order) VALUES
('Kashmir CareU OnGo (KCUOG)', 'All One Stop Healthcare Solution', 'New smart tech venture by Techpigeon — an all-in-one healthcare solution that helps care seekers access free advice from doctors and get appointments via mobile applications.', 'Healthcare', 1),
('Techpigeon Startup Network', 'See how with Connect', 'Techpigeon Startup Network brings Startups and Domain Experts on one Platform.', 'Startups', 2);

-- Partners
INSERT INTO partners (name, sort_order) VALUES
('The University of AJK', 1),
('DSA AJKU', 2),
('Start Invest LLC', 3);

-- TLD Prices
INSERT INTO tld_prices (ext, price_pkr, sort_order) VALUES
('.com', 3499, 1), ('.net', 3199, 2), ('.org', 3299, 3), ('.pk', 2499, 4),
('.com.pk', 1999, 5), ('.net.pk', 1999, 6), ('.org.pk', 1999, 7), ('.info', 2999, 8),
('.io', 8999, 9), ('.co', 5499, 10), ('.dev', 4299, 11), ('.app', 4299, 12),
('.tech', 2799, 13), ('.online', 1499, 14), ('.store', 1799, 15), ('.site', 1299, 16),
('.xyz', 999, 17), ('.cloud', 3599, 18), ('.ai', 14999, 19), ('.me', 3799, 20);

-- Page Sections
INSERT INTO page_sections (page, section_key, title, subtitle, content, data) VALUES
('home', 'hero', 'We arrange High Tech / AI Boot camps and AI Classes Nationwide.', 'AI Boot Camps, Tech Seminars, Capacity Building Trainings, High End Cloud Courses.', NULL, '{"stats": [{"value":"AI","label":"Boot Camps"},{"value":"Cloud","label":"App Development"},{"value":"99.9%","label":"Uptime SLA"}], "cta_primary": {"text":"Courses Registration","href":"/training"}, "cta_secondary": {"text":"Register your Startup","href":"/auth/register"}}'),
('home', 'services', 'Everything Your Business Needs', 'From AI boot camps to cloud hosting and custom software development — we have you covered.', NULL, '{"badge": "What We Offer"}'),
('home', 'ventures', 'Innovation-Driven Platforms', 'Building products that solve real problems in healthcare, startups, and education.', NULL, '{"badge": "Our Ventures"}'),
('home', 'testimonials', 'Trusted by the Clients', 'Teams of every size, shape and kind have already trust the techpigeon Pk where their work happens.', NULL, '{"badge": "Testimonials"}'),
('home', 'cta', 'Join the AI Revolution with TechPigeon', 'Register for our AI Boot Camps, enroll in cloud courses, or launch your startup on the Techpigeon Startup Network.', NULL, '{"badge": "Get Started Today", "cta_primary": {"text":"Courses Registration","href":"/training"}, "cta_secondary": {"text":"Get Started","href":"/auth/register"}}'),
('about', 'hero', 'About Techpigeon', NULL, NULL, '{}'),
('about', 'mission', 'What We Do', 'We empower businesses, students, and startups through three core pillars — each built on modern cloud-first technology and driven by real-world impact.', NULL, '{"pillars": [{"title":"Education Consulting","desc":"Strategic guidance for institutions and students navigating the evolving landscape of technology education, career readiness, and global academic opportunities."},{"title":"Custom Cloud Software","desc":"End-to-end cloud application development for iOS, Android, and web — powered by AI, scalable infrastructure, and modern DevOps practices across all major platforms."},{"title":"AI Bootcamps","desc":"Hands-on campaigns that deliver up-to-date experience on the latest AI and machine learning frameworks — turning participants into job-ready practitioners."}]}'),
('about', 'cta', 'Ready to Build Something Great?', 'Whether you need cloud software, education consulting, or want to join our AI Bootcamp — we are here to help you succeed.', NULL, '{}'),
('contact', 'hero', 'Contact Us', 'Send us a message', NULL, '{}'),
('domains', 'hero', 'Find Your Perfect Domain', 'Search from 500+ TLD extensions. Free WHOIS privacy, DNS management, and email forwarding included.', NULL, '{"badge": "Domain Registration"}'),
('hosting', 'hero', 'Hosting That Scales With You', 'Blazing-fast NVMe cloud servers in Lahore & Karachi. Free SSL, daily backups, and 24/7 local support — all at prices built for Pakistan.', NULL, '{"badge": "Cloud Hosting Pakistan"}'),
('training', 'hero', 'Learn From Industry Experts', 'Hands-on courses in cloud computing, cybersecurity, networking, Linux, and DevOps — taught by certified professionals in Pakistan.', NULL, '{"badge": "IT Training & Certification"}');

-- Nav Links
INSERT INTO nav_links (label, href, position, sort_order) VALUES
('Home', '/', 'primary', 1),
('Solutions', '/#services', 'primary', 2),
('Domains', '/domains', 'primary', 3),
('Cloud Hosting', '/hosting', 'primary', 4),
('Training', '/training', 'primary', 5),
('About', '/about', 'secondary', 6),
('Contact', '/contact', 'secondary', 7);

-- Footer Columns
INSERT INTO footer_columns (title, links, sort_order) VALUES
('PRODUCT', '[["Features","#"],["Enterprise","#"],["Security","#"],["Trust","#"]]', 1),
('SERVICES', '[["Cloud Hosting","/hosting"],["Domain Registration","/domains"],["IT Training","/training"],["Cloud Apps","#"],["Web Development","#"]]', 2),
('RESOURCES', '[["Library","#"],["Tips","#"],["Events","#"],["Help Center","#"]]', 3),
('COMPANY', '[["Team","/about"],["News","/blog"],["Contact","/contact"],["C-CAP (AJK)","#"]]', 4);
