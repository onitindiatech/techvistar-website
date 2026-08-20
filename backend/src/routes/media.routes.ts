import { Router } from 'express';
import {
  getMedia,
  getMediaById,
  createMedia,
  deleteMedia,
} from '@/controllers/media.controller';
import { authMiddleware } from '@/middleware/auth.middleware';
import { adminLimiter } from '@/middleware/rateLimit.middleware';

const router = Router();

// Protected Admin routes
router.get('/', adminLimiter, authMiddleware, getMedia);
router.get('/:id', adminLimiter, authMiddleware, getMediaById);
router.post('/', adminLimiter, authMiddleware, createMedia);
router.delete('/:id', adminLimiter, authMiddleware, deleteMedia);

export default router;
