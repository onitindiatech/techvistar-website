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

const router = Router();

router.get('/config', getPublicPagesCmsConfig);
router.get('/admin/config', authMiddleware, adminGetPagesCmsConfig);
router.put('/admin/config', authMiddleware, adminUpdatePagesCmsConfig);

export default router;
