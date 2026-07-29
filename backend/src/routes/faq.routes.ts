/**
 * @file src/routes/faq.routes.ts
 * @description Route definition for the FAQ CMS module.
 */

import { Router } from 'express';
import {
  getPublicFAQs,
  getPublicFAQById,
  adminCreateFAQ,
  adminUpdateFAQ,
  adminDeleteFAQ,
  adminGetFAQs,
  adminRestoreFAQ,
  adminPermanentlyDeleteFAQ,
  adminBulkDeleteFAQs,
  adminBulkRestoreFAQs,
  adminBulkStatusFAQs,
  adminHideFAQ,
  adminUpdateFAQOrder,
} from '@/controllers/faq.controller';
import { authMiddleware } from '@/middleware/auth.middleware';
import { adminLimiter, publicReadLimiter } from '@/middleware/rateLimit.middleware';
import { publicCmsCache } from '@/middleware/publicCmsCache.middleware';

const router = Router();

// ─── Administrative CRUD Endpoints ───────────────────────────────────────────
router.use('/admin', adminLimiter);
router.get('/admin', authMiddleware, adminGetFAQs);
router.post('/admin', authMiddleware, adminCreateFAQ);
router.post('/admin/bulk-delete', authMiddleware, adminBulkDeleteFAQs);
router.post('/admin/bulk-restore', authMiddleware, adminBulkRestoreFAQs);
router.post('/admin/bulk-status', authMiddleware, adminBulkStatusFAQs);
router.post('/admin/:id/restore', authMiddleware, adminRestoreFAQ);
router.delete('/admin/:id/permanent', authMiddleware, adminPermanentlyDeleteFAQ);
router.patch('/admin/:id/hide', authMiddleware, adminHideFAQ);
router.patch('/admin/:id/order', authMiddleware, adminUpdateFAQOrder);
router.put('/admin/:id', authMiddleware, adminUpdateFAQ);
router.delete('/admin/:id', authMiddleware, adminDeleteFAQ);

// ─── Public Endpoints ────────────────────────────────────────────────────────
router.get('/', publicReadLimiter, publicCmsCache, getPublicFAQs);
router.get('/:faqId', publicReadLimiter, publicCmsCache, getPublicFAQById);

export default router;
