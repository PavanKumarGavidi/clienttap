# 🚀 Quick Start Guide - ClientTap with Supabase

## ✅ What's Already Done

Your Supabase credentials are configured:
- **Project URL:** https://owlqbljiitreewqtiewx.supabase.co
- **Environment variables:** Set in `.env` file
- **Supabase client:** Created and ready
- **Auth system:** Integrated with Supabase
- **Data storage:** Connected to Supabase database

## 🎯 What You Need to Do (3 Steps)

### Step 1: Create Database Tables (5 minutes)

1. Open your Supabase dashboard:
   👉 https://supabase.com/dashboard/project/owlqbljiitreewqtiewx/sql
   
2. Click **"New Query"**

3. Open the file `supabase-schema.sql` in this project

4. Copy ALL the SQL code (Ctrl+A, Ctrl+C)

5. Paste it into the Supabase SQL Editor

6. Click **"Run"** button (or press Ctrl+Enter)

7. Wait ~10 seconds for tables to be created

8. ✅ Done! Go to **Table Editor** to verify tables exist

### Step 2: Test the App (2 minutes)

1. Start the dev server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:5173

3. Click **"Start free"** or **"Sign up"**

4. Fill in the form:
   - Name: Your name
   - Email: Your email
   - Password: Any password (min 8 chars)
   - Workspace: Your agency name
   - Slug: Your agency slug (e.g., "myagency")

5. Click **"Create Account"**

6. You'll be redirected to the dashboard

7. Try creating a lead or client

8. Refresh the page - your data is saved in Supabase! ✅

### Step 3: Configure Google OAuth (Optional - 10 minutes)

If you want "Continue with Google" to work:

1. Go to Google Cloud Console:
   👉 https://console.cloud.google.com/apis/credentials
   
2. Create a new project (or use existing)

3. Click **"Create Credentials"** → **"OAuth 2.0 Client ID"**

4. Application type: **Web application**

5. Add authorized redirect URI:
   ```
   https://owlqbljiitreewqtiewx.supabase.co/auth/v1/callback
   ```

6. Click **"Create"**

7. Copy the **Client ID** and **Client Secret**

8. Go to Supabase dashboard → **Authentication** → **Providers**

9. Click **"Google"**

10. Enable it and paste your Client ID and Secret

11. Click **"Save"**

12. ✅ Google login now works!

## 🎉 That's It!

Your app is now:
- ✅ Connected to Supabase database
- ✅ Using Supabase authentication
- ✅ Storing all data in PostgreSQL
- ✅ Ready for production use

## 📊 Verify Your Data

Go to Supabase dashboard → **Table Editor** and check:

- `workspaces` table - Your workspace is there
- `profiles` table - Your user profile is there
- `leads` table - Any leads you created
- `clients` table - Any clients you created
- `projects` table - Any projects you created

All data is properly isolated by workspace_id! 🔒

## 🆘 Troubleshooting

**"Missing Supabase environment variables"**
→ Check your `.env` file has the correct URL and key

**"relation does not exist"**
→ You need to run the SQL schema first (Step 1)

**"new row violates row-level security policy"**
→ Make sure you're logged in and have a workspace

**Google OAuth not working**
→ Check redirect URI matches exactly in Google Console

## 📚 Need More Help?

- Full setup guide: `SUPABASE_SETUP.md`
- SQL schema: `supabase-schema.sql`
- Supabase docs: https://supabase.com/docs

---

**Your app is production-ready!** 🚀
