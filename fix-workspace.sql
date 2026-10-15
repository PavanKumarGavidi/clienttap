-- ============================================
-- QUICK FIX: Create Profile and Workspace
-- Run this in Supabase SQL Editor
-- ============================================

-- This script will create a profile and workspace for the currently logged-in user
-- Run this while logged into your app in Supabase

-- First, check if profile exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid()) THEN
    -- Create profile
    INSERT INTO profiles (id, name, email, avatar, role)
    VALUES (
      auth.uid(),
      COALESCE(
        (SELECT raw_user_meta_data->>'name' FROM auth.users WHERE id = auth.uid()),
        'User'
      ),
      (SELECT email FROM auth.users WHERE id = auth.uid()),
      '👤',
      'owner'
    );
    RAISE NOTICE 'Profile created for user %', auth.uid();
  ELSE
    RAISE NOTICE 'Profile already exists for user %', auth.uid();
  END IF;
END $$;

-- Check if workspace exists
DO $$
DECLARE
  user_name TEXT;
  workspace_slug TEXT;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM workspaces WHERE owner_id = auth.uid()::text) THEN
    -- Get user name
    SELECT COALESCE(
      (SELECT raw_user_meta_data->>'name' FROM auth.users WHERE id = auth.uid()),
      'User'
    ) INTO user_name;
    
    -- Create workspace slug
    workspace_slug := lower(replace(user_name, ' ', '-')) || '-' || substr(auth.uid()::text, 1, 8);
    
    -- Create workspace
    INSERT INTO workspaces (owner_id, name, slug, logo, currency, currency_symbol, timezone, plan)
    VALUES (
      auth.uid()::text,
      user_name || '''s Agency',
      workspace_slug,
      '🏢',
      'INR',
      '₹',
      'Asia/Kolkata',
      'free'
    );
    RAISE NOTICE 'Workspace created for user %', auth.uid();
  ELSE
    RAISE NOTICE 'Workspace already exists for user %', auth.uid();
  END IF;
END $$;

-- Verify the setup
SELECT 
  'Profile' as type,
  p.id,
  p.name,
  p.email,
  p.role
FROM profiles p
WHERE p.id = auth.uid()

UNION ALL

SELECT 
  'Workspace' as type,
  w.id,
  w.name,
  w.slug,
  w.plan
FROM workspaces w
WHERE w.owner_id = auth.uid()::text;

-- ============================================
-- DONE! Your profile and workspace are ready.
-- Refresh the app and try adding leads/clients again.
-- ============================================
