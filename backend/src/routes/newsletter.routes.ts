/**
 * @file src/routes/newsletter.routes.ts
 * @description Route definition for the Newsletter module.
 */

import { Router } from 'express';
import {
  subscribeNewsletter,
  unsubscribeNewsletter,
  adminGetSubscribers,
  adminUpdateSubscriberStatus,
  adminDeleteSubscriber,
  adminRestoreSubscriber,
  adminPermanentlyDeleteSubscriber,
  adminBulkDeleteSubscribers,
  adminBulkRestoreSubscribers,
  adminBulkStatusSubscribers,
} from '@/controllers/newsletter.controller';
import { authMiddleware } from '@/middleware/auth.middleware';
import { adminLimiter, newsletterLimiter } from '@/middleware/rateLimit.middleware';

const router = Router();

// ─── Administrative Endpoints ──────────────────────────────────────────────────
router.use('/admin', adminLimiter);
router.get('/admin', authMiddleware, adminGetSubscribers);
router.patch('/admin/:id/status', authMiddleware, adminUpdateSubscriberStatus);
router.post('/admin/bulk-delete', authMiddleware, adminBulkDeleteSubscribers);
router.post('/admin/bulk-restore', authMiddleware, adminBulkRestoreSubscribers);
router.post('/admin/bulk-status', authMiddleware, adminBulkStatusSubscribers);
router.post('/admin/:id/restore', authMiddleware, adminRestoreSubscriber);
router.delete('/admin/:id/permanent', authMiddleware, adminPermanentlyDeleteSubscriber);
router.delete('/admin/:id', authMiddleware, adminDeleteSubscriber);

// ─── Public Endpoints ────────────────────────────────────────────────────────
router.post('/', newsletterLimiter, subscribeNewsletter);
router.patch('/unsubscribe', unsubscribeNewsletter);

export default router;
