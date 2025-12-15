# Job Application & Productivity Tracker 📊

> A complete full-stack web application for recent graduates to track job applications, manage study time, and maintain productivity during their job search.

## 🎯 Quick Links

- 🚀 **[QUICKSTART.md](QUICKSTART.md)** - Get running in 5 minutes!
- 📖 **[SETUP.md](SETUP.md)** - Detailed setup and API documentation
- 🏗️ **[PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md)** - Architecture and design
- 👨‍💻 **[DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md)** - Code patterns and extensions
- ✅ **[COMPLETION_SUMMARY.md](COMPLETION_SUMMARY.md)** - What's been built

## ✨ Features at a Glance

### 🔐 Authentication
Secure signup/login with JWT tokens and Bcrypt password hashing

### 📋 Job Application Tracking
Track 100+ applications with company, role, platform, status, and recruiter info

### ⏰ Smart Reminders
Automatic 7-day follow-up reminders for pending applications

### 📚 Activity Tracking
Log study sessions, job applications, interviews, and leisure time

### 📈 Dashboard & Analytics
Real-time statistics on applications, interviews, offers, and study hours

## 🛠 Tech Stack

```
Frontend: React 18 + React Router + Axios + CSS3
Backend: Node.js + Express + TypeScript
Database: PostgreSQL
Auth: JWT + Bcrypt
Scheduling: node-cron
```

## 🚀 Get Started in 5 Minutes

### Step 1: Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your PostgreSQL credentials
npm run dev
```

### Step 2: Frontend Setup (new terminal)
```bash
cd frontend
npm install
npm start
```

**Done!** App runs on [http://localhost:3000](http://localhost:3000)

👉 **[See QUICKSTART.md for detailed steps](QUICKSTART.md)**

## 📱 How It Works

### Add Applications
1. Sign up or login
2. Go to Applications page
3. Click "+ Add Application"
4. Fill in company, role, platform, date
5. Optionally add recruiter info and notes

### Log Activities
1. Go to Activities page
2. Select a date
3. Click "+ Log Activity"
4. Choose type (Study, Job App, Interview, etc.) and duration
5. Submit

### View Dashboard
1. Click Dashboard
2. See your stats:
   - Total applications
   - Interviews and offers
   - Study hours (last 7 days)
   - Upcoming reminders

## 📊 What's Included

✅ 50+ files of production-ready code  
✅ 16 fully-functional API endpoints  
✅ 4 database tables with optimization  
✅ Complete authentication system  
✅ Responsive, mobile-friendly UI  
✅ Comprehensive documentation  
✅ Security best practices  
✅ Clean, extensible architecture  

## 🔧 Key Features

| Feature | Description |
|---------|-------------|
| **Job Tracking** | Track applications with status, recruiter info, notes |
| **Activity Logging** | Log study time, interviews, and daily activities |
| **Smart Reminders** | Auto-reminders 7 days after application |
| **Statistics** | Real-time dashboard with key metrics |
| **Secure Auth** | JWT tokens with bcrypt password hashing |
| **Data Privacy** | User-scoped data - only see your own applications |
| **Responsive Design** | Works on desktop and mobile |
| **Production Ready** | Clean code, error handling, validation |

## 📖 Documentation

Each documentation file serves a specific purpose:

| File | Purpose |
|------|---------|
| **QUICKSTART.md** | 5-minute setup guide |
| **SETUP.md** | Complete installation + API docs |
| **PROJECT_OVERVIEW.md** | Architecture & design decisions |
| **DEVELOPER_GUIDE.md** | Code patterns & how to extend |
| **COMPLETION_SUMMARY.md** | What was built (50+ files) |

## 🎯 Use Cases

### Recent Graduates
Track all your job applications in one place with automatic follow-up reminders

### Career Changers
Log study time alongside applications to track productivity

### Job Seekers
Maintain statistics on applications, interviews, and offers to stay motivated

### Teams
Share job leads and track collective progress (with future enhancement)

## 🔐 Security

- ✅ Bcrypt password hashing (10 salt rounds)
- ✅ JWT authentication with expiry
- ✅ User-scoped database queries
- ✅ Input validation (server + client)
- ✅ SQL injection prevention
- ✅ CORS protection
- ✅ Environment variable management

## 📊 Database Schema

```sql
-- Users: Store user accounts
users (id, email, password_hash, full_name, created_at, updated_at)

-- Applications: Track job applications
job_applications (id, user_id, company_name, job_role, platform, 
                 applied_date, status, recruiter_email, recruiter_name, 
                 application_link, notes, created_at, updated_at)

-- Activities: Log daily activities
activities (id, user_id, activity_type, title, duration_minutes, 
           description, activity_date, created_at)

-- Reminders: Schedule notifications
reminders (id, user_id, job_application_id, reminder_type, title, 
          description, scheduled_date, is_notified, notified_at, created_at)
```

## 🚀 Deployment

### Backend
Deploy to: Heroku, Railway, Render, AWS, Azure

```bash
cd backend
npm run build
# Follow platform-specific deployment instructions
```

### Frontend
Deploy to: Vercel, Netlify, AWS S3 + CloudFront

```bash
cd frontend
npm run build
# Follow platform-specific deployment instructions
```

### Database
Use managed PostgreSQL: AWS RDS, Heroku Postgres, Railway, Azure DB

## 🎨 Future Enhancements

- [ ] Browser notifications for reminders
- [ ] Email notifications
- [ ] Analytics charts (Recharts)
- [ ] Export to CSV/PDF
- [ ] Mobile app (React Native)
- [ ] Interview preparation module
- [ ] Salary tracking
- [ ] Team collaboration

## 💡 Tech Highlights

### Backend Architecture
- **TypeScript** for type safety
- **Express.js** for lightweight REST API
- **PostgreSQL** for reliable data persistence
- **node-cron** for scheduled background tasks
- **Bcrypt** for secure password hashing
- **JWT** for stateless authentication

### Frontend Architecture
- **React Hooks** for component logic
- **React Router** for client-side routing
- **Axios** with interceptors for API calls
- **CSS3** for responsive styling
- **LocalStorage** for token persistence

## 🤝 Contributing

This is a learning project. Feel free to:
- Extend with new features
- Customize the design
- Improve performance
- Add more functionality

## 📚 Learning Resources

- [Express.js Docs](https://expressjs.com/)
- [React Docs](https://react.dev/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [JWT Guide](https://jwt.io/)
- [RESTful API Design](https://restfulapi.net/)

## ✅ Quality Checklist

- ✅ Type-safe with TypeScript
- ✅ Clean, commented code
- ✅ Error handling throughout
- ✅ Input validation
- ✅ Responsive design
- ✅ Security best practices
- ✅ Production-ready structure
- ✅ Comprehensive documentation

## 🆘 Troubleshooting

**Backend won't connect to database?**
- Check PostgreSQL is running
- Verify .env credentials
- Run `createdb job_tracker_db`

**Frontend can't reach backend?**
- Verify backend is running on port 5000
- Check API URL in frontend .env
- Look for CORS errors in browser console

**Forgot password requirements?**
- Min 8 characters
- 1 uppercase letter
- 1 number
- 1 special character (!@#$%^&*)

## 📝 License

Open source - feel free to use for learning, teaching, or as a starter project.

## 🎓 What You Learn

By exploring this codebase, you'll learn:
- Full-stack web development
- Database design and optimization
- REST API development
- Authentication and security
- React component architecture
- TypeScript best practices
- Production-ready code patterns

## 🎉 Ready to Get Started?

1. **[Open QUICKSTART.md](QUICKSTART.md)** for 5-minute setup
2. Create your account
3. Add your first job application
4. Start tracking your productivity!

---

## 📞 Quick Help

- 💻 **How to run?** → [QUICKSTART.md](QUICKSTART.md)
- 🔧 **Setup issues?** → [SETUP.md](SETUP.md)
- 🏗️ **How does it work?** → [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md)
- 👨‍💻 **How to extend?** → [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md)
- ✅ **What was built?** → [COMPLETION_SUMMARY.md](COMPLETION_SUMMARY.md)

---

**🚀 Happy job hunting and good luck with your applications! 🎯**

Built with ❤️ for recent graduates managing their job search.
