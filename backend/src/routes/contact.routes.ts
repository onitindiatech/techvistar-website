import { Router } from 'express';
import {
  submitContactForm,
  adminGetContacts,
  adminUpdateContactStatus,
  adminDeleteContact,
  adminRestoreContact,
  adminPermanentlyDeleteContact,
  adminBulkDeleteContacts,
  adminBulkRestoreContacts,
  adminBulkStatusContacts,
} from '@/controllers/contact.controller';
import { authMiddleware } from '@/middleware/auth.middleware';
import { adminLimiter, contactLimiter } from '@/middleware/rateLimit.middleware';

const router = Router();

// ─── Administrative Endpoints ──────────────────────────────────────────────────
router.use('/admin', adminLimiter);
router.get('/admin', authMiddleware, adminGetContacts);
router.patch('/admin/:id/status', authMiddleware, adminUpdateContactStatus);
router.post('/admin/bulk-delete', authMiddleware, adminBulkDeleteContacts);
router.post('/admin/bulk-restore', authMiddleware, adminBulkRestoreContacts);
router.post('/admin/bulk-status', authMiddleware, adminBulkStatusContacts);
router.post('/admin/:id/restore', authMiddleware, adminRestoreContact);
router.delete('/admin/:id/permanent', authMiddleware, adminPermanentlyDeleteContact);
router.delete('/admin/:id', authMiddleware, adminDeleteContact);

// ─── Public Endpoints ────────────────────────────────────────────────────────
router.post('/', contactLimiter, submitContactForm);

export default router;
