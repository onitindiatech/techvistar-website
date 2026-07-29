import type { IPagesCmsConfig } from '@/models/PagesCmsConfig';
import type { SeoAnalytics } from '@/utils/dashboard.seo';
import type { DashboardSystemStatus } from '@/utils/dashboard.system';

export type WebsiteHealthCheck = {
  key: string;
  label: string;
  percent: number;
  detail: string;
};

export type WebsiteHealth = {
  overallPercent: number;
  checks: WebsiteHealthCheck[];
};

function percentFromChecks(checks: boolean[]): number {
  if (checks.length === 0) return 0;
  const passed = checks.filter(Boolean).length;
  return Math.round((passed / checks.length) * 100);
}

function hasText(value?: string | null): boolean {
  return Boolean(value?.trim());
}

export function getWebsiteHealth(
  pagesDoc: IPagesCmsConfig | null,
  seoAnalytics: SeoAnalytics,
  systemStatus: DashboardSystemStatus[],
): WebsiteHealth {
  const home = pagesDoc?.home as Record<string, any> | undefined;
  const contact = pagesDoc?.contact as Record<string, any> | undefined;
  const settings = pagesDoc?.websiteSettings as Record<string, any> | undefined;
  const about = pagesDoc?.about as Record<string, any> | undefined;
  const solutionsLanding = pagesDoc?.solutionsLanding as Record<string, any> | undefined;
  const industriesLanding = pagesDoc?.industriesLanding as Record<string, any> | undefined;
  const portfolioLanding = pagesDoc?.portfolioLanding as Record<string, any> | undefined;
  const careers = pagesDoc?.careers as Record<string, any> | undefined;

  const homepageConfigured = Boolean(
    hasText(home?.hero?.headlineLine1) ||
    hasText(home?.hero?.tagline) ||
    hasText(home?.hero?.backgroundImage),
  );

  const cmsSections = [
    home?.hero?.headlineLine1,
    about?.hero?.title,
    contact?.hero?.title,
    solutionsLanding?.hero?.title,
    industriesLanding?.hero?.title,
    portfolioLanding?.hero?.title,
    careers?.hero?.title,
  ];
  const cmsCompleteness = percentFromChecks(cmsSections.map((value) => hasText(value)));

  const imagesConfigured = percentFromChecks([
    hasText(settings?.logo),
    hasText(settings?.favicon),
    hasText(settings?.seoDefaults?.defaultOgImage),
  ]);

  const contactConfigured = percentFromChecks([
    hasText(contact?.hero?.title),
    hasText(contact?.contactInfo?.email),
    hasText(contact?.contactInfo?.phone),
  ]);

  const social = settings?.socialLinks ?? {};
  const socialConfigured = percentFromChecks([
    hasText(social.linkedin),
    hasText(social.twitter),
    hasText(social.instagram),
    hasText(social.facebook),
    hasText(social.github),
    hasText(social.youtube),
  ]);

  const operationalSystems = systemStatus.filter((item) => item.status === 'online').length;
  const systemHealth = systemStatus.length > 0
    ? Math.round((operationalSystems / systemStatus.length) * 100)
    : 0;

  const checks: WebsiteHealthCheck[] = [
    {
      key: 'homepage',
      label: 'Homepage configured',
      percent: homepageConfigured ? 100 : 0,
      detail: homepageConfigured ? 'Hero content present' : 'Homepage hero missing',
    },
    {
      key: 'cms',
      label: 'CMS completeness',
      percent: cmsCompleteness,
      detail: `${cmsCompleteness}% of core landing sections configured`,
    },
    {
      key: 'seo',
      label: 'SEO completeness',
      percent: seoAnalytics.averageScore,
      detail: `Average SEO score ${seoAnalytics.averageScore}%`,
    },
    {
      key: 'images',
      label: 'Images configured',
      percent: imagesConfigured,
      detail: `${imagesConfigured}% of brand assets configured`,
    },
    {
      key: 'contact',
      label: 'Contact info configured',
      percent: contactConfigured,
      detail: `${contactConfigured}% of contact fields configured`,
    },
    {
      key: 'social',
      label: 'Social links configured',
      percent: socialConfigured,
      detail: socialConfigured > 0 ? 'Social profiles linked' : 'No social links configured',
    },
    {
      key: 'systems',
      label: 'Platform services',
      percent: systemHealth,
      detail: `${operationalSystems}/${systemStatus.length} services operational`,
    },
  ];

  const overallPercent = Math.round(
    checks.reduce((sum, check) => sum + check.percent, 0) / checks.length,
  );

  return { overallPercent, checks };
}
