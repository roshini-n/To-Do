# Quick Start Guide 🚀

This guide will help you get the Job Tracker application running in minutes!

## ⚡ Fast Setup (5 minutes)

### Step 1: Start PostgreSQL
```bash
# On Mac with Homebrew
brew services start postgresql

# Or using Docker
docker run --name jobtracker-db -e POSTGRES_PASSWORD=password -d postgres:15
```

### Step 2: Create Database
```bash
createdb job_tracker_db
```

### Step 3: Backend Setup & Run
```bash
cd backend
npm install
cp .env.example .env

# Edit .env with your PostgreSQL credentials:
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=job_tracker_db
# DB_USER=postgres
# DB_PASSWORD=password

npm run dev
# Backend runs on http://localhost:5000
```

### Step 4: Frontend Setup & Run (New Terminal)
```bash
cd frontend
npm install
npm start
# Frontend runs on http://localhost:3000
```

✅ **Done!** The app is now running at `http://localhost:3000`

## 📝 First Steps in the App

1. **Create an Account**
   - Click "Sign Up"
   - Use a test email and strong password
   - Password must have: uppercase, number, special character, 8+ chars

2. **Add Your First Job Application**
   - Navigate to "Applications"
   - Click "+ Add Application"
   - Fill in: Company, Role, Platform, Date
   - Click "Save Application"

3. **Log an Activity**
   - Navigate to "Activities"
   - Click "+ Log Activity"
   - Choose type, add duration, and submit

4. **View Dashboard**
   - Click "Dashboard"
   - See your stats and upcoming reminders

## 🧪 Testing the API

### Test Signup
```bash
curl -X POST http://localhost:5000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","fullName":"John Doe"}'
```

### Test Login
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'
```

Save the returned token and use it for protected endpoints:

### Test Get Applications (with token)
```bash
curl -X GET http://localhost:5000/applications \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🐛 Common Issues

**Backend won't start**
- Check PostgreSQL is running: `psql -U postgres`
- Check port 5000 is free: `lsof -i :5000`

**Database connection failed**
- Verify .env credentials match your PostgreSQL setup
- Ensure database exists: `psql -l`

**Frontend can't connect to backend**
- Check backend is running on port 5000
- Check browser console for CORS errors

**Password validation error**
- Password needs: min 8 chars, 1 uppercase, 1 number, 1 special (!@#$%^&*)

## 📚 Next Steps

1. Customize the app with your branding
2. Add more activity types
3. Implement email notifications
4. Deploy to production

## 🎯 What's Included

✅ User Authentication with JWT  
✅ Job Application Tracking  
✅ Activity/Time Logging  
✅ Reminder System with Scheduling  
✅ Dashboard with Statistics  
✅ Responsive UI  
✅ PostgreSQL Database  
✅ Clean & Scalable Architecture  

---

**Need help?** Check SETUP.md for detailed instructions.
