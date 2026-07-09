import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useHomeCms } from '@/contexts/HomeCmsContext';
import { getPublicPagesConfig } from '@/services/pages.service';
import { mergePagesCmsConfig } from '@/types/pagesCms';
import { DEFAULT_HOME_CMS, HomeFooterLink, HomeSocialLink } from '@/types/homeCms';
import type { WebsiteSocialLinks } from '@/types/websiteSettings';
import { getActiveServices } from '@/services/services.service';
import { getActiveIndustries } from '@/services/industry.service';
import defaultLogoUrl from '@/assets/logo.webp';

const INVALID_FOOTER_PATHS = new Set(['/privacy', '/terms', '/cookies', '/sitemap']);

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

function websiteSocialToArray(social: WebsiteSocialLinks): HomeSocialLink[] {
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

export function useFooterContent() {
  const homeFooter = useHomeCms().footer;

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
  });

  const { data: industries = [] } = useQuery({
    queryKey: ['activeIndustries'],
    queryFn: () => getActiveIndustries(),
    staleTime: 5 * 60 * 1000,
  });

  return useMemo(() => {
    const heading =
      wsFooter.heading?.trim() || websiteSettings.companyName?.trim() || 'TechVistar';
    const companyDescription =
      wsFooter.description?.trim() ||
      homeFooter.companyDescription?.trim() ||
      DEFAULT_HOME_CMS.footer.companyDescription;
    const logo =
      wsFooter.logo?.trim() ||
      websiteSettings.logo?.trim() ||
      homeFooter.logo?.trim() ||
      defaultLogoUrl;
    const phone = websiteSettings.phone?.trim() || homeFooter.phone;
    const email = websiteSettings.email?.trim() || homeFooter.email;
    const address = websiteSettings.address?.trim() || homeFooter.address;
    const workingHours = websiteSettings.workingHours?.trim() || homeFooter.workingHours;
    const newsletterHeading =
      wsFooter.newsletterHeading?.trim() || homeFooter.newsletterHeading;
    const newsletterDescription =
      wsFooter.newsletterDescription?.trim() || homeFooter.newsletterDescription;
    const copyright =
      wsFooter.copyright?.trim() ||
      homeFooter.copyright?.trim() ||
      DEFAULT_HOME_CMS.footer.copyright;
    const bottomText = wsFooter.bottomText?.trim() || homeFooter.bottomText?.trim() || '';
    const backgroundColor = wsFooter.backgroundColor?.trim() || '#05070B';
    const backgroundImage = wsFooter.backgroundImage?.trim() || '';

    const wsSocial = websiteSocialToArray(websiteSettings.socialLinks);
    const socialLinks = wsSocial.length
      ? wsSocial
      : sortLinks(
          homeFooter.socialLinks?.length
            ? homeFooter.socialLinks
            : DEFAULT_HOME_CMS.footer.socialLinks,
        );

    const serviceLinks: HomeFooterLink[] = [...services]
      .filter((service) => service?.slug)
      .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
      .map((service, index) => ({
        label: service.title || service.slug,
        href: `/services/${service.slug}`,
        sortOrder: service.displayOrder ?? index,
      }));

    const industryLinks: HomeFooterLink[] = [...industries]
      .filter((industry) => industry?.slug)
      .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
      .map((industry, index) => ({
        label: industry.title || industry.slug,
        href: `/industries/${industry.slug}`,
        sortOrder: industry.displayOrder ?? index,
      }));

    const companyLinks = sortLinks(
      homeFooter.companyLinks?.length
        ? homeFooter.companyLinks
        : DEFAULT_HOME_CMS.footer.companyLinks,
    )
      .map((link) => ({
        ...link,
        href: normalizeCompanyHref(link.href, link.label),
      }))
      .filter((link) => isValidFooterHref(link.href));

    const legalLinks = sortLinks(
      homeFooter.legalLinks?.length ? homeFooter.legalLinks : DEFAULT_HOME_CMS.footer.legalLinks,
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
  }, [homeFooter, websiteSettings, wsFooter, services, industries]);
}
