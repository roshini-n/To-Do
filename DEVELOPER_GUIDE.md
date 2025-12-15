# Developer's Guide 👨‍💻

This guide explains the key architectural decisions and how to extend the application.

## 🏗️ Architecture Decisions

### Why Express.js?
- Lightweight and flexible
- Large ecosystem of middleware
- Great for building REST APIs
- Easy to understand and extend
- Perfect for rapid development

### Why PostgreSQL?
- Robust relational database
- ACID compliance for data integrity
- Great for structured data like job applications
- Excellent indexing capabilities
- Easy to scale horizontally

### Why React?
- Component-based UI development
- Large community and resources
- Easy state management for this use case
- Fast development with hooks
- Great DevTools for debugging

### Why TypeScript?
- Type safety catches errors early
- Better IDE support and autocomplete
- Self-documenting code
- Easier refactoring
- Industry standard for backend

## 🔑 Key Concepts

### 1. Authentication Flow

```javascript
// User registers
POST /auth/signup
  → Input validation
  → Check if email exists
  → Hash password with bcrypt
  → Create user in database
  → Generate JWT token
  → Return token + user data

// User logs in
POST /auth/login
  → Validate email exists
  → Compare password with hash
  → Generate JWT token
  → Return token + user data

// Accessing protected resource
GET /applications
  → Check Authorization header for JWT
  → Verify JWT signature
  → Extract user ID from token
  → Query only this user's applications
  → Return data
```

### 2. Request/Response Pattern

Every API response follows this pattern:

```javascript
// Success
{
  "message": "Operation successful",
  "data": { /* response data */ }
}

// Error
{
  "message": "Error description"
}
```

### 3. Middleware Chain

```javascript
Request
  ↓
bodyParser (parse JSON)
  ↓
CORS (allow frontend)
  ↓
Routes
  ├─ Public routes (auth)
  └─ Protected routes
      ↓
      authenticateToken middleware
        ↓
        Controller logic
        ↓
        Database query
  ↓
Error handling
  ↓
Response
```

### 4. Data Isolation

Each user only sees their own data:

```typescript
// Correct - User scoped
const result = await pool.query(
  'SELECT * FROM job_applications WHERE user_id = $1',
  [userId]
);

// Wrong - Gets all users' data
const result = await pool.query(
  'SELECT * FROM job_applications'
);
```

## 📝 Code Patterns

### Authentication Middleware

```typescript
// All protected routes use this middleware
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Token required' });
  
  const decoded = verifyToken(token);
  if (!decoded) return res.status(403).json({ message: 'Invalid token' });
  
  req.user = decoded;  // Now controller can access req.user.userId
  next();
};
```

**Usage in routes:**
```typescript
router.get('/applications', authenticateToken, getApplications);
// authenticateToken runs before getApplications
```

### Database Pattern

```typescript
// Always use parameterized queries to prevent SQL injection
const result = await pool.query(
  'SELECT * FROM users WHERE email = $1',  // $1 is placeholder
  [email]  // Parameter passed separately
);

// Never do this:
const result = await pool.query(
  `SELECT * FROM users WHERE email = '${email}'`  // Vulnerable!
);
```

### Error Handling

```typescript
try {
  const user = await getUserByEmail(email);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(user);
} catch (error) {
  console.error(error);
  res.status(500).json({ message: 'Server error' });
}
```

### Validation Pattern

```typescript
// Validate before database operations
const validation = validateJobApplication(req.body);
if (!validation.valid) {
  return res.status(400).json({ 
    message: 'Validation failed',
    errors: validation.errors 
  });
}

// Now safe to proceed with database operation
const application = await createJobApplication(userId, req.body);
```

## 🔧 How to Add New Features

### Example: Add "Salary Range" to Job Applications

**Step 1: Update Database Schema**
```typescript
// In src/config/schema.ts, add to job_applications table:
ALTER TABLE job_applications ADD COLUMN salary_min INT;
ALTER TABLE job_applications ADD COLUMN salary_max INT;
```

**Step 2: Update TypeScript Interface**
```typescript
// In src/models/JobApplication.ts:
export interface JobApplication {
  // ... existing fields
  salary_min?: number;
  salary_max?: number;
}
```

**Step 3: Update Model Functions**
```typescript
export const createJobApplication = async (
  userId: number,
  data: Omit<JobApplication, 'id' | 'user_id' | 'created_at' | 'updated_at'>
): Promise<JobApplication> => {
  const result = await pool.query(
    `INSERT INTO job_applications 
    (user_id, company_name, job_role, platform, applied_date, 
     status, salary_min, salary_max) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
    RETURNING *`,
    [
      userId,
      data.company_name,
      data.job_role,
      data.platform,
      data.applied_date,
      data.status || 'Applied',
      data.salary_min || null,
      data.salary_max || null,
    ]
  );
  return result.rows[0];
};
```

**Step 4: Update Frontend Form**
```jsx
// In src/pages/Applications.js:
<div className="form-row">
  <div className="form-group">
    <label>Salary Min</label>
    <input
      type="number"
      name="salary_min"
      value={formData.salary_min}
      onChange={handleInputChange}
    />
  </div>
  <div className="form-group">
    <label>Salary Max</label>
    <input
      type="number"
      name="salary_max"
      value={formData.salary_max}
      onChange={handleInputChange}
    />
  </div>
</div>
```

**Done!** The feature is now integrated end-to-end.

## 🧪 Testing API Endpoints

### Using cURL

**1. Signup**
```bash
curl -X POST http://localhost:5000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email":"user@example.com",
    "password":"SecurePass123!",
    "fullName":"John Doe"
  }'
```

**2. Login and save token**
```bash
TOKEN=$(curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"SecurePass123!"}' \
  | jq -r '.token')

echo $TOKEN
```

**3. Use token in protected endpoint**
```bash
curl -X GET http://localhost:5000/applications \
  -H "Authorization: Bearer $TOKEN"
```

### Using Postman
1. Create collection
2. Add request for signup
3. Save token from response to variable
4. Use variable in Authorization header for other requests

## 📊 Performance Optimization

### Current Optimizations
1. **Database Indexes**: Fast queries on user_id, applied_date
2. **Connection Pooling**: Reuse database connections
3. **Parameterized Queries**: Prevent SQL injection, improve caching
4. **JWT Tokens**: No database lookup on each request

### Future Optimizations
1. **Caching**: Redis for frequently accessed data
2. **Pagination**: Limit returned records for large datasets
3. **Batch Operations**: Insert multiple records at once
4. **Query Optimization**: Analyze slow queries

## 🔐 Security Checklist

Before deploying to production:

- [ ] Change JWT_SECRET to strong random value
- [ ] Set strong database password
- [ ] Enable HTTPS/SSL
- [ ] Use environment variables for all secrets
- [ ] Enable CORS only for trusted domains
- [ ] Add rate limiting to prevent brute force
- [ ] Set up database backups
- [ ] Enable database encryption
- [ ] Use parameterized queries (already done ✅)
- [ ] Validate all inputs (already done ✅)

## 📈 Scaling Considerations

### Current Limits
- Single server instance
- Local database connection
- No caching layer
- Single background job process

### To Scale to 1000+ Users
1. **Database**: Use managed PostgreSQL service (AWS RDS)
2. **Load Balancing**: Add multiple server instances
3. **Caching**: Implement Redis for user sessions and stats
4. **Background Jobs**: Use job queue (Bull, Resque)
5. **Static Files**: Serve frontend from CDN
6. **Monitoring**: Add logging and error tracking (Sentry)

## 🚀 Deployment Checklist

### Backend
- [ ] Build: `npm run build`
- [ ] Test: All endpoints working
- [ ] Set production env variables
- [ ] Database migrations run
- [ ] CORS configured for production domain
- [ ] Deploy to hosting platform
- [ ] Verify health endpoint: `/health`

### Frontend
- [ ] Build: `npm run build`
- [ ] Test: All pages working
- [ ] Set API URL to production backend
- [ ] Deploy to CDN or hosting
- [ ] Verify all routes working
- [ ] Test authentication flow end-to-end

## 🐛 Debugging Tips

### Backend Debugging
```bash
# See all requests
NODE_DEBUG=* npm run dev

# Debug TypeScript
# Add breakpoints in src/
# Run with: node --inspect-brk ./node_modules/.bin/ts-node src/index.ts

# Check database directly
psql job_tracker_db
SELECT * FROM job_applications WHERE user_id = 1;
```

### Frontend Debugging
```javascript
// In browser console
localStorage.getItem('token')  // Check stored token
fetch('http://localhost:5000/health')  // Test API connection

// React DevTools browser extension
// Check component props and state
```

## 📚 Further Learning

### Backend Concepts
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [PostgreSQL Query Optimization](https://www.postgresql.org/docs/current/using-explain.html)
- [JWT Security](https://tools.ietf.org/html/rfc7519)
- [RESTful API Design](https://restfulapi.net/)

### Frontend Concepts
- [React Hooks](https://react.dev/reference/react)
- [React Router](https://reactrouter.com/)
- [Axios Interceptors](https://axios-http.com/docs/interceptors)

---

**Happy coding!** 🚀
