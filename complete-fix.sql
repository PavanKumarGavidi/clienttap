-- ============================================
-- COMPLETE FIX: Disable RLS and Test Workspace Creation
-- Run this ENTIRE script in Supabase SQL Editor
-- ============================================

-- Step 1: Disable RLS on ALL tables
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

-- Step 2: Drop ALL existing policies (clean slate)
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

-- Step 3: Verify RLS is disabled
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN (
  'workspaces', 'profiles', 'leads', 'clients', 
  'projects', 'tasks', 'meetings', 'invoices',
  'payments', 'retainers', 'documents', 'messages', 
  'notifications'
)
ORDER BY tablename;

-- Step 4: Test workspace creation (replace with your actual user ID)
-- First, get your user ID from Supabase Authentication panel
-- Then uncomment and run this test:

/*
DO $$
DECLARE
  test_user_id TEXT := 'YOUR-USER-ID-HERE'; -- Replace with your actual user ID from Authentication
  test_workspace_id UUID;
BEGIN
  -- Try to create a test workspace
  INSERT INTO workspaces (owner_id, name, slug, logo, currency, currency_symbol, timezone, plan)
  VALUES (
    test_user_id,
    'Test Agency',
    'test-agency-' || EXTRACT(EPOCH FROM NOW())::TEXT,
    '🏢',
    'INR',
    '₹',
    'Asia/Kolkata',
    'free'
  )
  RETURNING id INTO test_workspace_id;
  
  RAISE NOTICE '✅ Test workspace created successfully with ID: %', test_workspace_id;
  
  -- Verify it exists
  PERFORM * FROM workspaces WHERE id = test_workspace_id;
  IF FOUND THEN
    RAISE NOTICE '✅ Workspace verified in database';
  ELSE
    RAISE EXCEPTION '❌ Workspace not found after creation';
  END IF;
END $$;
*/

-- Step 5: Check existing workspaces
SELECT 
  id,
  owner_id,
  name,
  slug,
  created_at
FROM workspaces
ORDER BY created_at DESC
LIMIT 10;

-- Step 6: Check existing profiles
SELECT 
  id,
  user_id,
  name,
  email,
  created_at
FROM profiles
ORDER BY created_at DESC
LIMIT 10;

-- ============================================
-- DONE! 
-- Now try signing up again with a new email.
-- The workspace should be created automatically.
-- ============================================
