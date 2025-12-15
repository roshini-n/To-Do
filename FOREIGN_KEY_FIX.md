# Foreign Key Constraint Fix

## Problem
Error: `insert or update on table "job_applications" violates foreign key constraint "job_applications_user_id_fkey"`

This happens because:
1. Supabase Auth creates users in `auth.users` table
2. Our application requires users in `public.users` table
3. `job_applications` has a foreign key pointing to `public.users`

## Solution Applied
Updated `frontend/src/services/authService.js` to automatically create a `public.users` record when a user signs up.

## For Existing Test Accounts

If you have existing test accounts that were created before this fix, you need to manually add them to the `public.users` table.

### Option 1: Delete & Recreate (Easiest)
1. Delete your test account(s) from Supabase dashboard
2. Sign up again with your email - the new signup will automatically create the `public.users` record

### Option 2: Manually Add to Database (Keep Existing Data)
1. Go to https://app.supabase.com
2. Select your project: `qjqijkscpyahastebwvb`
3. Go to **SQL Editor**
4. Run this query to add missing user records:

```sql
-- Add users from auth.users that are missing from public.users
INSERT INTO public.users (id, email, full_name, created_at)
SELECT 
  id, 
  email, 
  raw_user_meta_data->>'full_name' as full_name,
  created_at
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.users)
ON CONFLICT (id) DO NOTHING;
```

5. Click **Run** button

This will add any auth users to the public users table that are missing.

## How It Works Now

### Signup Flow
```
1. User signs up with email & password
   ↓
2. Supabase Auth creates record in auth.users
   ↓
3. Auth returns user object
   ↓
4. authService automatically creates record in public.users
   ↓
5. Now user can create applications, activities, etc. ✅
```

### Key Changes
- File: `frontend/src/services/authService.js`
- New code creates `public.users` record after auth signup
- Handles errors gracefully if insertion fails
- Existing functionality unchanged

## Testing

1. **Delete your old test accounts** from Supabase dashboard (if any)
2. Sign up with a new email: `test@example.com`
3. Try creating a job application
4. Application should save successfully ✅

## Prevention Going Forward

All new signups will automatically create both:
- ✅ `auth.users` record (Supabase Auth)
- ✅ `public.users` record (Application users table)

This prevents the foreign key constraint error in the future.
