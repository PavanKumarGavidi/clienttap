-- ============================================
-- COMPLETE RESET & FIX SCRIPT
-- This will reset EVERYTHING and start fresh
-- Run this ONCE in Supabase SQL Editor
-- ============================================

-- STEP 1: Drop ALL existing tables
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS retainers CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS meetings CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS clients CASCADE;
DROP TABLE IF EXISTS leads CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS workspaces CASCADE;

-- STEP 2: Create clean tables
CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id TEXT NOT NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo TEXT DEFAULT '🏢',
  currency TEXT DEFAULT 'INR',
  currency_symbol TEXT DEFAULT '₹',
  timezone TEXT DEFAULT 'Asia/Kolkata',
  gstin TEXT DEFAULT '',
  plan TEXT DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  avatar TEXT DEFAULT '👤',
  role TEXT DEFAULT 'owner',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  value DECIMAL(15, 2) DEFAULT 0,
  currency TEXT DEFAULT 'INR',
  stage TEXT DEFAULT 's1',
  source TEXT DEFAULT 'Website',
  assigned_to TEXT DEFAULT '',
  follow_up BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  address TEXT DEFAULT '',
  gstin TEXT DEFAULT '',
  currency TEXT DEFAULT 'INR',
  currency_symbol TEXT DEFAULT '₹',
  owner TEXT DEFAULT '',
  portal_enabled BOOLEAN DEFAULT false,
  total_projects INTEGER DEFAULT 0,
  total_invoiced DECIMAL(15, 2) DEFAULT 0,
  total_paid DECIMAL(15, 2) DEFAULT 0,
  outstanding DECIMAL(15, 2) DEFAULT 0,
  since DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  client_id TEXT DEFAULT '',
  name TEXT NOT NULL,
  type TEXT DEFAULT 'one-off',
  budget DECIMAL(15, 2) DEFAULT 0,
  currency TEXT DEFAULT 'INR',
  received DECIMAL(15, 2) DEFAULT 0,
  pending DECIMAL(15, 2) DEFAULT 0,
  status TEXT DEFAULT 'ongoing',
  start_date DATE DEFAULT CURRENT_DATE,
  deadline DATE DEFAULT CURRENT_DATE,
  progress INTEGER DEFAULT 0,
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  project_id TEXT DEFAULT '',
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  assignee TEXT DEFAULT '',
  status TEXT DEFAULT 'todo',
  priority TEXT DEFAULT 'medium',
  due_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  client_id TEXT DEFAULT '',
  project_id TEXT DEFAULT '',
  title TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  duration INTEGER DEFAULT 30,
  timezone TEXT DEFAULT 'Asia/Kolkata',
  attendees JSONB DEFAULT '[]'::jsonb,
  agenda TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  status TEXT DEFAULT 'upcoming',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  client_id TEXT DEFAULT '',
  project_id TEXT DEFAULT '',
  number TEXT NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  status TEXT DEFAULT 'draft',
  issued_date DATE DEFAULT CURRENT_DATE,
  due_date DATE DEFAULT CURRENT_DATE,
  paid_date DATE,
  paid_amount DECIMAL(15, 2) DEFAULT 0,
  gst DECIMAL(5, 2) DEFAULT 0,
  cgst DECIMAL(15, 2) DEFAULT 0,
  sgst DECIMAL(15, 2) DEFAULT 0,
  igst DECIMAL(15, 2) DEFAULT 0,
  type TEXT DEFAULT 'intra-state',
  notes TEXT DEFAULT '',
  terms TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  invoice_id TEXT DEFAULT '',
  client_id TEXT DEFAULT '',
  project_id TEXT DEFAULT '',
  amount DECIMAL(15, 2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  date DATE DEFAULT CURRENT_DATE,
  method TEXT DEFAULT 'Bank Transfer',
  reference TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE retainers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  client_id TEXT DEFAULT '',
  project_id TEXT DEFAULT '',
  amount DECIMAL(15, 2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  billing_day INTEGER DEFAULT 1,
  start_date DATE DEFAULT CURRENT_DATE,
  end_date DATE,
  scope TEXT DEFAULT '',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  client_id TEXT DEFAULT '',
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  content TEXT DEFAULT '',
  version INTEGER DEFAULT 1,
  status TEXT DEFAULT 'draft',
  signed_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  client_id TEXT DEFAULT '',
  sender_id TEXT NOT NULL,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id TEXT DEFAULT '',
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  time TEXT DEFAULT 'Just now',
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- STEP 3: DISABLE RLS completely (no policies needed)
ALTER TABLE workspaces DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE leads DISABLE ROW LEVEL SECURITY;
ALTER TABLE clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE meetings DISABLE ROW LEVEL SECURITY;
ALTER TABLE invoices DISABLE ROW LEVEL SECURITY;
ALTER TABLE payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE retainers DISABLE ROW LEVEL SECURITY;
ALTER TABLE documents DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;

-- STEP 4: Create indexes for performance
CREATE INDEX idx_workspaces_owner ON workspaces(owner_id);
CREATE INDEX idx_profiles_user ON profiles(user_id);
CREATE INDEX idx_leads_workspace ON leads(workspace_id);
CREATE INDEX idx_clients_workspace ON clients(workspace_id);
CREATE INDEX idx_projects_workspace ON projects(workspace_id);
CREATE INDEX idx_tasks_workspace ON tasks(workspace_id);
CREATE INDEX idx_meetings_workspace ON meetings(workspace_id);

-- STEP 5: Verify setup
SELECT '✅ DATABASE RESET COMPLETE!' as status;
SELECT 'Tables created: ' || count(*)::text as tables_created
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE';

SELECT 'RLS disabled on all tables' as rls_status;

-- STEP 6: Show instructions
SELECT '
========================================
NEXT STEPS:
1. Go to your app and SIGN UP with a NEW email
2. Your workspace will be created automatically
3. Try adding leads, clients, projects
4. Check Settings - your data should appear
========================================
' as instructions;
