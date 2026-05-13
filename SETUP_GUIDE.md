# Authentication & Database Setup Guide

## Overview
This guide walks you through the final setup required to complete the sign-in and sign-up functionality for your Team Stock Invest application.

## Status
✅ **Frontend Auth Pages**: Both login and signup pages are working correctly with Supabase client integration.
✅ **Auth Callback Route**: Created to handle email confirmation and OAuth redirects.
✅ **Environment Variables**: Configured in `/vercel/share/.env.project` and `.env.local`.
⏳ **Database Schema**: SQL migration ready, needs to be executed in Supabase.

## What Was Fixed

### 1. Created Auth Callback Route (`/app/auth/callback/route.ts`)
- Handles Supabase email confirmation links
- Handles OAuth provider redirects
- Exchanges authorization codes for user sessions
- Redirects authenticated users to the dashboard

### 2. Updated Dashboard (`/app/dashboard/page.tsx`)
- Now gracefully handles missing database tables
- Won't crash if `profiles` or `accounts` tables don't exist yet
- Uses fallback values while tables are being set up

### 3. Created Database Migration File
- Located at: `/supabase/migrations/001_create_profiles_and_accounts.sql`
- Creates two tables:
  - **profiles**: Stores user profile information (name, etc.)
  - **accounts**: Stores financial data (balance, deposits, investments)
- Includes Row Level Security (RLS) policies to protect user data
- Includes auto-trigger to create profile records on user signup

### 4. Configured Environment Variables
- Created `.env.local` with all required Supabase credentials
- Variables now available to both server and client code

## Next Steps: Execute the Database Migration

You MUST run the SQL migration to complete the setup. Follow these steps:

### Option 1: Via Supabase Dashboard (Recommended)
1. Go to https://app.supabase.com
2. Select your project: **Teamstockinvest.us**
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy the entire contents of `/supabase/migrations/001_create_profiles_and_accounts.sql`
6. Paste it into the SQL Editor
7. Click **Run** (or press Ctrl+Enter)
8. Verify both tables were created successfully

### Option 2: Via Vercel CLI (If Deployed)
If your project is deployed to Vercel, use the Supabase CLI:
```bash
supabase db push
```

## Testing the Auth Flow

Once the database migration is complete:

1. **Sign Up**: Visit `/auth/signup` and create a new account
   - Email confirmation will be required
   - Check your email for the confirmation link
   
2. **Sign In**: Visit `/auth/login` with your credentials
   - You'll be redirected to `/dashboard` on successful login
   - Your profile and account records will auto-create

3. **Protected Routes**: Dashboard is protected by authentication middleware
   - Unauthorized users are redirected to login

## Troubleshooting

### Issue: "Table does not exist" error
**Solution**: The SQL migration hasn't been executed yet. Follow the "Execute the Database Migration" section above.

### Issue: Email confirmation not working
**Solution**: Check that the `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` environment variable is correctly set to your app's auth callback URL.

### Issue: Users can't access dashboard after login
**Solution**: Ensure the RLS policies were created correctly. Check Supabase Dashboard → Authentication → Policies.

## Security Notes

✅ **Row Level Security (RLS)**: All tables have RLS enabled
- Users can only view/edit their own data
- Database enforces permissions at the row level

✅ **Password Security**: Supabase handles password hashing and secure session management
✅ **API Keys**: The `NEXT_PUBLIC_SUPABASE_ANON_KEY` is safe to expose (anon/public key only)

## Architecture

```
Frontend (Next.js)
    ↓
Supabase Auth (Email/Password)
    ↓
Supabase PostgreSQL Database
    ├── profiles (user profiles with RLS)
    └── accounts (financial data with RLS)
```

## Files Modified

- ✨ Created: `/app/auth/callback/route.ts`
- ✨ Created: `/supabase/migrations/001_create_profiles_and_accounts.sql`
- 📝 Modified: `/app/dashboard/page.tsx` (added error handling)
- 📝 Created: `.env.local` (gitignored for security)

## Support

If you encounter issues:
1. Check the browser console for errors (F12)
2. Check Supabase project logs: Dashboard → Logs
3. Verify all environment variables are set in the Vercel project settings
4. Ensure the SQL migration was executed successfully
