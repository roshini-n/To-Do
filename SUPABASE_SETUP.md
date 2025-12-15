# Supabase Setup Guide

## 📋 Step 1: Create Database Tables

Login to your Supabase dashboard and go to **SQL Editor**. Run these SQL commands to create the required tables:

### 1. Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only read/update their own data
CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);
```

### 2. Job Applications Table
```sql
CREATE TABLE job_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  job_role TEXT NOT NULL,
  platform TEXT,
  application_date DATE NOT NULL,
  status TEXT DEFAULT 'Applied',
  recruiter_email TEXT,
  recruiter_contact TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their own applications
CREATE POLICY "Users can read own applications"
  ON job_applications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create applications"
  ON job_applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own applications"
  ON job_applications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own applications"
  ON job_applications FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX job_applications_user_id_idx ON job_applications(user_id);
CREATE INDEX job_applications_status_idx ON job_applications(status);
CREATE INDEX job_applications_date_idx ON job_applications(application_date);
```

### 3. Activities Table
```sql
CREATE TABLE activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  topic TEXT,
  duration_minutes INTEGER NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Policies: Users can only access their own activities
CREATE POLICY "Users can read own activities"
  ON activities FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create activities"
  ON activities FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own activities"
  ON activities FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own activities"
  ON activities FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX activities_user_id_idx ON activities(user_id);
CREATE INDEX activities_date_idx ON activities(date);
CREATE INDEX activities_type_idx ON activities(activity_type);
```

### 4. Reminders Table
```sql
CREATE TABLE reminders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  application_id UUID REFERENCES job_applications(id) ON DELETE CASCADE,
  reminder_text TEXT NOT NULL,
  reminder_date DATE NOT NULL,
  is_notified BOOLEAN DEFAULT FALSE,
  notified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

-- Policies: Users can only access their own reminders
CREATE POLICY "Users can read own reminders"
  ON reminders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create reminders"
  ON reminders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reminders"
  ON reminders FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reminders"
  ON reminders FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX reminders_user_id_idx ON reminders(user_id);
CREATE INDEX reminders_date_idx ON reminders(reminder_date);
CREATE INDEX reminders_is_notified_idx ON reminders(is_notified);
```

---

## 🔐 Step 2: Enable Authentication

1. Go to **Authentication** in Supabase dashboard
2. Click **Providers**
3. Ensure **Email** provider is enabled
4. Configure email templates if needed

---

## 📧 Step 3: Set Up Email Notifications (Optional)

### Using Supabase Edge Functions for Notifications:

1. Go to **Edge Functions** in dashboard
2. Create a new function named `send-reminders`:

```typescript
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export const handler = async (req: any) => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Get pending reminders
  const { data: reminders, error } = await supabase
    .from('reminders')
    .select('*, users(email)')
    .eq('is_notified', false)
    .lte('reminder_date', new Date().toISOString().split('T')[0]);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }

  // Mark reminders as notified
  for (const reminder of reminders || []) {
    await supabase
      .from('reminders')
      .update({ is_notified: true, notified_at: new Date().toISOString() })
      .eq('id', reminder.id);
  }

  return new Response(JSON.stringify({ sent: reminders?.length || 0 }), {
    status: 200,
  });
};
```

---

## 🔑 Step 4: Get Your Credentials

Your Supabase credentials are already configured:

- **Project URL**: `https://qjqijkscpyahastebwvb.supabase.co`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (configured in `.env`)

---

## ✅ Step 5: Test the Setup

1. Start your React app: `npm start`
2. Try signing up with an email
3. Check Supabase dashboard → **Auth** users section
4. Add a job application
5. Check **SQL Editor** → Run: `SELECT * FROM job_applications;`

---

## 📊 Verification Checklist

- [ ] All 4 tables created
- [ ] RLS policies enabled
- [ ] Can sign up new user
- [ ] User appears in Auth section
- [ ] User profile created in users table
- [ ] Can create job application
- [ ] Can log activity
- [ ] Can view reminders

---

## 🚀 Your App is Ready!

Your Supabase integration is complete. The frontend services will:
- ✅ Handle authentication automatically
- ✅ Store data in Supabase
- ✅ Manage job applications
- ✅ Track activities
- ✅ Create reminders

No more need for a Node.js/Express backend!
