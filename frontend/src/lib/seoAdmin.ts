import { EMPTY_SEO, SeoMetadata } from '@/types/seo';
import { seoFromApi } from '@/lib/seoResolve';

export function seoFromItem(item: Record<string, unknown> | null | undefined): SeoMetadata {
  return { ...EMPTY_SEO, ...seoFromApi(item ?? null) };
}

export function seoToPayload(seo: SeoMetadata): Record<string, string | boolean> {
  return {
    seoTitle: seo.seoTitle ?? '',
    seoDescription: seo.seoDescription ?? '',
    canonicalUrl: seo.canonicalUrl ?? '',
    ogTitle: seo.ogTitle ?? '',
    ogDescription: seo.ogDescription ?? '',
    ogImage: seo.ogImage ?? '',
    twitterTitle: seo.twitterTitle ?? '',
    twitterDescription: seo.twitterDescription ?? '',
    twitterImage: seo.twitterImage ?? '',
    robotsIndex: seo.robotsIndex !== false,
    robotsFollow: seo.robotsFollow !== false,
  };
}

export function patchSeo(
  current: SeoMetadata,
  patch: Partial<SeoMetadata>
): SeoMetadata {
  return { ...current, ...patch };
}
