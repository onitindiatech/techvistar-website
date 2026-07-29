/**
 * @file src/routes/auth.routes.ts
 * @description Route definitions for admin authentication endpoints.
 */

import { Router } from 'express';
import { authController } from '@/controllers/auth.controller';
import { authLimiter } from '@/middleware/rateLimit.middleware';

const router = Router();

router.get('/me', authController.me);
router.post('/login', authLimiter, authController.login);
router.post('/logout', authController.logout);

export default router;
