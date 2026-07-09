/**
 * @file src/utils/seoFields.ts
 * @description Shared SEO field schema + validator helpers for CMS entities.
 */

export interface ISeoFields {
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogImagePublicId?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterImagePublicId?: string;
  robotsIndex?: boolean;
  robotsFollow?: boolean;
}

export const seoMongooseFields = {
  seoTitle: { type: String, trim: true, default: '' },
  seoDescription: { type: String, trim: true, default: '' },
  canonicalUrl: { type: String, trim: true, default: '' },
  ogTitle: { type: String, trim: true, default: '' },
  ogDescription: { type: String, trim: true, default: '' },
  ogImage: { type: String, trim: true, default: '' },
  ogImagePublicId: { type: String, trim: true, default: '' },
  twitterTitle: { type: String, trim: true, default: '' },
  twitterDescription: { type: String, trim: true, default: '' },
  twitterImage: { type: String, trim: true, default: '' },
  twitterImagePublicId: { type: String, trim: true, default: '' },
  robotsIndex: { type: Boolean, default: true },
  robotsFollow: { type: Boolean, default: true },
};

export type SeoInput = {
  seoTitle?: unknown;
  seoDescription?: unknown;
  canonicalUrl?: unknown;
  ogTitle?: unknown;
  ogDescription?: unknown;
  ogImage?: unknown;
  ogImagePublicId?: unknown;
  twitterTitle?: unknown;
  twitterDescription?: unknown;
  twitterImage?: unknown;
  twitterImagePublicId?: unknown;
  robotsIndex?: unknown;
  robotsFollow?: unknown;
};

function trimOrEmpty(val: unknown): string {
  if (val === undefined || val === null) return '';
  return String(val).trim();
}

function parseBool(val: unknown, defaultValue: boolean): boolean {
  if (val === undefined || val === null) return defaultValue;
  if (val === true || val === 'true') return true;
  if (val === false || val === 'false') return false;
  return defaultValue;
}

export function pickSeoForCreate(input: SeoInput): ISeoFields {
  return {
    seoTitle: trimOrEmpty(input.seoTitle),
    seoDescription: trimOrEmpty(input.seoDescription),
    canonicalUrl: trimOrEmpty(input.canonicalUrl),
    ogTitle: trimOrEmpty(input.ogTitle),
    ogDescription: trimOrEmpty(input.ogDescription),
    ogImage: trimOrEmpty(input.ogImage),
    ogImagePublicId: trimOrEmpty(input.ogImagePublicId),
    twitterTitle: trimOrEmpty(input.twitterTitle),
    twitterDescription: trimOrEmpty(input.twitterDescription),
    twitterImage: trimOrEmpty(input.twitterImage),
    twitterImagePublicId: trimOrEmpty(input.twitterImagePublicId),
    robotsIndex: parseBool(input.robotsIndex, true),
    robotsFollow: parseBool(input.robotsFollow, true),
  };
}

export function pickSeoForUpdate(input: SeoInput): Partial<ISeoFields> {
  const partial: Partial<ISeoFields> = {};
  if (input.seoTitle !== undefined) partial.seoTitle = trimOrEmpty(input.seoTitle);
  if (input.seoDescription !== undefined) partial.seoDescription = trimOrEmpty(input.seoDescription);
  if (input.canonicalUrl !== undefined) partial.canonicalUrl = trimOrEmpty(input.canonicalUrl);
  if (input.ogTitle !== undefined) partial.ogTitle = trimOrEmpty(input.ogTitle);
  if (input.ogDescription !== undefined) partial.ogDescription = trimOrEmpty(input.ogDescription);
  if (input.ogImage !== undefined) partial.ogImage = trimOrEmpty(input.ogImage);
  if (input.ogImagePublicId !== undefined) partial.ogImagePublicId = trimOrEmpty(input.ogImagePublicId);
  if (input.twitterTitle !== undefined) partial.twitterTitle = trimOrEmpty(input.twitterTitle);
  if (input.twitterDescription !== undefined) partial.twitterDescription = trimOrEmpty(input.twitterDescription);
  if (input.twitterImage !== undefined) partial.twitterImage = trimOrEmpty(input.twitterImage);
  if (input.twitterImagePublicId !== undefined) partial.twitterImagePublicId = trimOrEmpty(input.twitterImagePublicId);
  if (input.robotsIndex !== undefined) partial.robotsIndex = parseBool(input.robotsIndex, true);
  if (input.robotsFollow !== undefined) partial.robotsFollow = parseBool(input.robotsFollow, true);
  return partial;
}

export const SEO_IMAGE_MEDIA_KEYS = [
  { urlKey: 'ogImage', publicIdKey: 'ogImagePublicId' },
  { urlKey: 'twitterImage', publicIdKey: 'twitterImagePublicId' },
] as const;
