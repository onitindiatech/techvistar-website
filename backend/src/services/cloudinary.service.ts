/**
 * @file src/services/cloudinary.service.ts
 * @description Reusable Cloudinary upload / delete lifecycle service.
 */

import { Readable } from 'stream';
import type { UploadApiResponse } from 'cloudinary';
import { cloudinary } from '@/config/cloudinary';
import { UPLOAD, VIDEO_UPLOAD, RESUME_UPLOAD } from '@/constants';
import { ApiError } from '@/utils/ApiError';
import { logger } from '@/utils/logger';
import {
  buildResumePublicId,
  resolveResumeFormat,
  resolveResumeResourceType,
  sanitizeResumeFilename,
} from '@/utils/resumeAsset';
import { UploadedImageResult, UploadedResumeResult, UploadedVideoResult } from '@/types/upload';

/** Minimal file shape accepted by uploadImage (Multer memory storage). */
export type UploadableImageFile = {
  buffer: Buffer;
  mimetype: string;
  size?: number;
};

export type UploadableVideoFile = UploadableImageFile;

export type UploadableResumeFile = UploadableImageFile & {
  originalname: string;
};

class CloudinaryService {
  /**
   * Uploads an in-memory image buffer and returns secure_url + public_id metadata.
   */
  async uploadImage(file: UploadableImageFile): Promise<UploadedImageResult> {
    if (!file?.buffer?.length) {
      throw ApiError.badRequest('No image file provided.');
    }

    try {
      const result = await this.uploadBuffer(file.buffer, file.mimetype, 'image', UPLOAD.CLOUDINARY_FOLDER);

      logger.info('[CloudinaryService] Image uploaded', {
        publicId: result.public_id,
        format: result.format,
        bytes: result.bytes,
      });

      return {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width ?? 0,
        height: result.height ?? 0,
        format: result.format ?? 'unknown',
      };
    } catch (err) {
      logger.error('[CloudinaryService] Upload failed', {
        message: err instanceof Error ? err.message : String(err),
        mimeType: file.mimetype,
        size: file.size,
      });

      if (err instanceof ApiError) {
        throw err;
      }

      throw ApiError.internal('Failed to upload image to Cloudinary.');
    }
  }

  async uploadResume(file: UploadableResumeFile): Promise<UploadedResumeResult> {
    if (!file?.buffer?.length) {
      throw ApiError.badRequest('No resume file provided.');
    }

    const originalFileName = sanitizeResumeFilename(file.originalname || 'resume.pdf');
    const resourceType = resolveResumeResourceType(file.mimetype);
    const format = resolveResumeFormat(file.mimetype, originalFileName);
    const publicId = buildResumePublicId(originalFileName);

    try {
      const uploadOptions: { publicId?: string; format?: string } = { publicId };
      // Let Cloudinary detect PDF format; forcing format on upload can break delivery metadata.
      if (resourceType === 'raw') {
        uploadOptions.format = format;
      }

      const result = await this.uploadBuffer(
        file.buffer,
        file.mimetype,
        resourceType,
        RESUME_UPLOAD.CLOUDINARY_FOLDER,
        uploadOptions,
      );

      logger.info('[CloudinaryService] Resume uploaded', {
        publicId: result.public_id,
        format: result.format,
        bytes: result.bytes,
        resourceType,
        originalFileName,
      });

      return {
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format ?? format ?? 'unknown',
        bytes: result.bytes,
        mimeType: file.mimetype,
        originalFileName,
        resourceType,
      };
    } catch (err) {
      logger.error('[CloudinaryService] Resume upload failed', {
        message: err instanceof Error ? err.message : String(err),
        mimeType: file.mimetype,
        size: file.size,
      });

      if (err instanceof ApiError) {
        throw err;
      }

      throw ApiError.internal('Failed to upload resume to Cloudinary.');
    }
  }

  async uploadVideo(file: UploadableVideoFile): Promise<UploadedVideoResult> {
    if (!file?.buffer?.length) {
      throw ApiError.badRequest('No video file provided.');
    }

    try {
      const result = await this.uploadBuffer(file.buffer, file.mimetype, 'video', VIDEO_UPLOAD.CLOUDINARY_FOLDER);

      logger.info('[CloudinaryService] Video uploaded', {
        publicId: result.public_id,
        format: result.format,
        bytes: result.bytes,
      });

      return {
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format ?? 'unknown',
        duration: result.duration,
        bytes: result.bytes,
      };
    } catch (err) {
      logger.error('[CloudinaryService] Video upload failed', {
        message: err instanceof Error ? err.message : String(err),
        mimeType: file.mimetype,
        size: file.size,
      });

      if (err instanceof ApiError) {
        throw err;
      }

      throw ApiError.internal('Failed to upload video to Cloudinary.');
    }
  }

  /**
   * Deletes a Cloudinary asset by public_id.
   * Never throws — Cloudinary failures are logged so MongoDB cleanup can continue.
   */
  async deleteImage(publicId: string | null | undefined): Promise<boolean> {
    const id = typeof publicId === 'string' ? publicId.trim() : '';
    if (!id) {
      return false;
    }

    try {
      const result = await cloudinary.uploader.destroy(id, {
        resource_type: 'image',
        invalidate: true,
      });

      const outcome = typeof result?.result === 'string' ? result.result : 'unknown';

      if (outcome === 'ok' || outcome === 'not found') {
        logger.info('[CloudinaryService] Image deleted', { publicId: id, outcome });
        return outcome === 'ok';
      }

      logger.warn('[CloudinaryService] Unexpected destroy response', {
        publicId: id,
        result,
      });
      return false;
    } catch (err) {
      logger.error('[CloudinaryService] Delete failed — continuing without aborting API', {
        publicId: id,
        message: err instanceof Error ? err.message : String(err),
      });
      return false;
    }
  }

  /**
   * Best-effort bulk delete. Never throws.
   */
  async deleteImages(publicIds: Array<string | null | undefined>): Promise<void> {
    const unique = [
      ...new Set(
        publicIds
          .map((id) => (typeof id === 'string' ? id.trim() : ''))
          .filter(Boolean)
      ),
    ];

    for (const id of unique) {
      await this.deleteImage(id);
    }
  }

  private uploadBuffer(
    buffer: Buffer,
    mimeType: string,
    resourceType: 'image' | 'video' | 'raw' = 'image',
    folder: string = UPLOAD.CLOUDINARY_FOLDER,
    options?: { publicId?: string; format?: string }
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: resourceType,
          public_id: options?.publicId,
          format:
            options?.format ??
            (resourceType === 'image' && mimeType === 'image/svg+xml' ? 'svg' : undefined),
          invalidate: true,
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          if (!result) {
            return reject(new Error('Cloudinary returned an empty upload result'));
          }
          resolve(result);
        }
      );

      Readable.from(buffer).pipe(uploadStream);
    });
  }
}

export const cloudinaryService = new CloudinaryService();
