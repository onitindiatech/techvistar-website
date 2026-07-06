/**
 * @file src/routes/newsletter.routes.ts
 * @description Route definition for the Newsletter module.
 */

import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  subscribeNewsletter,
  listSubscribers,
  unsubscribeNewsletter,
  deleteSubscriber,
} from '@/controllers/newsletter.controller';
import { NEWSLETTER_RATE_LIMIT } from '@/constants';

const router = Router();

const newsletterRateLimiter = rateLimit({
  windowMs:        NEWSLETTER_RATE_LIMIT.WINDOW_MS,
  max:             NEWSLETTER_RATE_LIMIT.MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders:   false,
  message: {
    success:    false,
    statusCode: 429,
    code:       'TOO_MANY_REQUESTS',
    message:    'Too many subscription attempts from this IP. Please try again after 15 minutes.',
  },
});

// POST /api/newsletter - Public subscription endpoint (rate limited)
router.post('/', newsletterRateLimiter, subscribeNewsletter);

// Administrative CRUD Endpoints (Disabled until Phase 7 JWT Auth and Admin Panel integration)
router.get('/', listSubscribers);
router.patch('/unsubscribe', unsubscribeNewsletter);
router.delete('/:id', deleteSubscriber);

export default router;
