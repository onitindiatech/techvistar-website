/**
 * @file src/routes/upload.routes.ts
 * @description Route definitions for CMS media uploads.
 */

import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { uploadImage, uploadVideo, uploadResume, deliverResumeFile } from '@/controllers/upload.controller';
import { authMiddleware } from '@/middleware/auth.middleware';
import {
  uploadImageMiddleware,
  uploadVideoMiddleware,
  uploadResumeMiddleware,
} from '@/middleware/upload.middleware';

const router = Router();

const resumeUploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'development' ? 50 : 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    code: 'TOO_MANY_REQUESTS',
    message: 'Too many resume uploads from this IP. Please try again later.',
  },
});

// POST /api/upload/resume — public resume upload for job applications
router.post('/resume', resumeUploadLimiter, uploadResumeMiddleware, uploadResume);

// GET /api/upload/resume/file — authenticated original resume download (PDF backup)
router.get('/resume/file', authMiddleware, deliverResumeFile);

// POST /api/upload/image — authenticated admin image upload to Cloudinary
router.post('/image', authMiddleware, uploadImageMiddleware, uploadImage);

// POST /api/upload/video — authenticated admin video upload to Cloudinary
router.post('/video', authMiddleware, uploadVideoMiddleware, uploadVideo);

export default router;
