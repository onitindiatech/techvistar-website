import { Router } from 'express';
import {
  getTeamMembers,
  getActiveTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from '@/controllers/teamMember.controller';
import { authMiddleware } from '@/middleware/auth.middleware';
import { adminLimiter, publicReadLimiter } from '@/middleware/rateLimit.middleware';
import { publicCmsCache } from '@/middleware/publicCmsCache.middleware';

const router = Router();

// Public routes
router.get('/active', publicReadLimiter, publicCmsCache, getActiveTeamMembers);

// Protected Admin routes
router.get('/', adminLimiter, authMiddleware, getTeamMembers);
router.post('/', adminLimiter, authMiddleware, createTeamMember);
router.put('/:id', adminLimiter, authMiddleware, updateTeamMember);
router.delete('/:id', adminLimiter, authMiddleware, deleteTeamMember);

export default router;
