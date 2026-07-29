import { Router } from 'express';
import { adminLimiter } from '@/middleware/rateLimit.middleware';
import { authMiddleware } from '@/middleware/auth.middleware';
import { adminGetDashboard } from '@/controllers/dashboard.controller';

const router = Router();

router.use(adminLimiter);

router.get('/dashboard', authMiddleware, adminGetDashboard);

export default router;
