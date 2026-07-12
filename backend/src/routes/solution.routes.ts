/**
 * @file src/routes/solution.routes.ts
 * @description Route definition for the Solutions CMS module.
 */

import { Router } from 'express';
import {
  getPublicSolutions,
  getPublicSolutionBySlug,
  adminCreateSolution,
  adminUpdateSolution,
  adminDeleteSolution,
  adminGetSolutions,
  adminRestoreSolution,
  adminPermanentlyDeleteSolution,
  adminBulkDelete,
  adminBulkRestore,
  adminBulkStatus,
} from '@/controllers/solution.controller';
import { authMiddleware } from '@/middleware/auth.middleware';
import { adminLimiter, publicReadLimiter } from '@/middleware/rateLimit.middleware';

const router = Router();

// ─── Administrative CRUD Endpoints ───────────────────────────────────────────
router.use('/admin', adminLimiter);
router.get('/admin', authMiddleware, adminGetSolutions);
router.post('/admin', authMiddleware, adminCreateSolution);
router.post('/admin/bulk-delete', authMiddleware, adminBulkDelete);
router.post('/admin/bulk-restore', authMiddleware, adminBulkRestore);
router.post('/admin/bulk-status', authMiddleware, adminBulkStatus);
router.post('/admin/:id/restore', authMiddleware, adminRestoreSolution);
router.delete('/admin/:id/permanent', authMiddleware, adminPermanentlyDeleteSolution);
router.put('/admin/:id', authMiddleware, adminUpdateSolution);
router.delete('/admin/:id', authMiddleware, adminDeleteSolution);

// ─── Public Endpoints ────────────────────────────────────────────────────────
router.get('/', publicReadLimiter, getPublicSolutions);
router.get('/:slug', publicReadLimiter, getPublicSolutionBySlug);

export default router;
