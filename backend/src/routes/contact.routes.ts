import { Router } from 'express';
import rateLimit from 'express-rate-limit';
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
import { CONTACT_RATE_LIMIT } from '@/constants';

const router = Router();

const contactRateLimiter = rateLimit({
  windowMs: CONTACT_RATE_LIMIT.WINDOW_MS,
  max: CONTACT_RATE_LIMIT.MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    code: 'TOO_MANY_REQUESTS',
    message: 'Too many submissions from this IP. Please try again after 15 minutes.',
  },
});

// ─── Administrative Endpoints ──────────────────────────────────────────────────
router.get('/admin', authMiddleware, adminGetContacts);
router.patch('/admin/:id/status', authMiddleware, adminUpdateContactStatus);
router.post('/admin/bulk-delete', authMiddleware, adminBulkDeleteContacts);
router.post('/admin/bulk-restore', authMiddleware, adminBulkRestoreContacts);
router.post('/admin/bulk-status', authMiddleware, adminBulkStatusContacts);
router.post('/admin/:id/restore', authMiddleware, adminRestoreContact);
router.delete('/admin/:id/permanent', authMiddleware, adminPermanentlyDeleteContact);
router.delete('/admin/:id', authMiddleware, adminDeleteContact);

// ─── Public Endpoints ────────────────────────────────────────────────────────
router.post('/', contactRateLimiter, submitContactForm);

export default router;
