# 🔧 Troubleshooting Guide - Data Not Saving

## Issue: Leads, Clients, Tasks Not Saving

If your data isn't being saved or showing up after refresh, follow these steps:

### Step 1: Verify SQL Schema Was Run

**This is the most common issue!**

1. Go to your Supabase dashboard:
   👉 https://supabase.com/dashboard/project/owlqbljiitreewqtiewx/sql

2. Click **"New Query"**

3. Open the file `supabase-schema.sql` from this project

4. Copy ALL the SQL code

5. Paste it into the SQL Editor

6. Click **"Run"**

7. Wait for it to complete (~10 seconds)

8. Go to **Table Editor** and verify these tables exist:
   - ✅ workspaces
   - ✅ profiles
   - ✅ leads
   - ✅ clients
   - ✅ projects
   - ✅ tasks
   - ✅ meetings
   - ✅ invoices
   - ✅ payments
   - ✅ retainers

### Step 2: Check Browser Console for Errors

1. Open your app in the browser
2. Press **F12** to open Developer Tools
3. Go to the **Console** tab
4. Look for errors like:
   - `Error fetching workspace data`
   - `Error adding leads`
   - `new row violates row-level security policy`

**Common errors and fixes:**

#### Error: "relation does not exist"
**Fix:** You need to run the SQL schema (Step 1)

#### Error: "new row violates row-level security policy"
**Fix:** 
1. Make sure you're logged in
2. Check that your workspace exists in the `workspaces` table
3. Check that you have a membership in the `memberships` table

#### Error: "failed to fetch" or network errors
**Fix:**
1. Check your internet connection
2. Verify your Supabase URL is correct in `.env`
3. Check Supabase dashboard for any outages

### Step 3: Verify Your Workspace

1. Go to Supabase dashboard → **Table Editor**
2. Click on `workspaces` table
3. You should see your workspace there
4. Note the `id` value

5. Click on `memberships` table
6. You should see a row with:
   - `workspace_id` = your workspace id
   - `user_id` = your user id
   - `role` = 'owner'

**If these don't exist**, you need to sign up again or manually create them.

### Step 4: Check RLS Policies

RLS (Row Level Security) might be blocking access. Let's verify the policies:

1. Go to Supabase dashboard → **Authentication** → **Policies**
2. Check that policies exist for each table
3. If policies are missing, run this SQL:

```sql
-- Enable RLS on all tables
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

-- Create policies for workspace access
CREATE POLICY "Users can view their workspaces"
  ON workspaces FOR SELECT
  USING (owner_id = auth.uid());

CREATE POLICY "Users can update their workspaces"
  ON workspaces FOR UPDATE
  USING (owner_id = auth.uid());

CREATE POLICY "Workspace members can view leads"
  ON leads FOR SELECT
  USING (workspace_id IN (
    SELECT workspace_id FROM memberships WHERE user_id = auth.uid()
  ));

CREATE POLICY "Workspace members can insert leads"
  ON leads FOR INSERT
  WITH CHECK (workspace_id IN (
    SELECT workspace_id FROM memberships WHERE user_id = auth.uid()
  ));

CREATE POLICY "Workspace members can update leads"
  ON leads FOR UPDATE
  USING (workspace_id IN (
    SELECT workspace_id FROM memberships WHERE user_id = auth.uid()
  ));

CREATE POLICY "Workspace members can delete leads"
  ON leads FOR DELETE
  USING (workspace_id IN (
    SELECT workspace_id FROM memberships WHERE user_id = auth.uid()
  ));

-- Repeat for clients, projects, tasks, meetings, invoices, payments, retainers
-- (The full schema.sql already includes these)
```

### Step 5: Test Data Persistence

1. Create a new lead in the app
2. Open browser console (F12)
3. Look for logs like:
   ```
   Adding lead to workspace: {workspace_id}
   Lead saved successfully
   ```
4. Refresh the page
5. Check if the lead is still there

**If the lead disappears:**
- Check console for errors
- Verify the lead exists in Supabase Table Editor
- Check if the workspace_id is correct

### Step 6: Manual Data Check

1. Go to Supabase dashboard → **Table Editor**
2. Click on `leads` table
3. You should see your leads there
4. Check the `workspace_id` column - it should match your workspace

**If leads exist in Supabase but not in the app:**
- The app isn't loading data correctly
- Check console for errors during data fetch
- Try logging out and logging back in

### Step 7: Reset and Start Fresh

If nothing works, try this:

1. **Clear browser storage:**
   - Open DevTools (F12)
   - Go to Application tab
   - Clear Local Storage and Session Storage

2. **Sign out:**
   - Click logout in the app

3. **Sign up again:**
   - Create a new account
   - This will create a new workspace

4. **Test again:**
   - Create a lead
   - Refresh the page
   - Check if it persists

### Step 8: Check Supabase Logs

1. Go to Supabase dashboard → **Logs**
2. Check **API logs** for failed requests
3. Check **Auth logs** for login issues
4. Look for any error messages

## Quick Fixes for Common Issues

### Issue: "Schedule Meeting" button doesn't work

**Fix:**
1. Make sure you're logged in
2. Check browser console for errors
3. Verify the meetings table exists in Supabase
4. Try creating a meeting and check if it appears in the meetings table

### Issue: "Save Changes" in Settings doesn't work

**Fix:**
1. Make sure you're logged in
2. Check browser console for errors
3. Verify the profiles and workspaces tables exist
4. Check if you have update permissions (RLS policies)

### Issue: Avatar upload doesn't work

**Fix:**
1. The avatar is currently saved as base64 in the profile
2. For production, you should use Supabase Storage
3. For now, the avatar preview should work locally
4. Check browser console for file upload errors

## Debug Mode

Add this to your browser console to debug:

```javascript
// Check current user
const { data: { user } } = await supabase.auth.getUser();
console.log('Current user:', user);

// Check current workspace
const { data: workspace } = await supabase
  .from('workspaces')
  .select('*')
  .eq('owner_id', user.id)
  .single();
console.log('Current workspace:', workspace);

// Check leads
const { data: leads } = await supabase
  .from('leads')
  .select('*')
  .eq('workspace_id', workspace.id);
console.log('Leads:', leads);
```

## Still Not Working?

If you've tried all the above and data still isn't saving:

1. **Check the SQL schema was run** (most common issue!)
2. **Check browser console for errors**
3. **Check Supabase logs for failed requests**
4. **Verify RLS policies are correct**
5. **Try signing up with a new account**

## Support

If you're still stuck:
1. Open browser console (F12)
2. Copy any error messages
3. Check Supabase Table Editor to see if data exists
4. Check Supabase Logs for API errors

---

**Remember:** The most common issue is that the SQL schema hasn't been run yet. Make sure you've completed Step 1! ✅
