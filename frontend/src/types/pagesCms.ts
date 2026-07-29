import { SeoMetadata } from '@/types/seo';
import {
  DEFAULT_INDUSTRY_CONSULTATION,
  DEFAULT_INDUSTRY_SIDEBAR,
} from '@/types/industriesCms';
import type { IndustryConsultationBlock, IndustrySidebarBlock } from '@/types/industriesCms';
import { ABOUT_COPY, ABOUT_PAGE, SITE } from '@/data/about';
import {
  DEFAULT_HOME_CMS,
  HomeCmsConfig,
  mergeHomeCmsConfig,
} from '@/types/homeCms';

export type { HomeCmsConfig } from '@/types/homeCms';

export interface CmsStatItem {
  value: string;
  label: string;
}

export interface CmsBenefitItem {
  title: string;
  description: string;
}

export interface CmsProcessStep {
  step: string;
  title: string;
  description: string;
}

export interface LandingHeroBlock {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  description: string;
  backgroundImage?: string;
  backgroundImagePublicId?: string;
}

export interface CmsCtaBlock {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

export interface AboutCmsConfig extends SeoMetadata {
  hero: LandingHeroBlock;
  story: { title: string; body: string };
  mission: { title: string; text: string };
  vision: { title: string; text: string };
  teamSection: { heading: string; description: string };
  cta: { text: string; buttonText: string; buttonLink: string };
}

export interface ContactCmsConfig extends SeoMetadata {
  hero: LandingHeroBlock;
  office: { heading: string; address: string; hours: string };
  contactInfo: { email: string; phone: string; supportText: string };
  cta: CmsCtaBlock;
}

export interface SolutionsLandingHeroBlock extends LandingHeroBlock {
  ctaText: string;
  ctaLink: string;
}

export interface SolutionsCategoryNavBlock {
  eyebrow: string;
}

export interface SolutionsFeaturedBlock {
  eyebrow: string;
  title: string;
  description: string;
  learnMoreLabel: string;
}

export interface SolutionsCatalogBlock {
  eyebrow: string;
  title: string;
  description: string;
  learnMoreLabel: string;
}

export interface SolutionsCapabilityItem {
  icon: string;
  title: string;
  description: string;
  color: string;
  image?: string;
  imagePublicId?: string;
}

export interface SolutionsCapabilitiesBlock {
  eyebrow: string;
  stats: CmsStatItem[];
  cards: SolutionsCapabilityItem[];
}

export interface SolutionsExtendedCtaBlock extends CmsCtaBlock {
  badge: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  backgroundImage?: string;
  backgroundImagePublicId?: string;
}

export interface SolutionsLandingCmsConfig extends SeoMetadata {
  hero: SolutionsLandingHeroBlock;
  categoryNav: SolutionsCategoryNavBlock;
  featured: SolutionsFeaturedBlock;
  catalog: SolutionsCatalogBlock;
  intro: { title: string; description: string };
  capabilities: SolutionsCapabilitiesBlock;
  cta: SolutionsExtendedCtaBlock;
}

export interface IndustriesLandingHeroBlock extends LandingHeroBlock {
  ctaText: string;
  ctaLink: string;
}

export interface IndustriesCatalogBlock {
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  learnMoreLabel: string;
}

export interface IndustriesCapabilityItem {
  icon: string;
  title: string;
  description: string;
  color: string;
  image?: string;
  imagePublicId?: string;
}

export interface IndustriesCapabilitiesBlock {
  eyebrow: string;
  stats: CmsStatItem[];
  cards: IndustriesCapabilityItem[];
}

export interface IndustriesExtendedCtaBlock extends CmsCtaBlock {
  badge: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  backgroundImage?: string;
  backgroundImagePublicId?: string;
}

export interface IndustriesLandingCmsConfig extends SeoMetadata {
  hero: IndustriesLandingHeroBlock;
  intro: { title: string; description: string; icon?: string; iconPublicId?: string };
  catalog: IndustriesCatalogBlock;
  capabilities: IndustriesCapabilitiesBlock;
  cta: IndustriesExtendedCtaBlock;
  sidebarDefaults: IndustrySidebarBlock;
  consultationDefaults: IndustryConsultationBlock;
}

export interface CareersLandingCmsConfig extends SeoMetadata {
  hero: LandingHeroBlock;
  culture: { title: string; description: string };
  benefits: CmsBenefitItem[];
  hiringProcess: CmsProcessStep[];
  cta: CmsCtaBlock;
}

import {
  DEFAULT_WEBSITE_SETTINGS,
  WebsiteSettingsConfig,
  mergeWebsiteSettingsConfig,
  type LegacyHomeFooterConfig,
} from '@/types/websiteSettings';

export type {
  WebsiteSettingsConfig,
  WebsiteNavbarSettings,
  WebsiteFooterSettings,
  WebsiteFooterLink,
  WebsiteSocialLinks,
  WebsiteSeoDefaults,
  WebsiteAnalyticsSettings,
  WebsiteMaintenanceSettings,
} from '@/types/websiteSettings';

export interface PagesCmsConfig {
  home: HomeCmsConfig;
  about: AboutCmsConfig;
  contact: ContactCmsConfig;
  solutionsLanding: SolutionsLandingCmsConfig;
  industriesLanding: IndustriesLandingCmsConfig;
  careers: CareersLandingCmsConfig;
  websiteSettings: WebsiteSettingsConfig;
}

export { DEFAULT_HOME_CMS };

export const DEFAULT_ABOUT_CMS: AboutCmsConfig = {
  hero: {
    eyebrow: ABOUT_PAGE.hero.eyebrow,
    title: ABOUT_PAGE.hero.title,
    description: ABOUT_PAGE.hero.lead,
    backgroundImage: '',
  },
  story: {
    title: ABOUT_PAGE.overview.title,
    body: ABOUT_PAGE.overview.paragraphs.join('\n\n'),
  },
  mission: { title: ABOUT_COPY.mission.title, text: ABOUT_COPY.mission.text },
  vision: { title: ABOUT_COPY.vision.title, text: ABOUT_COPY.vision.text },
  teamSection: {
    heading: 'Our team',
    description: ABOUT_COPY.closing,
  },
  cta: {
    text: ABOUT_PAGE.ctaText,
    buttonText: ABOUT_PAGE.ctaButtonText,
    buttonLink: '/#contact',
  },
  seoTitle: 'About TechVistar | Technology-first growth partner',
  seoDescription:
    'Learn about TechVistar — a Hyderabad-based technology-first growth partner delivering web systems, automation, applied AI, and accountable digital delivery.',
  canonicalUrl: 'https://techvistar.com/about',
  robotsIndex: true,
  robotsFollow: true,
};

export const DEFAULT_CONTACT_CMS: ContactCmsConfig = {
  hero: {
    eyebrow: "Let's Connect",
    title: "Let's Build Something Great Together",
    description:
      'Have a project in mind or want to explore how we can help your business grow? We\'d love to hear from you.',
    backgroundImage: '',
  },
  office: {
    heading: 'Visit Us',
    address: 'TechVistar HQ, Noida, Uttar Pradesh, India',
    hours: 'Monday - Saturday, 09:00 AM - 07:00 PM IST',
  },
  contactInfo: {
    email: 'hello@techvistar.com',
    phone: '+91 9573157982',
    supportText: 'We reply within 24 hours',
  },
  cta: {
    title: 'Send us a message',
    description: 'Fill out the form and our team will get back to you shortly.',
    buttonText: 'Send Message',
    buttonLink: '#contact-form-section',
  },
  seoTitle: 'Contact TechVistar | Start your project',
  seoDescription: 'Contact TechVistar for web development, AI, automation, and digital growth engagements.',
  canonicalUrl: 'https://techvistar.com/contact',
  robotsIndex: true,
  robotsFollow: true,
};

export const DEFAULT_SOLUTIONS_LANDING_CMS: SolutionsLandingCmsConfig = {
  hero: {
    eyebrow: 'Our Capabilities',
    title: 'Enterprise Solutions',
    description:
      'Deploying robust business automation, production-grade intelligence models, and highly secure cloud environments built to scale operations.',
    backgroundImage: '',
    ctaText: 'Explore Solutions',
    ctaLink: '#all-solutions',
  },
  categoryNav: {
    eyebrow: 'Browse by category',
  },
  featured: {
    eyebrow: 'Top Picks',
    title: 'Featured Solutions',
    description: 'Our most recommended enterprise solution programs.',
    learnMoreLabel: 'Learn more',
  },
  catalog: {
    eyebrow: 'Full catalog',
    title: 'All Solutions',
    description: 'Explore every solution vertical we deliver with enterprise-grade outcomes.',
    learnMoreLabel: 'Learn more',
  },
  intro: {
    title: 'Solution capabilities',
    description:
      'Enterprise-grade programs across business automation, applied AI, and digital infrastructure.',
  },
  capabilities: {
    eyebrow: 'Feature highlights',
    stats: [
      { value: '50+', label: 'Solutions deployed' },
      { value: '99.9%', label: 'SLA uptime' },
      { value: '24/7', label: 'Enterprise support' },
      { value: '4', label: 'Core verticals' },
    ],
    cards: [
      {
        icon: 'Brain',
        title: 'AI Powered',
        description:
          'Autonomous agents, document intelligence, and predictive models integrated into your stack.',
        color: 'from-emerald-500 to-teal-600',
      },
      {
        icon: 'ShieldCheck',
        title: 'Enterprise Ready',
        description:
          'Compliance-first architecture with governance, audit trails, and role-based controls.',
        color: 'from-blue-500 to-indigo-600',
      },
      {
        icon: 'Cloud',
        title: 'Cloud Native',
        description:
          'Containerized deployments, resilient APIs, and infrastructure built to scale globally.',
        color: 'from-violet-500 to-purple-600',
      },
      {
        icon: 'Layers',
        title: 'Secure & Scalable',
        description:
          'Encryption, redundancy, and performance patterns engineered for mission-critical workloads.',
        color: 'from-orange-500 to-amber-600',
      },
    ],
  },
  cta: {
    badge: "Let's collaborate",
    title: 'Ready to Deploy a Solution?',
    description: 'Discuss your requirements with our solutions architects.',
    buttonText: 'Contact us',
    buttonLink: '/contact',
    secondaryButtonText: 'Contact Us',
    secondaryButtonLink: '/contact',
    backgroundImage: '',
  },
  seoTitle: 'Solutions | TechVistar',
  seoDescription: 'Explore TechVistar business, AI, and digital solutions engineered for measurable outcomes.',
  canonicalUrl: 'https://techvistar.com/solutions',
  robotsIndex: true,
  robotsFollow: true,
};

export const DEFAULT_INDUSTRIES_LANDING_CMS: IndustriesLandingCmsConfig = {
  hero: {
    eyebrow: 'INDUSTRIES WE SERVE',
    title: 'Redefining Digitization',
    subtitle: 'In Global Industries',
    description:
      'We combine industry-specific domain expertise with scalable software engineering to deliver secure, regulatory-compliant, and high-performance digital ecosystems.',
    backgroundImage: '',
    ctaText: 'Explore Industries',
    ctaLink: '#all-industries',
  },
  intro: {
    title: 'Industries we serve',
    description:
      'Explore vertical-specific platforms and delivery patterns across healthcare, fintech, education, logistics, and more.',
    icon: '',
  },
  catalog: {
    eyebrow: 'Full catalog',
    title: 'All Industries',
    subtitle: '',
    description:
      'Browse every industry vertical we support with equal priority and enterprise-grade delivery.',
    learnMoreLabel: 'Explore industry',
  },
  capabilities: {
    eyebrow: 'Industry expertise',
    stats: [
      { value: '10+', label: 'Active verticals' },
      { value: '99.9%', label: 'Uptime targets' },
      { value: '24/7', label: 'Enterprise support' },
      { value: 'SOC 2', label: 'Security posture' },
    ],
    cards: [
      {
        icon: 'ShieldCheck',
        title: 'Compliance & Governance',
        description:
          'HIPAA, SOC 2, and sector-specific controls embedded across architecture and delivery.',
        color: 'from-emerald-500 to-teal-600',
      },
      {
        icon: 'Layers',
        title: 'Enterprise Delivery',
        description:
          'Structured discovery, phased rollouts, and cross-functional squads for complex verticals.',
        color: 'from-blue-500 to-indigo-600',
      },
      {
        icon: 'Headphones',
        title: 'Dedicated Support',
        description:
          'Vertical specialists guide implementation, integrations, and long-term platform evolution.',
        color: 'from-violet-500 to-purple-600',
      },
      {
        icon: 'Rocket',
        title: 'Deployment Assistance',
        description:
          'Cloud-native infrastructure, observability, and production readiness from day one.',
        color: 'from-orange-500 to-amber-600',
      },
    ],
  },
  cta: {
    badge: 'Industry Solutions',
    title: 'Looking for a custom enterprise platform?',
    description:
      'We collaborate closely with technical and product stakeholders to scope, design, and deploy secure, high-performance systems tailored to your vertical\'s specific requirements.',
    buttonText: 'Get Started',
    buttonLink: '/contact',
    secondaryButtonText: 'Contact Us',
    secondaryButtonLink: '/contact',
    backgroundImage: '',
  },
  sidebarDefaults: DEFAULT_INDUSTRY_SIDEBAR,
  consultationDefaults: DEFAULT_INDUSTRY_CONSULTATION,
  seoTitle: 'Industries | TechVistar',
  seoDescription: 'Explore TechVistar industry solutions across healthcare, fintech, education, and enterprise sectors.',
  canonicalUrl: 'https://techvistar.com/industries',
  robotsIndex: true,
  robotsFollow: true,
};

export const DEFAULT_CAREERS_LANDING_CMS: CareersLandingCmsConfig = {
  hero: {
    eyebrow: 'Careers at TechVistar',
    title: 'Build technology that',
    subtitle: 'solves real business problems',
    description:
      'Join our premium global squad of systems architects, designer engineers, and full stack builders to construct state-of-the-art enterprise digital hubs.',
    backgroundImage: '',
  },
  culture: {
    title: 'Life at TechVistar',
    description:
      'Real photography of workspaces, collaboration synch, and cultural events.',
  },
  benefits: [
    { title: 'Great Team', description: 'Work with talented and supportive people who care.' },
    { title: 'Learning & Growth', description: 'Continuous learning with courses, mentorship and more.' },
    { title: 'Flexible Work', description: 'Hybrid work environment and flexible hours.' },
    { title: 'Health Benefits', description: 'Comprehensive health insurance for you and your family.' },
    { title: 'Career Growth', description: 'Clear career paths and internal our culture opportunities.' },
    { title: 'Recognition', description: 'Celebrate wins and get recognized for your impact.' },
  ],
  hiringProcess: [
    { step: '1', title: 'Application', description: 'Submit your application online.' },
    { step: '2', title: 'Resume Review', description: 'Our team reviews your application carefully.' },
    { step: '3', title: 'Technical Round', description: 'Online assessment or technical interview.' },
    { step: '4', title: 'Interview Round', description: 'Meet the team and discuss your experience.' },
    { step: '5', title: 'HR Discussion', description: 'A conversation about you, our culture and role.' },
    { step: '6', title: 'Offer', description: "Welcome to the team! Let's build the future." },
  ],
  cta: {
    title: "Didn't find the right opening?",
    description:
      'We are constantly seeking outstanding designers, systems developers, and backend builders. Submit your portfolio details for general open considerations.',
    buttonText: 'Submit Open Application',
    buttonLink: '/contact',
  },
  seoTitle: 'Careers at TechVistar | Join our engineering team',
  seoDescription:
    'Explore open roles at TechVistar. Join a collaborative team building web, AI, and automation products.',
  canonicalUrl: 'https://techvistar.com/careers',
  robotsIndex: true,
  robotsFollow: true,
};

export { DEFAULT_WEBSITE_SETTINGS };

export const DEFAULT_PAGES_CMS_CONFIG: PagesCmsConfig = {
  home: DEFAULT_HOME_CMS,
  about: DEFAULT_ABOUT_CMS,
  contact: DEFAULT_CONTACT_CMS,
  solutionsLanding: DEFAULT_SOLUTIONS_LANDING_CMS,
  industriesLanding: DEFAULT_INDUSTRIES_LANDING_CMS,
  careers: DEFAULT_CAREERS_LANDING_CMS,
  websiteSettings: DEFAULT_WEBSITE_SETTINGS,
};

function deepMergeSection<T extends Record<string, unknown>>(defaults: T, api?: Partial<T> | null): T {
  const mergeBlock = <U extends Record<string, unknown>>(def: U, partial?: Partial<U>): U => {
    if (!partial) return def;
    const out = { ...def };
    for (const key of Object.keys(def) as Array<keyof U>) {
      const val = partial[key];
      if (val === undefined || val === null) continue;
      if (typeof val === 'string' && val.trim() === '') continue;
      if (Array.isArray(val)) {
        if (val.length === 0) continue;
        out[key] = val as U[keyof U];
      } else if (typeof val === 'object' && typeof def[key] === 'object' && !Array.isArray(def[key])) {
        out[key] = mergeBlock(
          def[key] as Record<string, unknown>,
          val as Record<string, unknown>,
        ) as U[keyof U];
      } else {
        out[key] = val as U[keyof U];
      }
    }
    return out;
  };
  return mergeBlock(defaults, api ?? undefined);
}

export function mergePagesCmsConfig(api?: Partial<PagesCmsConfig> | null): PagesCmsConfig {
  if (!api) return DEFAULT_PAGES_CMS_CONFIG;
  return {
    home: mergeHomeCmsConfig(api.home as Partial<HomeCmsConfig>),
    about: deepMergeSection(DEFAULT_ABOUT_CMS, api.about as Partial<AboutCmsConfig>),
    contact: deepMergeSection(DEFAULT_CONTACT_CMS, api.contact),
    solutionsLanding: deepMergeSection(DEFAULT_SOLUTIONS_LANDING_CMS, api.solutionsLanding),
    industriesLanding: deepMergeSection(DEFAULT_INDUSTRIES_LANDING_CMS, api.industriesLanding),
    careers: deepMergeSection(DEFAULT_CAREERS_LANDING_CMS, api.careers as Partial<CareersLandingCmsConfig>),
    websiteSettings: mergeWebsiteSettingsConfig(
      api.websiteSettings,
      (api.home as { footer?: LegacyHomeFooterConfig } | undefined)?.footer,
    ),
  };
}

/** @deprecated Use AboutCmsConfig seo fields — kept for PageSeoSettings backward compat */
export type PageSeoBlock = Pick<
  AboutCmsConfig,
  | 'seoTitle'
  | 'seoDescription'
  | 'canonicalUrl'
  | 'ogTitle'
  | 'ogDescription'
  | 'ogImage'
  | 'twitterTitle'
  | 'twitterDescription'
  | 'twitterImage'
  | 'robotsIndex'
  | 'robotsFollow'
>;
