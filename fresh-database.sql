-- ============================================
-- ClientTap - SIMPLE DATABASE SCHEMA
-- Drop all existing tables first, then run this
-- ============================================

-- Drop all tables
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

-- ============================================
-- WORKSPACES TABLE
-- ============================================
CREATE TABLE workspaces (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  owner_id TEXT NOT NULL,
  currency TEXT DEFAULT 'INR',
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- PROFILES TABLE
-- ============================================
CREATE TABLE profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  avatar TEXT,
  role TEXT DEFAULT 'owner',
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- LEADS TABLE
-- ============================================
CREATE TABLE leads (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  value DECIMAL(15,2) DEFAULT 0,
  currency TEXT DEFAULT 'INR',
  stage TEXT DEFAULT 'new',
  source TEXT DEFAULT 'website',
  assigned_to TEXT,
  follow_up BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- CLIENTS TABLE
-- ============================================
CREATE TABLE clients (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  gstin TEXT,
  currency TEXT DEFAULT 'INR',
  currency_symbol TEXT DEFAULT '₹',
  owner TEXT,
  portal_enabled BOOLEAN DEFAULT false,
  total_projects INTEGER DEFAULT 0,
  total_invoiced DECIMAL(15,2) DEFAULT 0,
  total_paid DECIMAL(15,2) DEFAULT 0,
  outstanding DECIMAL(15,2) DEFAULT 0,
  since DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- PROJECTS TABLE
-- ============================================
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  client_id TEXT,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'one-off',
  budget DECIMAL(15,2) DEFAULT 0,
  currency TEXT DEFAULT 'INR',
  received DECIMAL(15,2) DEFAULT 0,
  pending DECIMAL(15,2) DEFAULT 0,
  status TEXT DEFAULT 'ongoing',
  start_date DATE,
  deadline DATE,
  progress INTEGER DEFAULT 0,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- TASKS TABLE
-- ============================================
CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  project_id TEXT,
  title TEXT NOT NULL,
  description TEXT,
  assignee TEXT,
  status TEXT DEFAULT 'todo',
  priority TEXT DEFAULT 'medium',
  due_date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- MEETINGS TABLE
-- ============================================
CREATE TABLE meetings (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  client_id TEXT,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  duration INTEGER DEFAULT 30,
  attendees TEXT,
  status TEXT DEFAULT 'upcoming',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- INVOICES TABLE
-- ============================================
CREATE TABLE invoices (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  client_id TEXT,
  project_id TEXT,
  number TEXT NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  status TEXT DEFAULT 'draft',
  issued_date DATE,
  due_date DATE,
  gst DECIMAL(5,2) DEFAULT 0,
  cgst DECIMAL(15,2) DEFAULT 0,
  sgst DECIMAL(15,2) DEFAULT 0,
  igst DECIMAL(15,2) DEFAULT 0,
  type TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- PAYMENTS TABLE
-- ============================================
CREATE TABLE payments (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  invoice_id TEXT,
  client_id TEXT,
  amount DECIMAL(15,2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  date DATE,
  method TEXT,
  reference TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- RETAINERS TABLE
-- ============================================
CREATE TABLE retainers (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  client_id TEXT,
  amount DECIMAL(15,2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  billing_day INTEGER DEFAULT 1,
  start_date DATE,
  end_date DATE,
  scope TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- DOCUMENTS TABLE
-- ============================================
CREATE TABLE documents (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  client_id TEXT,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  content TEXT,
  version INTEGER DEFAULT 1,
  status TEXT DEFAULT 'draft',
  signed_date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- MESSAGES TABLE
-- ============================================
CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  client_id TEXT,
  sender_id TEXT NOT NULL,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE notifications (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  user_id TEXT,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  time TEXT DEFAULT 'Just now',
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE retainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CREATE POLICIES - ALLOW ALL FOR AUTHENTICATED USERS
-- ============================================
CREATE POLICY "Allow all for authenticated" ON workspaces FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated" ON profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated" ON leads FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated" ON clients FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated" ON projects FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated" ON tasks FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated" ON meetings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated" ON invoices FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated" ON payments FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated" ON retainers FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated" ON documents FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated" ON messages FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated" ON notifications FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================
-- CREATE INDEXES
-- ============================================
CREATE INDEX idx_leads_workspace ON leads(workspace_id);
CREATE INDEX idx_clients_workspace ON clients(workspace_id);
CREATE INDEX idx_projects_workspace ON projects(workspace_id);
CREATE INDEX idx_tasks_workspace ON tasks(workspace_id);
CREATE INDEX idx_meetings_workspace ON meetings(workspace_id);
CREATE INDEX idx_invoices_workspace ON invoices(workspace_id);
CREATE INDEX idx_payments_workspace ON payments(workspace_id);
CREATE INDEX idx_retainers_workspace ON retainers(workspace_id);

-- ============================================
-- DONE!
-- ============================================
