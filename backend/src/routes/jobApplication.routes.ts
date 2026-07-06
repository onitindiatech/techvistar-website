/**
 * @file src/routes/jobApplication.routes.ts
 * @description Route definition for Job Applications.
 */

import { Router } from 'express';
import { 
  submitApplication, 
  getAllApplications, 
  getApplicationById, 
  updateApplicationStatus, 
  deleteApplication 
} from '@/controllers/jobApplication.controller';

const router = Router();

// Public route to apply for a job
router.post('/', submitApplication);

// Admin routes (JWT auth gated in Phase 6, but available to frontend now)
router.get('/', getAllApplications);
router.get('/:id', getApplicationById);
router.patch('/:id/status', updateApplicationStatus);
router.delete('/:id', deleteApplication);

export default router;
