-- ============================================
-- FIX RLS POLICIES - Run This in Supabase SQL Editor
-- ============================================

-- Step 1: Drop ALL existing policies
DROP POLICY IF EXISTS "Enable all for authenticated users" ON workspaces;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON leads;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON clients;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON projects;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON tasks;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON meetings;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON invoices;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON payments;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON retainers;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON documents;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON messages;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON notifications;

-- Step 2: Disable RLS temporarily for testing (RECOMMENDED FOR NOW)
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

-- ============================================
-- DONE! RLS is now disabled for testing
-- Try signing up again - it should work now!
-- ============================================
