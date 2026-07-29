/**
 * @file src/middleware/rateLimit.middleware.ts
 * @description Tiered rate limiters — applied per route group, not globally.
 */

import rateLimit from 'express-rate-limit';
import { env } from '@/config/env';
import {
  PUBLIC_READ_RATE_LIMIT,
  ADMIN_RATE_LIMIT,
  CONTACT_RATE_LIMIT,
  NEWSLETTER_RATE_LIMIT,
  RESUME_UPLOAD_RATE_LIMIT,
  CAREER_APPLICATION_RATE_LIMIT,
} from '@/constants';

function rateLimitMessage(message: string) {
  return {
    success:    false,
    statusCode: 429,
    code:       'TOO_MANY_REQUESTS',
    message,
  };
}

/** High threshold for public CMS read endpoints — must not block normal browsing. */
export const publicReadLimiter = rateLimit({
  windowMs:        PUBLIC_READ_RATE_LIMIT.WINDOW_MS,
  max:             env.isDev ? 5000 : PUBLIC_READ_RATE_LIMIT.MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders:   false,
  message: rateLimitMessage(
    'Too many read requests from this IP. Please try again later.',
  ),
});

/** Strict protection for login attempts. */
export const authLimiter = rateLimit({
  windowMs:        env.loginRateLimitWindow,
  max:             env.loginRateLimitMax,
  standardHeaders: true,
  legacyHeaders:   false,
  message: rateLimitMessage(
    'Too many login attempts. Please try again later.',
  ),
});

/** Moderate protection for authenticated admin CRUD endpoints. */
export const adminLimiter = rateLimit({
  windowMs:        ADMIN_RATE_LIMIT.WINDOW_MS,
  max:             env.isDev ? 1000 : ADMIN_RATE_LIMIT.MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders:   false,
  message: rateLimitMessage(
    'Too many admin requests from this IP. Please try again later.',
  ),
});

/** Strict protection for contact form submissions. */
export const contactLimiter = rateLimit({
  windowMs:        CONTACT_RATE_LIMIT.WINDOW_MS,
  max:             CONTACT_RATE_LIMIT.MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders:   false,
  message: rateLimitMessage(
    'Too many submissions from this IP. Please try again after 15 minutes.',
  ),
});

/** Strict protection for newsletter subscriptions. */
export const newsletterLimiter = rateLimit({
  windowMs:        NEWSLETTER_RATE_LIMIT.WINDOW_MS,
  max:             NEWSLETTER_RATE_LIMIT.MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders:   false,
  message: rateLimitMessage(
    'Too many subscription attempts from this IP. Please try again after 15 minutes.',
  ),
});

/** Strict protection for public resume uploads. */
export const resumeUploadLimiter = rateLimit({
  windowMs:        RESUME_UPLOAD_RATE_LIMIT.WINDOW_MS,
  max:             env.isDev ? 50 : RESUME_UPLOAD_RATE_LIMIT.MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders:   false,
  message: rateLimitMessage(
    'Too many resume uploads from this IP. Please try again later.',
  ),
});

/** Strict protection for public job application submissions. */
export const careerApplicationLimiter = rateLimit({
  windowMs:        CAREER_APPLICATION_RATE_LIMIT.WINDOW_MS,
  max:             CAREER_APPLICATION_RATE_LIMIT.MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders:   false,
  message: rateLimitMessage(
    'Too many job applications from this IP. Please try again after 15 minutes.',
  ),
});
