/**
 * @file src/routes/industry.routes.ts
 * @description Route definition for the Industries CMS module.
 */

import { Router } from 'express';
import {
  getPublicIndustries,
  getPublicIndustryBySlug,
  adminCreateIndustry,
  adminUpdateIndustry,
  adminDeleteIndustry,
  adminGetIndustries,
  adminRestoreIndustry,
  adminPermanentlyDeleteIndustry,
  adminBulkDeleteIndustries,
  adminBulkRestoreIndustries,
  adminBulkStatusIndustries
} from '@/controllers/industry.controller';
import { authMiddleware } from '@/middleware/auth.middleware';
import { adminLimiter, publicReadLimiter } from '@/middleware/rateLimit.middleware';

const router = Router();

// ─── Administrative CRUD Endpoints ───────────────────────────────────────────
router.use('/admin', adminLimiter);
router.get('/admin', authMiddleware, adminGetIndustries);
router.post('/admin', authMiddleware, adminCreateIndustry);
router.post('/admin/bulk-delete', authMiddleware, adminBulkDeleteIndustries);
router.post('/admin/bulk-restore', authMiddleware, adminBulkRestoreIndustries);
router.post('/admin/bulk-status', authMiddleware, adminBulkStatusIndustries);
router.post('/admin/:id/restore', authMiddleware, adminRestoreIndustry);
router.delete('/admin/:id/permanent', authMiddleware, adminPermanentlyDeleteIndustry);
router.put('/admin/:id', authMiddleware, adminUpdateIndustry);
router.delete('/admin/:id', authMiddleware, adminDeleteIndustry);

// ─── Public Endpoints ────────────────────────────────────────────────────────
router.get('/', publicReadLimiter, getPublicIndustries);
router.get('/:slug', publicReadLimiter, getPublicIndustryBySlug);

export default router;
