/**
 * @file src/types/upload.ts
 * @description Shared types for CMS media uploads.
 */

export interface UploadedImageData {
  imageUrl: string;
  publicId: string;
  width:    number;
  height:   number;
  format:   string;
}

export interface UploadApiResponse {
  url:      string;
  publicId: string;
  width:    number;
  height:   number;
  format:   string;
}

export interface UploadedVideoData {
  videoUrl: string;
  publicId: string;
  format:   string;
  duration?: number;
}

export interface VideoUploadApiResponse {
  url:      string;
  publicId: string;
  format:   string;
  duration?: number;
}

export interface UploadedResumeData {
  resumeUrl: string;
  publicId: string;
  format: string;
  mimeType: string;
  originalFileName: string;
  resourceType: 'image' | 'raw';
}

export interface ResumeUploadApiResponse {
  url: string;
  publicId: string;
  format: string;
  mimeType: string;
  originalFileName: string;
  resourceType: 'image' | 'raw';
}
