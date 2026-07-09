/**
 * @file src/types/upload.ts
 * @description Shared types for the media upload module.
 */

/** Normalised image metadata returned after a successful Cloudinary upload. */
export interface UploadedImageResult {
  url:      string;
  publicId: string;
  width:    number;
  height:   number;
  format:   string;
}

export interface UploadedVideoResult {
  url:      string;
  publicId: string;
  format:   string;
  duration?: number;
  bytes?:   number;
}

export interface UploadedResumeResult {
  url:      string;
  publicId: string;
  format:   string;
  bytes?:   number;
  mimeType: string;
  originalFileName: string;
  resourceType: 'image' | 'raw';
}
