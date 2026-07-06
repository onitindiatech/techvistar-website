/**
 * @file src/routes/faq.routes.ts
 * @description Route mapping for the FAQ CMS module.
 *
 * Public:
 *   GET /api/faqs           → returns all active FAQs sorted by displayOrder
 *   GET /api/faqs/:faqId    → returns a single FAQ by faqId
 *
 * Admin (JWT-gated in Phase 3):
 *   POST   /api/faqs/admin          → create FAQ
 *   PUT    /api/faqs/admin/:id      → update FAQ
 *   DELETE /api/faqs/admin/:id      → delete FAQ
 *   PATCH  /api/faqs/admin/:id/hide → hide FAQ (soft delete)
 *   PATCH  /api/faqs/admin/:id/order → update display order
 */

import { Router } from 'express';
import {
  getPublicFAQs,
  getPublicFAQById,
  adminCreateFAQ,
  adminUpdateFAQ,
  adminDeleteFAQ,
  adminHideFAQ,
  adminUpdateFAQOrder,
  adminGetFAQs,
} from '@/controllers/faq.controller';

const router = Router();

// ─── Admin routes (to be JWT gated under authentication phase) ─────────────────
router.get('/admin',             adminGetFAQs);
router.post('/admin',            adminCreateFAQ);
router.put('/admin/:id',         adminUpdateFAQ);
router.delete('/admin/:id',      adminDeleteFAQ);
router.patch('/admin/:id/hide',  adminHideFAQ);
router.patch('/admin/:id/order', adminUpdateFAQOrder);

// ─── Public routes ─────────────────────────────────────────────────────────────
// GET /api/faqs — Returns all active FAQs
router.get('/', getPublicFAQs);

// GET /api/faqs/:faqId — Returns a single FAQ by faqId
router.get('/:faqId', getPublicFAQById);

export default router;
