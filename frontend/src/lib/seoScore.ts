import { SeoMetadata } from '@/types/seo';

export interface SeoScoreResult {
  score: number;
  suggestions: string[];
}

export function calculateSeoScore(
  seo: SeoMetadata,
  slug?: string
): SeoScoreResult {
  const suggestions: string[] = [];
  let score = 0;
  const max = 100;

  const title = seo.seoTitle?.trim() || '';
  const description = seo.seoDescription?.trim() || '';
  const slugVal = slug?.trim() || '';
  const ogImage = seo.ogImage?.trim() || '';
  const canonical = seo.canonicalUrl?.trim() || '';

  // Title (25 pts)
  if (title.length >= 40 && title.length <= 60) {
    score += 25;
  } else if (title.length > 0) {
    score += 12;
    if (title.length > 60) suggestions.push('SEO title is too long (aim for 40–60 characters).');
    else if (title.length < 40) suggestions.push('SEO title is short (aim for 40–60 characters).');
  } else {
    suggestions.push('Add an SEO title.');
  }

  // Description (25 pts)
  if (description.length >= 120 && description.length <= 160) {
    score += 25;
  } else if (description.length > 0) {
    score += 12;
    if (description.length > 160) suggestions.push('Meta description is too long (aim for 120–160 characters).');
    else if (description.length < 120) suggestions.push('Meta description is too short (aim for 120–160 characters).');
  } else {
    suggestions.push('Add a meta description.');
  }

  // Slug (15 pts)
  if (slugVal && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slugVal)) {
    score += 15;
  } else if (slugVal) {
    score += 8;
    suggestions.push('Use a lowercase hyphenated slug (e.g. mobile-app-development).');
  } else {
    suggestions.push('Slug is required for clean URLs.');
  }

  // OG Image (15 pts)
  if (ogImage) {
    score += 15;
  } else {
    suggestions.push('OpenGraph image is missing — social shares may look incomplete.');
  }

  // Canonical (10 pts)
  if (canonical) {
    if (canonical.startsWith('http')) score += 10;
    else {
      score += 5;
      suggestions.push('Canonical URL should be a full absolute URL.');
    }
  } else {
    score += 5;
    suggestions.push('Canonical URL not set — a default will be generated from the page path.');
  }

  // Robots (10 pts)
  if (seo.robotsIndex !== false && seo.robotsFollow !== false) {
    score += 10;
  } else if (seo.robotsIndex === false) {
    score += 5;
    suggestions.push('Page is set to noindex — it will be hidden from search engines.');
  } else {
    score += 8;
  }

  return { score: Math.min(max, Math.round(score)), suggestions };
}
