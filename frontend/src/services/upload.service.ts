/**
 * @file src/services/upload.service.ts
 * @description Client service for CMS image uploads to Cloudinary via the backend API.
 */

import { getAccessToken } from "@/services/auth.service";
import type {
  UploadedImageData,
  UploadApiResponse,
  UploadedVideoData,
  VideoUploadApiResponse,
  UploadedResumeData,
  ResumeUploadApiResponse,
} from "@/types/upload";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const UPLOAD_CONSTRAINTS = {
  maxFileSizeBytes: 5 * 1024 * 1024, // 5 MB
  acceptedMimeTypes: [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/svg+xml",
  ] as const,
  acceptedExtensions: [".jpg", ".jpeg", ".png", ".webp", ".svg"] as const,
  fieldName: "image",
} as const;

interface ApiEnvelope<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

function mapUploadResponse(data: UploadApiResponse): UploadedImageData {
  return {
    imageUrl: data.url,
    publicId: data.publicId,
    width:    data.width,
    height:   data.height,
    format:   data.format,
  };
}

/**
 * Uploads an image file with XMLHttpRequest so upload progress can be tracked.
 */
export function uploadImageFile(
  file: File,
  onProgress?: (percent: number) => void
): Promise<UploadedImageData> {
  return new Promise((resolve, reject) => {
    const token = getAccessToken();
    const formData = new FormData();
    formData.append(UPLOAD_CONSTRAINTS.fieldName, file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API_BASE_URL}/api/upload/image`);
    xhr.withCredentials = true;

    if (token) {
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    }

    xhr.upload.onprogress = (event) => {
      if (!onProgress || !event.lengthComputable) return;
      onProgress(Math.min(100, Math.round((event.loaded / event.total) * 100)));
    };

    xhr.onload = () => {
      let payload: ApiEnvelope<UploadApiResponse> | null = null;

      try {
        payload = JSON.parse(xhr.responseText) as ApiEnvelope<UploadApiResponse>;
      } catch {
        payload = null;
      }

      if (xhr.status >= 200 && xhr.status < 300 && payload?.data) {
        resolve(mapUploadResponse(payload.data));
        return;
      }

      reject(new Error(payload?.message || "Image upload failed"));
    };

    xhr.onerror = () => reject(new Error("Network error while uploading image"));
    xhr.onabort = () => reject(new Error("Image upload was cancelled"));

    xhr.send(formData);
  });
}

/**
 * Validates a file before upload (type + size).
 */
export function validateImageFile(file: File): string | null {
  const extension = `.${file.name.split(".").pop()?.toLowerCase() ?? ""}`;
  const mimeAllowed = (UPLOAD_CONSTRAINTS.acceptedMimeTypes as readonly string[]).includes(file.type);
  const extAllowed = (UPLOAD_CONSTRAINTS.acceptedExtensions as readonly string[]).includes(extension);

  if (!mimeAllowed || !extAllowed) {
    return "Invalid file type. Only JPG, JPEG, PNG, WEBP, and SVG are allowed.";
  }

  if (file.size > UPLOAD_CONSTRAINTS.maxFileSizeBytes) {
    return "File is too large. Maximum allowed size is 5 MB.";
  }

  return null;
}

export const VIDEO_UPLOAD_CONSTRAINTS = {
  maxFileSizeBytes: 50 * 1024 * 1024,
  acceptedMimeTypes: ['video/mp4', 'video/webm'] as const,
  acceptedExtensions: ['.mp4', '.webm'] as const,
  fieldName: 'video',
} as const;

function mapVideoResponse(data: VideoUploadApiResponse): UploadedVideoData {
  return {
    videoUrl: data.url,
    publicId: data.publicId,
    format: data.format,
    duration: data.duration,
  };
}

export function uploadVideoFile(
  file: File,
  onProgress?: (percent: number) => void
): Promise<UploadedVideoData> {
  return new Promise((resolve, reject) => {
    const token = getAccessToken();
    const formData = new FormData();
    formData.append(VIDEO_UPLOAD_CONSTRAINTS.fieldName, file);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_BASE_URL}/api/upload/video`);
    xhr.withCredentials = true;

    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }

    xhr.upload.onprogress = (event) => {
      if (!onProgress || !event.lengthComputable) return;
      onProgress(Math.min(100, Math.round((event.loaded / event.total) * 100)));
    };

    xhr.onload = () => {
      let payload: ApiEnvelope<VideoUploadApiResponse> | null = null;
      try {
        payload = JSON.parse(xhr.responseText) as ApiEnvelope<VideoUploadApiResponse>;
      } catch {
        payload = null;
      }

      if (xhr.status >= 200 && xhr.status < 300 && payload?.data) {
        resolve(mapVideoResponse(payload.data));
        return;
      }

      reject(new Error(payload?.message || 'Video upload failed'));
    };

    xhr.onerror = () => reject(new Error('Network error while uploading video'));
    xhr.onabort = () => reject(new Error('Video upload was cancelled'));

    xhr.send(formData);
  });
}

export function validateVideoFile(file: File): string | null {
  const extension = `.${file.name.split('.').pop()?.toLowerCase() ?? ''}`;
  const mimeAllowed = (VIDEO_UPLOAD_CONSTRAINTS.acceptedMimeTypes as readonly string[]).includes(file.type);
  const extAllowed = (VIDEO_UPLOAD_CONSTRAINTS.acceptedExtensions as readonly string[]).includes(extension);

  if (!mimeAllowed || !extAllowed) {
    return 'Invalid file type. Only MP4 and WebM are allowed.';
  }

  if (file.size > VIDEO_UPLOAD_CONSTRAINTS.maxFileSizeBytes) {
    return 'File is too large. Maximum allowed size is 50 MB.';
  }

  return null;
}

export const RESUME_UPLOAD_CONSTRAINTS = {
  maxFileSizeBytes: 5 * 1024 * 1024,
  acceptedMimeTypes: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/png',
    'image/jpeg',
    'image/jpg',
  ] as const,
  acceptedExtensions: ['.pdf', '.doc', '.docx', '.png', '.jpg', '.jpeg'] as const,
  fieldName: 'resume',
} as const;

function mapResumeResponse(data: ResumeUploadApiResponse): UploadedResumeData {
  return {
    resumeUrl: data.url,
    publicId: data.publicId,
    format: data.format,
    mimeType: data.mimeType,
    originalFileName: data.originalFileName,
    resourceType: data.resourceType,
  };
}

/** Uploads a resume/CV for public job applications (no auth required). */
export function uploadResumeFile(
  file: File,
  onProgress?: (percent: number) => void
): Promise<UploadedResumeData> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append(RESUME_UPLOAD_CONSTRAINTS.fieldName, file);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_BASE_URL}/api/upload/resume`);

    xhr.upload.onprogress = (event) => {
      if (!onProgress || !event.lengthComputable) return;
      onProgress(Math.min(100, Math.round((event.loaded / event.total) * 100)));
    };

    xhr.onload = () => {
      let payload: ApiEnvelope<ResumeUploadApiResponse> | null = null;
      try {
        payload = JSON.parse(xhr.responseText) as ApiEnvelope<ResumeUploadApiResponse>;
      } catch {
        payload = null;
      }

      if (xhr.status >= 200 && xhr.status < 300 && payload?.data) {
        resolve(mapResumeResponse(payload.data));
        return;
      }

      reject(new Error(payload?.message || 'Resume upload failed'));
    };

    xhr.onerror = () => reject(new Error('Network error while uploading resume'));
    xhr.onabort = () => reject(new Error('Resume upload was cancelled'));

    xhr.send(formData);
  });
}

export function validateResumeFile(file: File): string | null {
  const extension = `.${file.name.split('.').pop()?.toLowerCase() ?? ''}`;
  const mimeAllowed = (RESUME_UPLOAD_CONSTRAINTS.acceptedMimeTypes as readonly string[]).includes(file.type);
  const extAllowed = (RESUME_UPLOAD_CONSTRAINTS.acceptedExtensions as readonly string[]).includes(extension);

  if (!mimeAllowed || !extAllowed) {
    return 'Invalid file type. Only PDF, DOC, DOCX, PNG, JPG, and JPEG are allowed.';
  }

  if (file.size > RESUME_UPLOAD_CONSTRAINTS.maxFileSizeBytes) {
    return 'File is too large. Maximum allowed size is 5 MB.';
  }

  return null;
}
