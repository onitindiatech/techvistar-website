import { SeoMetadata } from '@/types/seo';
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

export interface SolutionsLandingCmsConfig extends SeoMetadata {
  hero: LandingHeroBlock;
  intro: { title: string; description: string };
  cta: CmsCtaBlock;
}

export interface IndustriesLandingCmsConfig extends SeoMetadata {
  hero: LandingHeroBlock;
  intro: { title: string; description: string };
  cta: CmsCtaBlock;
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
} from '@/types/websiteSettings';

export type {
  WebsiteSettingsConfig,
  WebsiteNavbarSettings,
  WebsiteFooterSettings,
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
  },
  intro: {
    title: 'Structured solution verticals',
    description: 'Business, AI, and digital infrastructure programs—each scoped with measurable outcomes.',
  },
  cta: {
    title: 'Ready to Deploy a Solution?',
    description: 'Discuss your requirements with our solutions architects.',
    buttonText: 'Contact us',
    buttonLink: '/contact',
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
  },
  intro: {
    title: 'Industries we serve',
    description:
      'Explore vertical-specific platforms and delivery patterns across healthcare, fintech, education, logistics, and more.',
  },
  cta: {
    title: 'Looking for a custom enterprise platform?',
    description:
      'We collaborate closely with technical and product stakeholders to scope, design, and deploy secure, high-performance systems tailored to your vertical\'s specific requirements.',
    buttonText: 'Get in Touch',
    buttonLink: '/contact',
  },
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
    websiteSettings: deepMergeSection(DEFAULT_WEBSITE_SETTINGS, api.websiteSettings),
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
