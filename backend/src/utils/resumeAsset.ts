/**
 * @file src/utils/resumeAsset.ts
 * @description Helpers for resume upload delivery (preview vs download, filenames, local backup).
 */

import fs from 'fs/promises';
import path from 'path';
import { createReadStream } from 'fs';

export const PREVIEWABLE_RESUME_MIMES = new Set([
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/jpg',
]);

export const RESUME_LOCAL_DIR = path.join(process.cwd(), 'uploads', 'resumes');

export interface ResumeDeliveryInput {
  resumeUrl: string;
  resumePublicId?: string;
  resumeMimeType?: string;
  originalFileName?: string;
}

export function sanitizeResumeFilename(originalname: string): string {
  const ext = path.extname(originalname).toLowerCase();
  const base =
    path
      .basename(originalname, ext)
      .replace(/[^a-zA-Z0-9._-]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .slice(0, 100) || 'resume';
  const safeExt = ext.replace(/[^a-z0-9.]/gi, '').slice(0, 10) || '.pdf';
  return `${base}${safeExt.startsWith('.') ? safeExt : `.${safeExt}`}`;
}

/** PDFs use image resource so Cloudinary can render page previews; office docs stay raw. */
export function resolveResumeResourceType(mimeType: string): 'image' | 'raw' {
  return PREVIEWABLE_RESUME_MIMES.has(mimeType.toLowerCase()) ? 'image' : 'raw';
}

export function resolveResumeFormat(mimeType: string, originalname: string): string {
  const ext = path.extname(originalname).toLowerCase().slice(1);
  if (mimeType === 'application/pdf') return 'pdf';
  if (mimeType === 'image/png') return 'png';
  if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') return 'jpg';
  if (mimeType === 'application/msword') return 'doc';
  if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return 'docx';
  }
  return ext || 'bin';
}

export function buildResumePublicId(originalname: string): string {
  const ext = path.extname(originalname).toLowerCase();
  const base =
    path
      .basename(originalname, ext)
      .replace(/[^a-zA-Z0-9._-]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .slice(0, 72) || 'resume';
  return `${base}_${Date.now()}`;
}

function localResumeKey(publicId: string): string {
  return publicId.replace(/\//g, '__');
}

export function getResumeLocalPath(publicId: string, format: string): string {
  return path.join(RESUME_LOCAL_DIR, `${localResumeKey(publicId)}.${format}`);
}

export async function persistResumeLocally(
  publicId: string,
  buffer: Buffer,
  format: string,
): Promise<string> {
  await fs.mkdir(RESUME_LOCAL_DIR, { recursive: true });
  const filePath = getResumeLocalPath(publicId, format);
  await fs.writeFile(filePath, buffer);
  return filePath;
}

export async function findLocalResumePath(publicId: string): Promise<string | null> {
  const key = localResumeKey(publicId);
  let entries: string[] = [];
  try {
    entries = await fs.readdir(RESUME_LOCAL_DIR);
  } catch {
    return null;
  }

  const match = entries.find((name) => name === key || name.startsWith(`${key}.`));
  return match ? path.join(RESUME_LOCAL_DIR, match) : null;
}

export function streamLocalResume(filePath: string) {
  return createReadStream(filePath);
}

export function mimeTypeFromFormat(format: string): string {
  switch (format.toLowerCase()) {
    case 'pdf':
      return 'application/pdf';
    case 'png':
      return 'image/png';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'doc':
      return 'application/msword';
    case 'docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    default:
      return 'application/octet-stream';
  }
}

type ParsedCloudinaryUrl = {
  cloud: string;
  resourceType: 'image' | 'raw';
  version?: string;
  publicPath: string;
};

export function parseCloudinaryDeliveryUrl(url: string): ParsedCloudinaryUrl | null {
  const match = url.match(
    /^https?:\/\/res\.cloudinary\.com\/([^/]+)\/(image|raw)\/upload\/(.+)$/i,
  );
  if (!match) return null;

  let remainder = match[3];
  remainder = remainder.replace(/^fl_attachment:[^/]+\//, '');

  let version: string | undefined;
  const versionMatch = remainder.match(/^v\d+\//);
  if (versionMatch) {
    version = versionMatch[0].slice(0, -1);
    remainder = remainder.slice(versionMatch[0].length);
  }

  remainder = remainder.replace(/^pg_\d+,[^/]+\//, '').replace(/^f_[^/]+\//, '');

  return {
    cloud: match[1],
    resourceType: match[2].toLowerCase() as 'image' | 'raw',
    version,
    publicPath: remainder.split('?')[0],
  };
}

function inferResumeFilename(input: ResumeDeliveryInput): string {
  if (input.originalFileName?.trim()) return input.originalFileName.trim();
  const url = input.resumeUrl ?? '';
  if (/\.pdf(\?|#|$)/i.test(url)) return 'resume.pdf';
  if (/\.png(\?|#|$)/i.test(url)) return 'resume.png';
  if (/\.jpe?g(\?|#|$)/i.test(url)) return 'resume.jpg';
  if (input.resumeMimeType === 'application/pdf') return 'resume.pdf';
  if (input.resumeMimeType === 'image/png') return 'resume.png';
  if (input.resumeMimeType?.startsWith('image/')) return 'resume.jpg';
  return 'resume';
}

function inferExtension(filename: string, input: ResumeDeliveryInput): string {
  const fromName = filename.includes('.') ? filename.split('.').pop() : '';
  if (fromName) return fromName.toLowerCase();
  return resolveResumeFormat(input.resumeMimeType ?? '', filename);
}

export function isPdfResume(input: ResumeDeliveryInput): boolean {
  const mime = input.resumeMimeType?.toLowerCase();
  if (mime === 'application/pdf') return true;
  return /\.pdf(\?|#|$)/i.test(input.resumeUrl ?? '');
}

/**
 * Cloudinary free plans block direct PDF CDN delivery (HTTP 401).
 * PDF previews must use page-as-image delivery (.jpg, pg_1).
 */
export function buildResumePreviewUrl(input: ResumeDeliveryInput): string | null {
  if (!input.resumeUrl?.trim()) return null;

  const parsed = parseCloudinaryDeliveryUrl(input.resumeUrl);
  if (!parsed) return input.resumeUrl.trim();

  const filename = inferResumeFilename(input);
  const ext = inferExtension(filename, input);

  let publicPath = input.resumePublicId?.trim() || parsed.publicPath;
  publicPath = publicPath.replace(/\.[^./]+$/i, '');

  const version = parsed.version ? `${parsed.version}/` : '';

  if (isPdfResume(input)) {
    return `https://res.cloudinary.com/${parsed.cloud}/image/upload/pg_1,f_jpg/${version}${publicPath}.jpg`;
  }

  if (!publicPath.includes('.')) {
    publicPath = `${publicPath}.${ext}`;
  }

  return `https://res.cloudinary.com/${parsed.cloud}/${parsed.resourceType}/upload/${version}${publicPath}`;
}

/** Cloudinary attachment URL for non-PDF assets; PDFs use the authenticated local backup route. */
export function buildResumeDownloadUrl(
  input: ResumeDeliveryInput,
  apiBaseUrl?: string,
): string | null {
  if (!input.resumeUrl?.trim()) return null;

  if (isPdfResume(input)) {
    const publicId = input.resumePublicId?.trim();
    if (!publicId || !apiBaseUrl) return null;
    return `${apiBaseUrl.replace(/\/$/, '')}/api/upload/resume/file?publicId=${encodeURIComponent(publicId)}`;
  }

  const parsed = parseCloudinaryDeliveryUrl(input.resumeUrl);
  if (!parsed) return input.resumeUrl.trim();

  const filename = inferResumeFilename(input);
  const ext = inferExtension(filename, input);
  let publicPath = input.resumePublicId?.trim() || parsed.publicPath;

  if (!publicPath.includes('.')) {
    publicPath = `${publicPath}.${ext}`;
  }

  const version = parsed.version ? `${parsed.version}/` : '';
  return `https://res.cloudinary.com/${parsed.cloud}/${parsed.resourceType}/upload/fl_attachment:${filename}/${version}${publicPath}`;
}
