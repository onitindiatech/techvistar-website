import { SITE } from '@/data/about';
import defaultLogoUrl from '@/assets/logo.webp';

export interface WebsiteFooterLink {
  label: string;
  href: string;
  sortOrder: number;
}

export interface WebsiteNavbarSettings {
  ctaButtonText: string;
  ctaButtonLink: string;
  stickyEnabled: boolean;
  transparentEnabled: boolean;
  showSearch: boolean;
  announcementBarEnabled: boolean;
  announcementText: string;
  announcementLink: string;
  announcementButtonText: string;
}

export interface WebsiteFooterSettings {
  description: string;
  copyright: string;
  heading: string;
  newsletterHeading: string;
  newsletterDescription: string;
  bottomText: string;
  logo: string;
  logoPublicId?: string;
  backgroundImage: string;
  backgroundImagePublicId?: string;
  backgroundColor: string;
  companyLinks: WebsiteFooterLink[];
  legalLinks: WebsiteFooterLink[];
}

export interface WebsiteSocialLinks {
  linkedin: string;
  instagram: string;
  twitter: string;
  facebook: string;
  github: string;
  youtube: string;
  discord: string;
  medium: string;
  behance: string;
  dribbble: string;
}

export interface WebsiteSeoDefaults {
  siteTitle: string;
  metaDescription: string;
  keywords: string;
  defaultOgImage: string;
  defaultOgImagePublicId?: string;
  canonicalUrl: string;
  robotsIndex: boolean;
  twitterCard: string;
  twitterHandle: string;
  openGraphType: string;
}

export interface WebsiteAnalyticsSettings {
  googleAnalyticsId: string;
  googleTagManagerId: string;
  metaPixelId: string;
  microsoftClarityId: string;
  linkedInInsightTag: string;
}

export interface WebsiteMaintenanceSettings {
  enabled: boolean;
  title: string;
  subtitle: string;
  description: string;
  backgroundImage: string;
  backgroundImagePublicId?: string;
  expectedReturnDate: string;
  buttonText: string;
  buttonLink: string;
}

export interface WebsiteSettingsConfig {
  logo: string;
  logoPublicId?: string;
  favicon: string;
  faviconPublicId?: string;
  companyName: string;
  companyTagline: string;
  defaultOgImage: string;
  defaultOgImagePublicId?: string;
  browserTitle: string;
  browserThemeColor: string;
  navbar: WebsiteNavbarSettings;
  email: string;
  phone: string;
  address: string;
  whatsappNumber: string;
  supportEmail: string;
  salesEmail: string;
  googleMapsUrl: string;
  workingHours: string;
  emergencyContact: string;
  footer: WebsiteFooterSettings;
  socialLinks: WebsiteSocialLinks;
  seoDefaults: WebsiteSeoDefaults;
  analytics: WebsiteAnalyticsSettings;
  maintenance: WebsiteMaintenanceSettings;
}

/** Legacy `home.footer` shape — used only for one-time migration into website settings. */
export interface LegacyHomeFooterConfig {
  logo?: string;
  logoPublicId?: string;
  companyDescription?: string;
  phone?: string;
  email?: string;
  address?: string;
  workingHours?: string;
  newsletterHeading?: string;
  newsletterDescription?: string;
  copyright?: string;
  bottomText?: string;
  socialLinks?: Array<{ platform: string; url: string; sortOrder?: number }>;
  companyLinks?: WebsiteFooterLink[];
  legalLinks?: WebsiteFooterLink[];
}

const DEFAULT_FOOTER_COMPANY_LINKS: WebsiteFooterLink[] = [
  { label: 'About Us', href: '/about', sortOrder: 0 },
  { label: 'Our Portfolio', href: '/work', sortOrder: 1 },
  { label: 'Core Solutions', href: '/solutions', sortOrder: 2 },
  { label: 'Our Industries', href: '/industries', sortOrder: 3 },
  { label: 'Careers', href: '/careers', sortOrder: 4 },
  { label: 'Contact Us', href: '/contact', sortOrder: 5 },
  { label: 'Portal FAQ', href: '/contact#faq-section', sortOrder: 6 },
];

const BROWSER_TITLE = 'TechVistar | Technology-first growth — web, automation & applied AI';
const META_DESCRIPTION =
  'TechVistar is a technology-first growth partner: web and mobile systems, brand and digital marketing, automation, applied AI, and documentation—structured scope, measurable outcomes, Hyderabad and remote.';
const META_KEYWORDS =
  'technology consulting, web development, mobile apps, marketing automation, applied AI, integration, technical documentation, Hyderabad, India, TechVistar';
const MAPS_URL =
  'https://www.openstreetmap.org/?mlat=28.628&mlon=77.372#map=16/28.628/77.372';

export const DEFAULT_WEBSITE_SETTINGS: WebsiteSettingsConfig = {
  logo: defaultLogoUrl,
  favicon: defaultLogoUrl,
  companyName: SITE.name,
  companyTagline: 'Technology-first growth partner',
  defaultOgImage: defaultLogoUrl,
  browserTitle: BROWSER_TITLE,
  browserThemeColor: '#16a34a',
  navbar: {
    ctaButtonText: 'Contact Us',
    ctaButtonLink: '/contact',
    stickyEnabled: true,
    transparentEnabled: true,
    showSearch: false,
    announcementBarEnabled: false,
    announcementText: '',
    announcementLink: '',
    announcementButtonText: 'Learn more',
  },
  email: 'hello@techvistar.com',
  phone: '+91 9573157982',
  address: 'A-75, Sector 4, Noida, Uttar Pradesh 201301, India',
  whatsappNumber: '+91 9573157982',
  supportEmail: 'hello@techvistar.com',
  salesEmail: 'hello@techvistar.com',
  googleMapsUrl: MAPS_URL,
  workingHours: 'Monday - Saturday, 09:00 AM - 07:00 PM IST',
  emergencyContact: '',
  footer: {
    description:
      'Deploying enterprise software architecture, cognitive AI models, and secure cloud infrastructures engineered for scalable conversions.',
    copyright: `© ${new Date().getFullYear()} TechVistar. Made with ❤️ by TechVistar.`,
    heading: SITE.name,
    newsletterHeading: 'Stay updated with TechVistar',
    newsletterDescription: 'Get product updates, technology insights, and engineering articles.',
    bottomText: '',
    logo: defaultLogoUrl,
    backgroundImage: '',
    backgroundColor: '#05070B',
    companyLinks: DEFAULT_FOOTER_COMPANY_LINKS,
    legalLinks: [],
  },
  socialLinks: {
    linkedin: SITE.socials[0] || 'https://www.linkedin.com/company/techvistar',
    instagram: SITE.socials[1] || 'https://www.instagram.com/tech_vistar',
    twitter: '',
    facebook: '',
    github: '',
    youtube: '',
    discord: '',
    medium: '',
    behance: '',
    dribbble: '',
  },
  seoDefaults: {
    siteTitle: BROWSER_TITLE,
    metaDescription: META_DESCRIPTION,
    keywords: META_KEYWORDS,
    defaultOgImage: defaultLogoUrl,
    canonicalUrl: SITE.url,
    robotsIndex: true,
    twitterCard: 'summary_large_image',
    twitterHandle: '@TechVistar',
    openGraphType: 'website',
  },
  analytics: {
    googleAnalyticsId: '',
    googleTagManagerId: '',
    metaPixelId: '',
    microsoftClarityId: '',
    linkedInInsightTag: '',
  },
  maintenance: {
    enabled: false,
    title: 'We’ll be back soon',
    subtitle: 'Scheduled maintenance',
    description: 'We are making improvements to deliver a better experience. Please check back shortly.',
    backgroundImage: '',
    expectedReturnDate: '',
    buttonText: 'Contact support',
    buttonLink: '/contact',
  },
};

function deepMergeSection<T extends Record<string, unknown>>(defaults: T, api?: Partial<T> | null): T {
  if (!api) return defaults;
  const out = { ...defaults };
  for (const key of Object.keys(defaults) as Array<keyof T>) {
    const val = api[key];
    if (val === undefined || val === null) continue;
    if (typeof val === 'string' && val.trim() === '') continue;
    if (Array.isArray(val)) {
      if (val.length === 0) continue;
      out[key] = val as T[keyof T];
    } else if (typeof val === 'object' && typeof defaults[key] === 'object' && !Array.isArray(defaults[key])) {
      out[key] = deepMergeSection(
        defaults[key] as Record<string, unknown>,
        val as Record<string, unknown>,
      ) as T[keyof T];
    } else {
      out[key] = val as T[keyof T];
    }
  }
  return out;
}

function pickNonEmpty(current: string | undefined, legacy: string | undefined): string | undefined {
  if (current?.trim()) return current.trim();
  if (legacy?.trim()) return legacy.trim();
  return undefined;
}

function migrateLegacyHomeFooter(
  settings: WebsiteSettingsConfig,
  legacy?: LegacyHomeFooterConfig | null,
): WebsiteSettingsConfig {
  if (!legacy) return settings;

  const footer = { ...settings.footer };
  const description = pickNonEmpty(footer.description, legacy.companyDescription);
  if (description) footer.description = description;

  const logo = pickNonEmpty(footer.logo, legacy.logo);
  if (logo) {
    footer.logo = logo;
    if (!footer.logoPublicId && legacy.logoPublicId) {
      footer.logoPublicId = legacy.logoPublicId;
    }
  }

  const newsletterHeading = pickNonEmpty(footer.newsletterHeading, legacy.newsletterHeading);
  if (newsletterHeading) footer.newsletterHeading = newsletterHeading;

  const newsletterDescription = pickNonEmpty(footer.newsletterDescription, legacy.newsletterDescription);
  if (newsletterDescription) footer.newsletterDescription = newsletterDescription;

  const copyright = pickNonEmpty(footer.copyright, legacy.copyright);
  if (copyright) footer.copyright = copyright;

  const bottomText = pickNonEmpty(footer.bottomText, legacy.bottomText);
  if (bottomText) footer.bottomText = bottomText;

  if (!footer.companyLinks?.length && legacy.companyLinks?.length) {
    footer.companyLinks = legacy.companyLinks;
  }
  if (!footer.legalLinks?.length && legacy.legalLinks?.length) {
    footer.legalLinks = legacy.legalLinks;
  }

  const socialLinks = { ...settings.socialLinks };
  const hasWebsiteSocial = Object.values(socialLinks).some((url) => url?.trim());
  if (!hasWebsiteSocial && legacy.socialLinks?.length) {
    for (const link of legacy.socialLinks) {
      const platform = link.platform?.toLowerCase() as keyof WebsiteSocialLinks;
      if (platform in socialLinks && link.url?.trim() && !socialLinks[platform]?.trim()) {
        socialLinks[platform] = link.url.trim();
      }
    }
  }

  return {
    ...settings,
    phone: pickNonEmpty(settings.phone, legacy.phone) ?? settings.phone,
    email: pickNonEmpty(settings.email, legacy.email) ?? settings.email,
    address: pickNonEmpty(settings.address, legacy.address) ?? settings.address,
    workingHours: pickNonEmpty(settings.workingHours, legacy.workingHours) ?? settings.workingHours,
    footer,
    socialLinks,
  };
}

/**
 * Merges website settings from the API and migrates legacy `home.footer` fields when
 * website settings are empty (backward compatible with older Home CMS footer data).
 */
export function mergeWebsiteSettingsConfig(
  api?: Partial<WebsiteSettingsConfig> | null,
  legacyHomeFooter?: LegacyHomeFooterConfig | null,
): WebsiteSettingsConfig {
  let merged = deepMergeSection(DEFAULT_WEBSITE_SETTINGS, api);
  merged = migrateLegacyHomeFooter(merged, legacyHomeFooter);

  if (!merged.footer.description?.trim()) {
    merged.footer.description = DEFAULT_WEBSITE_SETTINGS.footer.description;
  }
  if (!merged.footer.copyright?.trim()) {
    merged.footer.copyright = DEFAULT_WEBSITE_SETTINGS.footer.copyright;
  }
  if (!merged.footer.companyLinks?.length) {
    merged.footer.companyLinks = DEFAULT_WEBSITE_SETTINGS.footer.companyLinks;
  }
  if (!merged.footer.legalLinks?.length) {
    merged.footer.legalLinks = DEFAULT_WEBSITE_SETTINGS.footer.legalLinks;
  }

  return merged;
}
