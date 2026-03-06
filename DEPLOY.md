# TechPigeon — Complete Deployment Guide

## ─── STEP 1: Database (Neon.tech — FREE) ─────────────────────
1. Go to https://neon.tech → Create free account
2. Create new project: "techpigeon"
3. Copy the connection string (looks like: postgresql://user:pass@ep-xxx.neon.tech/techpigeon)
4. Run schema: Go to "SQL Editor" in Neon dashboard, paste contents of `database/schema.sql` and run
5. Seed admin: In SQL Editor run:
   ```sql
   INSERT INTO users(first_name,last_name,email,password_hash,role,is_verified,is_active)
   VALUES('Admin','TechPigeon','admin@techpigeon.org',
   '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQyCgntFxOJmNEqcGFRUZQWFm','admin',true,true);
   -- Password: Admin@TP2024!
   ```

## ─── STEP 2: Deploy Backend to Vercel ────────────────────────
1. Push this repo to GitHub
2. Go to https://vercel.com → New Project
3. Import your GitHub repo
4. Set Root Directory: `backend`
5. Add Environment Variables:
   ```
   DATABASE_URL=postgresql://...   (from Neon)
   JWT_SECRET=your_random_64_char_string
   JWT_EXPIRES_IN=7d
   FRONTEND_URL=https://your-frontend.vercel.app
   SMTP_HOST=smtp.resend.com
   SMTP_PORT=587
   SMTP_USER=resend
   SMTP_PASS=re_your_resend_api_key
   EMAIL_FROM=noreply@techpigeon.org
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   STRIPE_PUBLISHABLE_KEY=pk_live_...
   JAZZCASH_MERCHANT_ID=...
   JAZZCASH_PASSWORD=...
   JAZZCASH_INTEGRITY_SALT=...
   JAZZCASH_URL=https://payments.jazzcash.com.pk/ApplicationAPI/API/2.0/Purchase/DoMWalletTransaction
   EASYPAISA_STORE_ID=...
   EASYPAISA_HASH_KEY=...
   EASYPAISA_URL=https://easypay.easypaisa.com.pk/tpay/InitPaymentService
   ```
6. Deploy → Note your backend URL: https://techpigeon-backend.vercel.app

## ─── STEP 3: Deploy Frontend to Vercel ───────────────────────
1. Go to Vercel → New Project → Same GitHub repo
2. Set Root Directory: `frontend`
3. Add Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://techpigeon-backend.vercel.app/api
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   ```
4. Deploy → Your site: https://techpigeon.vercel.app

## ─── STEP 4: Custom Domain ───────────────────────────────────
1. In Vercel frontend project → Settings → Domains
2. Add: www.techpigeon.org
3. Update DNS at your registrar:
   - CNAME www → cname.vercel-dns.com
   - A @ → 76.76.19.61

## ─── PAYMENT GATEWAY SETUP ──────────────────────────────────

### JazzCash
1. Register at https://sandbox.jazzcash.com.pk
2. Get Merchant ID, Password, and Integrity Salt
3. Test with sandbox credentials first
4. Go live by contacting JazzCash business team

### EasyPaisa
1. Register merchant at https://developer.easypaisa.com.pk
2. Get Store ID and Hash Key
3. Test with sandbox

### Stripe (International Cards)
1. Create account at https://stripe.com
2. Get publishable & secret keys from dashboard
3. Set up webhook: Dashboard → Webhooks → Add endpoint
   URL: https://techpigeon-backend.vercel.app/api/payments/stripe/webhook
   Events: payment_intent.succeeded, payment_intent.payment_failed

## ─── ADMIN ACCESS ────────────────────────────────────────────
URL: https://www.techpigeon.org/login
Email: admin@techpigeon.org
Password: Admin@TP2024!
⚠️  Change password immediately after first login!

## ─── TECH STACK SUMMARY ─────────────────────────────────────
Frontend: Next.js 14 → Vercel (free hobby plan)
Backend:  Node.js + Express → Vercel Serverless
Database: PostgreSQL → Neon.tech (free 0.5GB)
Email:    Resend.com (free 3000 emails/month)
Payments: JazzCash + EasyPaisa + Stripe
Auth:     JWT (7 day expiry) + bcrypt (12 rounds)
