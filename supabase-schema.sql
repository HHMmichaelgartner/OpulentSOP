-- ============================================
-- HHM Hotels SOP Platform - Supabase Schema
-- Run this in your Supabase SQL Editor
-- ============================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  email TEXT DEFAULT '',
  role_id TEXT NOT NULL DEFAULT 'dept',
  department TEXT DEFAULT '',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

-- Roles table
CREATE TABLE IF NOT EXISTS roles (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  icon TEXT DEFAULT 'user',
  color TEXT DEFAULT '#6B7280',
  description TEXT DEFAULT '',
  permissions TEXT[] DEFAULT '{}',
  sort_order INTEGER DEFAULT 0
);

-- SOPs table
CREATE TABLE IF NOT EXISTS sops (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  department TEXT DEFAULT '',
  category TEXT DEFAULT 'standards',
  content TEXT DEFAULT '',
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'draft',
  tags TEXT[] DEFAULT '{}',
  roles TEXT[] DEFAULT '{}',
  property TEXT DEFAULT '',
  region TEXT DEFAULT '',
  version TEXT DEFAULT '1.0',
  created_by TEXT DEFAULT '',
  updated_by TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit templates
CREATE TABLE IF NOT EXISTS audit_templates (
  id TEXT PRIMARY KEY,
  template_name TEXT NOT NULL,
  department TEXT DEFAULT '',
  items JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Completed audits
CREATE TABLE IF NOT EXISTS audits (
  id TEXT PRIMARY KEY,
  type TEXT DEFAULT 'sop',
  sop_id TEXT DEFAULT '',
  sop_title TEXT DEFAULT '',
  template_id TEXT DEFAULT '',
  title TEXT DEFAULT '',
  property TEXT DEFAULT '',
  department TEXT DEFAULT '',
  auditor TEXT DEFAULT '',
  date DATE DEFAULT CURRENT_DATE,
  items JSONB DEFAULT '[]',
  notes TEXT DEFAULT '',
  score NUMERIC(3,2) DEFAULT 0,
  status TEXT DEFAULT 'completed',
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default roles
INSERT INTO roles (id, label, icon, color, description, permissions, sort_order) VALUES
  ('gm', 'General Manager', 'crown', '#002855', 'Living playbook and control center', ARRAY['create','edit','delete','audit','approve','assign','admin'], 1),
  ('dept', 'Department Leader', 'hotel', '#0E7C47', 'Visual standards and team checklists', ARRAY['create','edit','audit'], 2),
  ('corporate', 'Corporate Audit', 'clipboard', '#0072CE', 'Unified auditing framework', ARRAY['audit','report'], 3),
  ('doo', 'Director of Operations', 'globe', '#6D28D9', 'Portfolio-wide operating model', ARRAY['create','edit','delete','approve','audit','report','admin'], 4),
  ('quality', 'Quality Standards Mgr', 'check', '#0E7490', 'Version control and localization', ARRAY['create','edit','approve','version'], 5),
  ('brand', 'Brand & Regional Leader', 'building', '#B91C1C', 'Global standards and compliance', ARRAY['create','edit','approve','report','audit'], 6)
ON CONFLICT (id) DO NOTHING;

-- Seed default admin user
INSERT INTO users (id, name, role_id, active) VALUES
  ('admin001', 'Admin', 'gm', true)
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security (optional - for production)
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE sops ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE audit_templates ENABLE ROW LEVEL SECURITY;

-- Allow anonymous access for now (the app handles auth internally)
-- CREATE POLICY "Allow all" ON users FOR ALL USING (true);
-- CREATE POLICY "Allow all" ON roles FOR ALL USING (true);
-- CREATE POLICY "Allow all" ON sops FOR ALL USING (true);
-- CREATE POLICY "Allow all" ON audits FOR ALL USING (true);
-- CREATE POLICY "Allow all" ON audit_templates FOR ALL USING (true);
