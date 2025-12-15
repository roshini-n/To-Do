import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  logActivity,
  getDailyActivities,
  getActivityRange,
  getStudyStats,
} from '../controllers/activityController';

const router = express.Router();

/**
 * Activity Tracking Routes (all require authentication)
 * POST /activities - Log new activity
 * GET /activities/daily - Get activities for a specific day
 * GET /activities/range - Get activities within date range
 * GET /activities/stats - Get study statistics
 */

router.use(authenticateToken);

router.post('/', logActivity);
router.get('/daily', getDailyActivities);
router.get('/range', getActivityRange);
router.get('/stats', getStudyStats);

export default router;
