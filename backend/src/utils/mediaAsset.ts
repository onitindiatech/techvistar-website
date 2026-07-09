/**
 * @file src/utils/mediaAsset.ts
 * @description Helpers for deriving Cloudinary public_ids from CMS URLs and
 *              computing obsolete assets on replace / record deletion.
 *
 * Frontend continues to save image URL strings only. The backend derives and
 * stores companion `*PublicId` fields so cleanup never depends on the admin UI.
 */

export function isCloudinaryDeliveryUrl(value: string | null | undefined): boolean {
  const url = typeof value === 'string' ? value.trim() : '';
  if (!url) return false;
  return /res\.cloudinary\.com/i.test(url) || /cloudinary\.com\/.+\/(?:image|video|raw)\/upload\//i.test(url);
}

/**
 * Extract a Cloudinary public_id from a delivery URL, or accept a known public_id path.
 * Returns '' for legacy IMAGE_MAP keys, Unsplash, placehold, empty, etc.
 */
export function extractCloudinaryPublicId(urlOrId: string | null | undefined): string {
  const raw = typeof urlOrId === 'string' ? urlOrId.trim() : '';
  if (!raw) return '';

  // Our upload folder public_ids (no scheme)
  if (!/^https?:\/\//i.test(raw) && raw.startsWith('techvistar/')) {
    return raw.replace(/\.[a-z0-9]+$/i, '');
  }

  if (!isCloudinaryDeliveryUrl(raw)) {
    return '';
  }

  try {
    const pathname = decodeURIComponent(new URL(raw).pathname);
    const uploadIdx = pathname.search(/\/(?:image|video|raw)\/upload\//i);
    if (uploadIdx === -1) return '';

    const afterUpload = pathname.slice(uploadIdx).replace(/^\/(?:image|video|raw)\/upload\//i, '');
    const segments = afterUpload.split('/').filter(Boolean);

    // Drop version (v123) and transformation segments (contain underscore)
    while (segments.length > 0) {
      const seg = segments[0];
      if (/^v\d+$/i.test(seg) || /_/.test(seg)) {
        segments.shift();
        continue;
      }
      break;
    }

    if (!segments.length) return '';
    const joined = segments.join('/');
    return joined.replace(/\.[a-z0-9]+$/i, '');
  } catch {
    return '';
  }
}

/** Resolve the public_id that should be stored next to a URL field. */
export function publicIdForUrl(
  url: string | null | undefined,
  explicitPublicId?: string | null
): string {
  const explicit = typeof explicitPublicId === 'string' ? explicitPublicId.trim() : '';
  if (explicit) return explicit;
  return extractCloudinaryPublicId(url);
}

export type ScalarMediaField = {
  urlKey: string;
  publicIdKey: string;
};

/**
 * On create/update: attach companion publicId fields derived from URL strings.
 * Returns publicIds that became obsolete (replaced or cleared) for Cloudinary cleanup.
 */
export function syncScalarMediaFields(
  previous: Record<string, unknown> | null | undefined,
  next: Record<string, unknown>,
  fields: ScalarMediaField[]
): { payload: Record<string, unknown>; obsoletePublicIds: string[] } {
  const payload: Record<string, unknown> = { ...next };
  const obsoletePublicIds: string[] = [];

  for (const { urlKey, publicIdKey } of fields) {
    if (!(urlKey in next)) {
      continue;
    }

    const nextUrl = String(next[urlKey] ?? '').trim();
    const nextPublicId = publicIdForUrl(nextUrl, next[publicIdKey] as string | undefined);
    payload[publicIdKey] = nextPublicId;

    const prevUrl = String(previous?.[urlKey] ?? '').trim();
    const prevPublicId = publicIdForUrl(prevUrl, previous?.[publicIdKey] as string | undefined);

    if (prevPublicId && prevPublicId !== nextPublicId) {
      obsoletePublicIds.push(prevPublicId);
    }
  }

  return { payload, obsoletePublicIds };
}

/**
 * Sync gallery URL arrays + parallel publicId arrays.
 */
export function syncGalleryMedia(
  previousGallery: string[] | undefined,
  previousPublicIds: string[] | undefined,
  nextGallery: string[] | undefined
): { gallery: string[]; galleryPublicIds: string[]; obsoletePublicIds: string[] } {
  const gallery = (nextGallery ?? []).map((u) => String(u ?? '').trim()).filter(Boolean);
  const galleryPublicIds = gallery.map((url) => publicIdForUrl(url));

  const prevIds = new Set<string>();
  const prevGallery = previousGallery ?? [];
  const prevStored = previousPublicIds ?? [];

  prevGallery.forEach((url, idx) => {
    const id = publicIdForUrl(url, prevStored[idx]);
    if (id) prevIds.add(id);
  });
  prevStored.forEach((id) => {
    const trimmed = String(id ?? '').trim();
    if (trimmed) prevIds.add(trimmed);
  });

  const nextIds = new Set(galleryPublicIds.filter(Boolean));
  const obsoletePublicIds = [...prevIds].filter((id) => !nextIds.has(id));

  return { gallery, galleryPublicIds, obsoletePublicIds };
}

/** Collect every stored Cloudinary public_id on a CMS document for permanent delete. */
export function collectDocumentPublicIds(
  doc: Record<string, unknown> | null | undefined,
  scalarFields: ScalarMediaField[],
  galleryKeys?: { urlsKey: string; publicIdsKey: string }
): string[] {
  if (!doc) return [];

  const ids: string[] = [];

  for (const { urlKey, publicIdKey } of scalarFields) {
    const id = publicIdForUrl(doc[urlKey] as string, doc[publicIdKey] as string);
    if (id) ids.push(id);
  }

  if (galleryKeys) {
    const urls = (doc[galleryKeys.urlsKey] as string[] | undefined) ?? [];
    const stored = (doc[galleryKeys.publicIdsKey] as string[] | undefined) ?? [];
    urls.forEach((url, idx) => {
      const id = publicIdForUrl(url, stored[idx]);
      if (id) ids.push(id);
    });
    stored.forEach((id) => {
      const trimmed = String(id ?? '').trim();
      if (trimmed) ids.push(trimmed);
    });
  }

  return [...new Set(ids)];
}

/**
 * Extract Cloudinary media URLs embedded in Jobs description (`<!-- split -->` packing).
 */
export function extractUrlsFromJobDescription(description: string | null | undefined): string[] {
  const raw = typeof description === 'string' ? description : '';
  if (!raw) return [];

  const parts = raw.includes('<!-- split -->')
    ? raw.split('<!-- split -->').map((p) => p.trim())
    : [raw];

  const urls: string[] = [];
  for (const part of parts) {
    if (isCloudinaryDeliveryUrl(part)) {
      urls.push(part);
      continue;
    }
    const matches = part.match(/https?:\/\/res\.cloudinary\.com\/[^\s"'<>]+/gi);
    if (matches) {
      urls.push(...matches);
    }
  }

  return [...new Set(urls)];
}

export function collectJobMediaPublicIds(description: string | null | undefined): string[] {
  return extractUrlsFromJobDescription(description)
    .map((url) => extractCloudinaryPublicId(url))
    .filter(Boolean);
}

export function obsoleteJobMediaPublicIds(
  previousDescription: string | null | undefined,
  nextDescription: string | null | undefined
): string[] {
  const prev = new Set(collectJobMediaPublicIds(previousDescription));
  const next = new Set(collectJobMediaPublicIds(nextDescription));
  return [...prev].filter((id) => !next.has(id));
}

/** Best-effort Cloudinary cleanup — never throws. */
export async function deleteCloudinaryPublicIds(
  publicIds: Array<string | null | undefined>
): Promise<void> {
  const { cloudinaryService } = await import('@/services/cloudinary.service');
  await cloudinaryService.deleteImages(publicIds);
}

const SEO_SCALAR_MEDIA_FIELDS: ScalarMediaField[] = [
  { urlKey: 'ogImage', publicIdKey: 'ogImagePublicId' },
  { urlKey: 'twitterImage', publicIdKey: 'twitterImagePublicId' },
];

export const SERVICE_MEDIA_FIELDS: ScalarMediaField[] = [
  { urlKey: 'coverImage', publicIdKey: 'coverImagePublicId' },
  { urlKey: 'thumbnail', publicIdKey: 'thumbnailPublicId' },
  { urlKey: 'dashboardImage', publicIdKey: 'dashboardImagePublicId' },
  ...SEO_SCALAR_MEDIA_FIELDS,
];

export const INDUSTRY_MEDIA_FIELDS: ScalarMediaField[] = [
  { urlKey: 'coverImage', publicIdKey: 'coverImagePublicId' },
  { urlKey: 'thumbnail', publicIdKey: 'thumbnailPublicId' },
  { urlKey: 'dashboardImage', publicIdKey: 'dashboardImagePublicId' },
  ...SEO_SCALAR_MEDIA_FIELDS,
];

export const PROJECT_MEDIA_FIELDS: ScalarMediaField[] = [
  { urlKey: 'thumbnail', publicIdKey: 'thumbnailPublicId' },
  ...SEO_SCALAR_MEDIA_FIELDS,
];

export const SOLUTION_MEDIA_FIELDS: ScalarMediaField[] = [...SEO_SCALAR_MEDIA_FIELDS];

export const JOB_MEDIA_FIELDS: ScalarMediaField[] = [...SEO_SCALAR_MEDIA_FIELDS];
