/**
 * @file src/routes/index.ts
 * @description Root API router — mounts all sub-routers under /api.
 *
 * ARCHITECTURE DECISION:
 *   Instead of registering all routes directly in app.ts, we use a dedicated
 *   root router. This keeps app.ts focused on middleware setup and lets us
 *   version the API easily (/api/v1/... vs /api/v2/...) in the future.
 *
 *   As new feature routers are added, they are registered here:
 *   router.use('/contact',    contactRoutes);    // Phase 2
 *   router.use('/newsletter', newsletterRoutes); // Phase 2
 *   router.use('/careers',    careersRoutes);    // Phase 2
 *   router.use('/projects',   projectRoutes);    // Phase 2
 *   router.use('/auth',       authRoutes);       // Phase 2
 *   router.use('/admin',      adminRoutes);      // Phase 3 (JWT protected)
 */

import { Router, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import healthRouter from './health.routes';
import contactRouter from './contact.routes';
import newsletterRouter from './newsletter.routes';
import jobRouter from './job.routes';
import { RATE_LIMIT } from '@/constants';

const router = Router();

// ─── Global API Rate Limiter ───────────────────────────────────────────────────
// Applied to ALL /api/* routes — individual routes can have stricter limits
const globalRateLimiter = rateLimit({
  windowMs:        RATE_LIMIT.WINDOW_MS,    // 15 minutes
  max:             RATE_LIMIT.MAX_REQUESTS, // 100 requests per window per IP
  standardHeaders: true,                   // Return rate limit info in headers
  legacyHeaders:   false,                  // Disable deprecated X-RateLimit-* headers
  message: {
    success:    false,
    statusCode: 429,
    code:       'TOO_MANY_REQUESTS',
    message:    'Too many requests from this IP. Please try again after 15 minutes.',
  },
});

router.use(globalRateLimiter);

// ─── Route mounts ─────────────────────────────────────────────────────────────
router.use('/health', healthRouter);
router.use('/contact', contactRouter);
router.use('/newsletter', newsletterRouter);
router.use('/careers/jobs', jobRouter);

// ─── API root info ─────────────────────────────────────────────────────────────
// GET /api → Basic API info (not a real endpoint, just useful for developers)
router.get('/', (_req: Request, res: Response) => {
  res.json({
    success:   true,
    name:      'TechVistar API',
    version:   'v1',
    status:    'operational',
    docs:      '/api/docs',         // Swagger docs URL (Phase 2)
    health:    '/api/health',
    timestamp: new Date().toISOString(),
  });
});

export default router;
