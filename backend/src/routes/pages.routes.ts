/**
 * @file src/routes/pages.routes.ts
 */

import { Router } from 'express';
import {
  getPublicPagesCmsConfig,
  adminGetPagesCmsConfig,
  adminUpdatePagesCmsConfig,
} from '@/controllers/pagesCmsConfig.controller';
import { authMiddleware } from '@/middleware/auth.middleware';
import { adminLimiter, publicReadLimiter } from '@/middleware/rateLimit.middleware';

const router = Router();

router.get('/config', publicReadLimiter, getPublicPagesCmsConfig);
router.use('/admin', adminLimiter);
router.get('/admin/config', authMiddleware, adminGetPagesCmsConfig);
router.put('/admin/config', authMiddleware, adminUpdatePagesCmsConfig);

export default router;
