/**
 * @file src/routes/jobApplication.routes.ts
 * @description Route definition for Job Applications.
 */

import { Router } from 'express';
import { submitApplication } from '@/controllers/jobApplication.controller';

const router = Router();

// Public route to apply for a job
router.post('/', submitApplication);

export default router;
