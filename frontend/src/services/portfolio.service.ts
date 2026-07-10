/**
 * @file src/services/portfolio.service.ts
 * @description Client service for retrieving and managing Portfolio CMS data.
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
 * Fetches all active portfolio projects from the backend.
 */
export async function getActiveProjects(): Promise<any[]> {
  const response = await publicFetch(`${getApiBaseUrl()}/api/portfolio`);
  if (!response.ok) {
    throw new Error(await readApiError(response, 'Failed to fetch portfolio projects'));
  }
  const result = await response.json();
  return Array.isArray(result.data) ? result.data : [];
}

/**
 * Fetches all portfolio projects for admin panel with pagination, search, and filtering.
 */
export async function getAllProjects(params: QueryParams = {}): Promise<{ projects: any[]; pagination: any }> {
  const url = new URL(`${getApiBaseUrl()}/api/portfolio/admin`);

  if (params.page) url.searchParams.append('page', String(params.page));
  if (params.limit) url.searchParams.append('limit', String(params.limit));
  if (params.search) url.searchParams.append('search', params.search);
  if (params.status && params.status !== 'all') url.searchParams.append('status', params.status);
  if (params.category && params.category !== 'all') url.searchParams.append('category', params.category);
  if (params.trash !== undefined) url.searchParams.append('trash', String(params.trash));
  if (params.featured !== undefined && params.featured !== 'all') url.searchParams.append('featured', String(params.featured));
  if (params.sortBy) url.searchParams.append('sortBy', params.sortBy);
  if (params.sortOrder) url.searchParams.append('sortOrder', params.sortOrder);

  const response = await adminFetch(url.toString());
  if (!response.ok) {
    throw new Error(await readApiError(response, 'Failed to fetch all projects'));
  }
  const result = await response.json();
  return {
    projects: result.data || [],
    pagination: result.pagination || {
      total: (result.data || []).length,
      page: params.page || 1,
      limit: params.limit || 10,
      totalPages: 1,
    },
  };
}

/**
 * Fetches details for a single active project by its slug.
 * @param slug Project slug identifier
 */
export async function getProjectBySlug(slug: string): Promise<any> {
  const response = await publicFetch(`${getApiBaseUrl()}/api/portfolio/${slug}`);
  if (!response.ok) {
    throw new Error(await readApiError(response, 'Failed to fetch project details'));
  }
  const result = await response.json();
  return result.data;
}

/**
 * Creates a new portfolio project (admin).
 */
export async function createProject(data: any): Promise<any> {
  const response = await adminFetch(`${getApiBaseUrl()}/api/portfolio/admin`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(await readApiError(response, 'Failed to create project'));
  }
  const result = await response.json();
  return result.data;
}

/**
 * Updates an existing portfolio project (admin).
 */
export async function updateProject(id: string, data: any): Promise<any> {
  const response = await adminFetch(`${getApiBaseUrl()}/api/portfolio/admin/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(await readApiError(response, 'Failed to update project'));
  }
  const result = await response.json();
  return result.data;
}

/**
 * Soft-deletes a portfolio project (admin).
 */
export async function deleteProject(id: string): Promise<void> {
  const response = await adminFetch(`${getApiBaseUrl()}/api/portfolio/admin/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(await readApiError(response, 'Failed to delete project'));
  }
}

/**
 * Restores a soft-deleted portfolio project (admin).
 */
export async function restoreProject(id: string): Promise<void> {
  const response = await adminFetch(`${getApiBaseUrl()}/api/portfolio/admin/${id}/restore`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error(await readApiError(response, 'Failed to restore project'));
  }
}

/**
 * Permanently deletes a portfolio project (admin).
 */
export async function permanentlyDeleteProject(id: string): Promise<void> {
  const response = await adminFetch(`${getApiBaseUrl()}/api/portfolio/admin/${id}/permanent`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(await readApiError(response, 'Failed to permanently delete project'));
  }
}

/**
 * Bulk soft-deletes portfolio projects (admin).
 */
export async function bulkDeleteProjects(ids: string[]): Promise<void> {
  const response = await adminFetch(`${getApiBaseUrl()}/api/portfolio/admin/bulk-delete`, {
    method: 'POST',
    body: JSON.stringify({ ids }),
  });
  if (!response.ok) {
    throw new Error(await readApiError(response, 'Failed to bulk delete projects'));
  }
}

/**
 * Bulk restores soft-deleted portfolio projects (admin).
 */
export async function bulkRestoreProjects(ids: string[]): Promise<void> {
  const response = await adminFetch(`${getApiBaseUrl()}/api/portfolio/admin/bulk-restore`, {
    method: 'POST',
    body: JSON.stringify({ ids }),
  });
  if (!response.ok) {
    throw new Error(await readApiError(response, 'Failed to bulk restore projects'));
  }
}

/**
 * Bulk updates project status (admin).
 */
export async function bulkUpdateStatus(
  ids: string[],
  status: 'Completed' | 'In Progress' | 'Coming Soon'
): Promise<void> {
  const response = await adminFetch(`${getApiBaseUrl()}/api/portfolio/admin/bulk-status`, {
    method: 'POST',
    body: JSON.stringify({ ids, status }),
  });
  if (!response.ok) {
    throw new Error(await readApiError(response, 'Failed to bulk update status'));
  }
}
