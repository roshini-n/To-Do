# Job Application & Productivity Tracker 📊

A full-stack web application designed to help recent graduates track job applications, manage study time, and maintain productivity during their job search journey.

## 🎯 Features

### ✅ Authentication & User Management
- **Secure Signup/Login** with email and password
- **Password Security**: Bcrypt hashing with strong password requirements
- **JWT Tokens**: Secure session management
- **Protected Routes**: Only authenticated users can access their data

### 📋 Job Application Tracking
- Track **100+ job applications** seamlessly
- Record detailed information:
  - Company name and job role
  - Application platform (LinkedIn, Dice, Indeed, etc.)
  - Application date (auto-tracked)
  - Application status (Applied, Interview, Offer, Rejected, No Response)
  - Recruiter contact information
  - Application links and notes
- **Status Management**: Update application progress in real-time
- **Statistics Dashboard**: View total applications, pending apps, interviews, and offers

### ⏰ Reminder & Notification System
- **Automatic Follow-up Reminders**: 7-day follow-up reminders for pending applications
- **Scheduled Tasks**: Background job that checks reminders hourly
- **Customizable Reminders**: Create custom reminders for study goals or application targets
- **Notification Display**: View pending and upcoming reminders

### 📚 Activity Tracking
- **Log Daily Activities**: Study, Job Applications, Interviews, Leisure, etc.
- **Time Tracking**: Record duration for each activity
- **Daily Timeline**: Visual timeline of all activities for a specific day
- **Study Statistics**: Total study hours, activity breakdown over 7 days
- **Activity History**: Browse activities by date range

### 📈 Dashboard & Analytics
- **Quick Stats**: Total applications, interviews, offers, rejections
- **Activity Summary**: Study hours and activity breakdown
- **Upcoming Reminders**: See your next 7 days of reminders
- **Progress Tracking**: Visual overview of your job search progress

## 🛠 Tech Stack

### Backend
- **Framework**: Node.js with Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: Bcrypt
- **Scheduled Tasks**: node-cron
- **API Client**: Axios

### Frontend
- **Framework**: React 18
- **Routing**: React Router v6
- **Styling**: CSS3 with custom styles
- **HTTP Client**: Axios

## 📦 Project Structure

```
To-Do/
├── backend/
│   ├── src/
│   │   ├── config/           # Database configuration
│   │   ├── controllers/      # Request handlers
│   │   ├── models/           # Database models
│   │   ├── routes/           # API routes
│   │   ├── middleware/       # Authentication & error handling
│   │   ├── services/         # Business logic (reminders)
│   │   ├── utils/            # Utilities (auth, validation)
│   │   └── index.ts          # Server entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/       # Reusable React components
    │   ├── pages/            # Page components
    │   ├── services/         # API communication
    │   ├── utils/            # Utility functions
    │   ├── App.js
    │   └── index.js
    ├── public/
    │   └── index.html
    ├── package.json
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** 16+ and npm/yarn
- **PostgreSQL** 12+ (running locally or remotely)
- **Git**

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Configure database connection in `.env`**
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=job_tracker_db
   DB_USER=postgres
   DB_PASSWORD=your_password
   JWT_SECRET=your_jwt_secret_key_here
   PORT=5000
   FRONTEND_URL=http://localhost:3000
   ```

5. **Create PostgreSQL database**
   ```bash
   createdb job_tracker_db
   ```

6. **Start the backend server (development mode)**
   ```bash
   npm run dev
   ```

   The server will start at `http://localhost:5000`

### Frontend Setup

1. **Open new terminal and navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the React development server**
   ```bash
   npm start
   ```

   The app will open at `http://localhost:3000`

## 📝 API Endpoints

### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login user

### Job Applications
- `POST /applications` - Create application
- `GET /applications` - Get all applications
- `GET /applications/:id` - Get specific application
- `PUT /applications/:id` - Update application
- `DELETE /applications/:id` - Delete application
- `GET /applications/stats` - Get statistics

### Activities
- `POST /activities` - Log activity
- `GET /activities/daily?date=YYYY-MM-DD` - Get daily activities
- `GET /activities/range?startDate=&endDate=` - Get activities by date range
- `GET /activities/stats?days=7` - Get activity statistics

### Reminders
- `POST /reminders` - Create reminder
- `GET /reminders/pending` - Get pending reminders
- `GET /reminders/upcoming?days=7` - Get upcoming reminders
- `PUT /reminders/:id/notified` - Mark reminder as notified

## 🔐 Security Features

1. **Password Hashing**: Bcrypt with 10 salt rounds
2. **JWT Authentication**: Tokens expire after 7 days (configurable)
3. **Input Validation**: Server-side validation for all inputs
4. **Password Requirements**:
   - Minimum 8 characters
   - At least one uppercase letter
   - At least one number
   - At least one special character (!@#$%^&*)
5. **Protected Routes**: All sensitive routes require valid JWT
6. **CORS Protection**: Configured for frontend origin

## 📱 Usage Guide

### Adding a Job Application
1. Click "Applications" in navigation
2. Click "+ Add Application"
3. Fill in company name, job role, platform, and date
4. (Optional) Add recruiter contact and notes
5. Click "Save Application"

### Logging Activities
1. Click "Activities" in navigation
2. Select the date for the activity
3. Click "+ Log Activity"
4. Choose activity type and enter duration
5. Click "Log Activity"

### Viewing Dashboard
1. Click "Dashboard" to see:
   - Total applications
   - Interviews and offers count
   - Study hours (last 7 days)
   - Pending reminders

## 🔄 Background Tasks

The reminder scheduler runs automatically:
- **Daily at 8:00 AM**: Creates follow-up reminders for 7-day-old applications
- **Every hour**: Checks for pending reminders to process

## 🎨 Future Enhancements

- **Browser Notifications**: Real-time desktop alerts
- **Email Notifications**: Email reminders for follow-ups
- **Analytics Charts**: Recharts integration for visual statistics
- **Export Data**: Export applications to CSV/PDF
- **Mobile App**: React Native version
- **Interview Prep**: Interview question bank and preparation tracker

## 🐛 Troubleshooting

### Database connection error
- Check PostgreSQL is running: `psql -U postgres`
- Verify `.env` credentials match your setup
- Ensure database exists: `createdb job_tracker_db`

### API not responding
- Check backend is running on port 5000
- Verify CORS configuration in backend
- Check frontend `.env` has correct API URL

## 📄 License

This project is open source and available under the MIT License.

---

**Happy job hunting! 🎯**
