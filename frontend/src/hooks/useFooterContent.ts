import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPublicPagesConfig } from '@/services/pages.service';
import { mergePagesCmsConfig } from '@/types/pagesCms';
import {
  DEFAULT_WEBSITE_SETTINGS,
  type WebsiteFooterLink,
  type WebsiteSocialLinks,
} from '@/types/websiteSettings';
import { getActiveServices } from '@/services/services.service';
import { getActiveIndustries } from '@/services/industry.service';
import defaultLogoUrl from '@/assets/logo.webp';

const INVALID_FOOTER_PATHS = new Set(['/privacy', '/terms', '/cookies', '/sitemap']);
const FOOTER_SERVICES_MAX = 10;

export interface FooterSocialLink {
  platform: string;
  url: string;
  sortOrder: number;
}

function isFeaturedService(service: { featured?: unknown }): boolean {
  return service.featured === true || service.featured === 'true';
}

function buildFooterServiceLinks(services: Array<Record<string, unknown>>): WebsiteFooterLink[] {
  const published = services
    .filter((service) => service?.slug)
    .sort((a, b) => (Number(a.displayOrder) || 0) - (Number(b.displayOrder) || 0));

  const featured = published.filter(isFeaturedService);
  const nonFeatured = published.filter((service) => !isFeaturedService(service));
  const selected = [...featured, ...nonFeatured].slice(0, FOOTER_SERVICES_MAX);

  return selected.map((service, index) => ({
    label: String(service.title || service.slug),
    href: `/services/${service.slug}`,
    sortOrder: Number(service.displayOrder) || index,
  }));
}

export function isValidFooterHref(href: string): boolean {
  const trimmed = href?.trim();
  if (!trimmed) return false;
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('tel:')
  ) {
    return true;
  }
  const path = trimmed.split('#')[0].split('?')[0];
  if (INVALID_FOOTER_PATHS.has(path)) return false;
  return true;
}

function sortLinks<T extends { sortOrder?: number }>(links: T[]): T[] {
  return [...links].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}

function normalizeCompanyHref(href: string, label: string): string {
  if (label.toLowerCase().includes('faq') && href === '/contact') {
    return '/contact#faq-section';
  }
  return href;
}

function websiteSocialToArray(social: WebsiteSocialLinks): FooterSocialLink[] {
  const entries: Array<[string, string]> = [
    ['linkedin', social.linkedin],
    ['github', social.github],
    ['instagram', social.instagram],
    ['twitter', social.twitter],
    ['youtube', social.youtube],
    ['facebook', social.facebook],
    ['discord', social.discord],
    ['medium', social.medium],
    ['behance', social.behance],
    ['dribbble', social.dribbble],
  ];

  return entries
    .map(([platform, url], sortOrder) => ({ platform, url: url?.trim() || '', sortOrder }))
    .filter((item) => item.url);
}

/** Global footer content — sourced exclusively from Website Settings CMS. */
export function useFooterContent() {
  const { data: pagesConfig } = useQuery({
    queryKey: ['pages-config'],
    queryFn: getPublicPagesConfig,
    staleTime: 60_000,
  });

  const websiteSettings = mergePagesCmsConfig(pagesConfig).websiteSettings;
  const wsFooter = websiteSettings.footer;

  const { data: services = [] } = useQuery({
    queryKey: ['activeServices'],
    queryFn: getActiveServices,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  const { data: industries = [] } = useQuery({
    queryKey: ['activeIndustries'],
    queryFn: () => getActiveIndustries(),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  return useMemo(() => {
    const heading =
      wsFooter.heading?.trim() || websiteSettings.companyName?.trim() || 'TechVistar';
    const companyDescription =
      wsFooter.description?.trim() || DEFAULT_WEBSITE_SETTINGS.footer.description;
    const logo =
      wsFooter.logo?.trim() || websiteSettings.logo?.trim() || defaultLogoUrl;
    const phone = websiteSettings.phone?.trim() || '';
    const email = websiteSettings.email?.trim() || '';
    const address = websiteSettings.address?.trim() || '';
    const workingHours = websiteSettings.workingHours?.trim() || '';
    const newsletterHeading =
      wsFooter.newsletterHeading?.trim() || DEFAULT_WEBSITE_SETTINGS.footer.newsletterHeading;
    const newsletterDescription =
      wsFooter.newsletterDescription?.trim() || DEFAULT_WEBSITE_SETTINGS.footer.newsletterDescription;
    const copyright =
      wsFooter.copyright?.trim() || DEFAULT_WEBSITE_SETTINGS.footer.copyright;
    const bottomText = wsFooter.bottomText?.trim() || '';
    const backgroundColor = wsFooter.backgroundColor?.trim() || '#05070B';
    const backgroundImage = wsFooter.backgroundImage?.trim() || '';

    const socialLinks = websiteSocialToArray(websiteSettings.socialLinks);

    const serviceLinks = buildFooterServiceLinks(services as Array<Record<string, unknown>>);

    const industryLinks: WebsiteFooterLink[] = [...industries]
      .filter((industry) => industry?.slug)
      .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
      .map((industry, index) => ({
        label: industry.title || industry.slug,
        href: `/industries/${industry.slug}`,
        sortOrder: industry.displayOrder ?? index,
      }));

    const companyLinks = sortLinks(
      wsFooter.companyLinks?.length
        ? wsFooter.companyLinks
        : DEFAULT_WEBSITE_SETTINGS.footer.companyLinks,
    )
      .map((link) => ({
        ...link,
        href: normalizeCompanyHref(link.href, link.label),
      }))
      .filter((link) => isValidFooterHref(link.href));

    const legalLinks = sortLinks(
      wsFooter.legalLinks?.length ? wsFooter.legalLinks : DEFAULT_WEBSITE_SETTINGS.footer.legalLinks,
    ).filter((link) => isValidFooterHref(link.href));

    return {
      heading,
      companyDescription,
      logo,
      phone,
      email,
      address,
      workingHours,
      newsletterHeading,
      newsletterDescription,
      copyright,
      bottomText,
      backgroundColor,
      backgroundImage,
      socialLinks,
      serviceLinks,
      industryLinks,
      companyLinks,
      legalLinks,
    };
  }, [websiteSettings, wsFooter, services, industries]);
}
