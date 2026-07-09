import { Helmet } from 'react-helmet-async';
import { resolveSeo } from '@/lib/seoResolve';
import { SeoDefaults, SeoMetadata } from '@/types/seo';

interface PageSeoProps {
  seo?: SeoMetadata | null;
  defaults: SeoDefaults;
}

export function PageSeo({ seo, defaults }: PageSeoProps) {
  const resolved = resolveSeo(seo, defaults);

  return (
    <Helmet prioritizeSeoTags>
      <title>{resolved.title}</title>
      <meta name="description" content={resolved.description} />
      <meta name="robots" content={resolved.robots} />
      <link rel="canonical" href={resolved.canonical} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={resolved.siteName} />
      <meta property="og:title" content={resolved.ogTitle} />
      <meta property="og:description" content={resolved.ogDescription} />
      <meta property="og:url" content={resolved.ogUrl} />
      {resolved.ogImage ? <meta property="og:image" content={resolved.ogImage} /> : null}

      <meta name="twitter:card" content={resolved.twitterImage ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={resolved.twitterTitle} />
      <meta name="twitter:description" content={resolved.twitterDescription} />
      {resolved.twitterImage ? <meta name="twitter:image" content={resolved.twitterImage} /> : null}
    </Helmet>
  );
}
