/**
 * @file src/routes/service.routes.ts
 * @description Route definition for the Services CMS module.
 */

import { Router } from 'express';
import {
  getPublicServices,
  getPublicServiceBySlug,
  adminCreateService,
  adminUpdateService,
  adminDeleteService
} from '@/controllers/service.controller';

const router = Router();

// ─── Public Endpoints ────────────────────────────────────────────────────────
// GET /api/services - Returns all active services sorted by displayOrder
router.get('/', getPublicServices);

// GET /api/services/:slug - Returns details of a specific active service
router.get('/:slug', getPublicServiceBySlug);

// ─── Administrative CRUD Endpoints ───────────────────────────────────────────
// (Note: To be protected by JWT auth middleware when Phase 2 authentication is implemented)
router.post('/admin', adminCreateService);
router.put('/admin/:id', adminUpdateService);
router.delete('/admin/:id', adminDeleteService);

export default router;
