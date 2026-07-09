import { SITE } from '@/data/about';
import defaultLogoUrl from '@/assets/logo.webp';

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
    description: SITE.description,
    copyright: `© ${new Date().getFullYear()} TechVistar. Made with ❤️ by TechVistar.`,
    heading: SITE.name,
    newsletterHeading: 'Stay updated with TechVistar',
    newsletterDescription: 'Get product updates, technology insights, and engineering articles.',
    bottomText: '',
    logo: defaultLogoUrl,
    backgroundImage: '',
    backgroundColor: '#05070B',
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
