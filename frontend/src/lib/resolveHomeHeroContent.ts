import type { HomeHeroConfig, HomeMobileHeroConfig } from '@/types/homeCms';

export type HomeHeroAlignment = 'left' | 'center' | 'right';
export type HomeHeroCtaLayout = 'stack' | 'inline';

export interface ResolvedHomeHeroContent {
  source: 'desktop' | 'mobile';
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

/** Prefer mobile CMS copy; fall back to desktop hero only when mobile is blank. */
function pickMobileField(mobileValue: string | undefined, desktopValue: string): string {
  const mobile = (mobileValue ?? '').trim();
  return mobile.length > 0 ? mobile : desktopValue;
}

/**
 * Mobile headline blocks mirror desktop order:
 * line 1 → line 2 (white) → highlighted accent (green) → tagline (description).
 */
function resolveMobileHeadlines(
  mobile: HomeMobileHeroConfig,
  hero: HomeHeroConfig
): Pick<ResolvedHomeHeroContent, 'headlineLine1' | 'headlineLine2' | 'headlineAccent' | 'tagline'> {
  const headlineLine1 = pickMobileField(mobile.heading, hero.headlineLine1);
  const headingLine2Explicit = (mobile.headingLine2 ?? '').trim();
  const descriptionRaw = (mobile.description ?? '').trim();
  const accentRaw = (mobile.mobileHighlightedHeading ?? '').trim();

  // Legacy: before headingLine2 existed, line 2 was sometimes saved in description.
  const legacyLine2FromDescription =
    !headingLine2Explicit && !!descriptionRaw && !!accentRaw;

  const headlineLine2 = headingLine2Explicit
    || (legacyLine2FromDescription ? descriptionRaw : '')
    || pickMobileField('', hero.headlineLine2);

  const headlineAccent = pickMobileField(mobile.mobileHighlightedHeading, hero.headlineAccent);

  const tagline = legacyLine2FromDescription
    ? pickMobileField('', hero.tagline)
    : pickMobileField(mobile.description, hero.tagline);

  return { headlineLine1, headlineLine2, headlineAccent, tagline };
}

export function resolveHomeHeroContent(
  hero: HomeHeroConfig,
  mobileHero: HomeMobileHeroConfig | undefined,
  isMobileViewport: boolean
): ResolvedHomeHeroContent {
  const mobile = mobileHero ?? ({} as HomeMobileHeroConfig);
  const useMobile = isMobileViewport && mobile.enabled === true;

  if (useMobile) {
    const headlines = resolveMobileHeadlines(mobile, hero);

    return {
      source: 'mobile',
      badge: (mobile.badge ?? '').trim(),
      ...headlines,
      singleHeading: '',
      useSingleHeading: false,
      ctaPrimary: pickMobileField(mobile.ctaPrimary, hero.ctaPrimary),
      ctaSecondary: pickMobileField(mobile.ctaSecondary, hero.ctaSecondary),
      ctaPrimaryLink: pickMobileField(mobile.ctaPrimaryLink, hero.ctaPrimaryLink),
      ctaSecondaryLink: pickMobileField(mobile.ctaSecondaryLink, hero.ctaSecondaryLink),
      maxWidth: (mobile.maxWidth ?? '').trim(),
      alignment: mobile.alignment ?? 'left',
      ctaLayout: mobile.ctaLayout ?? 'stack',
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
