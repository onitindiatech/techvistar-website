import { adminFetch, getApiBaseUrl, readApiError } from '@/lib/api';
import type { DashboardAnalytics } from '@/types/dashboard';

interface ApiEnvelope<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export type DashboardAnalyticsQuery = {
  from?: Date | string;
  to?: Date | string;
  preset?: string;
};

export async function getDashboardAnalytics(
  query?: DashboardAnalyticsQuery,
): Promise<DashboardAnalytics> {
  const params = new URLSearchParams();
  if (query?.from) {
    params.set('from', query.from instanceof Date ? query.from.toISOString() : query.from);
  }
  if (query?.to) {
    params.set('to', query.to instanceof Date ? query.to.toISOString() : query.to);
  }
  if (query?.preset) {
    params.set('preset', query.preset);
  }
  const qs = params.toString();
  const response = await adminFetch(
    `${getApiBaseUrl()}/api/admin/dashboard${qs ? `?${qs}` : ''}`,
  );

  if (!response.ok) {
    throw new Error(await readApiError(response, 'Failed to load dashboard analytics'));
  }

  const payload = (await response.json()) as ApiEnvelope<DashboardAnalytics>;
  return payload.data;
}
