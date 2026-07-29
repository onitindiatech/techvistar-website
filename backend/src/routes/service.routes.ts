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
  adminDeleteService,
  adminGetServices,
  adminRestoreService,
  adminPermanentlyDeleteService,
  adminBulkDelete,
  adminBulkRestore,
  adminBulkStatus
} from '@/controllers/service.controller';
import {
  getPublicServicesCmsConfig,
  adminGetServicesCmsConfig,
  adminUpdateServicesCmsConfig,
} from '@/controllers/servicesCmsConfig.controller';
import { authMiddleware } from '@/middleware/auth.middleware';
import { adminLimiter, publicReadLimiter } from '@/middleware/rateLimit.middleware';

const router = Router();

// ─── CMS page config (must be before /:slug) ─────────────────────────────────
router.get('/config', publicReadLimiter, getPublicServicesCmsConfig);

// ─── Administrative CRUD Endpoints ───────────────────────────────────────────
router.use('/admin', adminLimiter);
router.get('/admin/config', authMiddleware, adminGetServicesCmsConfig);
router.put('/admin/config', authMiddleware, adminUpdateServicesCmsConfig);
router.get('/admin', authMiddleware, adminGetServices);
router.post('/admin', authMiddleware, adminCreateService);
router.post('/admin/bulk-delete', authMiddleware, adminBulkDelete);
router.post('/admin/bulk-restore', authMiddleware, adminBulkRestore);
router.post('/admin/bulk-status', authMiddleware, adminBulkStatus);
router.post('/admin/:id/restore', authMiddleware, adminRestoreService);
router.delete('/admin/:id/permanent', authMiddleware, adminPermanentlyDeleteService);
router.put('/admin/:id', authMiddleware, adminUpdateService);
router.delete('/admin/:id', authMiddleware, adminDeleteService);

// ─── Public Endpoints ────────────────────────────────────────────────────────
// GET /api/services - Returns all active services sorted by displayOrder
router.get('/', publicReadLimiter, getPublicServices);

// GET /api/services/:slug - Returns details of a specific active service
router.get('/:slug', publicReadLimiter, getPublicServiceBySlug);

export default router;
