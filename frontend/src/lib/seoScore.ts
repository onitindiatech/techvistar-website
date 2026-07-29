import { SeoMetadata } from '@/types/seo';

export type SeoCheckStatus = 'pass' | 'warning' | 'fail';

export interface SeoCheckItem {
  id: string;
  label: string;
  status: SeoCheckStatus;
  /** Max points this check can contribute */
  weight: number;
  /** Points earned */
  earned: number;
  message?: string;
}

export interface SeoScoreOptions {
  slug?: string;
  /** When false (landing pages), missing slug is not penalized */
  requireSlug?: boolean;
  pagePath?: string;
  /** Visible page H1 / hero title used for content SEO readiness */
  h1Text?: string;
  /** True when JSON-LD or equivalent structured data is present on the page */
  hasStructuredData?: boolean;
  /** True when the page exposes crawlable internal links / CTAs */
  hasInternalLinks?: boolean;
  /** True when primary imagery has alt text readiness */
  imageAltReady?: boolean;
  /** Other page titles in the CMS (duplicate detection) */
  existingTitles?: string[];
  /** Other page descriptions in the CMS (duplicate detection) */
  existingDescriptions?: string[];
}

export interface SeoScoreResult {
  score: number;
  checks: SeoCheckItem[];
  critical: SeoCheckItem[];
  warnings: SeoCheckItem[];
  passed: SeoCheckItem[];
  recommendations: string[];
  /** @deprecated Prefer recommendations / critical / warnings */
  suggestions: string[];
}

function isCleanPath(path: string): boolean {
  if (!path) return false;
  if (path.includes(' ') || path.includes('?') || path.includes('#')) return false;
  return /^\/[a-z0-9/-]*$/i.test(path);
}

function isCleanSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

function hasHttpUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

/**
 * Weighted SEO analyzer aligned with Lighthouse-style priorities:
 * indexability and core document signals weigh more than ideal string lengths.
 */
export function calculateSeoScore(
  seo: SeoMetadata,
  slugOrOptions?: string | SeoScoreOptions
): SeoScoreResult {
  const options: SeoScoreOptions =
    typeof slugOrOptions === 'string' || slugOrOptions === undefined
      ? { slug: slugOrOptions, requireSlug: true }
      : slugOrOptions;

  const requireSlug = options.requireSlug !== false;
  const title = seo.seoTitle?.trim() || '';
  const description = seo.seoDescription?.trim() || '';
  const slugVal = (options.slug ?? '').trim();
  const canonical = seo.canonicalUrl?.trim() || '';
  const ogTitle = seo.ogTitle?.trim() || '';
  const ogDescription = seo.ogDescription?.trim() || '';
  const ogImage = seo.ogImage?.trim() || '';
  const twitterTitle = seo.twitterTitle?.trim() || '';
  const twitterDescription = seo.twitterDescription?.trim() || '';
  const twitterImage = seo.twitterImage?.trim() || '';
  const h1 = options.h1Text?.trim() || '';
  const pagePath = options.pagePath?.trim() || '';

  const robotsIndex = seo.robotsIndex !== false;
  const robotsFollow = seo.robotsFollow !== false;

  const checks: SeoCheckItem[] = [];

  const push = (item: SeoCheckItem) => {
    checks.push(item);
  };

  // ── Critical indexability (≈55) ───────────────────────────────────────────

  if (!title) {
    push({
      id: 'title-exists',
      label: 'Title exists',
      status: 'fail',
      weight: 12,
      earned: 0,
      message: 'Add an SEO title — search engines need a document title.',
    });
  } else {
    push({
      id: 'title-exists',
      label: 'Title exists',
      status: 'pass',
      weight: 12,
      earned: 12,
    });
  }

  if (title) {
    if (title.length >= 30 && title.length <= 60) {
      push({
        id: 'title-length',
        label: 'Title length',
        status: 'pass',
        weight: 6,
        earned: 6,
      });
    } else if (title.length > 0 && title.length <= 70) {
      push({
        id: 'title-length',
        label: 'Title length',
        status: 'warning',
        weight: 6,
        earned: 4,
        message:
          title.length < 30
            ? 'Title is short (aim for ~30–60 characters for SERP display).'
            : 'Title is long and may truncate in search results.',
      });
    } else {
      push({
        id: 'title-length',
        label: 'Title length',
        status: 'warning',
        weight: 6,
        earned: 2,
        message: 'Title is very long and will likely truncate in SERPs.',
      });
    }
  } else {
    push({
      id: 'title-length',
      label: 'Title length',
      status: 'fail',
      weight: 6,
      earned: 0,
    });
  }

  if (!description) {
    push({
      id: 'meta-description-exists',
      label: 'Meta description exists',
      status: 'fail',
      weight: 12,
      earned: 0,
      message: 'Add a meta description for search result snippets.',
    });
  } else {
    push({
      id: 'meta-description-exists',
      label: 'Meta description exists',
      status: 'pass',
      weight: 12,
      earned: 12,
    });
  }

  if (description) {
    if (description.length >= 70 && description.length <= 160) {
      push({
        id: 'meta-description-length',
        label: 'Meta description length',
        status: 'pass',
        weight: 6,
        earned: 6,
      });
    } else {
      push({
        id: 'meta-description-length',
        label: 'Meta description length',
        status: 'warning',
        weight: 6,
        earned: 4,
        message:
          description.length < 70
            ? 'Meta description is short (aim for ~70–160 characters).'
            : 'Meta description may truncate in search results.',
      });
    }
  } else {
    push({
      id: 'meta-description-length',
      label: 'Meta description length',
      status: 'fail',
      weight: 6,
      earned: 0,
    });
  }

  if (robotsIndex) {
    push({
      id: 'robots-index',
      label: 'Robots Index',
      status: 'pass',
      weight: 10,
      earned: 10,
    });
  } else {
    push({
      id: 'robots-index',
      label: 'Robots Index',
      status: 'fail',
      weight: 10,
      earned: 0,
      message: 'Page is set to noindex — it will be hidden from search engines.',
    });
  }

  if (robotsFollow) {
    push({
      id: 'robots-follow',
      label: 'Robots Follow',
      status: 'pass',
      weight: 5,
      earned: 5,
    });
  } else {
    push({
      id: 'robots-follow',
      label: 'Robots Follow',
      status: 'warning',
      weight: 5,
      earned: 2,
      message: 'Nofollow is enabled — link equity from this page will not pass.',
    });
  }

  if (canonical) {
    if (hasHttpUrl(canonical)) {
      push({
        id: 'canonical',
        label: 'Canonical URL',
        status: 'pass',
        weight: 8,
        earned: 8,
      });
    } else {
      push({
        id: 'canonical',
        label: 'Canonical URL',
        status: 'warning',
        weight: 8,
        earned: 4,
        message: 'Canonical URL should be an absolute http(s) URL.',
      });
    }
  } else if (pagePath) {
    push({
      id: 'canonical',
      label: 'Canonical URL',
      status: 'warning',
      weight: 8,
      earned: 5,
      message: 'Canonical not set — a route-based canonical will be generated at runtime.',
    });
  } else {
    push({
      id: 'canonical',
      label: 'Canonical URL',
      status: 'warning',
      weight: 8,
      earned: 3,
      message: 'Set a canonical URL to avoid duplicate indexing.',
    });
  }

  if (h1) {
    push({
      id: 'h1',
      label: 'H1 presence',
      status: 'pass',
      weight: 8,
      earned: 8,
    });
  } else {
    push({
      id: 'h1',
      label: 'H1 presence',
      status: 'warning',
      weight: 8,
      earned: 3,
      message: 'Ensure the public page has a clear H1 (usually the hero title).',
    });
  }

  // ── Social / Open Graph (≈18) ─────────────────────────────────────────────

  const effectiveOgTitle = ogTitle || title;
  if (effectiveOgTitle) {
    push({
      id: 'og-title',
      label: 'OpenGraph title',
      status: ogTitle ? 'pass' : 'warning',
      weight: 3,
      earned: ogTitle ? 3 : 2,
      message: ogTitle ? undefined : 'OG title falls back to SEO title — set a dedicated OG title for social shares.',
    });
  } else {
    push({
      id: 'og-title',
      label: 'OpenGraph title',
      status: 'fail',
      weight: 3,
      earned: 0,
      message: 'OpenGraph title is missing.',
    });
  }

  const effectiveOgDescription = ogDescription || description;
  if (effectiveOgDescription) {
    push({
      id: 'og-description',
      label: 'OpenGraph description',
      status: ogDescription ? 'pass' : 'warning',
      weight: 3,
      earned: ogDescription ? 3 : 2,
      message: ogDescription
        ? undefined
        : 'OG description falls back to meta description.',
    });
  } else {
    push({
      id: 'og-description',
      label: 'OpenGraph description',
      status: 'fail',
      weight: 3,
      earned: 0,
      message: 'OpenGraph description is missing.',
    });
  }

  if (ogImage) {
    push({
      id: 'og-image',
      label: 'OpenGraph image',
      status: 'pass',
      weight: 6,
      earned: 6,
    });
  } else {
    push({
      id: 'og-image',
      label: 'OpenGraph image',
      status: 'warning',
      weight: 6,
      earned: 2,
      message: 'OpenGraph image missing — social shares may look incomplete.',
    });
  }

  const effectiveTwitterTitle = twitterTitle || effectiveOgTitle;
  if (effectiveTwitterTitle) {
    push({
      id: 'twitter-title',
      label: 'Twitter title',
      status: twitterTitle ? 'pass' : 'warning',
      weight: 2,
      earned: twitterTitle ? 2 : 1,
      message: twitterTitle ? undefined : 'Twitter title falls back to OG/SEO title.',
    });
  } else {
    push({
      id: 'twitter-title',
      label: 'Twitter title',
      status: 'fail',
      weight: 2,
      earned: 0,
      message: 'Twitter title is missing.',
    });
  }

  const effectiveTwitterDescription = twitterDescription || effectiveOgDescription;
  if (effectiveTwitterDescription) {
    push({
      id: 'twitter-description',
      label: 'Twitter description',
      status: twitterDescription ? 'pass' : 'warning',
      weight: 2,
      earned: twitterDescription ? 2 : 1,
      message: twitterDescription ? undefined : 'Twitter description falls back to OG/meta description.',
    });
  } else {
    push({
      id: 'twitter-description',
      label: 'Twitter description',
      status: 'fail',
      weight: 2,
      earned: 0,
      message: 'Twitter description is missing.',
    });
  }

  const effectiveTwitterImage = twitterImage || ogImage;
  if (effectiveTwitterImage) {
    push({
      id: 'twitter-image',
      label: 'Twitter image',
      status: twitterImage || ogImage ? (twitterImage ? 'pass' : 'warning') : 'fail',
      weight: 2,
      earned: twitterImage ? 2 : ogImage ? 1 : 0,
      message: twitterImage ? undefined : ogImage ? 'Twitter image falls back to OG image.' : 'Twitter image is missing.',
    });
  } else {
    push({
      id: 'twitter-image',
      label: 'Twitter image',
      status: 'fail',
      weight: 2,
      earned: 0,
      message: 'Twitter image is missing.',
    });
  }

  const missingSocial =
    !ogTitle || !ogDescription || !ogImage || !twitterTitle || !twitterDescription || !twitterImage;
  if (missingSocial) {
    push({
      id: 'social-completeness',
      label: 'Social tags completeness',
      status: 'warning',
      weight: 2,
      earned: 1,
      message: 'Some dedicated social tags are empty and rely on fallbacks.',
    });
  } else {
    push({
      id: 'social-completeness',
      label: 'Social tags completeness',
      status: 'pass',
      weight: 2,
      earned: 2,
    });
  }

  // ── Technical hygiene (≈17) ───────────────────────────────────────────────

  if (requireSlug) {
    if (slugVal && isCleanSlug(slugVal)) {
      push({
        id: 'slug',
        label: 'Slug',
        status: 'pass',
        weight: 4,
        earned: 4,
      });
    } else if (slugVal) {
      push({
        id: 'slug',
        label: 'Slug',
        status: 'warning',
        weight: 4,
        earned: 2,
        message: 'Use a lowercase hyphenated slug (e.g. mobile-app-development).',
      });
    } else {
      push({
        id: 'slug',
        label: 'Slug',
        status: 'fail',
        weight: 4,
        earned: 0,
        message: 'Slug is required for this content type.',
      });
    }
  } else if (pagePath && isCleanPath(pagePath)) {
    push({
      id: 'url-cleanliness',
      label: 'URL cleanliness',
      status: 'pass',
      weight: 4,
      earned: 4,
    });
  } else if (pagePath) {
    push({
      id: 'url-cleanliness',
      label: 'URL cleanliness',
      status: 'warning',
      weight: 4,
      earned: 2,
      message: 'Page path should be lowercase and free of query/hash fragments.',
    });
  } else {
    push({
      id: 'url-cleanliness',
      label: 'URL cleanliness',
      status: 'pass',
      weight: 4,
      earned: 3,
    });
  }

  if (options.hasStructuredData) {
    push({
      id: 'structured-data',
      label: 'Structured Data presence',
      status: 'pass',
      weight: 4,
      earned: 4,
    });
  } else if (title && description && (canonical || pagePath)) {
    push({
      id: 'structured-data',
      label: 'Structured Data presence',
      status: 'warning',
      weight: 4,
      earned: 2,
      message: 'Core SEO fields exist, but JSON-LD structured data is not confirmed for this page.',
    });
  } else {
    push({
      id: 'structured-data',
      label: 'Structured Data presence',
      status: 'warning',
      weight: 4,
      earned: 1,
      message: 'Add WebPage/Organization JSON-LD for richer search understanding.',
    });
  }

  if (options.imageAltReady !== false) {
    push({
      id: 'image-alt',
      label: 'Image alt readiness',
      status: 'pass',
      weight: 2,
      earned: 2,
    });
  } else {
    push({
      id: 'image-alt',
      label: 'Image alt readiness',
      status: 'warning',
      weight: 2,
      earned: 1,
      message: 'Ensure key images expose descriptive alt text.',
    });
  }

  if (options.hasInternalLinks !== false) {
    push({
      id: 'internal-links',
      label: 'Internal linking readiness',
      status: 'pass',
      weight: 2,
      earned: 2,
    });
  } else {
    push({
      id: 'internal-links',
      label: 'Internal linking readiness',
      status: 'warning',
      weight: 2,
      earned: 1,
      message: 'Add crawlable internal CTAs or section links.',
    });
  }

  const titleDup =
    title &&
    (options.existingTitles || []).some(
      (t) => t.trim().toLowerCase() === title.toLowerCase()
    );
  if (titleDup) {
    push({
      id: 'duplicate-title',
      label: 'Duplicate title detection',
      status: 'warning',
      weight: 2,
      earned: 0,
      message: 'This SEO title matches another page — unique titles perform better.',
    });
  } else {
    push({
      id: 'duplicate-title',
      label: 'Duplicate title detection',
      status: 'pass',
      weight: 2,
      earned: 2,
    });
  }

  const descDup =
    description &&
    (options.existingDescriptions || []).some(
      (d) => d.trim().toLowerCase() === description.toLowerCase()
    );
  if (descDup) {
    push({
      id: 'duplicate-description',
      label: 'Duplicate description detection',
      status: 'warning',
      weight: 2,
      earned: 0,
      message: 'This meta description matches another page.',
    });
  } else {
    push({
      id: 'duplicate-description',
      label: 'Duplicate description detection',
      status: 'pass',
      weight: 2,
      earned: 2,
    });
  }

  if (robotsIndex && title && description) {
    push({
      id: 'indexability',
      label: 'Indexability',
      status: 'pass',
      weight: 3,
      earned: 3,
    });
  } else if (!robotsIndex) {
    push({
      id: 'indexability',
      label: 'Indexability',
      status: 'fail',
      weight: 3,
      earned: 0,
      message: 'Page is not indexable.',
    });
  } else {
    push({
      id: 'indexability',
      label: 'Indexability',
      status: 'fail',
      weight: 3,
      earned: 1,
      message: 'Missing title or description reduces indexability quality.',
    });
  }

  const maxWeight = checks.reduce((sum, c) => sum + c.weight, 0) || 100;
  const earned = checks.reduce((sum, c) => sum + c.earned, 0);
  const score = Math.min(100, Math.round((earned / maxWeight) * 100));

  const critical = checks.filter((c) => c.status === 'fail');
  const warnings = checks.filter((c) => c.status === 'warning');
  const passed = checks.filter((c) => c.status === 'pass');
  const recommendations = [...critical, ...warnings]
    .map((c) => c.message)
    .filter((m): m is string => Boolean(m));

  return {
    score,
    checks,
    critical,
    warnings,
    passed,
    recommendations,
    suggestions: recommendations,
  };
}
