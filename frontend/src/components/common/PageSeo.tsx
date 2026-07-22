import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { resolveSeo } from '@/lib/seoResolve';
import { getPublicPagesConfig } from '@/services/pages.service';
import { mergePagesCmsConfig } from '@/types/pagesCms';
import { SeoDefaults, SeoMetadata } from '@/types/seo';

interface PageSeoProps {
  seo?: SeoMetadata | null;
  defaults: SeoDefaults;
  /** Emit WebPage JSON-LD from resolved SEO (default true) */
  includeStructuredData?: boolean;
}

export function PageSeo({ seo, defaults, includeStructuredData = true }: PageSeoProps) {
  const { data } = useQuery({
    queryKey: ['pages-config'],
    queryFn: getPublicPagesConfig,
  });

  const website = mergePagesCmsConfig(data).websiteSettings;
  const globalSeo = website.seoDefaults;

  const mergedDefaults: SeoDefaults = {
    ...defaults,
    siteName: defaults.siteName || website.companyName,
    image:
      defaults.image ||
      globalSeo.defaultOgImage ||
      website.defaultOgImage ||
      undefined,
    twitterSite: defaults.twitterSite || globalSeo.twitterHandle,
    keywords: defaults.keywords || globalSeo.keywords,
    description: defaults.description || globalSeo.metaDescription,
  };

  const resolved = resolveSeo(seo, mergedDefaults);

  const webPageLd = includeStructuredData
    ? {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: resolved.title,
        description: resolved.description,
        url: resolved.canonical,
        isPartOf: {
          '@type': 'WebSite',
          name: resolved.siteName,
          url: resolved.canonical.replace(/\/[^/]*$/, '') || resolved.canonical,
        },
        ...(resolved.ogImage
          ? {
              primaryImageOfPage: {
                '@type': 'ImageObject',
                url: resolved.ogImage,
              },
            }
          : {}),
      }
    : null;

  return (
    <Helmet prioritizeSeoTags>
      <title>{resolved.title}</title>
      <meta name="description" content={resolved.description} />
      <meta name="google-site-verification" content="adpi70yBdOt7OP4g9hTbBUep-ONVp3X5Ef-JXI9FCD8" />
      {resolved.keywords ? <meta name="keywords" content={resolved.keywords} /> : null}
      <meta name="robots" content={resolved.robots} />
      <link rel="canonical" href={resolved.canonical} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={resolved.siteName} />
      <meta property="og:title" content={resolved.ogTitle} />
      <meta property="og:description" content={resolved.ogDescription} />
      <meta property="og:url" content={resolved.ogUrl} />
      {resolved.ogImage ? <meta property="og:image" content={resolved.ogImage} /> : null}

      <meta name="twitter:card" content={resolved.twitterImage ? 'summary_large_image' : 'summary'} />
      {resolved.twitterSite ? <meta name="twitter:site" content={resolved.twitterSite} /> : null}
      <meta name="twitter:title" content={resolved.twitterTitle} />
      <meta name="twitter:description" content={resolved.twitterDescription} />
      {resolved.twitterImage ? <meta name="twitter:image" content={resolved.twitterImage} /> : null}

      {webPageLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageLd) }}
        />
      ) : null}
    </Helmet>
  );
}
