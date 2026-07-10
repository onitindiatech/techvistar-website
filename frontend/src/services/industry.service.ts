/**
 * @file src/services/industry.service.ts
 * @description Client service for retrieving and managing Industry CMS data.
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
 * Fetches all active industries from the backend API.
 */
export async function getActiveIndustries(category?: string): Promise<any[]> {
  const url = new URL(`${getApiBaseUrl()}/api/industries`);
  if (category && category !== 'All') {
    url.searchParams.append('category', category);
  }

  const response = await publicFetch(url.toString());
  if (!response.ok) {
    throw new Error(await readApiError(response, 'Failed to fetch industries'));
  }
  const result = await response.json();
  return Array.isArray(result.data) ? result.data : [];
}

/**
 * Fetches all industries (active + drafts) for admin panel with pagination, search, and filtering.
 */
export async function getAllIndustries(params: QueryParams = {}): Promise<{ industries: any[]; pagination: any }> {
  const url = new URL(`${getApiBaseUrl()}/api/industries/admin`);
  
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
    throw new Error(await readApiError(response, 'Failed to fetch all industries'));
  }
  const result = await response.json();
  return {
    industries: result.data || [],
    pagination: result.pagination || {
      total: (result.data || []).length,
      page: params.page || 1,
      limit: params.limit || 10,
      totalPages: 1
    }
  };
}

/**
 * Fetches details for a single active industry by its slug.
 * @param slug Industry slug
 */
export async function getIndustryBySlug(slug: string): Promise<any> {
  const response = await publicFetch(`${getApiBaseUrl()}/api/industries/${slug}`);
  if (!response.ok) {
    throw new Error(await readApiError(response, 'Failed to fetch industry details'));
  }
  const result = await response.json();
  return result.data;
}

/**
 * Creates a new industry listing (admin).
 */
export async function createIndustry(data: any): Promise<any> {
  const response = await adminFetch(`${getApiBaseUrl()}/api/industries/admin`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(await readApiError(response, 'Failed to create industry'));
  }
  const result = await response.json();
  return result.data;
}

/**
 * Updates an existing industry listing (admin).
 */
export async function updateIndustry(id: string, data: any): Promise<any> {
  const response = await adminFetch(`${getApiBaseUrl()}/api/industries/admin/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(await readApiError(response, 'Failed to update industry'));
  }
  const result = await response.json();
  return result.data;
}

/**
 * Deletes an industry listing (admin).
 */
export async function deleteIndustry(id: string): Promise<void> {
  const response = await adminFetch(`${getApiBaseUrl()}/api/industries/admin/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(await readApiError(response, 'Failed to delete industry'));
  }
}

/**
 * Restores a soft-deleted industry (admin).
 */
export async function restoreIndustry(id: string): Promise<void> {
  const response = await adminFetch(`${getApiBaseUrl()}/api/industries/admin/${id}/restore`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error(await readApiError(response, 'Failed to restore industry'));
  }
}

/**
 * Permanently deletes an industry (admin).
 */
export async function permanentlyDeleteIndustry(id: string): Promise<void> {
  const response = await adminFetch(`${getApiBaseUrl()}/api/industries/admin/${id}/permanent`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(await readApiError(response, 'Failed to permanently delete industry'));
  }
}

/**
 * Bulk soft-deletes industries (admin).
 */
export async function bulkDeleteIndustries(ids: string[]): Promise<void> {
  const response = await adminFetch(`${getApiBaseUrl()}/api/industries/admin/bulk-delete`, {
    method: 'POST',
    body: JSON.stringify({ ids }),
  });
  if (!response.ok) {
    throw new Error(await readApiError(response, 'Failed to bulk delete industries'));
  }
}

/**
 * Bulk restores soft-deleted industries (admin).
 */
export async function bulkRestoreIndustries(ids: string[]): Promise<void> {
  const response = await adminFetch(`${getApiBaseUrl()}/api/industries/admin/bulk-restore`, {
    method: 'POST',
    body: JSON.stringify({ ids }),
  });
  if (!response.ok) {
    throw new Error(await readApiError(response, 'Failed to bulk restore industries'));
  }
}

/**
 * Bulk updates the publish status of industries (admin).
 */
export async function bulkUpdateStatus(ids: string[], status: 'draft' | 'active'): Promise<void> {
  const response = await adminFetch(`${getApiBaseUrl()}/api/industries/admin/bulk-status`, {
    method: 'POST',
    body: JSON.stringify({ ids, status }),
  });
  if (!response.ok) {
    throw new Error(await readApiError(response, 'Failed to bulk update status'));
  }
}
