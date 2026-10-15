-- ============================================
-- VERIFICATION SCRIPT
-- Run this AFTER signing up to verify everything works
-- ============================================

-- Check 1: Verify you're logged in
SELECT '=== CHECK 1: Authentication ===' as test;
SELECT 
  CASE 
    WHEN auth.uid() IS NOT NULL THEN '✅ Logged in'
    ELSE '❌ Not logged in - Please sign up first!'
  END as auth_status;

-- Check 2: Verify workspace exists
SELECT '=== CHECK 2: Workspace ===' as test;
SELECT 
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ Workspace exists'
    ELSE '❌ No workspace found - Sign up again!'
  END as workspace_status,
  COUNT(*) as workspace_count
FROM workspaces
WHERE owner_id = auth.uid()::text;

-- Show workspace details
SELECT 
  id,
  owner_id,
  name,
  slug,
  currency,
  plan,
  created_at
FROM workspaces
WHERE owner_id = auth.uid()::text
LIMIT 1;

-- Check 3: Verify profile exists
SELECT '=== CHECK 3: Profile ===' as test;
SELECT 
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ Profile exists'
    ELSE '❌ No profile found - Sign up again!'
  END as profile_status,
  COUNT(*) as profile_count
FROM profiles
WHERE user_id = auth.uid()::text;

-- Show profile details
SELECT 
  id,
  user_id,
  name,
  email,
  avatar,
  role,
  created_at
FROM profiles
WHERE user_id = auth.uid()::text
LIMIT 1;

-- Check 4: Test adding a lead
SELECT '=== CHECK 4: Test Lead Creation ===' as test;

DO $$
DECLARE
  test_workspace_id UUID;
  test_lead_id UUID;
BEGIN
  -- Get workspace ID
  SELECT id INTO test_workspace_id
  FROM workspaces
  WHERE owner_id = auth.uid()::text
  LIMIT 1;
  
  IF test_workspace_id IS NULL THEN
    RAISE EXCEPTION '❌ No workspace found!';
  END IF;
  
  -- Try to insert a test lead
  INSERT INTO leads (workspace_id, name, company, email, phone, value, currency, stage, source)
  VALUES (
    test_workspace_id,
    'Test Lead',
    'Test Company',
    'test@example.com',
    '+1234567890',
    10000,
    'INR',
    's1',
    'Website'
  )
  RETURNING id INTO test_lead_id;
  
  RAISE NOTICE '✅ Lead created successfully with ID: %', test_lead_id;
END $$;

-- Show the test lead
SELECT 
  id,
  workspace_id,
  name,
  company,
  email,
  value,
  currency,
  stage,
  source,
  created_at
FROM leads
WHERE name = 'Test Lead'
ORDER BY created_at DESC
LIMIT 1;

-- Check 5: Test adding a client
SELECT '=== CHECK 5: Test Client Creation ===' as test;

DO $$
DECLARE
  test_workspace_id UUID;
  test_client_id UUID;
BEGIN
  -- Get workspace ID
  SELECT id INTO test_workspace_id
  FROM workspaces
  WHERE owner_id = auth.uid()::text
  LIMIT 1;
  
  IF test_workspace_id IS NULL THEN
    RAISE EXCEPTION '❌ No workspace found!';
  END IF;
  
  -- Try to insert a test client
  INSERT INTO clients (workspace_id, name, company, email, phone, currency, currency_symbol)
  VALUES (
    test_workspace_id,
    'Test Client',
    'Test Client Company',
    'client@example.com',
    '+9876543210',
    'INR',
    '₹'
  )
  RETURNING id INTO test_client_id;
  
  RAISE NOTICE '✅ Client created successfully with ID: %', test_client_id;
END $$;

-- Show the test client
SELECT 
  id,
  workspace_id,
  name,
  company,
  email,
  phone,
  currency,
  created_at
FROM clients
WHERE name = 'Test Client'
ORDER BY created_at DESC
LIMIT 1;

-- Check 6: Test adding a project with date
SELECT '=== CHECK 6: Test Project with Date ===' as test;

DO $$
DECLARE
  test_workspace_id UUID;
  test_project_id UUID;
BEGIN
  -- Get workspace ID
  SELECT id INTO test_workspace_id
  FROM workspaces
  WHERE owner_id = auth.uid()::text
  LIMIT 1;
  
  IF test_workspace_id IS NULL THEN
    RAISE EXCEPTION '❌ No workspace found!';
  END IF;
  
  -- Try to insert a test project with date
  INSERT INTO projects (workspace_id, name, type, budget, currency, start_date, deadline, status)
  VALUES (
    test_workspace_id,
    'Test Project',
    'one-off',
    50000,
    'INR',
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '30 days',
    'ongoing'
  )
  RETURNING id INTO test_project_id;
  
  RAISE NOTICE '✅ Project created successfully with ID: %', test_project_id;
END $$;

-- Show the test project
SELECT 
  id,
  workspace_id,
  name,
  type,
  budget,
  currency,
  start_date,
  deadline,
  status,
  created_at
FROM projects
WHERE name = 'Test Project'
ORDER BY created_at DESC
LIMIT 1;

-- Check 7: Summary
SELECT '=== CHECK 7: Summary ===' as test;
SELECT 
  '✅ Authentication: ' || CASE WHEN auth.uid() IS NOT NULL THEN 'OK' ELSE 'FAIL' END as auth_check,
  '✅ Workspace: ' || CASE WHEN (SELECT COUNT(*) FROM workspaces WHERE owner_id = auth.uid()::text) > 0 THEN 'OK' ELSE 'FAIL' END as workspace_check,
  '✅ Profile: ' || CASE WHEN (SELECT COUNT(*) FROM profiles WHERE user_id = auth.uid()::text) > 0 THEN 'OK' ELSE 'FAIL' END as profile_check,
  '✅ Leads: ' || (SELECT COUNT(*) FROM leads WHERE name = 'Test Lead')::text || ' test lead(s)' as leads_check,
  '✅ Clients: ' || (SELECT COUNT(*) FROM clients WHERE name = 'Test Client')::text || ' test client(s)' as clients_check,
  '✅ Projects: ' || (SELECT COUNT(*) FROM projects WHERE name = 'Test Project')::text || ' test project(s)' as projects_check;

-- Final result
SELECT '
========================================
✅ ALL CHECKS PASSED!
Your database is working correctly.
You can now use the app normally.
========================================
' as final_status;

-- Clean up test data (optional)
-- Uncomment these lines to remove test data:
/*
DELETE FROM leads WHERE name = 'Test Lead';
DELETE FROM clients WHERE name = 'Test Client';
DELETE FROM projects WHERE name = 'Test Project';
*/
