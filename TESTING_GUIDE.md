# Testing Guide - To-Do Application

## Overview
This guide helps you verify that the to-do application is working correctly with Supabase integration. All issues related to session persistence and data saving have been fixed.

## What Was Fixed
1. ✅ **Session Persistence** - Updated App.js to use Supabase Auth properly with session subscriptions
2. ✅ **Applications Form Fields** - Changed all form field names from snake_case to camelCase to match service expectations
3. ✅ **Error Logging** - Enhanced error messages in handleSubmit functions
4. ✅ **React Imports** - Fixed index.js React import issue

## Complete Testing Workflow

### Step 1: Start the Application
```bash
cd /Users/roshininaguru/Documents/GitHub/To-Do/frontend
npm start
```
- App should open at `http://localhost:3000`
- You should be redirected to `/login` page

### Step 2: Create a New Account (Sign Up)
**Test: Email Confirmation & Account Creation**

1. Click **"Sign Up"** link on login page
2. Fill in the form:
   - Email: `test@example.com` (use a real email or a test email)
   - Password: `TestPassword123`
   - Full Name: `Test User`
3. Click **"Sign Up"** button

**Expected Results:**
- ✅ "Signup successful! A confirmation email has been sent" message appears
- ✅ Page redirects to dashboard after a few seconds
- ✅ You remain logged in (navbar shows, not redirected to login)
- ✅ Check your email inbox for confirmation link (if using real email)

**If this fails:**
- Check browser console for error messages
- Verify Supabase project credentials in `/frontend/src/config/supabase.js`
- Check Supabase dashboard to see if user was created

### Step 3: Navigate to Applications Page
**Test: Page Access & Initial Load**

1. Click **"Applications"** in navbar
2. Verify page loads without errors

**Expected Results:**
- ✅ Applications page loads
- ✅ Empty list is shown (or existing applications if you've added any)
- ✅ **"+ Add Application"** button is visible

### Step 4: Create a Job Application
**Test: Data Saving & Form Validation**

1. Click **"+ Add Application"** button
2. Fill in the form:
   - Company Name: `Google`
   - Job Role: `Senior Frontend Engineer`
   - Platform: `LinkedIn`
   - Applied Date: `2024-01-15` (today's date or past date)
   - Status: `Applied`
   - Recruiter Email: `recruiter@google.com`
   - Recruiter Contact: `John Smith`
3. Click **"Save Application"** button

**Expected Results:**
- ✅ Form submission is successful
- ✅ Form clears and closes automatically
- ✅ New application appears in the list below
- ✅ Application shows company name, job role, platform, status, and date

**If data doesn't save:**
- Check browser console (F12 → Console tab) for error messages
- Look for errors like "User not authenticated" or "Permission denied"
- Verify the application shows in the Supabase dashboard:
  - Go to https://app.supabase.com
  - Select your project
  - Go to SQL Editor or Table Editor
  - Check `job_applications` table
  - Filter by your user_id

**Common Issues:**
- **"User not authenticated"**: Session wasn't properly initialized. Refresh page and try again.
- **"Permission denied"**: RLS policies not allowing INSERT. Check Supabase dashboard policies.

### Step 5: Test Session Persistence (Critical Test)
**Test: Session Persistence After Page Refresh**

1. Ensure you're logged in and on the Applications page with data visible
2. Press `F5` or `Cmd+R` to refresh the page
3. Wait for page to reload

**Expected Results:**
- ✅ Page reloads and stays at Applications page
- ✅ **You are NOT redirected to login page**
- ✅ Navbar is still visible
- ✅ Your applications are still displayed

**If you get redirected to login:**
- This means session wasn't persisted
- Check browser DevTools → Application → Cookies/LocalStorage
- Look for `sb-*` cookies from Supabase (should be present)
- This indicates a session initialization issue

### Step 6: Add Multiple Applications
**Test: Multiple Data Saves**

1. Add 3-4 more applications using different companies
2. Each should save successfully
3. Verify all appear in the list

**Expected Results:**
- ✅ All applications save without errors
- ✅ List shows all applications in reverse chronological order (newest first)
- ✅ Each application displays correct information

### Step 7: Navigate to Activities Page
**Test: Activities Tracking**

1. Click **"Activities"** in navbar
2. Page should load with date picker and empty activity list for today

**Expected Results:**
- ✅ Activities page loads
- ✅ Date picker shows today's date
- ✅ Empty activity list is shown
- ✅ **"+ Log Activity"** button is visible

### Step 8: Create an Activity Entry
**Test: Activity Data Saving**

1. Click **"+ Log Activity"** button
2. Fill in the form:
   - Activity Type: `Job Application`
   - Title: `Applied to Google for SDE role`
   - Duration: `60` minutes
   - Description: `Applied through LinkedIn`
3. Click **"Save Activity"** button

**Expected Results:**
- ✅ Activity saves successfully
- ✅ Activity appears in the list
- ✅ Shows activity type, title, duration, and timestamp

### Step 9: Change Date and Verify Activity History
**Test: Date-Specific Activity Retrieval**

1. Use the date picker to select **yesterday's date**
2. Verify no activities show for yesterday (or previous activities if any)
3. Change back to **today's date**
4. Verify your activities from today show again

**Expected Results:**
- ✅ Activities correctly filter by date
- ✅ Today's activities reappear when you switch back
- ✅ No errors when changing dates

### Step 10: Test Logout and Re-login
**Test: Logout & Session Recovery**

1. Click **"Logout"** in navbar
2. Verify you're redirected to login page
3. Login again with your credentials:
   - Email: `test@example.com`
   - Password: `TestPassword123`

**Expected Results:**
- ✅ Logout works and redirects to login
- ✅ Login works with same credentials
- ✅ Dashboard appears after login
- ✅ Your previous data (applications, activities) is still there

### Step 11: Test Password Recovery
**Test: Forgot Password Flow**

1. Go to login page: `http://localhost:3000/login`
2. Click **"Forgot Password?"** link
3. Enter your email address
4. Click **"Send Reset Email"** button

**Expected Results:**
- ✅ Success message appears: "Password reset email sent"
- ✅ Check your email for password reset link (if using real email)
- ✅ You can click the link to reset password

## Verification Checklist

### Core Functionality
- [ ] Sign up creates account and sends confirmation email
- [ ] Login works with correct credentials
- [ ] Session persists after page refresh (YOU STAY LOGGED IN)
- [ ] Logout clears session and redirects to login
- [ ] Forgot password sends email

### Applications Feature
- [ ] Can create new application with all fields
- [ ] Application data saves to Supabase
- [ ] Can edit existing application
- [ ] Can delete application
- [ ] Applications list loads on page visit
- [ ] Can search/filter applications (if implemented)

### Activities Feature
- [ ] Can log activity with all fields
- [ ] Activity data saves to Supabase
- [ ] Activities filter by selected date
- [ ] Can view activity history

### Data Persistence
- [ ] Page refresh keeps user logged in
- [ ] Page refresh preserves data
- [ ] Switching between pages keeps user logged in
- [ ] Closing and reopening browser keeps user logged in

### Error Handling
- [ ] Form validation works (empty fields are rejected)
- [ ] Error messages are clear and helpful
- [ ] Network errors are handled gracefully
- [ ] No console errors for normal operations

## Database Verification

To verify data is actually being saved to Supabase:

1. Go to https://app.supabase.com
2. Log in with your Supabase account
3. Select your project: `qjqijkscpyahastebwvb`
4. Navigate to **SQL Editor** or **Table Editor**
5. Check these tables:
   - `job_applications` - Should have your applications
   - `activities` - Should have your activities
   - `auth.users` - Should show your user account

## Troubleshooting

### Session Lost After Refresh
**Symptoms:** After logging in and refresh, redirected back to login

**Solutions:**
1. Check browser console (F12) for errors
2. Clear browser cache and cookies
3. Verify Supabase config in `frontend/src/config/supabase.js`
4. Check that `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_KEY` are in `.env`
5. Restart the development server

### Data Not Saving
**Symptoms:** Form submits but data doesn't appear in list or Supabase

**Solutions:**
1. Open browser DevTools → Console tab
2. Look for error messages in red
3. Check if error mentions "User not authenticated"
4. Try the operation again after refreshing page
5. Verify user exists in Supabase dashboard

### Applications Not Loading
**Symptoms:** Page loads but application list is empty when it should have data

**Solutions:**
1. Verify user is logged in (check navbar)
2. Check browser console for API errors
3. Manually check Supabase dashboard to see if data exists
4. Try adding a new application to verify save works first

### Email Confirmations Not Received
**Symptoms:** Signup succeeds but no confirmation email arrives

**Solutions:**
1. Check spam/junk folder
2. Use a different email address
3. Supabase SMTP might not be configured - contact Supabase support
4. Application still works even without email confirmation

## Performance Notes

- First load may take 2-3 seconds while checking session
- Form submission should take 1-2 seconds
- Page navigation should be instant
- Activity list filtering by date should be instant

## Next Steps After Testing

If all tests pass:
- ✅ Application is fully functional
- ✅ Data persistence is working
- ✅ Session management is working
- ✅ Ready for production or further feature development

If tests fail:
- Check console errors (F12 → Console)
- Review the Troubleshooting section
- Check if Supabase credentials are correct
- Verify database tables have proper RLS policies enabled

## Support

For detailed logs, check:
- Browser Console: F12 → Console tab
- Network tab: F12 → Network tab (to see API calls)
- Application tab: F12 → Application → LocalStorage/Cookies (to see Supabase session)
