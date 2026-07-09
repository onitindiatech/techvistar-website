const PLACEHOLDER_RESUME_PATTERN = /placeholder\.pdf|\/resumes\/placeholder/i;

const PREVIEWABLE_MIME_TYPES = new Set([
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/jpg',
]);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export interface ResumeAssetFields {
  resumeUrl?: string | null;
  resumePublicId?: string | null;
  resumeMimeType?: string | null;
  originalFileName?: string | null;
}

/** Returns true when the URL is a real uploaded resume (not a legacy placeholder). */
export function isResolvableResumeUrl(url?: string | null): url is string {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed || PLACEHOLDER_RESUME_PATTERN.test(trimmed)) return false;
  return /^https?:\/\//i.test(trimmed);
}

export function canPreviewResumeInline(asset: ResumeAssetFields): boolean {
  const mime = asset.resumeMimeType?.toLowerCase();
  if (mime && PREVIEWABLE_MIME_TYPES.has(mime)) return true;

  const url = asset.resumeUrl ?? '';
  return /\.(pdf|png|jpe?g)(\?|#|$)/i.test(url);
}

function inferResumeFilename(asset: ResumeAssetFields): string {
  if (asset.originalFileName?.trim()) return asset.originalFileName.trim();

  const url = asset.resumeUrl ?? '';
  if (/\.pdf(\?|#|$)/i.test(url)) return 'resume.pdf';
  if (/\.png(\?|#|$)/i.test(url)) return 'resume.png';
  if (/\.jpe?g(\?|#|$)/i.test(url)) return 'resume.jpg';
  if (asset.resumeMimeType === 'application/pdf') return 'resume.pdf';
  if (asset.resumeMimeType === 'image/png') return 'resume.png';
  if (asset.resumeMimeType?.startsWith('image/')) return 'resume.jpg';
  return 'resume';
}

function inferExtension(filename: string, asset: ResumeAssetFields): string {
  const fromName = filename.includes('.') ? filename.split('.').pop() : '';
  if (fromName) return fromName.toLowerCase();

  const mime = asset.resumeMimeType?.toLowerCase() ?? '';
  if (mime === 'application/pdf') return 'pdf';
  if (mime === 'image/png') return 'png';
  if (mime === 'image/jpeg' || mime === 'image/jpg') return 'jpg';
  if (mime.includes('wordprocessingml')) return 'docx';
  if (mime === 'application/msword') return 'doc';
  return 'pdf';
}

function isPdfResume(asset: ResumeAssetFields): boolean {
  const mime = asset.resumeMimeType?.toLowerCase();
  if (mime === 'application/pdf') return true;
  return /\.pdf(\?|#|$)/i.test(asset.resumeUrl ?? '');
}

type ParsedCloudinaryUrl = {
  cloud: string;
  resourceType: 'image' | 'raw';
  version?: string;
  publicPath: string;
};

function parseCloudinaryDeliveryUrl(url: string): ParsedCloudinaryUrl | null {
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

/**
 * Inline browser preview URL.
 * PDFs use Cloudinary page-as-image delivery because direct PDF CDN URLs return HTTP 401 on free plans.
 */
export function getResumePreviewUrl(asset: ResumeAssetFields): string | null {
  if (!isResolvableResumeUrl(asset.resumeUrl)) return null;
  if (!canPreviewResumeInline(asset)) return null;

  const parsed = parseCloudinaryDeliveryUrl(asset.resumeUrl);
  if (!parsed) return asset.resumeUrl.trim();

  const filename = inferResumeFilename(asset);
  const ext = inferExtension(filename, asset);
  let publicPath = asset.resumePublicId?.trim() || parsed.publicPath;
  publicPath = publicPath.replace(/\.[^./]+$/i, '');
  const version = parsed.version ? `${parsed.version}/` : '';

  if (isPdfResume(asset)) {
    return `https://res.cloudinary.com/${parsed.cloud}/image/upload/pg_1,f_jpg/${version}${publicPath}.jpg`;
  }

  if (!publicPath.includes('.')) {
    publicPath = `${publicPath}.${ext}`;
  }

  return `https://res.cloudinary.com/${parsed.cloud}/${parsed.resourceType}/upload/${version}${publicPath}`;
}

/** PDFs download via authenticated backend backup; other formats use Cloudinary attachment URLs. */
export function getResumeDownloadUrl(asset: ResumeAssetFields): string | null {
  if (!isResolvableResumeUrl(asset.resumeUrl)) return null;

  if (isPdfResume(asset)) {
    const publicId = asset.resumePublicId?.trim();
    if (!publicId) return null;
    const params = new URLSearchParams({ publicId });
    if (asset.originalFileName?.trim()) {
      params.set('filename', asset.originalFileName.trim());
    }
    return `${API_BASE_URL}/api/upload/resume/file?${params.toString()}`;
  }

  const parsed = parseCloudinaryDeliveryUrl(asset.resumeUrl);
  if (!parsed) return asset.resumeUrl.trim();

  const filename = inferResumeFilename(asset);
  const ext = inferExtension(filename, asset);
  let publicPath = asset.resumePublicId?.trim() || parsed.publicPath;

  if (!publicPath.includes('.')) {
    publicPath = `${publicPath}.${ext}`;
  }

  const version = parsed.version ? `${parsed.version}/` : '';
  return `https://res.cloudinary.com/${parsed.cloud}/${parsed.resourceType}/upload/fl_attachment:${filename}/${version}${publicPath}`;
}

export async function downloadResumeWithAuth(
  asset: ResumeAssetFields,
  getAccessToken: () => string | null,
): Promise<void> {
  const url = getResumeDownloadUrl(asset);
  if (!url) throw new Error('Resume download is not available.');

  if (!isPdfResume(asset)) {
    window.open(url, '_blank', 'noopener,noreferrer');
    return;
  }

  const token = getAccessToken();
  if (!token) throw new Error('Admin authentication is required to download this resume.');

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.message || 'Failed to download resume.');
  }

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = inferResumeFilename(asset);
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(objectUrl);
}
