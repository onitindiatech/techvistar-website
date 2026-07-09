/**
 * @file src/middleware/upload.middleware.ts
 * @description Reusable Multer middleware for in-memory image uploads.
 *
 * ARCHITECTURE DECISION:
 *   memoryStorage keeps files in a Buffer (req.file.buffer) so they can be
 *   streamed directly to Cloudinary without touching the local filesystem.
 *   File-type validation uses both MIME type and extension to reduce spoofing.
 */

import path from 'path';
import multer, { MulterError } from 'multer';
import { Request, Response, NextFunction } from 'express';
import { UPLOAD, VIDEO_UPLOAD, RESUME_UPLOAD } from '@/constants';
import { ApiError } from '@/utils/ApiError';

const storage = multer.memoryStorage();

const imageUpload = multer({
  storage,
  limits: {
    fileSize: UPLOAD.MAX_FILE_SIZE_BYTES,
    files:    1,
  },
  fileFilter: (_req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const mimeAllowed = (UPLOAD.ALLOWED_MIME_TYPES as readonly string[]).includes(file.mimetype);
    const extAllowed  = (UPLOAD.ALLOWED_EXTENSIONS as readonly string[]).includes(extension);

    if (!mimeAllowed || !extAllowed) {
      return cb(
        ApiError.validationError(
          'Invalid file type. Only JPG, JPEG, PNG, WEBP, and SVG images are allowed.',
          [{ field: UPLOAD.FIELD_NAME, mimeType: file.mimetype, extension }]
        )
      );
    }

    cb(null, true);
  },
});

/**
 * Parses a single image from multipart/form-data field `image`.
 * Forwards Multer and validation errors to the global error handler.
 */
export function uploadImageMiddleware(
  req:  Request,
  res:  Response,
  next: NextFunction
): void {
  imageUpload.single(UPLOAD.FIELD_NAME)(req, res, (err: unknown) => {
    if (err instanceof MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(
          ApiError.badRequest(
            `File too large. Maximum allowed size is ${UPLOAD.MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB.`
          )
        );
      }
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return next(
          ApiError.badRequest(
            `Unexpected file field. Use "${UPLOAD.FIELD_NAME}" as the form field name.`
          )
        );
      }
      return next(ApiError.badRequest(err.message));
    }

    if (err) {
      return next(err);
    }

    next();
  });
}

const videoUpload = multer({
  storage,
  limits: {
    fileSize: VIDEO_UPLOAD.MAX_FILE_SIZE_BYTES,
    files:    1,
  },
  fileFilter: (_req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const mimeAllowed = (VIDEO_UPLOAD.ALLOWED_MIME_TYPES as readonly string[]).includes(file.mimetype);
    const extAllowed  = (VIDEO_UPLOAD.ALLOWED_EXTENSIONS as readonly string[]).includes(extension);

    if (!mimeAllowed || !extAllowed) {
      return cb(
        ApiError.validationError(
          'Invalid file type. Only MP4 and WebM videos are allowed.',
          [{ field: VIDEO_UPLOAD.FIELD_NAME, mimeType: file.mimetype, extension }]
        )
      );
    }

    cb(null, true);
  },
});

const resumeUpload = multer({
  storage,
  limits: {
    fileSize: RESUME_UPLOAD.MAX_FILE_SIZE_BYTES,
    files:    1,
  },
  fileFilter: (_req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const mimeAllowed = (RESUME_UPLOAD.ALLOWED_MIME_TYPES as readonly string[]).includes(file.mimetype);
    const extAllowed  = (RESUME_UPLOAD.ALLOWED_EXTENSIONS as readonly string[]).includes(extension);

    if (!mimeAllowed || !extAllowed) {
      return cb(
        ApiError.validationError(
          'Invalid file type. Only PDF, DOC, DOCX, PNG, JPG, and JPEG resumes are allowed.',
          [{ field: RESUME_UPLOAD.FIELD_NAME, mimeType: file.mimetype, extension }]
        )
      );
    }

    cb(null, true);
  },
});

export function uploadResumeMiddleware(
  req:  Request,
  res:  Response,
  next: NextFunction
): void {
  resumeUpload.single(RESUME_UPLOAD.FIELD_NAME)(req, res, (err: unknown) => {
    if (err instanceof MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(
          ApiError.badRequest(
            `File too large. Maximum allowed size is ${RESUME_UPLOAD.MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB.`
          )
        );
      }
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return next(
          ApiError.badRequest(
            `Unexpected file field. Use "${RESUME_UPLOAD.FIELD_NAME}" as the form field name.`
          )
        );
      }
      return next(ApiError.badRequest(err.message));
    }

    if (err) {
      return next(err);
    }

    next();
  });
}

export function uploadVideoMiddleware(
  req:  Request,
  res:  Response,
  next: NextFunction
): void {
  videoUpload.single(VIDEO_UPLOAD.FIELD_NAME)(req, res, (err: unknown) => {
    if (err instanceof MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(
          ApiError.badRequest(
            `File too large. Maximum allowed size is ${VIDEO_UPLOAD.MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB.`
          )
        );
      }
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return next(
          ApiError.badRequest(
            `Unexpected file field. Use "${VIDEO_UPLOAD.FIELD_NAME}" as the form field name.`
          )
        );
      }
      return next(ApiError.badRequest(err.message));
    }

    if (err) {
      return next(err);
    }

    next();
  });
}
