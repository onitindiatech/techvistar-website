import { SeoMetadata } from '@/types/seo';

export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface ServiceCtaBlock {
  badge: string;
  headline: string;
  body: string;
  primaryButtonLabel: string;
  secondaryButtonLabel: string;
  secondaryButtonHref: string;
}

export interface ServiceSidebarBlock {
  summaryTitle: string;
  responseTimeTitle: string;
  responseTime: string;
  businessHoursTitle: string;
  businessHours: string;
  secureTitle: string;
  secureDescription: string;
  buttonLabel: string;
  directInquiriesTitle: string;
  directInquiriesBody: string;
  contactEmail: string;
}

export interface ServiceConsultationBlock {
  title: string;
  description: string;
  submitLabel: string;
  privacyText: string;
  successTitle: string;
  successMessage: string;
}

export interface ServicesLandingConfig extends SeoMetadata {
  title: string;
  subtitle: string;
  description: string;
  backgroundImage: string;
  offeringsLabel: string;
  learnMoreLabel: string;
}

export interface HomeServicesSectionConfig {
  tag: string;
  title: string;
  highlight: string;
  description: string;
  viewAllTitle: string;
  viewAllLinkText: string;
}

export interface ServicesCmsConfig {
  landing: ServicesLandingConfig;
  homeSection: HomeServicesSectionConfig;
  sidebarDefaults: ServiceSidebarBlock;
  consultationDefaults: ServiceConsultationBlock;
}

export const DEFAULT_SERVICES_CMS_CONFIG: ServicesCmsConfig = {
  landing: {
    title: 'Our Services',
    subtitle: 'What We Do',
    description:
      'We offer structured, productized growth services spanning full-stack delivery, revenue operations, automation, and applied artificial intelligence.',
    backgroundImage: '',
    seoTitle: 'Our Services | TechVistar',
    seoDescription:
      'Explore TechVistar productized services across web development, AI, cloud, automation, and digital growth.',
    canonicalUrl: 'https://techvistar.com/services',
    offeringsLabel: 'Key Offerings',
    learnMoreLabel: 'Learn more',
  },
  homeSection: {
    tag: 'Our services',
    title: 'Productized growth',
    highlight: 'you can scope and measure',
    description:
      'Eighteen core service verticals—from custom software engineering to digital marketing and AI integrations—each designed with transparent processes, technologies, and outcomes.',
    viewAllTitle: 'View All Services',
    viewAllLinkText: 'Explore All',
  },
  sidebarDefaults: {
    summaryTitle: 'Consultation Summary',
    responseTimeTitle: 'Average Response Time',
    responseTime: '< 4 Hours (Within Business Days)',
    businessHoursTitle: 'Business Hours',
    businessHours: 'Monday – Friday, 9:00 AM – 6:00 PM',
    secureTitle: 'Secure Consultation',
    secureDescription: 'All SOW outlines and documentation covered by NDA.',
    buttonLabel: 'Book Free Session',
    directInquiriesTitle: 'Direct Inquiries',
    directInquiriesBody:
      'Have an SOW ready or need instant escalation? Contact our lead architect directly at:',
    contactEmail: 'architect@techvistar.com',
  },
  consultationDefaults: {
    title: 'Request Free Consultation',
    description:
      'Describe your requirements and obtain a custom SOW draft from our engineering leads.',
    submitLabel: 'Submit Requirements',
    privacyText:
      'I agree to be contacted by the TechVistar engineering team and accept the privacy policy.',
    successTitle: 'Inquiry Submitted',
    successMessage:
      'Thank you! We will get back to you in under 4 business hours regarding your project.',
  },
};

export function mergeServicesCmsConfig(api?: Partial<ServicesCmsConfig> | null): ServicesCmsConfig {
  if (!api) return DEFAULT_SERVICES_CMS_CONFIG;
  return {
    landing: { ...DEFAULT_SERVICES_CMS_CONFIG.landing, ...(api.landing || {}) },
    homeSection: { ...DEFAULT_SERVICES_CMS_CONFIG.homeSection, ...(api.homeSection || {}) },
    sidebarDefaults: { ...DEFAULT_SERVICES_CMS_CONFIG.sidebarDefaults, ...(api.sidebarDefaults || {}) },
    consultationDefaults: {
      ...DEFAULT_SERVICES_CMS_CONFIG.consultationDefaults,
      ...(api.consultationDefaults || {}),
    },
  };
}

export function mergeSidebarBlock(
  defaults: ServiceSidebarBlock,
  overrides?: Partial<ServiceSidebarBlock> | null
): ServiceSidebarBlock {
  if (!overrides) return defaults;
  const merged = { ...defaults };
  (Object.keys(merged) as Array<keyof ServiceSidebarBlock>).forEach((key) => {
    const val = overrides[key];
    if (typeof val === 'string' && val.trim()) {
      merged[key] = val.trim();
    }
  });
  return merged;
}

export function mergeConsultationBlock(
  defaults: ServiceConsultationBlock,
  overrides?: Partial<ServiceConsultationBlock> | null
): ServiceConsultationBlock {
  if (!overrides) return defaults;
  const merged = { ...defaults };
  (Object.keys(merged) as Array<keyof ServiceConsultationBlock>).forEach((key) => {
    const val = overrides[key];
    if (typeof val === 'string' && val.trim()) {
      merged[key] = val.trim();
    }
  });
  return merged;
}

export function resolveServiceCtaBlock(
  service: {
    cta?: string;
    ctaBlock?: Partial<ServiceCtaBlock> | null;
  },
  defaults?: Partial<ServiceCtaBlock>
): ServiceCtaBlock {
  const base: ServiceCtaBlock = {
    badge: "Let's collaborate",
    headline: 'Ready to build your next digital product?',
    body:
      service.cta ||
      "Let's collaborate on structuring and engineering your next web portal or AI integration.",
    primaryButtonLabel: 'Book Free Consultation',
    secondaryButtonLabel: 'Talk to an Expert',
    secondaryButtonHref: 'mailto:architect@techvistar.com?subject=Consultation%20Escalation',
    ...defaults,
  };

  if (!service.ctaBlock) return base;

  return {
    badge: service.ctaBlock.badge?.trim() || base.badge,
    headline: service.ctaBlock.headline?.trim() || base.headline,
    body: service.ctaBlock.body?.trim() || service.cta?.trim() || base.body,
    primaryButtonLabel: service.ctaBlock.primaryButtonLabel?.trim() || base.primaryButtonLabel,
    secondaryButtonLabel: service.ctaBlock.secondaryButtonLabel?.trim() || base.secondaryButtonLabel,
    secondaryButtonHref: service.ctaBlock.secondaryButtonHref?.trim() || base.secondaryButtonHref,
  };
}
