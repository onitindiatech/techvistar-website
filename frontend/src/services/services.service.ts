/**
 * @file src/services/services.service.ts
 * @description Client service for retrieving and managing Services CMS data.
 */

import { adminFetch, getApiBaseUrl, publicFetch, readApiError } from '@/lib/api';

interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  category?: string;
  trash?: boolean | string;
  featured?: boolean | string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Fetches all active services from the backend API.
 */
export async function getActiveServices(category?: string): Promise<any[]> {
  const url = new URL(`${getApiBaseUrl()}/api/services`);
  if (typeof category === 'string' && category && category !== 'All') {
    url.searchParams.append('category', category);
  }

  const response = await publicFetch(url.toString());
  if (!response.ok) {
    throw new Error(await readApiError(response, 'Failed to fetch services'));
  }
  const result = await response.json();
  return Array.isArray(result.data) ? result.data : [];
}

/**
 * Fetches all services (active + drafts) for admin panel with pagination, search, and filtering.
 */
export async function getAllServices(params: QueryParams = {}): Promise<{ services: any[]; pagination: any }> {
  const url = new URL(`${getApiBaseUrl()}/api/services/admin`);

  if (params.page) url.searchParams.append('page', String(params.page));
  if (params.limit) url.searchParams.append('limit', String(params.limit));
  if (params.search) url.searchParams.append('search', params.search);
  if (params.status && params.status !== 'all') url.searchParams.append('status', params.status);
  if (params.category && params.category !== 'all') url.searchParams.append('category', params.category);
  if (params.trash !== undefined) url.searchParams.append('trash', String(params.trash));
  if (params.featured !== undefined) url.searchParams.append('featured', String(params.featured));
  if (params.sortBy) url.searchParams.append('sortBy', params.sortBy);
  if (params.sortOrder) url.searchParams.append('sortOrder', params.sortOrder);

  const response = await adminFetch(url.toString());
  if (!response.ok) {
    throw new Error(await readApiError(response, 'Failed to fetch all services'));
  }
  const result = await response.json();
  return {
    services: result.data || [],
    pagination: result.pagination || {
      total: (result.data || []).length,
      page: params.page || 1,
      limit: params.limit || 10,
      totalPages: 1,
    },
  };
}

/**
 * Extracts the service slug from a `/services/:slug` nav path.
 */
export function serviceSlugFromNavPath(path: string): string | null {
  const match = path.match(/^\/services\/([^/?#]+)/);
  return match?.[1] ?? null;
}

/**
 * Keeps only nav items whose service slug is in the active (non-trashed) set.
 */
export function filterNavServicesByActiveSlugs<T extends { to: string }>(
  items: T[],
  activeSlugs: ReadonlySet<string>,
): T[] {
  return items.filter((item) => {
    const slug = serviceSlugFromNavPath(item.to);
    return slug ? activeSlugs.has(slug) : false;
  });
}

/**
 * Fetches details for a single active service by its slug.
 */
export async function getServiceBySlug(slug: string): Promise<any> {
  const response = await publicFetch(`${getApiBaseUrl()}/api/services/${slug}`);
  if (!response.ok) {
    throw new Error(await readApiError(response, 'Failed to fetch service details'));
  }
  const result = await response.json();
  return result.data;
}

export async function createService(data: any): Promise<any> {
  const response = await adminFetch(`${getApiBaseUrl()}/api/services/admin`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(await readApiError(response, 'Failed to create service'));
  }
  const result = await response.json();
  return result.data;
}

export async function updateService(id: string, data: any): Promise<any> {
  const response = await adminFetch(`${getApiBaseUrl()}/api/services/admin/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(await readApiError(response, 'Failed to update service'));
  }
  const result = await response.json();
  return result.data;
}

export async function deleteService(id: string): Promise<void> {
  const response = await adminFetch(`${getApiBaseUrl()}/api/services/admin/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(await readApiError(response, 'Failed to delete service'));
  }
}

export async function restoreService(id: string): Promise<void> {
  const response = await adminFetch(`${getApiBaseUrl()}/api/services/admin/${id}/restore`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error(await readApiError(response, 'Failed to restore service'));
  }
}

export async function permanentlyDeleteService(id: string): Promise<void> {
  const response = await adminFetch(`${getApiBaseUrl()}/api/services/admin/${id}/permanent`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(await readApiError(response, 'Failed to permanently delete service'));
  }
}

export async function bulkDeleteServices(ids: string[]): Promise<void> {
  const response = await adminFetch(`${getApiBaseUrl()}/api/services/admin/bulk-delete`, {
    method: 'POST',
    body: JSON.stringify({ ids }),
  });
  if (!response.ok) {
    throw new Error(await readApiError(response, 'Failed to bulk delete services'));
  }
}

export async function bulkRestoreServices(ids: string[]): Promise<void> {
  const response = await adminFetch(`${getApiBaseUrl()}/api/services/admin/bulk-restore`, {
    method: 'POST',
    body: JSON.stringify({ ids }),
  });
  if (!response.ok) {
    throw new Error(await readApiError(response, 'Failed to bulk restore services'));
  }
}

export async function bulkUpdateStatus(ids: string[], status: 'draft' | 'active'): Promise<void> {
  const response = await adminFetch(`${getApiBaseUrl()}/api/services/admin/bulk-status`, {
    method: 'POST',
    body: JSON.stringify({ ids, status }),
  });
  if (!response.ok) {
    throw new Error(await readApiError(response, 'Failed to bulk update status'));
  }
}
