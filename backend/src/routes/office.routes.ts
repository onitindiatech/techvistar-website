import { Router } from 'express';
import {
  getPublicOffices,
  adminGetOffices,
  adminGetOfficeById,
  adminCreateOffice,
  adminUpdateOffice,
  adminDeleteOffice,
  adminReorderOffices,
} from '@/controllers/office.controller';
import { authMiddleware } from '@/middleware/auth.middleware';
import { adminLimiter, publicReadLimiter } from '@/middleware/rateLimit.middleware';
import { publicCmsCache } from '@/middleware/publicCmsCache.middleware';

const router = Router();

// Administrative CRUD Endpoints
router.use('/admin', adminLimiter);
router.get('/admin', authMiddleware, adminGetOffices);
router.post('/admin', authMiddleware, adminCreateOffice);
router.post('/admin/reorder', authMiddleware, adminReorderOffices);
router.get('/admin/:id', authMiddleware, adminGetOfficeById);
router.put('/admin/:id', authMiddleware, adminUpdateOffice);
router.delete('/admin/:id', authMiddleware, adminDeleteOffice);

// Public Endpoints
router.get('/', publicReadLimiter, publicCmsCache, getPublicOffices);

export default router;
