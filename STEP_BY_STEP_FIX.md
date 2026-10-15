# 🔧 STEP-BY-STEP FIX GUIDE

## ⚠️ IMPORTANT: Follow These Steps EXACTLY

You're seeing these errors:
- "Failed to create project. Check console for details."
- "Failed to add lead. Check console for details."

This means the database tables don't exist or have the wrong structure.

---

## 📋 STEP 1: Open Database Diagnostic Tool

1. Start your app: `npm run dev`
2. Open this URL in your browser: **http://localhost:5173/test-database.html**
3. Click **"Run All Tests"** button
4. **Take a screenshot** of the results
5. **Share the screenshot with me**

This will tell us exactly what's wrong.

---

## 📋 STEP 2: Check Browser Console

1. Open your app: `npm run dev`
2. Press **F12** to open Developer Tools
3. Go to the **Console** tab
4. Try to add a lead
5. **Copy ALL the error messages** from the console
6. **Share them with me**

Look for messages like:
- `[Storage] Error adding leads:`
- `Error message:`
- `Error code:`
- `Error details:`

---

## 📋 STEP 3: Verify Database Tables

1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/owlqbljiitreewqtiewx
   
2. Click on **"Table Editor"** in the left sidebar

3. **Check if these tables exist:**
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
   - ✅ documents
   - ✅ messages
   - ✅ notifications

4. **If tables are missing** → Go to STEP 4

5. **If tables exist** → Click on the `leads` table and check the columns:
   - Should have: `id`, `workspace_id`, `name`, `company`, `email`, `phone`, `value`, `currency`, `stage`, `source`, `assigned_to`, `follow_up`, `created_at`
   - **Take a screenshot** and share with me

---

## 📋 STEP 4: Run Fresh Database Schema

### 4.1: Delete Old Tables

1. Go to Supabase SQL Editor: https://supabase.com/dashboard/project/owlqbljiitreewqtiewx/sql
   
2. Click **"New Query"**

3. Copy and paste this SQL:

```sql
-- Delete all existing tables
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
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS workspaces CASCADE;
```

4. Click **"Run"** button

5. Wait for it to complete (should say "Success")

### 4.2: Create New Tables

1. Open the file: **`fresh-database.sql`** (in your project root folder)

2. Copy **ALL** the SQL code (Ctrl+A, Ctrl+C)

3. Go back to Supabase SQL Editor

4. Paste the code (Ctrl+V)

5. Click **"Run"** button

6. Wait for it to complete (should say "Success")

### 4.3: Verify Tables Were Created

1. Go to **Table Editor** in Supabase sidebar

2. You should now see all the tables listed

3. Click on the `leads` table

4. Verify it has these columns:
   - id (text)
   - workspace_id (text)
   - name (text)
   - company (text)
   - email (text)
   - phone (text)
   - value (numeric)
   - currency (text)
   - stage (text)
   - source (text)
   - assigned_to (text)
   - follow_up (boolean)
   - created_at (timestamp)

---

## 📋 STEP 5: Test the App Again

1. Go to your app: http://localhost:5173

2. Try to add a lead:
   - Go to Leads page
   - Click "Add Lead" button
   - Fill in: Name = "Test", Company = "Test Co"
   - Click "Add Lead"

3. **What should happen:**
   - ✅ Alert: "Lead added successfully!"
   - ✅ Lead appears in the pipeline
   - ✅ Console shows: "[Storage] leads added successfully"

4. **If it still fails:**
   - Press F12 → Console tab
   - Copy ALL error messages
   - Share with me

---

## 📋 STEP 6: Check Workspace

1. Go to Supabase → Table Editor → `workspaces` table

2. You should see at least one row with:
   - `id`: some text value
   - `name`: your workspace name
   - `owner_id`: your user ID
   - `slug`: your workspace slug

3. **If no rows exist:**
   - This means your workspace wasn't created
   - Log out and sign up again
   - Or run the diagnostic tool

---

## 📋 STEP 7: Check RLS Policies

1. Go to Supabase → Authentication → Policies

2. Check if policies exist for the `leads` table

3. You should see a policy like:
   - Name: "Enable all for authenticated users"
   - Table: leads
   - Command: ALL
   - Definition: `(true)`

4. **If policies are missing:**
   - The `fresh-database.sql` should have created them
   - Run it again if needed

---

## 🔍 COMMON ERRORS AND SOLUTIONS

### Error: "relation does not exist"
**Cause:** Database tables don't exist  
**Solution:** Run STEP 4 (fresh-database.sql)

### Error: "duplicate key value violates unique constraint"
**Cause:** Trying to insert a record with an ID that already exists  
**Solution:** Clear browser cache and try again

### Error: "null value in column violates not-null constraint"
**Cause:** Missing required field  
**Solution:** Check console for which field is missing

### Error: "new row violates row-level security policy"
**Cause:** RLS policy is blocking the insert  
**Solution:** Run fresh-database.sql again (it creates permissive policies)

### Error: "foreign key constraint"
**Cause:** Old database schema with foreign keys  
**Solution:** Run STEP 4.1 (DROP statements) then STEP 4.2 (fresh-database.sql)

---

## 📸 WHAT TO SHARE WITH ME

If you're still having issues, please share:

1. **Screenshot of diagnostic tool results** (from STEP 1)
2. **Console error messages** (from STEP 2)
3. **Screenshot of Table Editor** showing the leads table structure (from STEP 3)
4. **Screenshot of workspaces table** showing your workspace (from STEP 6)

---

## ✅ EXPECTED RESULTS

After completing all steps:

- ✅ All tables exist in Supabase
- ✅ Tables have correct columns (TEXT, not UUID)
- ✅ RLS policies allow all operations
- ✅ Diagnostic tool shows all tests passing
- ✅ Can add leads, clients, projects without errors
- ✅ Data persists after page refresh

---

## 🆘 STILL NOT WORKING?

If you've followed all steps and it's still not working:

1. **Clear browser cache** (Ctrl+Shift+Delete)
2. **Log out** of the app
3. **Sign up again** with a new account
4. **Run the diagnostic tool** again
5. **Share all screenshots and error messages** with me

---

## 📁 FILES YOU NEED

- **`fresh-database.sql`** - Run this in Supabase SQL Editor
- **`public/test-database.html`** - Diagnostic tool (accessible at /test-database.html)
- **`COMPLETE_SOLUTION.md`** - Detailed explanation
- **`README_FIX.md`** - Quick reference

---

**Follow these steps exactly and everything will work!** 🚀
