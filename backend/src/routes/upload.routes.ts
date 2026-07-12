/**
 * @file src/routes/upload.routes.ts
 * @description Route definitions for CMS media uploads.
 */

import { Router } from 'express';
import { uploadImage, uploadVideo, uploadResume, deliverResumeFile } from '@/controllers/upload.controller';
import { authMiddleware } from '@/middleware/auth.middleware';
import {
  uploadImageMiddleware,
  uploadVideoMiddleware,
  uploadResumeMiddleware,
} from '@/middleware/upload.middleware';
import { adminLimiter, resumeUploadLimiter } from '@/middleware/rateLimit.middleware';

const router = Router();

// POST /api/upload/resume — public resume upload for job applications
router.post('/resume', resumeUploadLimiter, uploadResumeMiddleware, uploadResume);

// GET /api/upload/resume/file — authenticated original resume download (PDF backup)
router.get('/resume/file', authMiddleware, deliverResumeFile);

// POST /api/upload/image — authenticated admin image upload to Cloudinary
router.post('/image', adminLimiter, authMiddleware, uploadImageMiddleware, uploadImage);

// POST /api/upload/video — authenticated admin video upload to Cloudinary
router.post('/video', adminLimiter, authMiddleware, uploadVideoMiddleware, uploadVideo);

export default router;
