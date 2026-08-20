import { Router } from 'express';
import {
  getTestimonials,
  getPublishedTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '@/controllers/testimonial.controller';
import { authMiddleware } from '@/middleware/auth.middleware';
import { adminLimiter, publicReadLimiter } from '@/middleware/rateLimit.middleware';
import { publicCmsCache } from '@/middleware/publicCmsCache.middleware';

const router = Router();

// Public routes
router.get('/published', publicReadLimiter, publicCmsCache, getPublishedTestimonials);

// Protected Admin routes
router.get('/', adminLimiter, authMiddleware, getTestimonials);
router.post('/', adminLimiter, authMiddleware, createTestimonial);
router.put('/:id', adminLimiter, authMiddleware, updateTestimonial);
router.delete('/:id', adminLimiter, authMiddleware, deleteTestimonial);

export default router;
