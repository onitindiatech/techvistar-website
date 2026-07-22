/**
 * @file src/routes/job.routes.ts
 * @description Route definition for Careers Job listings.
 */

import { Router } from 'express';
import {
  listJobs,
  getJobBySlug,
  adminGetJobs,
  adminCreateJob,
  adminUpdateJob,
  adminDeleteJob,
  adminRestoreJob,
  adminPermanentlyDeleteJob,
  adminBulkDeleteJobs,
  adminBulkRestoreJobs,
  adminBulkStatusJobs,
} from '@/controllers/job.controller';
import { authMiddleware } from '@/middleware/auth.middleware';
import { adminGetApplicationsByJob } from '@/controllers/jobApplication.controller';
import { adminLimiter, publicReadLimiter } from '@/middleware/rateLimit.middleware';
import { publicCmsCache } from '@/middleware/publicCmsCache.middleware';

const router = Router();

// ─── Administrative CRUD Endpoints ───────────────────────────────────────────
router.use('/admin', adminLimiter);
router.get('/admin', authMiddleware, adminGetJobs);
router.get('/admin/:jobId/applications', authMiddleware, adminGetApplicationsByJob);
router.post('/admin', authMiddleware, adminCreateJob);
router.post('/admin/bulk-delete', authMiddleware, adminBulkDeleteJobs);
router.post('/admin/bulk-restore', authMiddleware, adminBulkRestoreJobs);
router.post('/admin/bulk-status', authMiddleware, adminBulkStatusJobs);
router.post('/admin/:id/restore', authMiddleware, adminRestoreJob);
router.delete('/admin/:id/permanent', authMiddleware, adminPermanentlyDeleteJob);
router.put('/admin/:id', authMiddleware, adminUpdateJob);
router.delete('/admin/:id', authMiddleware, adminDeleteJob);

// ─── Public Endpoints ────────────────────────────────────────────────────────
router.get('/', publicReadLimiter, publicCmsCache, listJobs);
router.get('/:slug', publicReadLimiter, publicCmsCache, getJobBySlug);

export default router;
