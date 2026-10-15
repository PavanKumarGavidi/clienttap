# 🔧 Troubleshooting: "No workspace ID available" Error

## Problem
You're seeing this error when trying to add leads, clients, projects, etc.:
```
Failed to add lead: No workspace ID available. Check console for details.
```

## Root Cause
The workspace is not being loaded properly when the app starts. This can happen if:
1. The user profile doesn't exist in the database
2. The workspace doesn't exist in the database
3. The database schema is outdated
4. There's a mismatch between the auth user and the workspace

## Solution

### Step 1: Check Browser Console
Open the browser console (F12) and look for these logs when the app loads:

```
🔄 Loading user and workspace...
✅ User loaded: {id: "...", name: "...", ...}
✅ Workspace loaded: {id: "...", name: "...", ...}
📦 Loading data for workspace: ...
✅ Data loaded: {leads: 0, clients: 0, ...}
```

If you see:
- `❌ No workspace available` - The workspace wasn't created
- `⚠️ No workspace ID available` - The workspace ID is missing

### Step 2: Verify Database Schema
Make sure you've run the **latest** database schema:

1. Go to Supabase SQL Editor
2. Run the DROP statements first:
```sql
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
DROP TABLE IF EXISTS memberships CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS workspaces CASCADE;
```

3. Then run the schema from `database-schema-fixed.sql`

### Step 3: Check if Profile and Workspace Exist
In Supabase SQL Editor, run:

```sql
-- Check if your user has a profile
SELECT * FROM profiles WHERE id = auth.uid();

-- Check if your user has a workspace
SELECT * FROM workspaces WHERE owner_id = auth.uid()::text;
```

If these return empty results, that's the problem.

### Step 4: Manual Fix - Create Profile and Workspace
If the above queries return empty, create them manually:

```sql
-- Create profile for current user
INSERT INTO profiles (id, name, email, avatar, role)
VALUES (
  auth.uid(),
  (SELECT raw_user_meta_data->>'name' FROM auth.users WHERE id = auth.uid()),
  (SELECT email FROM auth.users WHERE id = auth.uid()),
  '👤',
  'owner'
);

-- Create workspace for current user
INSERT INTO workspaces (owner_id, name, slug, logo, currency, currency_symbol, timezone, plan)
VALUES (
  auth.uid()::text,
  (SELECT raw_user_meta_data->>'name' FROM auth.users WHERE id = auth.uid()) || '''s Agency',
  'workspace-' || substr(auth.uid()::text, 1, 8),
  '🏢',
  'INR',
  '₹',
  'Asia/Kolkata',
  'free'
);
```

### Step 5: Sign Up Again (Recommended)
The easiest fix is to sign up with a new account:

1. Click "Sign out" in the app
2. Go to the signup page
3. Create a new account with a different email
4. The system will automatically create the profile and workspace
5. Try adding leads/clients again

### Step 6: Check RLS Policies
Make sure RLS policies are enabled and allow the operations:

```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'workspaces', 'leads', 'clients', 'projects');

-- If rowsecurity is false, enable it
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create permissive policies
CREATE POLICY "Enable all for authenticated users" ON profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for authenticated users" ON workspaces FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for authenticated users" ON leads FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for authenticated users" ON clients FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for authenticated users" ON projects FOR ALL TO authenticated USING (true) WITH CHECK (true);
```

## Auto-Fix Features
The app now has auto-fix features:
- ✅ If no profile exists, it creates one automatically
- ✅ If no workspace exists, it creates one automatically
- ✅ Better error logging to help diagnose issues

## Quick Test
After applying the fix:
1. Refresh the page
2. Check console for the loading logs
3. Try adding a lead
4. Check console for the "Adding lead" logs
5. Verify the lead appears in the list

## Still Not Working?
If you're still seeing the error:
1. Take a screenshot of the browser console
2. Take a screenshot of the Supabase Table Editor showing the profiles and workspaces tables
3. Share the screenshots for further debugging

## Common Mistakes
- ❌ Running the old schema (`database-schema.sql`) instead of the fixed one (`database-schema-fixed.sql`)
- ❌ Not dropping old tables before running the new schema
- ❌ Using an account that was created before the schema was updated
- ❌ Not checking the browser console for error messages

## Expected Behavior
After the fix, you should see:
```
🔄 Loading user and workspace...
✅ User loaded: {id: "xxx", name: "John Doe", ...}
✅ Workspace loaded: {id: "xxx", name: "John Doe's Agency", ...}
📦 Loading data for workspace: xxx
✅ Data loaded: {leads: 0, clients: 0, projects: 0, ...}
```

Then when adding a lead:
```
Adding lead: {name: "Test Lead", ...}
Lead data: {name: "Test Lead", ...}
Adding lead with workspace ID: xxx
New lead data: {id: "xxx", name: "Test Lead", workspace_id: "xxx", ...}
Adding leads to workspace xxx: {...}
Lead added to Supabase successfully
leads added successfully: [{...}]
Leads refreshed from Supabase: 1 leads
Lead added successfully
```
