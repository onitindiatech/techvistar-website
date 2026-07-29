/**
 * @file src/models/PagesCmsConfig.ts
 * @description Singleton CMS config for static pages, landing pages, and website settings.
 */

import mongoose, { Schema } from 'mongoose';
import { BaseDocument } from '@/types/common';
import { ISeoFields, seoMongooseFields } from '@/utils/seoFields';

const statItemSchema = {
  icon: { type: String, trim: true, default: 'Circle' },
  value: { type: String, trim: true, default: '' },
  prefix: { type: String, trim: true, default: '' },
  suffix: { type: String, trim: true, default: '' },
  label: { type: String, trim: true, default: '' },
  sortOrder: { type: Number, default: 0 },
};

const footerLinkSchema = {
  label: { type: String, trim: true, default: '' },
  href: { type: String, trim: true, default: '' },
  sortOrder: { type: Number, default: 0 },
};

const socialLinkSchema = {
  platform: { type: String, trim: true, default: '' },
  url: { type: String, trim: true, default: '' },
  sortOrder: { type: Number, default: 0 },
};

const homeBenefitCardSchema = {
  icon: { type: String, trim: true, default: 'Circle' },
  image: { type: String, trim: true, default: '' },
  imagePublicId: { type: String, trim: true, default: '' },
  title: { type: String, trim: true, default: '' },
  description: { type: String, trim: true, default: '' },
  accentColor: { type: String, trim: true, default: '#10b981' },
  sortOrder: { type: Number, default: 0 },
};

const homeFeaturedBlockSchema = {
  heading: { type: String, trim: true, default: '' },
  subtitle: { type: String, trim: true, default: '' },
  ctaText: { type: String, trim: true, default: '' },
  ctaLink: { type: String, trim: true, default: '' },
  layout: { type: String, trim: true, default: 'featured-grid' },
  featuredOnly: { type: Boolean, default: true },
  manualSelection: { type: [String], default: [] },
  limit: { type: Number, default: 6 },
  visible: { type: Boolean, default: true },
};

const benefitItemSchema = {
  title: { type: String, trim: true, default: '' },
  description: { type: String, trim: true, default: '' },
};

const processStepSchema = {
  step: { type: String, trim: true, default: '' },
  title: { type: String, trim: true, default: '' },
  description: { type: String, trim: true, default: '' },
};

const industryCapabilityCardSchema = {
  icon: { type: String, trim: true, default: 'ShieldCheck' },
  title: { type: String, trim: true, default: '' },
  description: { type: String, trim: true, default: '' },
  color: { type: String, trim: true, default: 'from-emerald-500 to-teal-600' },
  image: { type: String, trim: true, default: '' },
  imagePublicId: { type: String, trim: true, default: '' },
};

const sidebarDefaultsSchema = {
  summaryTitle: { type: String, trim: true, default: '' },
  responseTimeTitle: { type: String, trim: true, default: '' },
  responseTime: { type: String, trim: true, default: '' },
  businessHoursTitle: { type: String, trim: true, default: '' },
  businessHours: { type: String, trim: true, default: '' },
  secureTitle: { type: String, trim: true, default: '' },
  secureDescription: { type: String, trim: true, default: '' },
  buttonLabel: { type: String, trim: true, default: '' },
  directInquiriesTitle: { type: String, trim: true, default: '' },
  directInquiriesBody: { type: String, trim: true, default: '' },
  contactEmail: { type: String, trim: true, default: '' },
};

const consultationDefaultsSchema = {
  title: { type: String, trim: true, default: '' },
  description: { type: String, trim: true, default: '' },
  submitLabel: { type: String, trim: true, default: '' },
  privacyText: { type: String, trim: true, default: '' },
  successTitle: { type: String, trim: true, default: '' },
  successMessage: { type: String, trim: true, default: '' },
};

const extendedCtaBlockSchema = {
  title: { type: String, trim: true, default: '' },
  description: { type: String, trim: true, default: '' },
  buttonText: { type: String, trim: true, default: '' },
  buttonLink: { type: String, trim: true, default: '' },
  badge: { type: String, trim: true, default: '' },
  secondaryButtonText: { type: String, trim: true, default: '' },
  secondaryButtonLink: { type: String, trim: true, default: '' },
  backgroundImage: { type: String, trim: true, default: '' },
  backgroundImagePublicId: { type: String, trim: true, default: '' },
};

const ctaBlockSchema = {
  title: { type: String, trim: true, default: '' },
  description: { type: String, trim: true, default: '' },
  buttonText: { type: String, trim: true, default: '' },
  buttonLink: { type: String, trim: true, default: '' },
};

const landingHeroSchema = {
  eyebrow: { type: String, trim: true, default: '' },
  title: { type: String, trim: true, default: '' },
  subtitle: { type: String, trim: true, default: '' },
  description: { type: String, trim: true, default: '' },
  backgroundImage: { type: String, trim: true, default: '' },
  backgroundImagePublicId: { type: String, trim: true, default: '' },
  ctaText: { type: String, trim: true, default: '' },
  ctaLink: { type: String, trim: true, default: '' },
};

export interface IPagesCmsConfig extends BaseDocument {
  configKey: string;
  home: Record<string, unknown>;
  about: ISeoFields & Record<string, unknown>;
  contact: ISeoFields & Record<string, unknown>;
  solutionsLanding: ISeoFields & Record<string, unknown>;
  industriesLanding: ISeoFields & Record<string, unknown>;
  careers: ISeoFields & Record<string, unknown>;
  websiteSettings: Record<string, unknown>;
  updatedBy?: string;
}

const pagesCmsConfigSchema = new Schema<IPagesCmsConfig>(
  {
    configKey: { type: String, required: true, unique: true, default: 'global', trim: true },
    home: {
      hero: {
        badge: { type: String, trim: true, default: '' },
        headlineLine1: { type: String, trim: true, default: 'Technology-first' },
        headlineAccent: { type: String, trim: true, default: 'Growth' },
        headlineLine2: { type: String, trim: true, default: 'Without the chaos' },
        tagline: { type: String, trim: true, default: '' },
        ctaPrimary: { type: String, trim: true, default: 'Get in touch' },
        ctaSecondary: { type: String, trim: true, default: 'View services' },
        ctaPrimaryLink: { type: String, trim: true, default: '/#services' },
        ctaSecondaryLink: { type: String, trim: true, default: '/#contact' },
        locationLine: { type: String, trim: true, default: 'Hyderabad · Remote worldwide' },
        mediaType: { type: String, trim: true, default: 'video' },
        backgroundImage: { type: String, trim: true, default: '' },
        backgroundImagePublicId: { type: String, trim: true, default: '' },
        backgroundVideoMp4: { type: String, trim: true, default: '' },
        backgroundVideoWebm: { type: String, trim: true, default: '' },
        backgroundVideoUrl: { type: String, trim: true, default: '' },
        backgroundVideoPublicId: { type: String, trim: true, default: '' },
        heroPosterImage: { type: String, trim: true, default: '' },
        heroPosterImagePublicId: { type: String, trim: true, default: '' },
        youtubeUrl: { type: String, trim: true, default: '' },
        youtubeStartTime: { type: Number, default: 3, min: 0 },
        overlayOpacity: { type: Number, default: 40 },
        backgroundBlur: { type: Boolean, default: true },
        animationEnabled: { type: Boolean, default: true },
        showScrollIndicator: { type: Boolean, default: true },
        trustLogos: {
          type: [{ url: String, alt: String, sortOrder: Number }],
          default: [],
        },
      },
      mobileHero: {
        enabled: { type: Boolean, default: false },
        badge: { type: String, trim: true, default: '' },
        heading: { type: String, trim: true, default: '' },
        headingLine2: { type: String, trim: true, default: '' },
        mobileHighlightedHeading: { type: String, trim: true, default: '' },
        description: { type: String, trim: true, default: '' },
        ctaPrimary: { type: String, trim: true, default: '' },
        ctaPrimaryLink: { type: String, trim: true, default: '' },
        ctaSecondary: { type: String, trim: true, default: '' },
        ctaSecondaryLink: { type: String, trim: true, default: '' },
        maxWidth: { type: String, trim: true, default: '' },
        alignment: { type: String, trim: true, default: 'left', enum: ['left', 'center', 'right'] },
        ctaLayout: { type: String, trim: true, default: 'stack', enum: ['stack', 'inline'] },
      },
      ipadProHero: {
        enabled: { type: Boolean, default: false },
        showFeatureCards: { type: Boolean, default: true },
        showMetrics: { type: Boolean, default: true },
        showHighlightPills: { type: Boolean, default: true },
        showClientStrip: { type: Boolean, default: true },
        metrics: {
          type: [{ value: String, label: String, sortOrder: Number }],
          default: [],
        },
        highlights: { type: [String], default: [] },
        featureCards: {
          type: [{ icon: String, label: String, description: String, sortOrder: Number }],
          default: [],
        },
      },
      /** Optional unified responsive hero payload (falls back to mobileHero + ipadProHero). */
      responsiveHero: { type: Schema.Types.Mixed, default: null },
      stats: { type: [statItemSchema], default: [] },
      benefits: {
        badge: { type: String, trim: true, default: '' },
        heading: { type: String, trim: true, default: '' },
        highlight: { type: String, trim: true, default: '' },
        subtitle: { type: String, trim: true, default: '' },
        description: { type: String, trim: true, default: '' },
        cards: { type: [homeBenefitCardSchema], default: [] },
        visible: { type: Boolean, default: true },
      },
      featuredServices: homeFeaturedBlockSchema,
      featuredIndustries: homeFeaturedBlockSchema,
      portfolio: {
        badge: { type: String, trim: true, default: '' },
        heading: { type: String, trim: true, default: '' },
        highlight: { type: String, trim: true, default: '' },
        description: { type: String, trim: true, default: '' },
        features: { type: [String], default: [] },
        primaryButtonText: { type: String, trim: true, default: '' },
        primaryButtonLink: { type: String, trim: true, default: '/work' },
        secondaryButtonText: { type: String, trim: true, default: '' },
        secondaryButtonLink: { type: String, trim: true, default: '/work' },
        globeEnabled: { type: Boolean, default: true },
        backgroundImage: { type: String, trim: true, default: '' },
        backgroundImagePublicId: { type: String, trim: true, default: '' },
        animationSpeed: { type: Number, default: 1 },
        visible: { type: Boolean, default: true },
      },
      contactCta: {
        badge: { type: String, trim: true, default: '' },
        heading: { type: String, trim: true, default: '' },
        highlight: { type: String, trim: true, default: '' },
        description: { type: String, trim: true, default: '' },
        steps: {
          type: [{ title: String, description: String, sortOrder: Number }],
          default: [],
        },
        categories: {
          type: [{ id: String, label: String, icon: String, sortOrder: Number }],
          default: [],
        },
        budgetOptions: {
          type: [{ id: String, label: String, sortOrder: Number }],
          default: [],
        },
        ctaText: { type: String, trim: true, default: '' },
        successMessage: { type: String, trim: true, default: '' },
        backgroundImage: { type: String, trim: true, default: '' },
        backgroundImagePublicId: { type: String, trim: true, default: '' },
        visible: { type: Boolean, default: true },
      },
      footer: {
        logo: { type: String, trim: true, default: '' },
        logoPublicId: { type: String, trim: true, default: '' },
        companyDescription: { type: String, trim: true, default: '' },
        phone: { type: String, trim: true, default: '' },
        email: { type: String, trim: true, default: '' },
        address: { type: String, trim: true, default: '' },
        workingHours: { type: String, trim: true, default: '' },
        newsletterHeading: { type: String, trim: true, default: '' },
        newsletterDescription: { type: String, trim: true, default: '' },
        socialLinks: { type: [socialLinkSchema], default: [] },
        quickLinks: { type: [footerLinkSchema], default: [] },
        servicesLinks: { type: [footerLinkSchema], default: [] },
        industryLinks: { type: [footerLinkSchema], default: [] },
        companyLinks: { type: [footerLinkSchema], default: [] },
        legalLinks: { type: [footerLinkSchema], default: [] },
        copyright: { type: String, trim: true, default: '' },
        bottomText: { type: String, trim: true, default: '' },
      },
      cta: ctaBlockSchema,
      seo: {
        ...seoMongooseFields,
        seoTitle: { type: String, trim: true, default: 'TechVistar | Technology-first growth partner' },
        canonicalUrl: { type: String, trim: true, default: 'https://techvistar.com/' },
      },
    },
    about: {
      hero: landingHeroSchema,
      story: {
        title: { type: String, trim: true, default: 'Who we are' },
        body: { type: String, trim: true, default: '' },
      },
      mission: {
        title: { type: String, trim: true, default: 'Mission' },
        text: { type: String, trim: true, default: '' },
      },
      vision: {
        title: { type: String, trim: true, default: 'Vision' },
        text: { type: String, trim: true, default: '' },
      },
      teamSection: {
        heading: { type: String, trim: true, default: 'Our team' },
        description: { type: String, trim: true, default: '' },
      },
      cta: {
        text: { type: String, trim: true, default: '' },
        buttonText: { type: String, trim: true, default: 'Contact us' },
        buttonLink: { type: String, trim: true, default: '/contact' },
      },
      ...seoMongooseFields,
      seoTitle: { type: String, trim: true, default: 'About TechVistar | Technology-first growth partner' },
      seoDescription: {
        type: String,
        trim: true,
        default:
          'Learn about TechVistar — a Hyderabad-based technology-first growth partner delivering web systems, automation, applied AI, and accountable digital delivery.',
      },
      canonicalUrl: { type: String, trim: true, default: 'https://techvistar.com/about' },
    },
    contact: {
      hero: landingHeroSchema,
      office: {
        heading: { type: String, trim: true, default: 'Office' },
        address: { type: String, trim: true, default: '' },
        hours: { type: String, trim: true, default: '' },
      },
      contactInfo: {
        email: { type: String, trim: true, default: '' },
        phone: { type: String, trim: true, default: '' },
        supportText: { type: String, trim: true, default: '' },
      },
      cta: ctaBlockSchema,
      ...seoMongooseFields,
      seoTitle: { type: String, trim: true, default: 'Contact TechVistar | Start your project' },
      canonicalUrl: { type: String, trim: true, default: 'https://techvistar.com/contact' },
    },
    solutionsLanding: {
      hero: landingHeroSchema,
      categoryNav: {
        eyebrow: { type: String, trim: true, default: 'Browse by category' },
      },
      featured: {
        eyebrow: { type: String, trim: true, default: 'Top Picks' },
        title: { type: String, trim: true, default: 'Featured Solutions' },
        description: {
          type: String,
          trim: true,
          default: 'Our most recommended enterprise solution programs.',
        },
        learnMoreLabel: { type: String, trim: true, default: 'Learn more' },
      },
      catalog: {
        eyebrow: { type: String, trim: true, default: 'Full catalog' },
        title: { type: String, trim: true, default: 'All Solutions' },
        description: {
          type: String,
          trim: true,
          default: 'Explore every solution vertical we deliver with enterprise-grade outcomes.',
        },
        learnMoreLabel: { type: String, trim: true, default: 'Learn more' },
      },
      intro: {
        title: { type: String, trim: true, default: 'Solution capabilities' },
        description: {
          type: String,
          trim: true,
          default:
            'Enterprise-grade programs across business automation, applied AI, and digital infrastructure.',
        },
      },
      capabilities: {
        eyebrow: { type: String, trim: true, default: 'Feature highlights' },
        stats: { type: [statItemSchema], default: [] },
        cards: { type: [industryCapabilityCardSchema], default: [] },
      },
      cta: extendedCtaBlockSchema,
      ...seoMongooseFields,
      seoTitle: { type: String, trim: true, default: 'Solutions | TechVistar' },
      canonicalUrl: { type: String, trim: true, default: 'https://techvistar.com/solutions' },
    },
    industriesLanding: {
      hero: landingHeroSchema,
      intro: {
        title: { type: String, trim: true, default: '' },
        description: { type: String, trim: true, default: '' },
        icon: { type: String, trim: true, default: '' },
        iconPublicId: { type: String, trim: true, default: '' },
      },
      catalog: {
        eyebrow: { type: String, trim: true, default: '' },
        title: { type: String, trim: true, default: '' },
        subtitle: { type: String, trim: true, default: '' },
        description: { type: String, trim: true, default: '' },
        learnMoreLabel: { type: String, trim: true, default: '' },
      },
      capabilities: {
        eyebrow: { type: String, trim: true, default: '' },
        stats: { type: [statItemSchema], default: [] },
        cards: { type: [industryCapabilityCardSchema], default: [] },
      },
      cta: extendedCtaBlockSchema,
      sidebarDefaults: sidebarDefaultsSchema,
      consultationDefaults: consultationDefaultsSchema,
      ...seoMongooseFields,
      seoTitle: { type: String, trim: true, default: 'Industries | TechVistar' },
      canonicalUrl: { type: String, trim: true, default: 'https://techvistar.com/industries' },
    },
    careers: {
      hero: landingHeroSchema,
      culture: {
        title: { type: String, trim: true, default: 'Life at TechVistar' },
        description: { type: String, trim: true, default: '' },
      },
      benefits: { type: [benefitItemSchema], default: [] },
      hiringProcess: { type: [processStepSchema], default: [] },
      cta: ctaBlockSchema,
      ...seoMongooseFields,
      seoTitle: { type: String, trim: true, default: 'Careers at TechVistar | Join our engineering team' },
      seoDescription: {
        type: String,
        trim: true,
        default:
          'Explore open roles at TechVistar. Join a collaborative team building web, AI, and automation products.',
      },
      canonicalUrl: { type: String, trim: true, default: 'https://techvistar.com/careers' },
    },
    websiteSettings: {
      logo: { type: String, trim: true, default: '' },
      logoPublicId: { type: String, trim: true, default: '' },
      favicon: { type: String, trim: true, default: '' },
      faviconPublicId: { type: String, trim: true, default: '' },
      companyName: { type: String, trim: true, default: 'TechVistar' },
      companyTagline: { type: String, trim: true, default: 'Technology-first growth partner' },
      defaultOgImage: { type: String, trim: true, default: '' },
      defaultOgImagePublicId: { type: String, trim: true, default: '' },
      browserTitle: {
        type: String,
        trim: true,
        default: 'TechVistar | Technology-first growth — web, automation & applied AI',
      },
      browserThemeColor: { type: String, trim: true, default: '#16a34a' },
      navbar: {
        ctaButtonText: { type: String, trim: true, default: 'Contact Us' },
        ctaButtonLink: { type: String, trim: true, default: '/contact' },
        stickyEnabled: { type: Boolean, default: true },
        transparentEnabled: { type: Boolean, default: true },
        showSearch: { type: Boolean, default: false },
        announcementBarEnabled: { type: Boolean, default: false },
        announcementText: { type: String, trim: true, default: '' },
        announcementLink: { type: String, trim: true, default: '' },
        announcementButtonText: { type: String, trim: true, default: 'Learn more' },
      },
      email: { type: String, trim: true, default: 'hello@techvistar.com' },
      phone: { type: String, trim: true, default: '+91 9573157982' },
      address: {
        type: String,
        trim: true,
        default: 'A-75, Sector 4, Noida, Uttar Pradesh 201301, India',
      },
      whatsappNumber: { type: String, trim: true, default: '+91 9573157982' },
      supportEmail: { type: String, trim: true, default: 'hello@techvistar.com' },
      salesEmail: { type: String, trim: true, default: 'hello@techvistar.com' },
      googleMapsUrl: {
        type: String,
        trim: true,
        default: 'https://www.openstreetmap.org/?mlat=28.628&mlon=77.372#map=16/28.628/77.372',
      },
      workingHours: {
        type: String,
        trim: true,
        default: 'Monday - Saturday, 09:00 AM - 07:00 PM IST',
      },
      emergencyContact: { type: String, trim: true, default: '' },
      footer: {
        description: { type: String, trim: true, default: '' },
        copyright: { type: String, trim: true, default: '' },
        heading: { type: String, trim: true, default: 'TechVistar' },
        newsletterHeading: { type: String, trim: true, default: 'Stay updated with TechVistar' },
        newsletterDescription: {
          type: String,
          trim: true,
          default: 'Get product updates, technology insights, and engineering articles.',
        },
        bottomText: { type: String, trim: true, default: '' },
        logo: { type: String, trim: true, default: '' },
        logoPublicId: { type: String, trim: true, default: '' },
        backgroundImage: { type: String, trim: true, default: '' },
        backgroundImagePublicId: { type: String, trim: true, default: '' },
        backgroundColor: { type: String, trim: true, default: '#05070B' },
        companyLinks: { type: [footerLinkSchema], default: [] },
        legalLinks: { type: [footerLinkSchema], default: [] },
      },
      socialLinks: {
        linkedin: { type: String, trim: true, default: '' },
        instagram: { type: String, trim: true, default: '' },
        twitter: { type: String, trim: true, default: '' },
        facebook: { type: String, trim: true, default: '' },
        github: { type: String, trim: true, default: '' },
        youtube: { type: String, trim: true, default: '' },
        discord: { type: String, trim: true, default: '' },
        medium: { type: String, trim: true, default: '' },
        behance: { type: String, trim: true, default: '' },
        dribbble: { type: String, trim: true, default: '' },
      },
      seoDefaults: {
        siteTitle: {
          type: String,
          trim: true,
          default: 'TechVistar | Technology-first growth — web, automation & applied AI',
        },
        metaDescription: { type: String, trim: true, default: '' },
        keywords: { type: String, trim: true, default: '' },
        defaultOgImage: { type: String, trim: true, default: '' },
        defaultOgImagePublicId: { type: String, trim: true, default: '' },
        canonicalUrl: { type: String, trim: true, default: 'https://techvistar.com' },
        robotsIndex: { type: Boolean, default: true },
        twitterCard: { type: String, trim: true, default: 'summary_large_image' },
        twitterHandle: { type: String, trim: true, default: '@TechVistar' },
        openGraphType: { type: String, trim: true, default: 'website' },
      },
      analytics: {
        googleAnalyticsId: { type: String, trim: true, default: '' },
        googleTagManagerId: { type: String, trim: true, default: '' },
        metaPixelId: { type: String, trim: true, default: '' },
        microsoftClarityId: { type: String, trim: true, default: '' },
        linkedInInsightTag: { type: String, trim: true, default: '' },
      },
      maintenance: {
        enabled: { type: Boolean, default: false },
        title: { type: String, trim: true, default: 'We’ll be back soon' },
        subtitle: { type: String, trim: true, default: 'Scheduled maintenance' },
        description: {
          type: String,
          trim: true,
          default: 'We are making improvements to deliver a better experience. Please check back shortly.',
        },
        backgroundImage: { type: String, trim: true, default: '' },
        backgroundImagePublicId: { type: String, trim: true, default: '' },
        expectedReturnDate: { type: String, trim: true, default: '' },
        buttonText: { type: String, trim: true, default: 'Contact support' },
        buttonLink: { type: String, trim: true, default: '/contact' },
      },
    },
    updatedBy: { type: String, default: '' },
  },
  { timestamps: true }
);

export const PagesCmsConfig = mongoose.model<IPagesCmsConfig>('PagesCmsConfig', pagesCmsConfigSchema);

/** @deprecated Use IPagesCmsConfig — kept for backward compatibility */
export type IPageSeoBlock = ISeoFields;
