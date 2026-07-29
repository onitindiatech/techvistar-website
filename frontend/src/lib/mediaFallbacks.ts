/**
 * @file mediaFallbacks.ts
 * @description Shared CMS image fallback helpers for listing vs detail surfaces.
 */

/** Vite-bundled or local asset paths — not CMS-managed media. */
export function isBundledAssetUrl(url: string): boolean {
  const value = url.trim().toLowerCase();
  if (!value) return true;
  return (
    value.includes('logo.webp') ||
    value.startsWith('/src/assets/') ||
    (value.startsWith('/assets/') && !value.includes('cloudinary.com'))
  );
}

/** Build a Cloudinary delivery URL from a stored public_id (optional hint for cloud name). */
export function cloudinaryUrlFromPublicId(
  publicId: string | undefined,
  cloudNameHint?: string,
): string {
  const id = publicId?.trim();
  if (!id) return '';

  const fromHint = cloudNameHint?.match(/res\.cloudinary\.com\/([^/]+)\//i)?.[1];
  const cloud = fromHint || import.meta.env.VITE_CLOUDINARY_CLOUD_NAME?.trim();
  if (!cloud) return '';
  return `https://res.cloudinary.com/${cloud}/image/upload/${id}`;
}

/** Seed / demo URLs that should yield to a real CMS Cloudinary upload. */
export function isSoftPlaceholderUrl(url: string): boolean {
  const value = url.trim().toLowerCase();
  if (!value) return true;
  return (
    value.includes('images.unsplash.com') ||
    value.includes('placehold.co') ||
    value.includes('via.placeholder.com')
  );
}

/**
 * Prefer a real CMS primary image; soft placeholders (seed Unsplash / placehold.co)
 * yield to a real secondary (e.g. Cloudinary cover). Last resort is finalFallback.
 */
export function preferCmsImage(primary: string | undefined, secondary: string | undefined, finalFallback = ''): string {
  const a = (primary || '').trim();
  const b = (secondary || '').trim();

  if (a && !isSoftPlaceholderUrl(a)) return a;
  if (b && !isSoftPlaceholderUrl(b)) return b;
  if (a) return a;
  if (b) return b;
  return finalFallback;
}
