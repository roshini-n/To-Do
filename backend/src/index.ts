import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import applicationRoutes from './routes/applicationRoutes';
import activityRoutes from './routes/activityRoutes';
import reminderRoutes from './routes/reminderRoutes';
import { errorHandler } from './middleware/auth';
import { initializeDatabase } from './config/schema';
import { startReminderScheduler } from './services/reminderService';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/auth', authRoutes);
app.use('/applications', applicationRoutes);
app.use('/activities', activityRoutes);
app.use('/reminders', reminderRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

// Error handling
app.use(errorHandler);

/**
 * Initialize database and start server
 */
const startServer = async () => {
  try {
    // Initialize database tables
    await initializeDatabase();

    // Start reminder scheduler
    startReminderScheduler();

    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
