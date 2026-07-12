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
import healthRouter from './health.routes';
import contactRouter from './contact.routes';
import newsletterRouter from './newsletter.routes';
import jobRouter from './job.routes';
import jobApplicationRouter from './jobApplication.routes';
import serviceRouter from './service.routes';
import solutionRouter from './solution.routes';
import projectRouter from './project.routes';
import faqRouter    from './faq.routes';
import authRouter    from './auth.routes';
import industryRouter from './industry.routes';
import uploadRouter   from './upload.routes';
import pagesRouter    from './pages.routes';
import officeRouter   from './office.routes';

const router = Router();

// ─── Route mounts ─────────────────────────────────────────────────────────────
// Rate limiting is applied per route group in each sub-router (see rateLimit.middleware.ts).
router.use('/health', healthRouter);
router.use('/contact', contactRouter);
router.use('/newsletter', newsletterRouter);
router.use('/careers/jobs', jobRouter);
router.use('/careers/apply', jobApplicationRouter);
router.use('/services', serviceRouter);
router.use('/solutions', solutionRouter);
router.use('/portfolio', projectRouter);
router.use('/faqs',      faqRouter);
router.use('/auth',      authRouter);
router.use('/industries', industryRouter);
router.use('/upload',     uploadRouter);
router.use('/pages',      pagesRouter);
router.use('/offices',    officeRouter);

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
