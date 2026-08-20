import { Router } from 'express';
import {
  getBlogPosts,
  getPublishedBlogPosts,
  getBlogPostBySlug,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from '@/controllers/blogPost.controller';
import { authMiddleware } from '@/middleware/auth.middleware';
import { adminLimiter, publicReadLimiter } from '@/middleware/rateLimit.middleware';
import { publicCmsCache } from '@/middleware/publicCmsCache.middleware';

const router = Router();

// Public routes
router.get('/published', publicReadLimiter, publicCmsCache, getPublishedBlogPosts);
router.get('/slug/:slug', publicReadLimiter, publicCmsCache, getBlogPostBySlug);

// Protected Admin routes
router.get('/', adminLimiter, authMiddleware, getBlogPosts);
router.post('/', adminLimiter, authMiddleware, createBlogPost);
router.put('/:id', adminLimiter, authMiddleware, updateBlogPost);
router.delete('/:id', adminLimiter, authMiddleware, deleteBlogPost);

export default router;
