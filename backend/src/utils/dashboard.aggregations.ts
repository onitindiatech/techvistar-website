import type { Model } from 'mongoose';

export type DashboardBucket = {
  key: string;
  label: string;
  start: Date;
  end: Date;
};

export type SummaryCounter = {
  key: string;
  condition: Record<string, unknown>;
};

export type MetricSeriesPoint = {
  label: string;
  value: number;
};

export type DashboardSummaryRow = Record<string, number> & { total: number };

export const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const DASHBOARD_MONTHS = 6;
export const RECENT_LIST_LIMIT = 5;
export const RECENT_ACTIVITY_LIMIT = 10;

export type DashboardDateRange = {
  from: Date;
  to: Date;
};

export type AnalyticsGranularity = 'hour' | 'day' | 'week' | 'month';

/** Parse optional `from` / `to` query params. Returns null when missing/invalid. */
export function parseDashboardDateRange(
  fromRaw: unknown,
  toRaw: unknown,
): DashboardDateRange | null {
  if (typeof fromRaw !== 'string' || typeof toRaw !== 'string') return null;
  const from = new Date(fromRaw);
  const to = new Date(toRaw);
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime()) || from > to) return null;
  return { from, to };
}

export function dateFieldMatch(
  range: DashboardDateRange | null | undefined,
  field: 'createdAt' | 'updatedAt' = 'createdAt',
): Record<string, unknown> {
  if (!range) return {};
  return { [field]: { $gte: range.from, $lte: range.to } };
}

const DAY_MS = 86_400_000;
const HOUR_MS = 3_600_000;
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Previous equivalent window for period-over-period trends.
 * Prefer calendar presets when provided; otherwise use equal-length prior window.
 */
export function buildPreviousEquivalentRange(
  range: DashboardDateRange,
  preset?: string | null,
): DashboardDateRange {
  switch (preset) {
    case 'thisMonth':
    case 'lastMonth': {
      // Shift by one calendar month using the request bounds (client local→ISO), not UTC midnight.
      const from = new Date(range.from);
      const to = new Date(range.to);
      from.setUTCMonth(from.getUTCMonth() - 1);
      to.setUTCMonth(to.getUTCMonth() - 1);
      return { from, to };
    }
    default: {
      // Equal-length prior window. Preserves client local day boundaries sent as ISO
      // (e.g. IST Today 18:30Z→18:29Z maps to Yesterday 18:30Z→18:29Z).
      const duration = Math.max(0, range.to.getTime() - range.from.getTime());
      const to = new Date(range.from.getTime() - 1);
      const from = new Date(to.getTime() - duration);
      return { from, to };
    }
  }
}

export function resolveAnalyticsGranularity(range?: DashboardDateRange | null): AnalyticsGranularity {
  if (!range) return 'month';
  const spanMs = Math.max(0, range.to.getTime() - range.from.getTime());
  const spanHours = spanMs / HOUR_MS;
  const spanDays = spanMs / DAY_MS;

  if (spanHours <= 48) return 'hour';
  if (spanDays <= 45) return 'day';
  if (spanDays <= 120) return 'week';
  return 'month';
}

export function buildMonthBuckets(monthCount = DASHBOARD_MONTHS): DashboardBucket[] {
  const buckets: DashboardBucket[] = [];
  const now = new Date();

  for (let offset = monthCount - 1; offset >= 0; offset -= 1) {
    const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - offset, 1));
    const key = `${start.getUTCFullYear()}-${String(start.getUTCMonth() + 1).padStart(2, '0')}`;

    buckets.push({
      key,
      label: MONTH_LABELS[start.getUTCMonth()],
      start,
      end: new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 1)),
    });
  }

  return buckets;
}

/** @deprecated Prefer buildAnalyticsBuckets. Month-only buckets overlapping range. */
export function buildMonthBucketsForRange(range?: DashboardDateRange | null): DashboardBucket[] {
  if (!range) return buildMonthBuckets();

  const buckets: DashboardBucket[] = [];
  let cursor = new Date(Date.UTC(range.from.getUTCFullYear(), range.from.getUTCMonth(), 1));
  const last = new Date(Date.UTC(range.to.getUTCFullYear(), range.to.getUTCMonth(), 1));
  let guard = 0;
  while (cursor <= last && guard < 24) {
    const key = `${cursor.getUTCFullYear()}-${String(cursor.getUTCMonth() + 1).padStart(2, '0')}`;
    buckets.push({
      key,
      label: MONTH_LABELS[cursor.getUTCMonth()],
      start: cursor,
      end: new Date(Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth() + 1, 1)),
    });
    cursor = new Date(Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth() + 1, 1));
    guard += 1;
  }
  return buckets.length > 0 ? buckets : buildMonthBuckets(1);
}

/**
 * Adaptive analytics buckets for charts/sparklines:
 * ≤48h → hourly | ≤45d → daily | ≤120d → weekly | else monthly
 */
export function buildAnalyticsBuckets(range?: DashboardDateRange | null): DashboardBucket[] {
  if (!range) return buildMonthBuckets();

  const granularity = resolveAnalyticsGranularity(range);

  if (granularity === 'hour') {
    const buckets: DashboardBucket[] = [];
    const start = new Date(range.from);
    start.setUTCMinutes(0, 0, 0);
    const endLimit = range.to.getTime();
    for (let cursor = start.getTime(); cursor <= endLimit && buckets.length < 72; cursor += HOUR_MS) {
      const hourStart = new Date(cursor);
      const key = hourStart.toISOString().slice(0, 13); // YYYY-MM-DDTHH
      buckets.push({
        key,
        label: `${String(hourStart.getUTCHours()).padStart(2, '0')}:00`,
        start: hourStart,
        end: new Date(cursor + HOUR_MS),
      });
    }
    return buckets.length > 0 ? buckets : buildMonthBuckets(1);
  }

  if (granularity === 'day') {
    const buckets: DashboardBucket[] = [];
    const startDay = new Date(Date.UTC(range.from.getUTCFullYear(), range.from.getUTCMonth(), range.from.getUTCDate()));
    const endDay = new Date(Date.UTC(range.to.getUTCFullYear(), range.to.getUTCMonth(), range.to.getUTCDate()));
    for (let cursor = startDay; cursor <= endDay; cursor = new Date(cursor.getTime() + DAY_MS)) {
      const key = cursor.toISOString().slice(0, 10);
      buckets.push({
        key,
        label: `${DAY_LABELS[cursor.getUTCDay()]} ${cursor.getUTCDate()}`,
        start: cursor,
        end: new Date(cursor.getTime() + DAY_MS),
      });
    }
    return buckets.length > 0 ? buckets : buildMonthBuckets(1);
  }

  if (granularity === 'week') {
    const buckets: DashboardBucket[] = [];
    const start = startOfUtcWeek(range.from);
    const end = range.to;
    for (let cursor = start; cursor <= end && buckets.length < 26; cursor = new Date(cursor.getTime() + 7 * DAY_MS)) {
      const weekEnd = new Date(cursor.getTime() + 7 * DAY_MS);
      const { year, week } = isoWeekParts(cursor);
      const key = `${year}-W${String(week).padStart(2, '0')}`;
      buckets.push({
        key,
        label: `W${week}`,
        start: cursor,
        end: weekEnd,
      });
    }
    return buckets.length > 0 ? buckets : buildMonthBuckets(1);
  }

  // monthly
  const buckets: DashboardBucket[] = [];
  let cursor = new Date(Date.UTC(range.from.getUTCFullYear(), range.from.getUTCMonth(), 1));
  const last = new Date(Date.UTC(range.to.getUTCFullYear(), range.to.getUTCMonth(), 1));
  let guard = 0;
  while (cursor <= last && guard < 24) {
    const key = `${cursor.getUTCFullYear()}-${String(cursor.getUTCMonth() + 1).padStart(2, '0')}`;
    buckets.push({
      key,
      label: MONTH_LABELS[cursor.getUTCMonth()],
      start: cursor,
      end: new Date(Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth() + 1, 1)),
    });
    cursor = new Date(Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth() + 1, 1));
    guard += 1;
  }
  return buckets.length > 0 ? buckets : buildMonthBuckets(1);
}

function startOfUtcWeek(date: Date): Date {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = d.getUTCDay() || 7; // Mon=1..Sun=7 style → treat Sun as 7
  if (day !== 1) d.setUTCDate(d.getUTCDate() - (day - 1));
  return d;
}

function isoWeekParts(date: Date): { year: number; week: number } {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d.getTime() - yearStart.getTime()) / DAY_MS + 1) / 7);
  return { year: d.getUTCFullYear(), week };
}

export async function aggregateSummary(
  model: Model<unknown>,
  counters: SummaryCounter[] = [],
  match: Record<string, unknown> = { isDeleted: { $ne: true } },
): Promise<DashboardSummaryRow> {
  const groupStage = { _id: null, total: { $sum: 1 } } as Record<string, unknown>;

  for (const counter of counters) {
    groupStage[counter.key] = { $sum: { $cond: [counter.condition, 1, 0] } };
  }

  const [row] = await model.aggregate([
    { $match: match },
    { $group: groupStage as { _id: null; total: { $sum: 1 }; [key: string]: unknown } },
  ]);

  return {
    total: Number(row?.total ?? 0),
    ...counters.reduce<Record<string, number>>((accumulator, counter) => {
      accumulator[counter.key] = Number(row?.[counter.key] ?? 0);
      return accumulator;
    }, {}),
  };
}

export async function aggregateMonthlySeries(
  model: Model<unknown>,
  monthBuckets: DashboardBucket[],
  match: Record<string, unknown> = { isDeleted: { $ne: true } },
  dateField: 'createdAt' | 'updatedAt' = 'createdAt',
): Promise<MetricSeriesPoint[]> {
  const [firstBucket] = monthBuckets;
  const lastBucket = monthBuckets[monthBuckets.length - 1];
  if (!firstBucket || !lastBucket) return [];

  const sampleKey = firstBucket.key;
  const granularity: AnalyticsGranularity =
    sampleKey.includes('T') ? 'hour'
      : sampleKey.includes('-W') ? 'week'
        : sampleKey.length === 10 ? 'day'
          : 'month';

  const groupId =
    granularity === 'hour'
      ? { $dateToString: { format: '%Y-%m-%dT%H', date: `$${dateField}`, timezone: 'UTC' } }
      : granularity === 'day'
        ? { $dateToString: { format: '%Y-%m-%d', date: `$${dateField}`, timezone: 'UTC' } }
        : granularity === 'week'
          ? {
              $concat: [
                { $toString: { $isoWeekYear: `$${dateField}` } },
                '-W',
                {
                  $cond: [
                    { $lt: [{ $isoWeek: `$${dateField}` }, 10] },
                    { $concat: ['0', { $toString: { $isoWeek: `$${dateField}` } }] },
                    { $toString: { $isoWeek: `$${dateField}` } },
                  ],
                },
              ],
            }
          : {
              year: { $year: `$${dateField}` },
              month: { $month: `$${dateField}` },
            };

  const rows = await model.aggregate([
    {
      $match: {
        ...match,
        [dateField]: {
          $gte: firstBucket.start,
          $lt: lastBucket.end,
        },
      },
    },
    {
      $group: {
        _id: groupId,
        value: { $sum: 1 },
      },
    },
  ]);

  const counts = new Map<string, number>();
  for (const row of rows) {
    if (granularity === 'month') {
      const key = `${row._id.year}-${String(row._id.month).padStart(2, '0')}`;
      counts.set(key, Number(row.value ?? 0));
    } else {
      counts.set(String(row._id), Number(row.value ?? 0));
    }
  }

  return monthBuckets.map((bucket) => ({
    label: bucket.label,
    value: counts.get(bucket.key) ?? 0,
  }));
}

/**
 * Period-over-period trend.
 * ((current - previous) / previous) × 100
 * Never returns fake +100% when previous is 0 — uses status instead.
 */
export type PeriodTrendResult = {
  value: number | null;
  status: 'ok' | 'new' | 'none';
};

export function calculatePeriodTrend(current: number, previous: number): PeriodTrendResult {
  if (previous === 0 && current === 0) {
    return { value: null, status: 'none' };
  }
  if (previous === 0 && current > 0) {
    return { value: null, status: 'new' };
  }
  return {
    value: Number((((current - previous) / previous) * 100).toFixed(1)),
    status: 'ok',
  };
}

/** @deprecated Prefer calculatePeriodTrend with previous-equivalent totals. */
export function calculateTrend(series: MetricSeriesPoint[]): number {
  const last = series.at(-1)?.value ?? 0;
  const prev = series.at(-2)?.value ?? 0;
  const result = calculatePeriodTrend(last, prev);
  return result.value ?? 0;
}

export function buildMonthlyGrowth(
  contactsSeries: MetricSeriesPoint[],
  applicationsSeries: MetricSeriesPoint[],
  subscribersSeries: MetricSeriesPoint[],
): Array<{ label: string; contacts: number; applications: number; subscribers: number }> {
  return contactsSeries.map((point, index) => ({
    label: point.label,
    contacts: point.value,
    applications: applicationsSeries[index]?.value ?? 0,
    subscribers: subscribersSeries[index]?.value ?? 0,
  }));
}

export type ExtendedMonthlyGrowthPoint = {
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
};

export function buildExtendedMonthlyGrowth(series: {
  contacts: MetricSeriesPoint[];
  applications: MetricSeriesPoint[];
  subscribers: MetricSeriesPoint[];
  services: MetricSeriesPoint[];
  solutions: MetricSeriesPoint[];
  industries: MetricSeriesPoint[];
  jobs: MetricSeriesPoint[];
  portfolio: MetricSeriesPoint[];
  cmsUpdates: MetricSeriesPoint[];
}): ExtendedMonthlyGrowthPoint[] {
  return series.contacts.map((point, index) => {
    const services = series.services[index]?.value ?? 0;
    const solutions = series.solutions[index]?.value ?? 0;
    const industries = series.industries[index]?.value ?? 0;
    const jobs = series.jobs[index]?.value ?? 0;
    const portfolio = series.portfolio[index]?.value ?? 0;

    return {
      label: point.label,
      contacts: point.value,
      applications: series.applications[index]?.value ?? 0,
      subscribers: series.subscribers[index]?.value ?? 0,
      services,
      solutions,
      industries,
      jobs,
      portfolio,
      content: services + solutions + industries + jobs + portfolio,
      cmsUpdates: series.cmsUpdates[index]?.value ?? 0,
    };
  });
}

export function sumSeriesValues(series: MetricSeriesPoint[]): number {
  return series.reduce((sum, point) => sum + point.value, 0);
}

export function mergeMonthlySeries(seriesList: MetricSeriesPoint[][]): MetricSeriesPoint[] {
  const [first] = seriesList;
  if (!first?.length) return [];

  return first.map((point, index) => ({
    label: point.label,
    value: seriesList.reduce((sum, series) => sum + (series[index]?.value ?? 0), 0),
  }));
}

export function toStatusData(rows: Array<{ name: string; value: number }>): Array<{ name: string; value: number }> {
  return rows.filter((item) => item.value > 0);
}
