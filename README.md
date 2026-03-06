# TechPigeon — Full Stack Web Platform

Pakistan's most trusted digital partner — domain registration, cloud hosting, and IT training.

## 🏗️ Project Structure

```
techpigeon_pk/
├── backend/              ← Express.js API (Node.js)
│   ├── src/
│   │   ├── config/       ← db.js, mailer.js
│   │   ├── middleware/   ← auth.js (JWT + role guards)
│   │   ├── routes/       ← auth, domains, hosting, courses, orders, payments, tickets, dashboard, admin, users
│   │   └── server.js
│   ├── package.json
│   └── .env.example
├── frontend/             ← Next.js 14 App Router
│   ├── src/
│   │   ├── app/          ← Pages (/, /domains, /hosting, /training, /auth/*, /dashboard/*, /admin/*)
│   │   ├── components/
│   │   │   ├── ui/       ← Logo, Button, Input, Badge, Alert, Modal, StatCard, Table, Select
│   │   │   ├── layout/   ← Navbar, Footer, DashboardLayout, AdminLayout
│   │   │   └── payment/  ← PaymentModal (JazzCash/EasyPaisa/Stripe/Bank/SadaPay)
│   │   └── lib/          ← api.ts (typed API client), data.ts (constants)
│   ├── package.json
│   └── .env.local.example
└── database/
    ├── schema.sql
    └── seed_admin.js
```

## 🚀 Quick Start

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env       # fill in your values
npm run dev                # runs on http://localhost:5000
```

### 2. Frontend
```bash
cd frontend
npm install
cp .env.local.example .env.local
# set NEXT_PUBLIC_API_URL=http://localhost:5000/api
npm run dev                # runs on http://localhost:3000
```

### 3. Database (Neon.tech)
1. Create a free project at https://neon.tech
2. Run `backend/src/db/schema.sql` in the SQL editor
3. Run `node database/seed_admin.js`

## 🔑 Demo Credentials
- Client: any email + `demo1234`
- Admin:  any email containing "admin" + `demo1234`
- Admin (real): `admin@techpigeon.org` / `Admin@TP2024!`

## 💳 Payment Methods
JazzCash · EasyPaisa · Stripe · Bank Transfer · SadaPay

## 🌐 Tech Stack
- Frontend: Next.js 14 + Tailwind CSS → Vercel
- Backend:  Node.js + Express → Vercel Serverless
- Database: PostgreSQL → Neon.tech
- Email:    Nodemailer + Resend.com
