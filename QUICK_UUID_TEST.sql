-- ============================================
-- QUICK VERIFICATION TEST
-- Run this to verify UUID fix is working
-- ============================================

-- TEST 1: Verify leads table has UUID type
SELECT '=== TEST 1: Check leads.id type ===' as test;
SELECT 
  column_name,
  data_type,
  column_default
FROM information_schema.columns
WHERE table_name = 'leads' AND column_name = 'id';

-- Expected: data_type = 'uuid', column_default = 'gen_random_uuid()'

-- TEST 2: Try inserting a lead WITHOUT id
SELECT '=== TEST 2: Insert lead without ID ===' as test;

INSERT INTO leads (workspace_id, name, company, email)
VALUES (
  (SELECT id FROM workspaces LIMIT 1),
  'UUID Test Lead',
  'Test Company',
  'uuid-test@example.com'
)
RETURNING 
  id,
  name,
  company,
  created_at;

-- Expected: id should be a UUID like 550e8400-e29b-41d4-a716-446655440000
-- NOT a string like l_1791640183027_9vg3bx

-- TEST 3: Verify the ID is a proper UUID
SELECT '=== TEST 3: Verify UUID format ===' as test;
SELECT 
  id,
  LENGTH(id::text) as id_length,
  id::text ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' as is_valid_uuid
FROM leads
WHERE name = 'UUID Test Lead';

-- Expected: is_valid_uuid = true

-- TEST 4: Clean up test data
SELECT '=== TEST 4: Clean up ===' as test;
DELETE FROM leads WHERE name = 'UUID Test Lead';

-- TEST 5: Final summary
SELECT '=== TEST 5: Summary ===' as test;
SELECT '
========================================
✅ UUID FIX VERIFIED!

If you see:
- data_type = uuid
- id = 550e8400-e29b-41d4-a716-446655440000
- is_valid_uuid = true

Then the database is working correctly.

Next steps:
1. Clear browser cache (Ctrl+Shift+Delete)
2. Clear localStorage (F12 → Application → Clear)
3. Rebuild app (npm run build)
4. Sign up with NEW email
5. Try adding leads
========================================
' as result;
