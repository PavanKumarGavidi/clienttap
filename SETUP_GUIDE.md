# ClientTap - Production Setup Guide

## 🚀 Quick Start

### 1. Supabase Database Setup

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Wait for the database to be ready

2. **Run the SQL Schema**
   - Go to SQL Editor in your Supabase dashboard
   - Copy the contents of `supabase-schema.sql`
   - Paste and run the SQL
   - This will create all tables, indexes, and RLS policies

3. **Verify Tables Created**
   - Go to Table Editor
   - You should see: workspaces, profiles, leads, clients, projects, invoices, payments, retainers, tasks, etc.

### 2. Google OAuth Setup

1. **Create Google OAuth Credentials**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client ID"
   - Application type: "Web application"
   - Add authorized redirect URIs:
     - `https://your-project-id.supabase.co/auth/v1/callback`
   - Save the Client ID and Client Secret

2. **Configure Supabase Authentication**
   - Go to Authentication → Providers in Supabase
   - Enable "Google" provider
   - Enter your Google Client ID and Client Secret
   - Save changes

3. **Update Redirect URL**
   - Go to Authentication → URL Configuration
   - Set Site URL to your app URL (e.g., `https://your-app.vercel.app`)
   - Add redirect URLs if needed

### 3. Connect App to Supabase

1. **Install Supabase Client**
   ```bash
   npm install @supabase/supabase-js
   ```

2. **Create Supabase Client**
   Create `src/lib/supabase.ts`:
   ```typescript
   import { createClient } from '@supabase/supabase-js';

   const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
   const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

   export const supabase = createClient(supabaseUrl, supabaseAnonKey);
   ```

3. **Add Environment Variables**
   Create `.env` file:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Update Auth Service**
   Replace localStorage implementation with Supabase calls in `src/lib/auth.ts`:
   ```typescript
   import { supabase } from './supabase';

   // Sign up
   const { data, error } = await supabase.auth.signUp({
     email,
     password,
     options: { data: { name, workspace_name } }
   });

   // Login
   const { data, error } = await supabase.auth.signInWithPassword({
     email,
     password
   });

   // Google OAuth
   const { data, error } = await supabase.auth.signInWithOAuth({
     provider: 'google',
     options: { redirectTo: window.location.origin + '/app/dashboard' }
   });

   // Logout
   await supabase.auth.signOut();
   ```

### 4. Storage Setup (for file uploads)

1. **Create Storage Buckets**
   - Go to Storage in Supabase
   - Create buckets:
     - `project-files` - for project attachments
     - `document-files` - for signed documents
     - `profile-avatars` - for user avatars
   - Set appropriate policies for each bucket

2. **Update File Upload Code**
   ```typescript
   const { data, error } = await supabase.storage
     .from('project-files')
     .upload(`workspace-${workspaceId}/${fileName}`, file);
   ```

### 5. Edge Functions (for automation)

Create Edge Functions for:
- **Auto-invoice retainers**: Run on billing day
- **Send reminders**: Meeting reminders, payment reminders
- **Lead follow-ups**: Auto-schedule follow-ups

Example retainer auto-invoicing function:
```typescript
// supabase/functions/auto-invoice-retainers/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // Get all active retainers due for invoicing
  const { data: retainers } = await supabase
    .from('retainers')
    .select('*')
    .eq('status', 'active')
    .eq('billing_day', new Date().getDate())

  // Create invoices for each
  for (const retainer of retainers || []) {
    await supabase.from('invoices').insert({
      workspace_id: retainer.workspace_id,
      client_id: retainer.client_id,
      amount: retainer.amount,
      currency: retainer.currency,
      status: 'sent',
      issued_date: new Date().toISOString().split('T')[0],
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    })
  }

  return new Response('OK')
})
```

Schedule with cron:
```bash
# Run daily at midnight
curl -X POST 'https://your-project-id.supabase.co/functions/v1/auto-invoice-retainers' \
  -H 'Authorization: Bearer your-service-role-key'
```

## 📊 Database Schema Overview

### Core Tables

| Table | Purpose |
|-------|---------|
| `workspaces` | Agency/freelancer workspaces |
| `profiles` | User profiles (extends auth.users) |
| `memberships` | Workspace membership |
| `leads` | Sales pipeline leads |
| `clients` | Client records |
| `projects` | Project tracking |
| `invoices` | Invoice records |
| `payments` | Payment records |
| `retainers` | Recurring retainers |
| `tasks` | Task management |
| `messages` | Client communication |
| `meetings` | Meeting schedules |
| `documents` | Contracts & proposals |
| `reviews` | Verified client reviews |

### Key Relationships

```
workspace (1) → (many) leads
workspace (1) → (many) clients
client (1) → (many) projects
project (1) → (many) invoices
invoice (1) → (many) payments
workspace (1) → (many) retainers
```

## 🔐 Security Features

### Row Level Security (RLS)

All tables have RLS enabled. Users can only access data from their own workspace.

Example policy:
```sql
CREATE POLICY "Workspace members can view leads"
  ON leads FOR SELECT
  USING (workspace_id IN (
    SELECT workspace_id FROM memberships WHERE user_id = auth.uid()
  ));
```

### Data Encryption

- Passwords: Hashed with bcrypt (via Supabase Auth)
- Sensitive data: Encrypted at rest
- Transit: All data encrypted via HTTPS

## 📧 Email Configuration

1. **Enable Email Provider**
   - Go to Authentication → Email Templates
   - Configure SMTP settings or use Supabase's built-in email

2. **Customize Templates**
   - Welcome email
   - Password reset
   - Invoice notifications
   - Meeting reminders

## 🎨 Customization

### Brand Colors

Update in `src/index.css`:
```css
--color-primary-600: #ea580c; /* Your brand color */
```

### Logo

Update workspace logo in Settings → Workspace

## 📱 Mobile App

The app is responsive and works on mobile. For a native app:

1. **PWA Setup**
   - Add `manifest.json` to `public/`
   - Add service worker for offline support

2. **Capacitor/React Native**
   - Wrap the web app with Capacitor
   - Build for iOS/Android

## 🚢 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy

### Netlify

1. Push code to GitHub
2. Connect to Netlify
3. Add environment variables
4. Deploy

## 🧪 Testing

### Test Google OAuth

1. Click "Continue with Google" on login page
2. Authorize with Google account
3. Verify user is created in Supabase
4. Verify workspace is created
5. Verify redirect to dashboard

### Test Data Persistence

1. Create a lead
2. Refresh page
3. Verify lead still exists
4. Check Supabase table editor

## 📈 Monitoring

### Supabase Dashboard

- **Logs**: View API calls and errors
- **Auth**: Monitor user signups/logins
- **Database**: Query performance
- **Storage**: File upload metrics

### Error Tracking

Add error tracking service:
```bash
npm install @sentry/react
```

## 🔧 Troubleshooting

### Google OAuth Not Working

1. Check redirect URIs in Google Console
2. Verify Supabase has correct Client ID/Secret
3. Check browser console for errors
4. Verify email is verified in Google account

### Data Not Persisting

1. Check browser console for errors
2. Verify Supabase connection
3. Check RLS policies
4. Verify environment variables

### RLS Policy Errors

1. Check user is authenticated
2. Verify workspace_id is set correctly
3. Check membership exists
4. Review policy syntax

## 📚 Additional Resources

- [Supabase Docs](https://supabase.com/docs)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Edge Functions](https://supabase.com/docs/guides/functions)

## 🆘 Support

For issues or questions:
1. Check the troubleshooting section
2. Review Supabase logs
3. Check browser console
4. Open an issue on GitHub

---

**Production Checklist:**

- [ ] Supabase project created
- [ ] SQL schema executed
- [ ] Google OAuth configured
- [ ] Environment variables set
- [ ] Storage buckets created
- [ ] Email templates customized
- [ ] RLS policies verified
- [ ] Edge functions deployed
- [ ] Error tracking enabled
- [ ] Monitoring configured
- [ ] Backup strategy in place
- [ ] Domain configured
- [ ] SSL certificate active
