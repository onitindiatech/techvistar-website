/**
 * @file src/routes/jobApplication.routes.ts
 * @description Route definition for Job Applications.
 */

import { Router } from 'express';
import {
  submitApplication,
  adminGetApplications,
  adminGetApplicationById,
  adminUpdateApplicationStatus,
  adminDeleteApplication,
  adminRestoreApplication,
  adminPermanentlyDeleteApplication,
  adminBulkDeleteApplications,
  adminBulkRestoreApplications,
  adminBulkStatusApplications,
} from '@/controllers/jobApplication.controller';
import { authMiddleware } from '@/middleware/auth.middleware';

const router = Router();

// ─── Administrative Endpoints ──────────────────────────────────────────────────
router.get('/admin', authMiddleware, adminGetApplications);
router.post('/admin/bulk-delete', authMiddleware, adminBulkDeleteApplications);
router.post('/admin/bulk-restore', authMiddleware, adminBulkRestoreApplications);
router.post('/admin/bulk-status', authMiddleware, adminBulkStatusApplications);
router.post('/admin/:id/restore', authMiddleware, adminRestoreApplication);
router.delete('/admin/:id/permanent', authMiddleware, adminPermanentlyDeleteApplication);
router.patch('/admin/:id/status', authMiddleware, adminUpdateApplicationStatus);
router.delete('/admin/:id', authMiddleware, adminDeleteApplication);
router.get('/admin/:id', authMiddleware, adminGetApplicationById);

// ─── Public Endpoints ────────────────────────────────────────────────────────
router.post('/', submitApplication);

export default router;
