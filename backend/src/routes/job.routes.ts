/**
 * @file src/routes/job.routes.ts
 * @description Route definition for Careers Job listings.
 */

import { Router } from 'express';
import {
  createJob,
  listJobs,
  getJobBySlug,
  updateJob,
  updateJobStatus,
  deleteJob,
} from '@/controllers/job.controller';

const router = Router();

// Public routes
router.get('/', listJobs);
router.get('/:slug', getJobBySlug);

// Administrative CRUD routes (will receive auth middleware in Phase 6)
router.post('/', createJob);
router.put('/:id', updateJob);
router.patch('/:id/status', updateJobStatus);
router.delete('/:id', deleteJob);

export default router;
