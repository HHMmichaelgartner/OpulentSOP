# HHM Hotels - SOP Management Platform

A comprehensive Standard Operating Procedure management platform built for HHM Hotels (Hersha Hospitality Management). Features role-based access control, audit scoring, reporting dashboards, and SOP lifecycle management.

## Features

- **SOP Library** - Create, edit, search, filter, and manage SOPs by department, category, status, and priority
- **Role-Based Access (RBAC)** - 6 default roles with 9 configurable permissions (GM, Department Leader, Corporate Audit, Director of Operations, Quality Standards Mgr, Brand & Regional Leader)
- **User Management** - Admin-controlled user provisioning with role and department assignment
- **Audit System** - Conduct audits against approved SOPs or standalone templates with 1-5 scoring per item
- **Reporting** - Compliance by property, by department, trend over time charts, and auditor activity logs
- **SOP Generator** - Template-based SOP generation with structured sections
- **Export/Import** - Export SOPs as PDF or Word, import from Word documents
- **Mobile Responsive** - Full mobile support with adaptive navigation

## Quick Start

```bash
# Install dependencies
npm install

# Copy env template and add your Supabase credentials
cp .env.example .env

# Start development server
npm run dev

# Build for production
npm run build
```

## Supabase Setup (Required for multi-user)

1. Go to [supabase.com](https://supabase.com) and create a free project
2. Once your project is ready, go to **SQL Editor** and paste the contents of `supabase-schema.sql` — click **Run** to create all tables and seed data
3. Go to **Settings > API** and copy your **Project URL** and **anon public key**
4. Create a `.env` file in the project root:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
5. For Vercel/Netlify: add these same variables in your deployment's Environment Variables settings

**Without Supabase**, the app still works using browser-local IndexedDB — data persists per-browser but isn't shared between users/devices.

**With Supabase**, all users share the same database — SOPs, audits, users, and roles sync across everyone in real-time.

## Deploy to Vercel (Recommended - Free)

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click "New Project" and import your repo
4. Vercel auto-detects Vite - click "Deploy"
5. Your app is live in ~60 seconds

## Deploy to Netlify (Free)

1. Push this repo to GitHub
2. Go to [netlify.com](https://netlify.com) and sign in with GitHub
3. Click "New site from Git" and select your repo
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Click "Deploy"

## Deploy to GitHub Pages

1. Install gh-pages: `npm install -D gh-pages`
2. Add to `vite.config.js`: `base: '/your-repo-name/'`
3. Add to package.json scripts: `"deploy": "npm run build && gh-pages -d dist"`
4. Run: `npm run deploy`

## Default Login

The platform seeds a default admin account on first launch:
- **Name:** `Admin`
- **Role:** General Manager (full access)

Sign in as Admin, then go to Settings > Users to add your team members.

## Tech Stack

- React 18 (single-file component)
- Vite (build tool)
- IndexedDB (client-side persistence)
- No external UI libraries - all custom styled

## Data Storage

The app has a 3-tier storage strategy:
1. **Supabase** (primary) — If `VITE_SUPABASE_URL` is configured, all data syncs to Supabase PostgreSQL. Shared across all users and devices.
2. **IndexedDB** (fallback) — If Supabase is not configured, data persists in the browser's IndexedDB. Per-browser only.
3. **In-Memory** (last resort) — If IndexedDB is blocked (e.g. in some iframes), data lives in memory for the session only.

All writes go to both Supabase AND local IndexedDB simultaneously, so the app works offline and syncs when connectivity returns.

## Project Structure

```
hhm-sop-app/
  index.html              # Entry HTML
  package.json            # Dependencies
  vite.config.js          # Build config
  supabase-schema.sql     # Database schema (run in Supabase SQL Editor)
  .env.example            # Environment variables template
  src/
    main.jsx              # React mount
    App.jsx               # Full application component
    db.js                 # Supabase + IndexedDB storage layer
```

## License

Internal use - HHM Hotels
