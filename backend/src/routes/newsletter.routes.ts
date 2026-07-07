/**
 * @file src/routes/newsletter.routes.ts
 * @description Route definition for the Newsletter module.
 */

import { Router } from 'express';
import rateLimit from 'express-rate-limit';
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
import { NEWSLETTER_RATE_LIMIT } from '@/constants';

const router = Router();

const newsletterRateLimiter = rateLimit({
  windowMs: NEWSLETTER_RATE_LIMIT.WINDOW_MS,
  max: NEWSLETTER_RATE_LIMIT.MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    code: 'TOO_MANY_REQUESTS',
    message: 'Too many subscription attempts from this IP. Please try again after 15 minutes.',
  },
});

// ─── Administrative Endpoints ──────────────────────────────────────────────────
router.get('/admin', authMiddleware, adminGetSubscribers);
router.patch('/admin/:id/status', authMiddleware, adminUpdateSubscriberStatus);
router.post('/admin/bulk-delete', authMiddleware, adminBulkDeleteSubscribers);
router.post('/admin/bulk-restore', authMiddleware, adminBulkRestoreSubscribers);
router.post('/admin/bulk-status', authMiddleware, adminBulkStatusSubscribers);
router.post('/admin/:id/restore', authMiddleware, adminRestoreSubscriber);
router.delete('/admin/:id/permanent', authMiddleware, adminPermanentlyDeleteSubscriber);
router.delete('/admin/:id', authMiddleware, adminDeleteSubscriber);

// ─── Public Endpoints ────────────────────────────────────────────────────────
router.post('/', newsletterRateLimiter, subscribeNewsletter);
router.patch('/unsubscribe', unsubscribeNewsletter);

export default router;
