import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  createNewReminder,
  getPending,
  getUpcoming,
  markNotified,
} from '../controllers/reminderController';

const router = express.Router();

/**
 * Reminder Routes (all require authentication)
 * POST /reminders - Create new reminder
 * GET /reminders/pending - Get pending reminders
 * GET /reminders/upcoming - Get upcoming reminders
 * PUT /reminders/:id/notified - Mark reminder as notified
 */

router.use(authenticateToken);

router.post('/', createNewReminder);
router.get('/pending', getPending);
router.get('/upcoming', getUpcoming);
router.put('/:id/notified', markNotified);

export default router;
