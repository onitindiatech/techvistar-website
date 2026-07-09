/**
 * @file src/controllers/upload.controller.ts
 * @description Controller for media upload endpoints.
 */

import { Request, Response, NextFunction } from 'express';
import path from 'path';
import { cloudinaryService } from '@/services/cloudinary.service';
import { ApiResponse } from '@/utils/ApiResponse';
import { ApiError } from '@/utils/ApiError';
import { HTTP_STATUS, UPLOAD, VIDEO_UPLOAD, RESUME_UPLOAD } from '@/constants';
import {
  findLocalResumePath,
  mimeTypeFromFormat,
  persistResumeLocally,
  resolveResumeFormat,
  sanitizeResumeFilename,
  streamLocalResume,
} from '@/utils/resumeAsset';

/**
 * POST /api/upload/image
 * Accepts a single image file and uploads it to Cloudinary.
 * Returns { url, publicId, width, height, format }.
 */
export async function uploadImage(
  req:  Request,
  res:  Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.file) {
      throw ApiError.badRequest(
        `No image file provided. Send a multipart/form-data request with field "${UPLOAD.FIELD_NAME}".`
      );
    }

    const result = await cloudinaryService.uploadImage(req.file);

    ApiResponse.success(
      res,
      result,
      'Image uploaded successfully',
      HTTP_STATUS.CREATED
    );
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/upload/resume
 * Public endpoint for job applicants to upload a resume/CV to Cloudinary.
 */
export async function uploadResume(
  req:  Request,
  res:  Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.file) {
      throw ApiError.badRequest(
        `No resume file provided. Send a multipart/form-data request with field "${RESUME_UPLOAD.FIELD_NAME}".`
      );
    }

    if (
      req.file.mimetype === 'application/pdf' &&
      req.file.buffer.subarray(0, 4).toString() !== '%PDF'
    ) {
      throw ApiError.badRequest('The uploaded PDF file is invalid or corrupted.');
    }

    const result = await cloudinaryService.uploadResume(req.file);
    const format = resolveResumeFormat(req.file.mimetype, req.file.originalname);
    await persistResumeLocally(result.publicId, req.file.buffer, format);

    ApiResponse.success(
      res,
      result,
      'Resume uploaded successfully',
      HTTP_STATUS.CREATED
    );
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/upload/resume/file?publicId=...
 * Authenticated delivery of the original resume bytes (required for PDF on Cloudinary free plans).
 */
export async function deliverResumeFile(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const publicId = typeof req.query.publicId === 'string' ? req.query.publicId.trim() : '';
    if (!publicId) {
      throw ApiError.badRequest('publicId query parameter is required.');
    }

    const filePath = await findLocalResumePath(publicId);
    if (!filePath) {
      throw ApiError.notFound('Resume file is not available for download.');
    }

    const ext = path.extname(filePath).slice(1).toLowerCase();
    const downloadName =
      typeof req.query.filename === 'string' && req.query.filename.trim()
        ? sanitizeResumeFilename(req.query.filename.trim())
        : sanitizeResumeFilename(`resume.${ext || 'pdf'}`);

    res.setHeader('Content-Type', mimeTypeFromFormat(ext));
    res.setHeader('Content-Disposition', `attachment; filename="${downloadName}"`);
    streamLocalResume(filePath).pipe(res);
  } catch (err) {
    next(err);
  }
}

export async function uploadVideo(
  req:  Request,
  res:  Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.file) {
      throw ApiError.badRequest(
        `No video file provided. Send a multipart/form-data request with field "${VIDEO_UPLOAD.FIELD_NAME}".`
      );
    }

    const result = await cloudinaryService.uploadVideo(req.file);

    ApiResponse.success(
      res,
      result,
      'Video uploaded successfully',
      HTTP_STATUS.CREATED
    );
  } catch (err) {
    next(err);
  }
}
