import { useQuery } from '@tanstack/react-query';
import { SITE, SERVICES } from '@/data';
import { getPublicPagesConfig } from '@/services/pages.service';
import { mergePagesCmsConfig } from '@/types/pagesCms';

/**
 * Schema.org JSON-LD for Organization + ProfessionalService + service catalog.
 * Organization sameAs is driven by Website Settings social links (non-empty only).
 */
export const JsonLd = () => {
  const { data: pagesConfig } = useQuery({
    queryKey: ['pages-config'],
    queryFn: getPublicPagesConfig,
  });

  const socialLinks = mergePagesCmsConfig(pagesConfig).websiteSettings.socialLinks;
  const sameAs = Object.values(socialLinks)
    .map((url) => url?.trim() || '')
    .filter(Boolean);

  const orgId = `${SITE.url}#organization`;
  const serviceId = `${SITE.url}#services`;

  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': orgId,
        name: SITE.name,
        url: SITE.url,
        description: SITE.description,
        address: {
          '@type': 'PostalAddress',
          addressLocality: SITE.address.locality,
          addressRegion: SITE.address.region,
          addressCountry: SITE.address.countryCode,
        },
        areaServed: {
          '@type': 'Country',
          name: SITE.address.countryName,
        },
        sameAs,
      },
      {
        '@type': 'ProfessionalService',
        '@id': serviceId,
        name: `${SITE.name} — Technology-first growth partner`,
        url: SITE.url,
        description: SITE.description,
        provider: { '@id': orgId },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Growth and technology services',
          itemListElement: SERVICES.map((s, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: {
              '@type': 'Service',
              name: s.title,
              description: s.description,
              provider: { '@id': orgId },
            },
          })),
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
};
