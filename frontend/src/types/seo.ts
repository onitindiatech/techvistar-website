export interface SeoMetadata {
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  robotsIndex?: boolean;
  robotsFollow?: boolean;
}

export interface SeoDefaults {
  title: string;
  description: string;
  image?: string;
  url: string;
  siteName?: string;
}

export const EMPTY_SEO: SeoMetadata = {
  seoTitle: '',
  seoDescription: '',
  canonicalUrl: '',
  ogTitle: '',
  ogDescription: '',
  ogImage: '',
  twitterTitle: '',
  twitterDescription: '',
  twitterImage: '',
  robotsIndex: true,
  robotsFollow: true,
};

export const SITE_DEFAULTS = {
  siteName: 'TechVistar',
  siteUrl: import.meta.env.VITE_SITE_URL || 'https://techvistar.com',
};
