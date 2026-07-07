/**
 * @file src/routes/project.routes.ts
 * @description Route mapping for the Portfolio module.
 */

import { Router } from 'express';
import {
  getPublicProjects,
  getPublicProjectBySlug,
  adminCreateProject,
  adminUpdateProject,
  adminDeleteProject,
  adminGetProjects,
  adminRestoreProject,
  adminPermanentlyDeleteProject,
  adminBulkDeleteProjects,
  adminBulkRestoreProjects,
  adminBulkStatusProjects,
} from '@/controllers/project.controller';
import { authMiddleware } from '@/middleware/auth.middleware';

const router = Router();

// ─── Administrative CRUD Endpoints ───────────────────────────────────────────
router.get('/admin', authMiddleware, adminGetProjects);
router.post('/admin', authMiddleware, adminCreateProject);
router.post('/admin/bulk-delete', authMiddleware, adminBulkDeleteProjects);
router.post('/admin/bulk-restore', authMiddleware, adminBulkRestoreProjects);
router.post('/admin/bulk-status', authMiddleware, adminBulkStatusProjects);
router.post('/admin/:id/restore', authMiddleware, adminRestoreProject);
router.delete('/admin/:id/permanent', authMiddleware, adminPermanentlyDeleteProject);
router.put('/admin/:id', authMiddleware, adminUpdateProject);
router.delete('/admin/:id', authMiddleware, adminDeleteProject);

// ─── Public Endpoints ────────────────────────────────────────────────────────
router.get('/', getPublicProjects);
router.get('/:slug', getPublicProjectBySlug);

export default router;
