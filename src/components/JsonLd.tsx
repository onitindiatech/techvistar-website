import { SITE, SERVICES } from '@/lib/constants';

/**
 * Schema.org JSON-LD for Organization + ProfessionalService + service catalog.
 * Improves discoverability for technology services queries.
 */
export const JsonLd = () => {
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
          addressLocality: 'Hyderabad',
          addressRegion: 'Telangana',
          addressCountry: 'IN',
        },
        areaServed: {
          '@type': 'Country',
          name: 'India',
        },
        sameAs: [
          'https://www.linkedin.com/company/techvistar',
          'https://www.instagram.com/tech_vistar',
        ],
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
