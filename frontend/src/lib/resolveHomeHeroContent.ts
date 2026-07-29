import type { HomeHeroConfig, HomeResponsiveHeroCopyConfig } from '@/types/homeCms';

export type HomeHeroAlignment = 'left' | 'center' | 'right';
export type HomeHeroCtaLayout = 'stack' | 'inline';

export interface ResolvedHomeHeroContent {
  source: 'desktop' | 'responsive';
  badge: string;
  headlineLine1: string;
  headlineLine2: string;
  headlineAccent: string;
  singleHeading: string;
  useSingleHeading: boolean;
  tagline: string;
  ctaPrimary: string;
  ctaSecondary: string;
  ctaPrimaryLink: string;
  ctaSecondaryLink: string;
  maxWidth: string;
  alignment: HomeHeroAlignment;
  ctaLayout: HomeHeroCtaLayout;
}

/** Prefer responsive CMS copy; fall back to desktop hero only when responsive field is blank. */
function pickResponsiveField(responsiveValue: string | undefined, desktopValue: string): string {
  const responsive = (responsiveValue ?? '').trim();
  return responsive.length > 0 ? responsive : desktopValue;
}

/**
 * Responsive headline blocks mirror desktop order:
 * line 1 → line 2 (white) → highlighted accent (green) → tagline (description).
 */
function resolveResponsiveHeadlines(
  responsive: HomeResponsiveHeroCopyConfig,
  hero: HomeHeroConfig
): Pick<ResolvedHomeHeroContent, 'headlineLine1' | 'headlineLine2' | 'headlineAccent' | 'tagline'> {
  const headlineLine1 = pickResponsiveField(responsive.heading, hero.headlineLine1);
  const headingLine2Explicit = (responsive.headingLine2 ?? '').trim();
  const descriptionRaw = (responsive.description ?? '').trim();
  const accentRaw = (responsive.mobileHighlightedHeading ?? '').trim();

  // Legacy: before headingLine2 existed, line 2 was sometimes saved in description.
  const legacyLine2FromDescription =
    !headingLine2Explicit && !!descriptionRaw && !!accentRaw;

  const headlineLine2 = headingLine2Explicit
    || (legacyLine2FromDescription ? descriptionRaw : '')
    || pickResponsiveField('', hero.headlineLine2);

  const headlineAccent = pickResponsiveField(responsive.mobileHighlightedHeading, hero.headlineAccent);

  const tagline = legacyLine2FromDescription
    ? pickResponsiveField('', hero.tagline)
    : pickResponsiveField(responsive.description, hero.tagline);

  return { headlineLine1, headlineLine2, headlineAccent, tagline };
}

/**
 * Resolves hero copy for the current viewport.
 * Phones (and other compact breakpoints) use responsive copy when `mobileHero.enabled` is true.
 * API field `mobileHero` is preserved for backward compatibility.
 */
export function resolveHomeHeroContent(
  hero: HomeHeroConfig,
  responsiveHeroCopy: HomeResponsiveHeroCopyConfig | undefined,
  useResponsiveCopy: boolean
): ResolvedHomeHeroContent {
  const responsive = responsiveHeroCopy ?? ({} as HomeResponsiveHeroCopyConfig);
  const useResponsive = useResponsiveCopy && responsive.enabled === true;

  if (useResponsive) {
    const headlines = resolveResponsiveHeadlines(responsive, hero);

    return {
      source: 'responsive',
      badge: (responsive.badge ?? '').trim(),
      ...headlines,
      singleHeading: '',
      useSingleHeading: false,
      ctaPrimary: pickResponsiveField(responsive.ctaPrimary, hero.ctaPrimary),
      ctaSecondary: pickResponsiveField(responsive.ctaSecondary, hero.ctaSecondary),
      ctaPrimaryLink: pickResponsiveField(responsive.ctaPrimaryLink, hero.ctaPrimaryLink),
      ctaSecondaryLink: pickResponsiveField(responsive.ctaSecondaryLink, hero.ctaSecondaryLink),
      maxWidth: (responsive.maxWidth ?? '').trim(),
      alignment: responsive.alignment ?? 'left',
      ctaLayout: responsive.ctaLayout ?? 'stack',
    };
  }

  return {
    source: 'desktop',
    badge: hero.badge.trim(),
    headlineLine1: hero.headlineLine1.trim(),
    headlineLine2: hero.headlineLine2.trim(),
    headlineAccent: hero.headlineAccent.trim(),
    singleHeading: '',
    useSingleHeading: false,
    tagline: hero.tagline,
    ctaPrimary: hero.ctaPrimary,
    ctaSecondary: hero.ctaSecondary,
    ctaPrimaryLink: hero.ctaPrimaryLink,
    ctaSecondaryLink: hero.ctaSecondaryLink,
    maxWidth: '',
    alignment: 'left',
    ctaLayout: 'stack',
  };
}
