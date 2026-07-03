/**
 * @file src/routes/contact.routes.ts
 * @description Route definition for Contact Module.
 *
 * ARCHITECTURE DECISION:
 *   Exposes the public POST endpoint for form submissions.
 *   Mounted onto the index API router under /api/contact.
 */

import { Router } from 'express';
import { submitContactForm } from '@/controllers/contact.controller';

const router = Router();

// POST /api/contact
// Public submission route
router.post('/', submitContactForm);

export default router;
