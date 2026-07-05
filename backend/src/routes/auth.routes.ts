/**
 * @file src/routes/auth.routes.ts
 * @description Route definitions for admin authentication endpoints.
 */

import { Router } from 'express';
import { authController } from '@/controllers/auth.controller';

const router = Router();

router.get('/me', authController.me);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

export default router;
