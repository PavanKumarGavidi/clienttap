-- ============================================
-- DIAGNOSTIC & FIX SCRIPT
-- Run this to diagnose and fix all issues
-- ============================================

-- Step 1: Check current state
SELECT '=== CURRENT STATE ===' as info;

-- Check if you're logged in
SELECT 
  'Current User ID: ' || auth.uid()::text as current_user;

-- Check existing workspaces
SELECT 
  '=== WORKSPACES ===' as info;
SELECT 
  id,
  owner_id,
  name,
  slug,
  created_at
FROM workspaces
ORDER BY created_at DESC
LIMIT 5;

-- Check existing profiles
SELECT 
  '=== PROFILES ===' as info;
SELECT 
  id,
  user_id,
  name,
  email,
  created_at
FROM profiles
ORDER BY created_at DESC
LIMIT 5;

-- Step 2: Fix RLS (disable it completely)
SELECT 
  '=== DISABLING RLS ===' as info;

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

SELECT '✅ RLS disabled on all tables' as status;

-- Step 3: Drop all policies
SELECT 
  '=== DROPPING POLICIES ===' as info;

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

SELECT '✅ All policies dropped' as status;

-- Step 4: Create workspace for current user if it doesn't exist
SELECT 
  '=== CREATING WORKSPACE ===' as info;

DO $$
DECLARE
  current_user_id TEXT;
  workspace_exists BOOLEAN;
  new_workspace_id UUID;
  user_name TEXT;
BEGIN
  -- Get current user ID
  current_user_id := auth.uid()::text;
  
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION '❌ No user logged in! Please sign up first.';
  END IF;
  
  RAISE NOTICE '👤 Current user ID: %', current_user_id;
  
  -- Check if workspace exists
  SELECT EXISTS(
    SELECT 1 FROM workspaces WHERE owner_id = current_user_id
  ) INTO workspace_exists;
  
  IF workspace_exists THEN
    RAISE NOTICE '✅ Workspace already exists for this user';
  ELSE
    -- Get user name from profiles or use default
    SELECT COALESCE(
      (SELECT name FROM profiles WHERE user_id = current_user_id),
      'User'
    ) INTO user_name;
    
    -- Create workspace
    INSERT INTO workspaces (
      owner_id,
      name,
      slug,
      logo,
      currency,
      currency_symbol,
      timezone,
      plan
    ) VALUES (
      current_user_id,
      user_name || '''s Agency',
      lower(replace(user_name, ' ', '-')) || '-' || EXTRACT(EPOCH FROM NOW())::text,
      '🏢',
      'INR',
      '₹',
      'Asia/Kolkata',
      'free'
    ) RETURNING id INTO new_workspace_id;
    
    RAISE NOTICE '✅ Workspace created with ID: %', new_workspace_id;
  END IF;
END $$;

-- Step 5: Create profile for current user if it doesn't exist
SELECT 
  '=== CREATING PROFILE ===' as info;

DO $$
DECLARE
  current_user_id TEXT;
  profile_exists BOOLEAN;
  user_email TEXT;
BEGIN
  -- Get current user ID
  current_user_id := auth.uid()::text;
  
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION '❌ No user logged in!';
  END IF;
  
  -- Check if profile exists
  SELECT EXISTS(
    SELECT 1 FROM profiles WHERE user_id = current_user_id
  ) INTO profile_exists;
  
  IF profile_exists THEN
    RAISE NOTICE '✅ Profile already exists for this user';
  ELSE
    -- Get user email
    SELECT email INTO user_email
    FROM auth.users
    WHERE id = current_user_id::uuid;
    
    -- Create profile
    INSERT INTO profiles (
      user_id,
      name,
      email,
      avatar,
      role
    ) VALUES (
      current_user_id,
      COALESCE(user_email, 'User'),
      user_email,
      '👤',
      'owner'
    );
    
    RAISE NOTICE '✅ Profile created for user: %', current_user_id;
  END IF;
END $$;

-- Step 6: Verify everything is set up correctly
SELECT 
  '=== VERIFICATION ===' as info;

SELECT 
  'User ID: ' || auth.uid()::text as user_info;

SELECT 
  'Workspace: ' || COALESCE(name, 'NOT FOUND') as workspace_info
FROM workspaces
WHERE owner_id = auth.uid()::text
LIMIT 1;

SELECT 
  'Profile: ' || COALESCE(name, 'NOT FOUND') as profile_info
FROM profiles
WHERE user_id = auth.uid()::text
LIMIT 1;

-- Step 7: Show final state
SELECT 
  '=== FINAL STATE ===' as info;

SELECT 
  w.id as workspace_id,
  w.owner_id,
  w.name as workspace_name,
  w.slug,
  p.name as user_name,
  p.email as user_email
FROM workspaces w
LEFT JOIN profiles p ON p.user_id = w.owner_id
WHERE w.owner_id = auth.uid()::text;

SELECT 
  '✅ SETUP COMPLETE!' as status,
  'You can now sign up and use the app.' as message;

-- ============================================
-- INSTRUCTIONS:
-- 1. Run this entire script in Supabase SQL Editor
-- 2. Check the output for any errors
-- 3. If you see "No user logged in", sign up first in the app
-- 4. Then run this script again
-- 5. After successful run, try adding leads/clients in the app
-- ============================================
