import { cloudinary } from '@/config/cloudinary';
import { Service } from '@/models/Service';
import { Solution } from '@/models/Solution';
import { Industry } from '@/models/Industry';
import { ProjectModel } from '@/models/Project';
import { Job } from '@/models/Job';
import { JobApplication } from '@/models/JobApplication';
import { Contact } from '@/models/Contact';
import { Newsletter } from '@/models/Newsletter';
import { FAQModel } from '@/models/FAQ';
import { Office } from '@/models/Office';
import { Admin } from '@/models/Admin';
import { PagesCmsConfig, type IPagesCmsConfig } from '@/models/PagesCmsConfig';
import {
  aggregateMonthlySeries,
  aggregateSummary,
  buildAnalyticsBuckets,
  buildExtendedMonthlyGrowth,
  buildMonthBuckets,
  buildPreviousEquivalentRange,
  calculatePeriodTrend,
  dateFieldMatch,
  mergeMonthlySeries,
  RECENT_ACTIVITY_LIMIT,
  RECENT_LIST_LIMIT,
  toStatusData,
  type DashboardDateRange,
  type MetricSeriesPoint,
  type PeriodTrendResult,
} from '@/utils/dashboard.aggregations';
import { getWebsiteHealth, type WebsiteHealth } from '@/utils/dashboard.health';
import { getSeoAnalytics, type SeoAnalytics } from '@/utils/dashboard.seo';
import {
  buildSystemStatus,
  getAverageContactResponseHours,
  getDatabaseStats,
  type DashboardSystemStatus,
} from '@/utils/dashboard.system';

type DashboardMetric = {
  key: string;
  title: string;
  value: number;
  description: string;
  trend: number | null;
  trendStatus: 'ok' | 'new' | 'none';
  series: MetricSeriesPoint[];
};

type DashboardRecentActivity = {
  type: string;
  title: string;
  subtitle: string;
  status: string;
  href: string;
  createdAt: string;
};

type DashboardSystemStatusItem = DashboardSystemStatus;

type PlatformOverviewMetric = {
  key: string;
  label: string;
  value: number;
  trend: number | null;
  trendStatus: 'ok' | 'new' | 'none';
};

export type DashboardResponse = {
  generatedAt: string;
  metrics: DashboardMetric[];
  platformOverview: {
    metrics: PlatformOverviewMetric[];
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
  systemStatus: DashboardSystemStatusItem[];
  storageUsage: {
    available: boolean;
    usedBytes?: number;
    usedMB?: number;
    assetCount?: number;
    detail: string;
  } | null;
  databaseStats: { dataSizeMB: number; collections: number } | null;
};

function buildSeriesDescription(activeLabel: string, extra: string[] = []): string {
  return [activeLabel, ...extra].filter(Boolean).join(' · ');
}

function buildMetric(
  key: string,
  title: string,
  value: number,
  description: string,
  series: MetricSeriesPoint[],
  periodTrend?: PeriodTrendResult,
): DashboardMetric {
  const trend = periodTrend ?? { value: null, status: 'none' as const };
  return {
    key,
    title,
    value,
    description,
    trend: trend.value,
    trendStatus: trend.status,
    series,
  };
}

function asPlatformTrend(result: PeriodTrendResult): Pick<PlatformOverviewMetric, 'trend' | 'trendStatus'> {
  return { trend: result.value, trendStatus: result.status };
}

async function getRecentActivity(
  limit = RECENT_ACTIVITY_LIMIT,
  range?: DashboardDateRange | null,
): Promise<DashboardRecentActivity[]> {
  const createdAtMatch = dateFieldMatch(range, 'createdAt');
  const baseMatch = { isDeleted: { $ne: true }, ...createdAtMatch };

  const recent = await Service.aggregate([
    { $match: baseMatch },
    { $sort: { createdAt: -1 } },
    { $limit: limit },
    {
      $project: {
        type: { $literal: 'service' },
        title: '$title',
        subtitle: '$status',
        status: '$status',
        href: { $literal: '/admin/services' },
        createdAt: '$createdAt',
      },
    },
    {
      $unionWith: {
        coll: 'solutions',
        pipeline: [
          { $match: baseMatch },
          { $sort: { createdAt: -1 } },
          { $limit: limit },
          {
            $project: {
              type: { $literal: 'solution' },
              title: '$title',
              subtitle: '$status',
              status: '$status',
              href: { $literal: '/admin/solutions' },
              createdAt: '$createdAt',
            },
          },
        ],
      },
    },
    {
      $unionWith: {
        coll: 'industries',
        pipeline: [
          { $match: baseMatch },
          { $sort: { createdAt: -1 } },
          { $limit: limit },
          {
            $project: {
              type: { $literal: 'industry' },
              title: '$title',
              subtitle: '$status',
              status: '$status',
              href: { $literal: '/admin/industries' },
              createdAt: '$createdAt',
            },
          },
        ],
      },
    },
    {
      $unionWith: {
        coll: 'projects',
        pipeline: [
          { $match: baseMatch },
          { $sort: { createdAt: -1 } },
          { $limit: limit },
          {
            $project: {
              type: { $literal: 'project' },
              title: '$title',
              subtitle: '$status',
              status: '$status',
              href: { $literal: '/admin/portfolio' },
              createdAt: '$createdAt',
            },
          },
        ],
      },
    },
    {
      $unionWith: {
        coll: 'jobs',
        pipeline: [
          { $match: baseMatch },
          { $sort: { createdAt: -1 } },
          { $limit: limit },
          {
            $project: {
              type: { $literal: 'job' },
              title: '$title',
              subtitle: '$status',
              status: '$status',
              href: { $literal: '/admin/jobs' },
              createdAt: '$createdAt',
            },
          },
        ],
      },
    },
    {
      $unionWith: {
        coll: 'jobapplications',
        pipeline: [
          { $match: baseMatch },
          { $sort: { createdAt: -1 } },
          { $limit: limit },
          {
            $project: {
              type: { $literal: 'application' },
              title: '$fullName',
              subtitle: '$email',
              status: '$status',
              href: { $literal: '/admin/applications' },
              createdAt: '$createdAt',
            },
          },
        ],
      },
    },
    {
      $unionWith: {
        coll: 'contacts',
        pipeline: [
          { $match: baseMatch },
          { $sort: { createdAt: -1 } },
          { $limit: limit },
          {
            $project: {
              type: { $literal: 'contact' },
              title: '$name',
              subtitle: '$serviceInterested',
              status: '$status',
              href: { $literal: '/admin/contacts' },
              createdAt: '$createdAt',
            },
          },
        ],
      },
    },
    {
      $unionWith: {
        coll: 'newsletters',
        pipeline: [
          { $match: baseMatch },
          { $sort: { createdAt: -1 } },
          { $limit: limit },
          {
            $project: {
              type: { $literal: 'newsletter' },
              title: '$email',
              subtitle: { $ifNull: ['$source', 'website'] },
              status: '$status',
              href: { $literal: '/admin/newsletter' },
              createdAt: '$createdAt',
            },
          },
        ],
      },
    },
    {
      $unionWith: {
        coll: 'faqs',
        pipeline: [
          { $match: baseMatch },
          { $sort: { createdAt: -1 } },
          { $limit: limit },
          {
            $project: {
              type: { $literal: 'faq' },
              title: '$question',
              subtitle: '$category',
              status: '$status',
              href: { $literal: '/admin/faqs' },
              createdAt: '$createdAt',
            },
          },
        ],
      },
    },
    { $sort: { createdAt: -1 } },
    { $limit: limit },
    {
      $project: {
        type: 1,
        title: 1,
        subtitle: 1,
        status: 1,
        href: 1,
        createdAt: { $toString: '$createdAt' },
      },
    },
  ]);

  return recent.map((item) => ({
    type: String(item.type ?? 'item'),
    title: String(item.title ?? 'Untitled'),
    subtitle: String(item.subtitle ?? ''),
    status: String(item.status ?? ''),
    href: String(item.href ?? '/admin/dashboard'),
    createdAt: String(item.createdAt ?? new Date().toISOString()),
  }));
}

async function getRecentContacts(limit = RECENT_LIST_LIMIT, range?: DashboardDateRange | null) {
  return Contact.aggregate([
    { $match: { isDeleted: { $ne: true }, ...dateFieldMatch(range, 'createdAt') } },
    { $sort: { createdAt: -1 } },
    { $limit: limit },
    {
      $project: {
        id: { $toString: '$_id' },
        name: 1,
        email: 1,
        subject: '$serviceInterested',
        status: 1,
        createdAt: { $toString: '$createdAt' },
      },
    },
  ]);
}

async function getRecentApplications(limit = RECENT_LIST_LIMIT, range?: DashboardDateRange | null) {
  return JobApplication.aggregate([
    { $match: { isDeleted: { $ne: true }, ...dateFieldMatch(range, 'createdAt') } },
    { $sort: { createdAt: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: 'jobs',
        localField: 'jobId',
        foreignField: '_id',
        as: 'job',
      },
    },
    { $unwind: { path: '$job', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        id: { $toString: '$_id' },
        fullName: 1,
        email: 1,
        position: { $ifNull: ['$job.title', 'Unknown position'] },
        status: 1,
        createdAt: { $toString: '$createdAt' },
      },
    },
  ]);
}

async function getRecentNewsletter(limit = RECENT_LIST_LIMIT, range?: DashboardDateRange | null) {
  return Newsletter.aggregate([
    { $match: { isDeleted: { $ne: true }, ...dateFieldMatch(range, 'createdAt') } },
    { $sort: { createdAt: -1 } },
    { $limit: limit },
    {
      $project: {
        id: { $toString: '$_id' },
        email: 1,
        source: { $ifNull: ['$source', 'website'] },
        status: 1,
        createdAt: { $toString: '$createdAt' },
      },
    },
  ]);
}

async function getRecentPortfolio(limit = RECENT_LIST_LIMIT, range?: DashboardDateRange | null) {
  return ProjectModel.aggregate([
    { $match: { isDeleted: { $ne: true }, ...dateFieldMatch(range, 'createdAt') } },
    { $sort: { createdAt: -1 } },
    { $limit: limit },
    {
      $project: {
        id: { $toString: '$_id' },
        title: 1,
        status: 1,
        featured: { $ifNull: ['$featured', false] },
        createdAt: { $toString: '$createdAt' },
      },
    },
  ]);
}

async function getRecentCmsUpdates(limit = RECENT_LIST_LIMIT, range?: DashboardDateRange | null) {
  const updatedAtMatch = dateFieldMatch(range, 'updatedAt');
  const contentUpdatePipeline = (type: string) => [
    { $match: { isDeleted: { $ne: true }, ...updatedAtMatch } },
    { $sort: { updatedAt: -1 as const } },
    { $limit: limit },
    {
      $project: {
        type: { $literal: type },
        title: '$title',
        updatedBy: { $ifNull: ['$updatedBy', 'Admin'] },
        updatedAt: '$updatedAt',
      },
    },
  ];

  const recent = await Service.aggregate([
    ...contentUpdatePipeline('service'),
    {
      $unionWith: {
        coll: 'solutions',
        pipeline: contentUpdatePipeline('solution'),
      },
    },
    {
      $unionWith: {
        coll: 'industries',
        pipeline: contentUpdatePipeline('industry'),
      },
    },
    {
      $unionWith: {
        coll: 'projects',
        pipeline: contentUpdatePipeline('portfolio'),
      },
    },
    {
      $unionWith: {
        coll: 'pagescmsconfigs',
        pipeline: [
          { $match: updatedAtMatch },
          { $sort: { updatedAt: -1 as const } },
          { $limit: limit },
          {
            $project: {
              type: { $literal: 'pages-cms' },
              title: { $literal: 'Pages CMS' },
              updatedBy: { $ifNull: ['$updatedBy', 'Admin'] },
              updatedAt: '$updatedAt',
            },
          },
        ],
      },
    },
    { $sort: { updatedAt: -1 as const } },
    { $limit: limit },
    {
      $project: {
        type: 1,
        title: 1,
        updatedBy: 1,
        updatedAt: { $toString: '$updatedAt' },
      },
    },
  ]);

  return recent;
}

async function getLatestAdminActivity(limit = RECENT_LIST_LIMIT, range?: DashboardDateRange | null) {
  return Admin.aggregate([
    { $match: dateFieldMatch(range, 'updatedAt') },
    { $sort: { updatedAt: -1 } },
    { $limit: limit },
    {
      $project: {
        id: { $toString: '$_id' },
        name: 1,
        email: 1,
        updatedAt: { $toString: '$updatedAt' },
      },
    },
  ]);
}

async function getStorageUsage(): Promise<DashboardResponse['storageUsage']> {
  try {
    const usage = await cloudinary.api.usage();
    const usedBytes = Number(usage?.storage?.usage ?? 0);
    const assetCount = Number(usage?.resources ?? usage?.objects?.usage ?? 0) || undefined;

    if (!usedBytes && !assetCount) {
      return { available: true, detail: 'Cloudinary connected' };
    }

    const usedMB = usedBytes ? Math.round(usedBytes / (1024 * 1024)) : undefined;
    const detailParts = [
      usedMB ? `${usedMB} MB used` : null,
      assetCount ? `${assetCount} assets` : null,
    ].filter(Boolean);

    return {
      available: true,
      usedBytes: usedBytes || undefined,
      usedMB,
      assetCount,
      detail: detailParts.join(' · ') || 'Cloudinary connected',
    };
  } catch {
    return { available: true, detail: 'Cloudinary configured' };
  }
}

export async function getDashboardSummary(
  range?: DashboardDateRange | null,
  preset?: string | null,
): Promise<DashboardResponse> {
  const isAllTime = preset === 'allTime' || !range;
  const analyticsRange: DashboardDateRange | null = isAllTime ? null : range!;
  /** Fixed window for inventory KPI sparklines — independent of date filter. */
  const inventoryBuckets = buildMonthBuckets(6);
  /** Analytics charts/feeds follow the selected range (or 12 months for All Time). */
  const analyticsBuckets = isAllTime ? buildMonthBuckets(12) : buildAnalyticsBuckets(analyticsRange);
  const previousRange = analyticsRange
    ? buildPreviousEquivalentRange(analyticsRange, preset)
    : null;

  /** Analytics-only match. Inventory CMS counts stay unscoped. */
  const createdInRangeMatch: Record<string, unknown> = {
    isDeleted: { $ne: true },
    ...dateFieldMatch(analyticsRange, 'createdAt'),
  };
  const createdInPreviousMatch: Record<string, unknown> = {
    isDeleted: { $ne: true },
    ...(previousRange ? dateFieldMatch(previousRange, 'createdAt') : {}),
  };

  const noneTrend = (): PeriodTrendResult => ({ value: null, status: 'none' });
  const periodTrend = (current: number, previous: number): PeriodTrendResult =>
    isAllTime || !previousRange ? noneTrend() : calculatePeriodTrend(current, previous);

  const [
    servicesSummary,
    solutionsSummary,
    industriesSummary,
    projectsSummary,
    jobsSummary,
    applicationsSummary,
    contactsSummary,
    newslettersSummary,
    faqsSummary,
    officesSummary,
    adminsSummary,
    jobsInRangeSummary,
    servicesSeries,
    solutionsSeries,
    industriesSeries,
    projectsSeries,
    jobsSeries,
    applicationsSeries,
    contactsSeries,
    newslettersSeries,
    servicesInvSeries,
    solutionsInvSeries,
    industriesInvSeries,
    projectsInvSeries,
    faqsInvSeries,
    adminsInvSeries,
    servicesUpdatedSeries,
    solutionsUpdatedSeries,
    industriesUpdatedSeries,
    projectsUpdatedSeries,
    prevJobsCreated,
    prevApplicationsCreated,
    prevContactsCreated,
    prevNewslettersCreated,
    recentActivityRaw,
    recentContacts,
    recentApplications,
    recentNewsletter,
    recentPortfolio,
    recentCmsUpdates,
    latestAdminActivity,
    pagesCmsDoc,
    storageUsage,
    databaseStats,
    averageContactResponseHours,
  ] = await Promise.all([
    // —— Global CMS inventory (never date-filtered) ——
    aggregateSummary(Service, [
      { key: 'active', condition: { $eq: ['$status', 'active'] } },
      { key: 'draft', condition: { $eq: ['$status', 'draft'] } },
      { key: 'featured', condition: { $eq: ['$featured', true] } },
    ]),
    aggregateSummary(Solution, [
      { key: 'active', condition: { $eq: ['$status', 'active'] } },
      { key: 'draft', condition: { $eq: ['$status', 'draft'] } },
      { key: 'featured', condition: { $eq: ['$featured', true] } },
    ]),
    aggregateSummary(Industry, [
      { key: 'active', condition: { $eq: ['$status', 'active'] } },
      { key: 'draft', condition: { $eq: ['$status', 'draft'] } },
      { key: 'featured', condition: { $eq: ['$featured', true] } },
    ]),
    aggregateSummary(ProjectModel, [
      { key: 'completed', condition: { $eq: ['$status', 'Completed'] } },
      { key: 'inProgress', condition: { $eq: ['$status', 'In Progress'] } },
      { key: 'comingSoon', condition: { $eq: ['$status', 'Coming Soon'] } },
      { key: 'featured', condition: { $eq: ['$featured', true] } },
    ]),
    aggregateSummary(Job, [
      { key: 'active', condition: { $eq: ['$status', 'active'] } },
      { key: 'closed', condition: { $eq: ['$status', 'closed'] } },
      { key: 'draft', condition: { $eq: ['$status', 'draft'] } },
      { key: 'featured', condition: { $eq: ['$featured', true] } },
    ]),
    // —— Analytical metrics (scoped to selected date range) ——
    aggregateSummary(
      JobApplication,
      [
        { key: 'pending', condition: { $eq: ['$status', 'Pending'] } },
        { key: 'shortlisted', condition: { $eq: ['$status', 'Shortlisted'] } },
        { key: 'interview', condition: { $eq: ['$status', 'Interview'] } },
        { key: 'rejected', condition: { $eq: ['$status', 'Rejected'] } },
        { key: 'selected', condition: { $eq: ['$status', 'Selected'] } },
      ],
      createdInRangeMatch,
    ),
    aggregateSummary(
      Contact,
      [
        { key: 'new', condition: { $eq: ['$status', 'new'] } },
        { key: 'inProgress', condition: { $eq: ['$status', 'in-progress'] } },
        { key: 'resolved', condition: { $eq: ['$status', 'resolved'] } },
        { key: 'archived', condition: { $eq: ['$status', 'archived'] } },
      ],
      createdInRangeMatch,
    ),
    aggregateSummary(
      Newsletter,
      [
        { key: 'subscribed', condition: { $eq: ['$status', 'subscribed'] } },
        { key: 'unsubscribed', condition: { $eq: ['$status', 'unsubscribed'] } },
      ],
      createdInRangeMatch,
    ),
    aggregateSummary(FAQModel, [
      { key: 'active', condition: { $eq: ['$status', 'active'] } },
      { key: 'inactive', condition: { $eq: ['$status', 'inactive'] } },
      { key: 'featured', condition: { $eq: ['$featured', true] } },
    ]),
    aggregateSummary(Office, [
      { key: 'active', condition: { $eq: ['$isActive', true] } },
      { key: 'inactive', condition: { $eq: ['$isActive', false] } },
    ]),
    aggregateSummary(Admin, []),
    aggregateSummary(
      Job,
      [
        { key: 'active', condition: { $eq: ['$status', 'active'] } },
        { key: 'closed', condition: { $eq: ['$status', 'closed'] } },
        { key: 'draft', condition: { $eq: ['$status', 'draft'] } },
        { key: 'featured', condition: { $eq: ['$featured', true] } },
      ],
      createdInRangeMatch,
    ),
    aggregateMonthlySeries(Service, analyticsBuckets),
    aggregateMonthlySeries(Solution, analyticsBuckets),
    aggregateMonthlySeries(Industry, analyticsBuckets),
    aggregateMonthlySeries(ProjectModel, analyticsBuckets),
    aggregateMonthlySeries(Job, analyticsBuckets),
    aggregateMonthlySeries(JobApplication, analyticsBuckets),
    aggregateMonthlySeries(Contact, analyticsBuckets),
    aggregateMonthlySeries(Newsletter, analyticsBuckets),
    // Inventory KPI sparklines — fixed 6-month window, ignore date filter
    aggregateMonthlySeries(Service, inventoryBuckets),
    aggregateMonthlySeries(Solution, inventoryBuckets),
    aggregateMonthlySeries(Industry, inventoryBuckets),
    aggregateMonthlySeries(ProjectModel, inventoryBuckets),
    aggregateMonthlySeries(FAQModel, inventoryBuckets),
    aggregateMonthlySeries(Admin, inventoryBuckets, {}),
    aggregateMonthlySeries(Service, analyticsBuckets, { isDeleted: { $ne: true } }, 'updatedAt'),
    aggregateMonthlySeries(Solution, analyticsBuckets, { isDeleted: { $ne: true } }, 'updatedAt'),
    aggregateMonthlySeries(Industry, analyticsBuckets, { isDeleted: { $ne: true } }, 'updatedAt'),
    aggregateMonthlySeries(ProjectModel, analyticsBuckets, { isDeleted: { $ne: true } }, 'updatedAt'),
    // Previous-equivalent period create counts (analytics trends only)
    aggregateSummary(Job, [], createdInPreviousMatch),
    aggregateSummary(JobApplication, [], createdInPreviousMatch),
    aggregateSummary(Contact, [], createdInPreviousMatch),
    aggregateSummary(Newsletter, [], createdInPreviousMatch),
    getRecentActivity(RECENT_ACTIVITY_LIMIT, analyticsRange),
    getRecentContacts(RECENT_LIST_LIMIT, analyticsRange),
    getRecentApplications(RECENT_LIST_LIMIT, analyticsRange),
    getRecentNewsletter(RECENT_LIST_LIMIT, analyticsRange),
    getRecentPortfolio(RECENT_LIST_LIMIT, analyticsRange),
    getRecentCmsUpdates(RECENT_LIST_LIMIT, analyticsRange),
    getLatestAdminActivity(RECENT_LIST_LIMIT, analyticsRange),
    PagesCmsConfig.findOne({ configKey: 'global' }).lean(),
    getStorageUsage(),
    getDatabaseStats(),
    getAverageContactResponseHours(),
  ]);

  const cmsUpdatesSeries = mergeMonthlySeries([
    servicesUpdatedSeries,
    solutionsUpdatedSeries,
    industriesUpdatedSeries,
    projectsUpdatedSeries,
  ]);

  const seoAnalytics = await getSeoAnalytics(pagesCmsDoc as IPagesCmsConfig | null);
  const systemStatus = buildSystemStatus();
  const websiteHealth = getWebsiteHealth(
    pagesCmsDoc as IPagesCmsConfig | null,
    seoAnalytics,
    systemStatus,
  );

  if (storageUsage?.detail) {
    const storageItem = systemStatus.find((item) => item.key === 'storage');
    if (storageItem) {
      storageItem.detail = storageUsage.detail;
      if (!storageUsage.available) {
        storageItem.status = 'offline';
        storageItem.healthPercent = 0;
      }
    }
  }

  /**
   * Recent Activity must use the same createdAt range filter as analytics KPI cards.
   * CMS updates (updatedAt) are returned separately as `recentCmsUpdates` — merging them
   * here previously made updated inventory look like "today's activity" while create-based
   * KPIs (applications/jobs/contacts/newsletter) correctly stayed at 0.
   */
  const recentActivity = recentActivityRaw;

  // Inventory sparklines: MoM within fixed 6-month window (independent of date filter)
  const inventoryMoM = (series: MetricSeriesPoint[]) =>
    calculatePeriodTrend(series.at(-1)?.value ?? 0, series.at(-2)?.value ?? 0);

  const metrics = [
    buildMetric(
      'services',
      'Total Services',
      servicesSummary.total,
      buildSeriesDescription(`Active ${servicesSummary.active}`, [`Draft ${servicesSummary.draft}`, `Featured ${servicesSummary.featured}`]),
      servicesInvSeries,
      inventoryMoM(servicesInvSeries),
    ),
    buildMetric(
      'industries',
      'Total Industries',
      industriesSummary.total,
      buildSeriesDescription(`Active ${industriesSummary.active}`, [`Draft ${industriesSummary.draft}`, `Featured ${industriesSummary.featured}`]),
      industriesInvSeries,
      inventoryMoM(industriesInvSeries),
    ),
    buildMetric(
      'solutions',
      'Total Solutions',
      solutionsSummary.total,
      buildSeriesDescription(`Active ${solutionsSummary.active}`, [`Draft ${solutionsSummary.draft}`, `Featured ${solutionsSummary.featured}`]),
      solutionsInvSeries,
      inventoryMoM(solutionsInvSeries),
    ),
    buildMetric(
      'projects',
      'Portfolio Projects',
      projectsSummary.total,
      buildSeriesDescription(`Completed ${projectsSummary.completed}`, [`In progress ${projectsSummary.inProgress}`, `Featured ${projectsSummary.featured}`]),
      projectsInvSeries,
      inventoryMoM(projectsInvSeries),
    ),
    buildMetric(
      'faqs',
      'Total FAQs',
      faqsSummary.total,
      buildSeriesDescription(`Active ${faqsSummary.active}`, [`Inactive ${faqsSummary.inactive}`, `Featured ${faqsSummary.featured}`]),
      faqsInvSeries,
      inventoryMoM(faqsInvSeries),
    ),
    buildMetric(
      'jobs',
      'Total Jobs',
      jobsInRangeSummary.total,
      buildSeriesDescription(`Active ${jobsInRangeSummary.active}`, [`Closed ${jobsInRangeSummary.closed}`, `Featured ${jobsInRangeSummary.featured}`]),
      jobsSeries,
      periodTrend(jobsInRangeSummary.total, prevJobsCreated.total),
    ),
    buildMetric(
      'applications',
      'Total Applications',
      applicationsSummary.total,
      buildSeriesDescription(`Pending ${applicationsSummary.pending}`, [`Shortlisted ${applicationsSummary.shortlisted}`, `Interview ${applicationsSummary.interview}`]),
      applicationsSeries,
      periodTrend(applicationsSummary.total, prevApplicationsCreated.total),
    ),
    buildMetric(
      'contacts',
      'Contact Inquiries',
      contactsSummary.total,
      buildSeriesDescription(`New ${contactsSummary.new}`, [`Resolved ${contactsSummary.resolved}`, `Archived ${contactsSummary.archived}`]),
      contactsSeries,
      periodTrend(contactsSummary.total, prevContactsCreated.total),
    ),
    buildMetric(
      'newsletter',
      'Newsletter Subscribers',
      newslettersSummary.total,
      buildSeriesDescription(`Subscribed ${newslettersSummary.subscribed}`, [`Unsubscribed ${newslettersSummary.unsubscribed}`]),
      newslettersSeries,
      periodTrend(newslettersSummary.total, prevNewslettersCreated.total),
    ),
    buildMetric(
      'admins',
      'Active Admins',
      adminsSummary.total,
      buildSeriesDescription(`${adminsSummary.total} registered`, [`Offices ${officesSummary.active}`]),
      adminsInvSeries,
      inventoryMoM(adminsInvSeries),
    ),
  ];

  const monthlyGrowth = buildExtendedMonthlyGrowth({
    contacts: contactsSeries,
    applications: applicationsSeries,
    subscribers: newslettersSeries,
    services: servicesSeries,
    solutions: solutionsSeries,
    industries: industriesSeries,
    jobs: jobsSeries,
    portfolio: projectsSeries,
    cmsUpdates: cmsUpdatesSeries,
  });

  const inboundTotal =
    contactsSummary.total + applicationsSummary.total + newslettersSummary.subscribed;

  const prevInboundTotal =
    prevContactsCreated.total + prevApplicationsCreated.total + prevNewslettersCreated.total;

  const platformOverview = {
    metrics: [
      {
        key: 'inbound',
        label: 'Total Inbound',
        value: inboundTotal,
        ...asPlatformTrend(periodTrend(inboundTotal, prevInboundTotal)),
      },
      {
        key: 'contacts',
        label: 'Contacts',
        value: contactsSummary.total,
        ...asPlatformTrend(periodTrend(contactsSummary.total, prevContactsCreated.total)),
      },
      {
        key: 'applications',
        label: 'Applications',
        value: applicationsSummary.total,
        ...asPlatformTrend(periodTrend(applicationsSummary.total, prevApplicationsCreated.total)),
      },
      {
        key: 'subscribers',
        label: 'Subscribers',
        value: newslettersSummary.subscribed,
        ...asPlatformTrend(periodTrend(newslettersSummary.total, prevNewslettersCreated.total)),
      },
    ],
    series: monthlyGrowth.map((row) => ({
      label: row.label,
      contacts: row.contacts,
      applications: row.applications,
      subscribers: row.subscribers,
      content: row.content,
      cmsUpdates: row.cmsUpdates,
    })),
  };

  return {
    generatedAt: new Date().toISOString(),
    metrics,
    platformOverview,
    contentDistribution: toStatusData([
      { name: 'Services', value: servicesSummary.total },
      { name: 'Solutions', value: solutionsSummary.total },
      { name: 'Industries', value: industriesSummary.total },
      { name: 'Portfolio', value: projectsSummary.total },
      { name: 'Jobs', value: jobsSummary.total },
      { name: 'FAQs', value: faqsSummary.total },
    ]),
    applicationStatus: toStatusData([
      { name: 'Pending', value: applicationsSummary.pending },
      { name: 'Shortlisted', value: applicationsSummary.shortlisted },
      { name: 'Interview', value: applicationsSummary.interview },
      { name: 'Rejected', value: applicationsSummary.rejected },
      { name: 'Selected', value: applicationsSummary.selected },
    ]),
    contactStatus: toStatusData([
      { name: 'New', value: contactsSummary.new },
      { name: 'In Progress', value: contactsSummary.inProgress },
      { name: 'Resolved', value: contactsSummary.resolved },
      { name: 'Archived', value: contactsSummary.archived },
    ]),
    jobStatus: toStatusData([
      { name: 'Active', value: jobsInRangeSummary.active },
      { name: 'Closed', value: jobsInRangeSummary.closed },
      { name: 'Draft', value: jobsInRangeSummary.draft },
    ]),
    projectStatus: toStatusData([
      { name: 'Completed', value: projectsSummary.completed },
      { name: 'In Progress', value: projectsSummary.inProgress },
      { name: 'Coming Soon', value: projectsSummary.comingSoon },
    ]),
    newsletterStatus: toStatusData([
      { name: 'Subscribed', value: newslettersSummary.subscribed },
      { name: 'Unsubscribed', value: newslettersSummary.unsubscribed },
    ]),
    monthlyGrowth,
    recentActivity,
    recentContacts,
    recentApplications,
    recentNewsletter,
    recentPortfolio,
    recentCmsUpdates,
    latestAdminActivity,
    seoAnalytics,
    websiteHealth,
    contentStatistics: {
      offices: {
        total: officesSummary.total,
        active: officesSummary.active,
        inactive: officesSummary.inactive,
      },
      admins: { total: adminsSummary.total },
      pagesCms: {
        lastUpdatedAt: pagesCmsDoc?.updatedAt ? new Date(pagesCmsDoc.updatedAt).toISOString() : null,
        updatedBy: pagesCmsDoc?.updatedBy ?? '',
      },
      featured: {
        services: servicesSummary.featured,
        solutions: solutionsSummary.featured,
        industries: industriesSummary.featured,
        projects: projectsSummary.featured,
        jobs: jobsSummary.featured,
        faqs: faqsSummary.featured,
      },
      published: {
        services: servicesSummary.active,
        solutions: solutionsSummary.active,
        industries: industriesSummary.active,
      },
      draft: {
        services: servicesSummary.draft,
        solutions: solutionsSummary.draft,
        industries: industriesSummary.draft,
        jobs: jobsSummary.draft,
      },
      hidden: {
        faqs: faqsSummary.inactive,
      },
      archived: {
        contacts: contactsSummary.archived,
      },
      averageContactResponseHours,
    },
    systemStatus,
    storageUsage,
    databaseStats,
  };
}
