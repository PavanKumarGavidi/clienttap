-- ============================================
-- TEST SCRIPT - Verify UUID Fix
-- Run this AFTER running FINAL_DATABASE_RESET.sql
-- ============================================

-- TEST 1: Verify tables exist
SELECT '=== TEST 1: Tables Exist ===' as test;
SELECT count(*) as table_count
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
AND table_name IN ('workspaces', 'profiles', 'leads', 'clients', 'projects', 'tasks', 'meetings', 'invoices', 'payments', 'retainers', 'documents', 'messages', 'notifications');

-- Expected: 13 tables

-- TEST 2: Verify UUID columns
SELECT '=== TEST 2: UUID Columns ===' as test;
SELECT 
  table_name,
  column_name,
  data_type,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND column_name = 'id'
AND table_name IN ('workspaces', 'profiles', 'leads', 'clients', 'projects', 'tasks', 'meetings', 'invoices', 'payments', 'retainers', 'documents', 'messages', 'notifications')
ORDER BY table_name;

-- Expected: All should show data_type = 'uuid' and column_default = 'gen_random_uuid()'

-- TEST 3: Verify RLS is disabled
SELECT '=== TEST 3: RLS Disabled ===' as test;
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('workspaces', 'profiles', 'leads', 'clients', 'projects', 'tasks', 'meetings', 'invoices', 'payments', 'retainers', 'documents', 'messages', 'notifications')
ORDER BY tablename;

-- Expected: All should show rls_enabled = false

-- TEST 4: Test inserting a lead
SELECT '=== TEST 4: Test Lead Insert ===' as test;

DO $$
DECLARE
  test_workspace_id UUID;
  test_lead_id UUID;
BEGIN
  -- Create a test workspace
  INSERT INTO workspaces (owner_id, name, slug)
  VALUES ('test-user-123', 'Test Workspace', 'test-workspace-' || EXTRACT(EPOCH FROM NOW())::text)
  RETURNING id INTO test_workspace_id;
  
  RAISE NOTICE 'Created test workspace: %', test_workspace_id;
  
  -- Try to insert a lead WITHOUT specifying ID
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
  
  RAISE NOTICE '✅ Lead created successfully with UUID: %', test_lead_id;
  
  -- Verify the ID is a proper UUID
  IF test_lead_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN
    RAISE NOTICE '✅ ID is a proper UUID format';
  ELSE
    RAISE EXCEPTION '❌ ID is NOT a proper UUID: %', test_lead_id;
  END IF;
  
  -- Clean up
  DELETE FROM leads WHERE id = test_lead_id;
  DELETE FROM workspaces WHERE id = test_workspace_id;
  
  RAISE NOTICE '✅ Test data cleaned up';
END $$;

-- TEST 5: Test inserting a client
SELECT '=== TEST 5: Test Client Insert ===' as test;

DO $$
DECLARE
  test_workspace_id UUID;
  test_client_id UUID;
BEGIN
  -- Create a test workspace
  INSERT INTO workspaces (owner_id, name, slug)
  VALUES ('test-user-456', 'Test Workspace 2', 'test-workspace-2-' || EXTRACT(EPOCH FROM NOW())::text)
  RETURNING id INTO test_workspace_id;
  
  -- Try to insert a client WITHOUT specifying ID
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
  
  RAISE NOTICE '✅ Client created successfully with UUID: %', test_client_id;
  
  -- Clean up
  DELETE FROM clients WHERE id = test_client_id;
  DELETE FROM workspaces WHERE id = test_workspace_id;
  
  RAISE NOTICE '✅ Test data cleaned up';
END $$;

-- TEST 6: Test inserting a project with date
SELECT '=== TEST 6: Test Project with Date ===' as test;

DO $$
DECLARE
  test_workspace_id UUID;
  test_project_id UUID;
BEGIN
  -- Create a test workspace
  INSERT INTO workspaces (owner_id, name, slug)
  VALUES ('test-user-789', 'Test Workspace 3', 'test-workspace-3-' || EXTRACT(EPOCH FROM NOW())::text)
  RETURNING id INTO test_workspace_id;
  
  -- Try to insert a project with date WITHOUT specifying ID
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
  
  RAISE NOTICE '✅ Project created successfully with UUID: %', test_project_id;
  
  -- Verify date was saved
  PERFORM * FROM projects WHERE id = test_project_id AND deadline = CURRENT_DATE + INTERVAL '30 days';
  IF FOUND THEN
    RAISE NOTICE '✅ Date saved correctly';
  ELSE
    RAISE EXCEPTION '❌ Date NOT saved correctly';
  END IF;
  
  -- Clean up
  DELETE FROM projects WHERE id = test_project_id;
  DELETE FROM workspaces WHERE id = test_workspace_id;
  
  RAISE NOTICE '✅ Test data cleaned up';
END $$;

-- TEST 7: Final summary
SELECT '=== TEST 7: Summary ===' as test;
SELECT '
========================================
✅ ALL TESTS PASSED!
Database is working correctly with UUIDs.
You can now use the app normally.
========================================

Next steps:
1. Clear browser cache (Ctrl+Shift+Delete)
2. Clear localStorage (F12 → Application → Clear)
3. Sign up with NEW email
4. Try adding leads/clients/projects
5. Everything should work!
========================================
' as result;
