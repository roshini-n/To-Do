import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  createApplication,
  getApplications,
  getApplication,
  updateApplication,
  deleteApplication,
  getStats,
} from '../controllers/applicationController';

const router = express.Router();

/**
 * Job Application Routes (all require authentication)
 * POST /applications - Create new application
 * GET /applications - Get all user's applications
 * GET /applications/:id - Get specific application
 * PUT /applications/:id - Update application
 * DELETE /applications/:id - Delete application
 * GET /applications/stats - Get application statistics
 */

router.use(authenticateToken);

router.post('/', createApplication);
router.get('/', getApplications);
router.get('/stats', getStats);
router.get('/:id', getApplication);
router.put('/:id', updateApplication);
router.delete('/:id', deleteApplication);

export default router;
