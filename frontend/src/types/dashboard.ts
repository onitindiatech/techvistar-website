export type DashboardMetric = {
  key: string;
  title: string;
  value: number;
  description: string;
  /** Percentage delta when trendStatus === 'ok' */
  trend: number | null;
  /** ok = show %; new = first activity; none = cannot compare (e.g. All Time) */
  trendStatus: 'ok' | 'new' | 'none';
  series: Array<{ label: string; value: number }>;
};

export type DashboardRecentActivity = {
  type: string;
  title: string;
  subtitle: string;
  status: string;
  href: string;
  createdAt: string;
};

export type DashboardSystemStatus = {
  key: string;
  label: string;
  status: 'online' | 'degraded' | 'offline';
  detail?: string;
  healthPercent: number;
};

export type SeoAnalytics = {
  totalPages: number;
  configuredPages: number;
  missingSeo: number;
  averageScore: number;
  missingMetaDescriptions: number;
  missingTitles: number;
  missingOgImage: number;
  missingCanonical: number;
  missingSchema: number;
  missingRobotsConfig: number;
  progress: Array<{ label: string; value: number; total: number }>;
};

export type WebsiteHealth = {
  overallPercent: number;
  checks: Array<{ key: string; label: string; percent: number; detail: string }>;
};

export type DashboardAnalytics = {
  generatedAt: string;
  metrics: DashboardMetric[];
  platformOverview: {
    metrics: Array<{
      key: string;
      label: string;
      value: number;
      trend: number | null;
      trendStatus: 'ok' | 'new' | 'none';
    }>;
    series: Array<{
      label: string;
      contacts: number;
      applications: number;
      subscribers: number;
      content: number;
      cmsUpdates: number;
    }>;
  };
  contentDistribution: Array<{ name: string; value: number }>;
  applicationStatus: Array<{ name: string; value: number }>;
  contactStatus: Array<{ name: string; value: number }>;
  jobStatus: Array<{ name: string; value: number }>;
  projectStatus: Array<{ name: string; value: number }>;
  newsletterStatus: Array<{ name: string; value: number }>;
  monthlyGrowth: Array<{
    label: string;
    contacts: number;
    applications: number;
    subscribers: number;
    services: number;
    solutions: number;
    industries: number;
    jobs: number;
    portfolio: number;
    content: number;
    cmsUpdates: number;
  }>;
  recentActivity: DashboardRecentActivity[];
  recentContacts: Array<{ id: string; name: string; email: string; subject: string; status: string; createdAt: string }>;
  recentApplications: Array<{ id: string; fullName: string; email: string; position: string; status: string; createdAt: string }>;
  recentNewsletter: Array<{ id: string; email: string; source: string; status: string; createdAt: string }>;
  recentPortfolio: Array<{ id: string; title: string; status: string; featured: boolean; createdAt: string }>;
  recentCmsUpdates: Array<{ type: string; title: string; updatedBy: string; updatedAt: string }>;
  latestAdminActivity: Array<{ id: string; name: string; email: string; updatedAt: string }>;
  seoAnalytics: SeoAnalytics;
  websiteHealth: WebsiteHealth;
  contentStatistics: {
    offices: { total: number; active: number; inactive: number };
    admins: { total: number };
    pagesCms: { lastUpdatedAt: string | null; updatedBy: string };
    featured: {
      services: number;
      solutions: number;
      industries: number;
      projects: number;
      jobs: number;
      faqs: number;
    };
    published: { services: number; solutions: number; industries: number };
    draft: { services: number; solutions: number; industries: number; jobs: number };
    hidden: { faqs: number };
    archived: { contacts: number };
    averageContactResponseHours: number | null;
  };
  systemStatus: DashboardSystemStatus[];
  storageUsage: {
    available: boolean;
    usedBytes?: number;
    usedMB?: number;
    assetCount?: number;
    detail: string;
  } | null;
  databaseStats: { dataSizeMB: number; collections: number } | null;
};
