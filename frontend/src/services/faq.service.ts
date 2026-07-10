/**
 * @file src/services/faq.service.ts
 * @description Client service for retrieving and managing FAQ CMS data.
 */

import { adminFetch, getApiBaseUrl, publicFetch, readApiError } from '@/lib/api';

interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  category?: string;
  pageContext?: string;
  trash?: boolean | string;
  featured?: boolean | string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Fetches all active FAQs from the backend, sorted by displayOrder.
 */
export async function getActiveFAQs(): Promise<any[]> {
  const response = await publicFetch(`${getApiBaseUrl()}/api/faqs`);
  if (!response.ok) {
    throw new Error(await readApiError(response, 'Failed to fetch FAQs'));
  }
  const result = await response.json();
  return result.data || [];
}

/**
 * Fetches all FAQs for admin panel with pagination, search, and filtering.
 */
export async function getAllFAQs(params: QueryParams = {}): Promise<{ faqs: any[]; pagination: any }> {
  const url = new URL(`${getApiBaseUrl()}/api/faqs/admin`);

  if (params.page) url.searchParams.append('page', String(params.page));
  if (params.limit) url.searchParams.append('limit', String(params.limit));
  if (params.search) url.searchParams.append('search', params.search);
  if (params.status && params.status !== 'all') url.searchParams.append('status', params.status);
  if (params.category && params.category !== 'all') url.searchParams.append('category', params.category);
  if (params.pageContext && params.pageContext !== 'all') url.searchParams.append('pageContext', params.pageContext);
  if (params.trash !== undefined) url.searchParams.append('trash', String(params.trash));
  if (params.featured !== undefined && params.featured !== 'all') url.searchParams.append('featured', String(params.featured));
  if (params.sortBy) url.searchParams.append('sortBy', params.sortBy);
  if (params.sortOrder) url.searchParams.append('sortOrder', params.sortOrder);

  const response = await adminFetch(url.toString());
  if (!response.ok) {
    throw new Error(await readApiError(response, 'Failed to fetch all FAQs'));
  }
  const result = await response.json();
  return {
    faqs: result.data || [],
    pagination: result.pagination || {
      total: (result.data || []).length,
      page: params.page || 1,
      limit: params.limit || 10,
      totalPages: 1,
    },
  };
}

/**
 * Creates a new FAQ entry (admin).
 */
export async function createFAQ(data: any): Promise<any> {
  const response = await adminFetch(`${getApiBaseUrl()}/api/faqs/admin`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(await readApiError(response, 'Failed to create FAQ'));
  }
  const result = await response.json();
  return result.data;
}

/**
 * Updates an existing FAQ entry (admin).
 */
export async function updateFAQ(id: string, data: any): Promise<any> {
  const response = await adminFetch(`${getApiBaseUrl()}/api/faqs/admin/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(await readApiError(response, 'Failed to update FAQ'));
  }
  const result = await response.json();
  return result.data;
}

/**
 * Soft-deletes a FAQ entry (admin).
 */
export async function deleteFAQ(id: string): Promise<void> {
  const response = await adminFetch(`${getApiBaseUrl()}/api/faqs/admin/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(await readApiError(response, 'Failed to delete FAQ'));
  }
}

/**
 * Restores a soft-deleted FAQ (admin).
 */
export async function restoreFAQ(id: string): Promise<void> {
  const response = await adminFetch(`${getApiBaseUrl()}/api/faqs/admin/${id}/restore`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error(await readApiError(response, 'Failed to restore FAQ'));
  }
}

/**
 * Permanently deletes a FAQ (admin).
 */
export async function permanentlyDeleteFAQ(id: string): Promise<void> {
  const response = await adminFetch(`${getApiBaseUrl()}/api/faqs/admin/${id}/permanent`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(await readApiError(response, 'Failed to permanently delete FAQ'));
  }
}

/**
 * Bulk soft-deletes FAQs (admin).
 */
export async function bulkDeleteFAQs(ids: string[]): Promise<void> {
  const response = await adminFetch(`${getApiBaseUrl()}/api/faqs/admin/bulk-delete`, {
    method: 'POST',
    body: JSON.stringify({ ids }),
  });
  if (!response.ok) {
    throw new Error(await readApiError(response, 'Failed to bulk delete FAQs'));
  }
}

/**
 * Bulk restores soft-deleted FAQs (admin).
 */
export async function bulkRestoreFAQs(ids: string[]): Promise<void> {
  const response = await adminFetch(`${getApiBaseUrl()}/api/faqs/admin/bulk-restore`, {
    method: 'POST',
    body: JSON.stringify({ ids }),
  });
  if (!response.ok) {
    throw new Error(await readApiError(response, 'Failed to bulk restore FAQs'));
  }
}

/**
 * Bulk updates the status of FAQs (admin).
 */
export async function bulkUpdateStatus(ids: string[], status: 'active' | 'inactive'): Promise<void> {
  const response = await adminFetch(`${getApiBaseUrl()}/api/faqs/admin/bulk-status`, {
    method: 'POST',
    body: JSON.stringify({ ids, status }),
  });
  if (!response.ok) {
    throw new Error(await readApiError(response, 'Failed to bulk update status'));
  }
}
