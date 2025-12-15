import express from 'express';
import { signup, login } from '../controllers/authController';

const router = express.Router();

/**
 * Authentication Routes
 * POST /auth/signup - Register new user
 * POST /auth/login - Login existing user
 */

router.post('/signup', signup);
router.post('/login', login);

export default router;
