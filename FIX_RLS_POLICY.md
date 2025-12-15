# Fix RLS Policy Error - Update Your Supabase Tables

The error "row-level security policy" means we need to update the RLS policies to allow users to create their profiles.

## Quick Fix (2 minutes)

Go to **Supabase Dashboard → SQL Editor** and run these commands:

### Option 1: Update Users Table RLS (Recommended)

Replace your existing users table RLS policies with this:

```sql
-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;

-- Create new policies that allow insertion
CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own data"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can delete own data"
  ON users FOR DELETE
  USING (auth.uid() = id);
```

### Option 2: Create a Trigger (Advanced)

If you want auto-created user profiles, run this:

```sql
-- Create a function to auto-create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to call the function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## What Changed

| Before | After |
|--------|-------|
| Manual insert in signup | Auto-created via Supabase Auth |
| RLS only allowed select/update | RLS now allows insert too |
| User profile not guaranteed | User profile auto-created |

---

## After Updating:

1. Go back to your app: http://localhost:3000
2. Refresh the page (Ctrl+R or Cmd+R)
3. Try signing up again with: `test@example.com`
4. Should work now! ✅

---

## If Still Having Issues:

Try disabling RLS temporarily (not recommended for production):

```sql
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE activities DISABLE ROW LEVEL SECURITY;
ALTER TABLE reminders DISABLE ROW LEVEL SECURITY;
```

Then re-enable after signup works:

```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
```
