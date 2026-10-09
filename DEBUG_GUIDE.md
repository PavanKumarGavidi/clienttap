# 🔧 Debug Guide - Data Not Saving

## What Was Fixed

I've added comprehensive logging throughout the application to help identify why data isn't saving. All console logs will now show you exactly what's happening at each step.

## How to Debug

### Step 1: Open Browser Console
1. Press **F12** to open Developer Tools
2. Go to the **Console** tab
3. Clear any existing logs (click the 🚫 icon)

### Step 2: Test Each Feature

#### Test Add Client
1. Go to Dashboard
2. Click "Add client" button
3. Fill in the form
4. Click "Add Client"
5. **Check console for these logs:**
   ```
   Adding client: [client name]
   Adding client to workspace: [workspace-id] {client data}
   Adding clients to workspace [workspace-id]: {client data}
   Client added to state
   clients added successfully: [{client data}]
   ```

#### Test Schedule Meeting
1. Go to Dashboard
2. Click "Schedule meeting" button
3. Fill in the form
4. Click "Schedule"
5. **Check console for these logs:**
   ```
   Scheduling meeting: [meeting title]
   Adding meeting to workspace: [workspace-id] {meeting data}
   Adding meetings to workspace [workspace-id]: {meeting data}
   Meeting added to state
   meetings added successfully: [{meeting data}]
   ```

#### Test Save Profile
1. Go to Settings → Profile
2. Change your name
3. Click "Save Changes"
4. **Check console for these logs:**
   ```
   Saving profile: {name, email, avatar}
   Updating profile in store: {updates}
   Updating profile: [user-id] {updates}
   Profile updated successfully: [{profile data}]
   Profile updated, new user: {user data}
   ```

#### Test Save Workspace
1. Go to Settings → Workspace
2. Change workspace name
3. Click "Save Changes"
4. **Check console for these logs:**
   ```
   Saving workspace: {name, slug, currency, timezone}
   Updating workspace in store: {updates}
   Updating workspace: [workspace-id] {updates}
   Workspace updated successfully: [{workspace data}]
   Workspace updated, new workspace: {workspace data}
   ```

### Step 3: Check for Errors

Look for these common errors in the console:

#### Error: "Cannot add client: no workspace ID"
**Cause:** You're not logged in or workspace wasn't created
**Fix:** 
1. Log out and log back in
2. Check if workspace exists in Supabase Table Editor → workspaces
3. If not, sign up again

#### Error: "Error adding clients: [error details]"
**Cause:** Database insert failed
**Fix:**
1. Check if the `clients` table exists in Supabase
2. Check if RLS policies are set up correctly
3. Check if you have the required permissions

#### Error: "new row violates row-level security policy"
**Cause:** RLS is blocking the insert
**Fix:**
1. Run the SQL schema again to ensure RLS policies are created
2. Check that you're a member of the workspace in the `memberships` table

#### Error: "relation does not exist"
**Cause:** Table doesn't exist in database
**Fix:**
1. Run `quick-setup.sql` or `supabase-schema.sql` in Supabase SQL Editor
2. Verify tables exist in Table Editor

### Step 4: Verify Data in Supabase

After performing an action, check if data was saved:

1. Go to Supabase dashboard → **Table Editor**
2. Check the relevant table:
   - Clients → `clients` table
   - Meetings → `meetings` table
   - Profile → `profiles` table
   - Workspace → `workspaces` table
3. Your data should be there

### Step 5: Refresh and Verify

1. Refresh the page (F5)
2. Check if the data is still there
3. If data disappears, the issue is with loading data, not saving

## Common Issues & Solutions

### Issue: Buttons don't open modals
**Solution:**
1. Check console for JavaScript errors
2. Make sure you're not seeing "Cannot add client: no workspace ID"
3. Try logging out and back in

### Issue: Modal opens but data doesn't save
**Solution:**
1. Check console for errors during save
2. Verify workspace_id is being set correctly
3. Check Supabase Table Editor to see if data was inserted
4. If data is in database but not showing, check the getData function

### Issue: Data saves but doesn't show after refresh
**Solution:**
1. Check console for errors during data loading
2. Verify the getData function is being called
3. Check if workspace_id is correct
4. Verify RLS policies allow SELECT

### Issue: Settings save but don't reflect in UI
**Solution:**
1. Check console for update errors
2. Verify the updateProfile/updateWorkspace functions are working
3. Check if currentUser/currentWorkspace are being updated in the store
4. The useEffect in Settings should sync the UI

## Quick Test Script

Paste this in the browser console to test everything:

```javascript
// Test 1: Check current user and workspace
const { data: { user } } = await supabase.auth.getUser();
console.log('Current user:', user);

const { data: workspace } = await supabase
  .from('workspaces')
  .select('*')
  .eq('owner_id', user.id)
  .single();
console.log('Current workspace:', workspace);

// Test 2: Try adding a client
const { data: newClient, error } = await supabase
  .from('clients')
  .insert({
    workspace_id: workspace.id,
    name: 'Test Client',
    company: 'Test Company',
    email: 'test@example.com'
  })
  .select();

console.log('New client:', newClient);
console.log('Error:', error);

// Test 3: Check if client was saved
const { data: clients } = await supabase
  .from('clients')
  .select('*')
  .eq('workspace_id', workspace.id);

console.log('All clients:', clients);
```

## What to Share If Still Not Working

If you're still having issues, share:

1. **Console logs** - Copy all the logs from when you try to save
2. **Error messages** - Any red error messages in console
3. **Supabase Table Editor** - Screenshot showing if data exists in database
4. **Network tab** - Check if API calls are succeeding (F12 → Network tab)

## Expected Behavior

After all fixes, you should see:

✅ **Add Client button** opens modal, saves to database, shows in UI
✅ **Schedule Meeting button** opens modal, saves to database, shows in UI  
✅ **Save Changes in Settings** updates database, reflects in UI immediately
✅ **Avatar upload** shows preview, saves to database, persists after refresh
✅ **All data persists** after page refresh
✅ **Console logs** show exactly what's happening at each step

## Next Steps

1. Run the tests above
2. Check console for any errors
3. Verify data in Supabase Table Editor
4. If still not working, share the console logs and error messages

---

**Remember:** The most common issue is that the SQL schema hasn't been run yet. Make sure you've run `quick-setup.sql` or `supabase-schema.sql` in Supabase SQL Editor!
