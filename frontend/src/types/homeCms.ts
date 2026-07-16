import { SeoMetadata } from '@/types/seo';
import { HERO_COPY } from '@/data/hero';
import { SECTION_BENEFITS, BENEFITS } from '@/data/benefits';
import { CONTACT_FORM } from '@/data/contact';
import { SITE } from '@/data/about';

export interface HomeCtaBlock {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

export type HomeHeroMediaType = 'image' | 'video';

export interface HomeTrustLogo {
  url: string;
  alt: string;
  sortOrder: number;
}

export interface HomeHeroConfig {
  badge: string;
  headlineLine1: string;
  headlineAccent: string;
  headlineLine2: string;
  tagline: string;
  ctaPrimary: string;
  ctaSecondary: string;
  ctaPrimaryLink: string;
  ctaSecondaryLink: string;
  locationLine: string;
  mediaType: HomeHeroMediaType;
  backgroundImage: string;
  backgroundImagePublicId?: string;
  backgroundVideoMp4: string;
  backgroundVideoWebm: string;
  backgroundVideoUrl: string;
  backgroundVideoPublicId?: string;
  /** Optional LCP poster shown instantly while hero video loads */
  heroPosterImage: string;
  heroPosterImagePublicId?: string;
  youtubeUrl: string;
  youtubeStartTime: number;
  overlayOpacity: number;
  backgroundBlur: boolean;
  animationEnabled: boolean;
  showScrollIndicator: boolean;
  trustLogos: HomeTrustLogo[];
}

export type HomeMobileHeroAlignment = 'left' | 'center' | 'right';
export type HomeMobileHeroCtaLayout = 'stack' | 'inline';
export type HomeResponsiveHeroAlignment = HomeMobileHeroAlignment;
export type HomeResponsiveHeroCtaLayout = HomeMobileHeroCtaLayout;

/** Copy overrides for compact responsive viewports (phones, foldables, small tablets). */
export interface HomeResponsiveHeroCopyConfig {
  enabled: boolean;
  badge: string;
  heading: string;
  headingLine2: string;
  mobileHighlightedHeading: string;
  description: string;
  ctaPrimary: string;
  ctaPrimaryLink: string;
  ctaSecondary: string;
  ctaSecondaryLink: string;
  maxWidth: string;
  alignment: HomeResponsiveHeroAlignment;
  ctaLayout: HomeResponsiveHeroCtaLayout;
}

/** @deprecated Stored as `mobileHero` in API — use HomeResponsiveHeroCopyConfig */
export type HomeMobileHeroConfig = HomeResponsiveHeroCopyConfig;

export interface HomeResponsiveHeroMetric {
  value: string;
  label: string;
  sortOrder: number;
}

/** @deprecated Use HomeResponsiveHeroMetric */
export type HomeIpadProMetric = HomeResponsiveHeroMetric;

export interface HomeResponsiveHeroFeatureCard {
  icon: string;
  label: string;
  description: string;
  sortOrder: number;
}

/** Layout enrichment for large responsive tablets (1024–1199px). Stored as `ipadProHero` in API. */
export interface HomeResponsiveHeroLayoutConfig {
  enabled: boolean;
  showFeatureCards: boolean;
  showMetrics: boolean;
  showHighlightPills: boolean;
  showClientStrip: boolean;
  metrics: HomeResponsiveHeroMetric[];
  highlights: string[];
  featureCards: HomeResponsiveHeroFeatureCard[];
}

/** @deprecated Stored as `ipadProHero` in API — use HomeResponsiveHeroLayoutConfig */
export type HomeIpadProHeroConfig = HomeResponsiveHeroLayoutConfig;

/**
 * Optional unified API payload. When present, maps into `mobileHero` + `ipadProHero`.
 * Legacy documents may only store the split fields.
 */
export interface HomeResponsiveHeroUnifiedPayload extends Partial<HomeResponsiveHeroCopyConfig> {
  tabletEnabled?: boolean;
  showFeatureCards?: boolean;
  showMetrics?: boolean;
  showHighlightPills?: boolean;
  showClientStrip?: boolean;
  metrics?: HomeResponsiveHeroMetric[];
  highlights?: string[];
  featureCards?: HomeResponsiveHeroFeatureCard[];
}

export interface HomeStatItem {
  icon: string;
  value: string;
  prefix: string;
  suffix: string;
  label: string;
  sortOrder: number;
}

export interface HomeBenefitCard {
  icon: string;
  image: string;
  imagePublicId?: string;
  title: string;
  description: string;
  accentColor: string;
  sortOrder: number;
}

export interface HomeBenefitsSection {
  badge: string;
  heading: string;
  highlight: string;
  subtitle: string;
  description: string;
  cards: HomeBenefitCard[];
  visible: boolean;
}

export type HomeFeaturedLayout = 'featured-grid' | 'compact-grid' | 'horizontal';

export interface HomeFeaturedBlock {
  heading: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  layout: HomeFeaturedLayout;
  featuredOnly: boolean;
  manualSelection: string[];
  limit: number;
  visible: boolean;
}

export interface HomePortfolioSection {
  badge: string;
  heading: string;
  highlight: string;
  description: string;
  features: string[];
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  globeEnabled: boolean;
  backgroundImage: string;
  backgroundImagePublicId?: string;
  animationSpeed: number;
  visible: boolean;
}

export interface HomeContactStep {
  title: string;
  description: string;
  sortOrder: number;
}

export interface HomeContactCategory {
  id: string;
  label: string;
  icon: string;
  sortOrder: number;
}

export interface HomeContactBudget {
  id: string;
  label: string;
  sortOrder: number;
}

export interface HomeContactCtaSection {
  badge: string;
  heading: string;
  highlight: string;
  description: string;
  steps: HomeContactStep[];
  categories: HomeContactCategory[];
  budgetOptions: HomeContactBudget[];
  ctaText: string;
  successMessage: string;
  backgroundImage: string;
  backgroundImagePublicId?: string;
  visible: boolean;
}

export interface HomeCmsConfig {
  hero: HomeHeroConfig;
  /** Responsive hero copy — API field `mobileHero` */
  mobileHero: HomeResponsiveHeroCopyConfig;
  /** Responsive hero layout enrichment — API field `ipadProHero` */
  ipadProHero: HomeResponsiveHeroLayoutConfig;
  stats: HomeStatItem[];
  benefits: HomeBenefitsSection;
  featuredServices: HomeFeaturedBlock;
  featuredIndustries: HomeFeaturedBlock;
  portfolio: HomePortfolioSection;
  contactCta: HomeContactCtaSection;
  cta: HomeCtaBlock;
  seo: SeoMetadata;
}

const BENEFIT_ICON_NAMES = ['Cpu', 'Shield', 'Users', 'ClipboardCheck', 'DollarSign', 'Layers'] as const;

const DEFAULT_CONTACT_CATEGORIES: HomeContactCategory[] = [
  { id: 'web', label: 'Web Dev', icon: 'Globe', sortOrder: 0 },
  { id: 'mobile', label: 'Mobile Apps', icon: 'Smartphone', sortOrder: 1 },
  { id: 'design', label: 'UI/UX Design', icon: 'Palette', sortOrder: 2 },
  { id: 'ai', label: 'AI Solutions', icon: 'Brain', sortOrder: 3 },
  { id: 'software', label: 'Software', icon: 'Laptop', sortOrder: 4 },
  { id: 'devops', label: 'Cloud/DevOps', icon: 'Cloud', sortOrder: 5 },
];

const DEFAULT_CONTACT_BUDGETS: HomeContactBudget[] = [
  { id: 'under_10k', label: '< $10k', sortOrder: 0 },
  { id: '10k_25k', label: '$10k - $25k', sortOrder: 1 },
  { id: '25k_50k', label: '$25k - $50k', sortOrder: 2 },
  { id: 'over_50k', label: '$50k+', sortOrder: 3 },
];

const BENEFIT_IMAGES = [
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=150&auto=format&fit=crop&q=80',
];

const DEFAULT_CONTACT_STEPS: HomeContactStep[] = [
  { title: 'Share Requirements', description: "Tell us your goals, timeline, and budget — we'll review everything.", sortOrder: 0 },
  { title: 'Expert Assessment', description: 'Our team will evaluate your project and identify the best approach.', sortOrder: 1 },
  { title: 'Get Your Solution', description: "We'll reach out with a tailored proposal and next steps.", sortOrder: 2 },
];

export const DEFAULT_HOME_CMS: HomeCmsConfig = {
  hero: {
    badge: '',
    headlineLine1: 'We Build Intelligent',
    headlineAccent: 'Real Impact',
    headlineLine2: 'Digital Solutions',
    tagline: 'AI-Powered. Future-Ready. Business-Focused.',
    ctaPrimary: 'Explore Services',
    ctaSecondary: 'Talk to an Expert',
    ctaPrimaryLink: '/#services',
    ctaSecondaryLink: '/#contact',
    locationLine: HERO_COPY.locationLine,
    mediaType: 'video',
    backgroundImage: '',
    backgroundImagePublicId: '',
    backgroundVideoMp4: '',
    backgroundVideoWebm: '',
    backgroundVideoUrl: '',
    backgroundVideoPublicId: '',
    heroPosterImage: '',
    heroPosterImagePublicId: '',
    youtubeUrl: '',
    youtubeStartTime: 3,
    overlayOpacity: 40,
    backgroundBlur: false,
    animationEnabled: true,
    showScrollIndicator: true,
    trustLogos: [],
  },
  mobileHero: {
    enabled: false,
    badge: '',
    heading: '',
    headingLine2: '',
    mobileHighlightedHeading: '',
    description: '',
    ctaPrimary: '',
    ctaPrimaryLink: '',
    ctaSecondary: '',
    ctaSecondaryLink: '',
    maxWidth: '',
    alignment: 'left',
    ctaLayout: 'stack',
  },
  ipadProHero: {
    enabled: false,
    showFeatureCards: true,
    showMetrics: true,
    showHighlightPills: true,
    showClientStrip: true,
    metrics: [
      { value: '50+', label: 'Projects', sortOrder: 0 },
      { value: '15+', label: 'Industries', sortOrder: 1 },
      { value: '24/7', label: 'Support', sortOrder: 2 },
      { value: '99%', label: 'Client Satisfaction', sortOrder: 3 },
    ],
    highlights: [
      'AI Automation',
      'Enterprise Security',
      'Cloud Native',
      '24×7 Support',
    ],
    featureCards: [
      {
        icon: 'Brain',
        label: 'AI Powered',
        description: 'Intelligent automation for modern businesses.',
        sortOrder: 0,
      },
      {
        icon: 'Shield',
        label: 'Enterprise Ready',
        description: 'Built for secure enterprise workloads.',
        sortOrder: 1,
      },
      {
        icon: 'Cloud',
        label: 'Cloud Native',
        description: 'Modern cloud-first architecture.',
        sortOrder: 2,
      },
      {
        icon: 'Layers',
        label: 'Secure & Scalable',
        description: 'Designed to scale without compromise.',
        sortOrder: 3,
      },
    ],
  },
  stats: [],
  benefits: {
    badge: SECTION_BENEFITS.tag,
    heading: SECTION_BENEFITS.title,
    highlight: SECTION_BENEFITS.highlight,
    subtitle: '',
    description: SECTION_BENEFITS.description,
    cards: BENEFITS.map((b, i) => ({
      icon: BENEFIT_ICON_NAMES[i] || 'Circle',
      image: BENEFIT_IMAGES[i] || '',
      title: b.title,
      description: b.description,
      accentColor: '#10b981',
      sortOrder: i,
    })),
    visible: true,
  },
  featuredServices: {
    heading: '',
    subtitle: '',
    ctaText: 'View All Services',
    ctaLink: '/services',
    layout: 'featured-grid',
    featuredOnly: true,
    manualSelection: [],
    limit: 8,
    visible: true,
  },
  featuredIndustries: {
    heading: 'Industries we serve',
    subtitle: 'Domain-aware engineering across regulated and high-growth sectors.',
    ctaText: 'Explore industries',
    ctaLink: '/industries',
    layout: 'compact-grid',
    featuredOnly: true,
    manualSelection: [],
    limit: 8,
    visible: false,
  },
  portfolio: {
    badge: 'Project Demo',
    heading: 'Explore Our Projects',
    highlight: 'In An Immersive 3D Experience',
    description:
      'Showcase our latest work through an interactive 3D project globe. Drag, rotate, and explore real projects with smooth animations.',
    features: [
      'Interactive 3D Experience',
      'Click Any Project',
      'Live Case Studies',
      'Real Business Solutions',
    ],
    primaryButtonText: 'Explore Portfolio',
    primaryButtonLink: '/work',
    secondaryButtonText: 'View Case Studies',
    secondaryButtonLink: '/work',
    globeEnabled: true,
    backgroundImage: '',
    backgroundImagePublicId: '',
    animationSpeed: 1,
    visible: true,
  },
  contactCta: {
    badge: 'START A PROJECT',
    heading: 'Tell Us About Your Project',
    highlight: '',
    description:
      'Share your idea and our team will get back to you with a tailored plan within 24 hours.',
    steps: DEFAULT_CONTACT_STEPS,
    categories: DEFAULT_CONTACT_CATEGORIES,
    budgetOptions: DEFAULT_CONTACT_BUDGETS,
    ctaText: 'Send Message',
    successMessage: CONTACT_FORM.toasts.success.description,
    backgroundImage: '',
    backgroundImagePublicId: '',
    visible: true,
  },
  cta: {
    title: 'Ready to build something measurable?',
    description: 'Tell us about your scope—we respond within one business day.',
    buttonText: 'Get in touch',
    buttonLink: '/contact',
  },
  seo: {
    seoTitle: 'TechVistar | Technology-first growth partner',
    seoDescription: SITE.description,
    canonicalUrl: 'https://techvistar.com/',
    robotsIndex: true,
    robotsFollow: true,
  },
};

function mergeResponsiveHeroCopyConfig(
  defaults: HomeResponsiveHeroCopyConfig,
  partial?: Partial<HomeResponsiveHeroCopyConfig> | null,
  hero?: HomeHeroConfig
): HomeResponsiveHeroCopyConfig {
  const merged: HomeResponsiveHeroCopyConfig = { ...defaults };

  if (partial) {
    const copyFields = ['badge', 'heading', 'headingLine2', 'mobileHighlightedHeading', 'description', 'maxWidth'] as const;
    for (const key of copyFields) {
      const val = partial[key];
      if (typeof val === 'string' && val.trim() !== '') {
        merged[key] = val.trim();
      }
    }

    const ctaFields = ['ctaPrimary', 'ctaSecondary', 'ctaPrimaryLink', 'ctaSecondaryLink'] as const;
    for (const key of ctaFields) {
      if (partial[key] !== undefined && partial[key] !== null) {
        merged[key] = String(partial[key]).trim();
      }
    }

    if (partial.enabled !== undefined && partial.enabled !== null) {
      merged.enabled = Boolean(partial.enabled);
    }
    if (partial.alignment) merged.alignment = partial.alignment;
    if (partial.ctaLayout) merged.ctaLayout = partial.ctaLayout;
  }

  if (hero) {
    if (!merged.ctaPrimaryLink?.trim()) merged.ctaPrimaryLink = hero.ctaPrimaryLink;
    if (!merged.ctaSecondaryLink?.trim()) merged.ctaSecondaryLink = hero.ctaSecondaryLink;
  }

  return merged;
}

/** @deprecated Use mergeResponsiveHeroCopyConfig */
const mergeMobileHeroConfig = mergeResponsiveHeroCopyConfig;

function splitResponsiveHeroUnifiedPayload(
  payload?: HomeResponsiveHeroUnifiedPayload | null
): {
  copy?: Partial<HomeResponsiveHeroCopyConfig>;
  layout?: Partial<HomeResponsiveHeroLayoutConfig>;
} {
  if (!payload) return {};

  const {
    tabletEnabled,
    showFeatureCards,
    showMetrics,
    showHighlightPills,
    showClientStrip,
    metrics,
    highlights,
    featureCards,
    ...copyFields
  } = payload;

  const layout: Partial<HomeResponsiveHeroLayoutConfig> = {};
  if (tabletEnabled !== undefined && tabletEnabled !== null) layout.enabled = Boolean(tabletEnabled);
  if (showFeatureCards !== undefined && showFeatureCards !== null) layout.showFeatureCards = Boolean(showFeatureCards);
  if (showMetrics !== undefined && showMetrics !== null) layout.showMetrics = Boolean(showMetrics);
  if (showHighlightPills !== undefined && showHighlightPills !== null) {
    layout.showHighlightPills = Boolean(showHighlightPills);
  }
  if (showClientStrip !== undefined && showClientStrip !== null) layout.showClientStrip = Boolean(showClientStrip);
  if (metrics?.length) layout.metrics = metrics;
  if (highlights?.length) layout.highlights = highlights;
  if (featureCards?.length) layout.featureCards = featureCards;

  return {
    copy: copyFields,
    layout: Object.keys(layout).length > 0 ? layout : undefined,
  };
}

function mergeResponsiveHeroLayoutConfig(
  defaults: HomeResponsiveHeroLayoutConfig,
  partial?: Partial<HomeResponsiveHeroLayoutConfig> | null
): HomeResponsiveHeroLayoutConfig {
  const merged: HomeResponsiveHeroLayoutConfig = {
    ...defaults,
    metrics: defaults.metrics.map((m) => ({ ...m })),
    highlights: [...defaults.highlights],
    featureCards: defaults.featureCards.map((c) => ({ ...c })),
  };

  if (!partial) return merged;

  if (partial.enabled !== undefined && partial.enabled !== null) {
    merged.enabled = Boolean(partial.enabled);
  }
  if (partial.showFeatureCards !== undefined && partial.showFeatureCards !== null) {
    merged.showFeatureCards = Boolean(partial.showFeatureCards);
  }
  if (partial.showMetrics !== undefined && partial.showMetrics !== null) {
    merged.showMetrics = Boolean(partial.showMetrics);
  }
  if (partial.showHighlightPills !== undefined && partial.showHighlightPills !== null) {
    merged.showHighlightPills = Boolean(partial.showHighlightPills);
  }
  if (partial.showClientStrip !== undefined && partial.showClientStrip !== null) {
    merged.showClientStrip = Boolean(partial.showClientStrip);
  }

  if (partial.metrics?.length) {
    merged.metrics = partial.metrics.map((m, i) => ({
      value: String(m.value ?? '').trim(),
      label: String(m.label ?? '').trim(),
      sortOrder: typeof m.sortOrder === 'number' ? m.sortOrder : i,
    }));
  }

  if (partial.highlights?.length) {
    merged.highlights = partial.highlights
      .map((h) => String(h).trim())
      .filter(Boolean);
  }

  if (partial.featureCards?.length) {
    merged.featureCards = partial.featureCards.map((card, i) => ({
      icon: String(card.icon ?? 'Circle').trim() || 'Circle',
      label: String(card.label ?? '').trim(),
      description: String(card.description ?? '').trim(),
      sortOrder: typeof card.sortOrder === 'number' ? card.sortOrder : i,
    }));
  }

  return merged;
}

/** @deprecated Use mergeResponsiveHeroLayoutConfig */
const mergeIpadProHeroConfig = mergeResponsiveHeroLayoutConfig;

/** Merge legacy partial home config from API with full defaults. */
export function mergeHomeCmsConfig(api?: Partial<HomeCmsConfig> | null): HomeCmsConfig {
  if (!api) return DEFAULT_HOME_CMS;

  const mergeBlock = <T extends Record<string, unknown>>(defaults: T, partial?: Partial<T>): T => {
    if (!partial) return defaults;
    const out = { ...defaults };
    for (const key of Object.keys(defaults) as Array<keyof T>) {
      const val = partial[key];
      if (val === undefined || val === null) continue;
      if (typeof val === 'string' && val.trim() === '') continue;
      if (Array.isArray(val)) {
        if (val.length === 0) continue;
        out[key] = val as T[keyof T];
      } else if (typeof val === 'object' && typeof defaults[key] === 'object' && !Array.isArray(defaults[key])) {
        out[key] = mergeBlock(
          defaults[key] as Record<string, unknown>,
          val as Record<string, unknown>
        ) as T[keyof T];
      } else {
        out[key] = val as T[keyof T];
      }
    }
    return out;
  };

  const legacyHero = api.hero as Partial<HomeHeroConfig> | undefined;
  const hero = mergeBlock(DEFAULT_HOME_CMS.hero, {
    ...legacyHero,
    mediaType: legacyHero?.mediaType ?? (legacyHero?.backgroundImage ? 'image' : DEFAULT_HOME_CMS.hero.mediaType),
    ctaPrimaryLink: legacyHero?.ctaPrimaryLink?.trim() || '/#services',
    ctaSecondaryLink: legacyHero?.ctaSecondaryLink?.trim() || '/#contact',
    youtubeUrl:
      legacyHero?.youtubeUrl != null
        ? String(legacyHero.youtubeUrl).trim()
        : DEFAULT_HOME_CMS.hero.youtubeUrl,
    youtubeStartTime: legacyHero?.youtubeStartTime ?? DEFAULT_HOME_CMS.hero.youtubeStartTime,
    overlayOpacity: legacyHero?.overlayOpacity ?? DEFAULT_HOME_CMS.hero.overlayOpacity,
    backgroundBlur: legacyHero?.backgroundBlur ?? DEFAULT_HOME_CMS.hero.backgroundBlur,
    animationEnabled: legacyHero?.animationEnabled ?? DEFAULT_HOME_CMS.hero.animationEnabled,
    showScrollIndicator: legacyHero?.showScrollIndicator ?? DEFAULT_HOME_CMS.hero.showScrollIndicator,
    trustLogos: legacyHero?.trustLogos?.length ? legacyHero.trustLogos : DEFAULT_HOME_CMS.hero.trustLogos,
  });

  const legacyStats = api.stats;
  const stats =
    legacyStats && legacyStats.length > 0
      ? legacyStats.map((s, i) => {
          const item = s as HomeStatItem & { value?: string; label?: string };
          if ('sortOrder' in item && item.icon) return item as HomeStatItem;
          return {
            icon: 'Circle',
            value: item.value || '',
            prefix: '',
            suffix: '',
            label: item.label || '',
            sortOrder: i,
          };
        })
      : DEFAULT_HOME_CMS.stats;

  const featuredServices = mergeBlock(DEFAULT_HOME_CMS.featuredServices, api.featuredServices);
  if (!featuredServices.ctaLink?.trim()) {
    featuredServices.ctaLink = '/services';
  }
  if (!featuredServices.ctaText?.trim()) {
    featuredServices.ctaText = 'View All Services';
  }

  const benefits = mergeBlock(DEFAULT_HOME_CMS.benefits, api.benefits);
  if (benefits.visible !== false && !benefits.cards?.length) {
    benefits.cards = DEFAULT_HOME_CMS.benefits.cards;
  }

  const contactCta = mergeBlock(DEFAULT_HOME_CMS.contactCta, api.contactCta);
  if (!contactCta.categories?.length) contactCta.categories = DEFAULT_HOME_CMS.contactCta.categories;
  if (!contactCta.budgetOptions?.length) contactCta.budgetOptions = DEFAULT_HOME_CMS.contactCta.budgetOptions;
  if (!contactCta.steps?.length) contactCta.steps = DEFAULT_HOME_CMS.contactCta.steps;

  const responsiveUnified = splitResponsiveHeroUnifiedPayload(
    (api as { responsiveHero?: HomeResponsiveHeroUnifiedPayload | null }).responsiveHero
  );

  const mobileHero = mergeResponsiveHeroCopyConfig(
    DEFAULT_HOME_CMS.mobileHero,
    { ...api.mobileHero, ...responsiveUnified.copy },
    hero
  );
  const ipadProHero = mergeResponsiveHeroLayoutConfig(DEFAULT_HOME_CMS.ipadProHero, {
    ...api.ipadProHero,
    ...responsiveUnified.layout,
  });

  return {
    hero,
    mobileHero,
    ipadProHero,
    stats,
    benefits,
    featuredServices,
    featuredIndustries: mergeBlock(DEFAULT_HOME_CMS.featuredIndustries, api.featuredIndustries),
    portfolio: mergeBlock(DEFAULT_HOME_CMS.portfolio, api.portfolio),
    contactCta,
    cta: mergeBlock(DEFAULT_HOME_CMS.cta, api.cta),
    seo: mergeBlock(DEFAULT_HOME_CMS.seo, api.seo),
  };
}
