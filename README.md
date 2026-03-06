# TechPigeon — Full Stack Web App

Domain registration, cloud hosting, and IT training platform for Pakistan.

## Stack
- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS → Vercel
- **Backend**: Node.js + Express → Vercel Serverless Functions
- **Database**: PostgreSQL (Neon.tech — free tier)
- **Auth**: JWT + bcrypt
- **Payments**: JazzCash + EasyPaisa + Stripe

## Quick Start

```bash
# Clone
git clone https://github.com/YOUR_USERNAME/techpigeon.git
cd techpigeon

# Backend
cd backend && cp .env.example .env
npm install && npm run dev

# Frontend (new terminal)
cd frontend && cp .env.example .env.local
npm install && npm run dev
```

## Deploy to Vercel
1. Push to GitHub
2. Import repo on vercel.com
3. Set root to `frontend/` for frontend deployment
4. Set root to `backend/` for backend deployment (separate project)
5. Add all env variables from `.env.example` files

## Admin Access
After running DB migrations, seed an admin user:
```bash
cd backend && npm run seed:admin
```
Default admin: `admin@techpigeon.org` / `Admin@TP2024!`
