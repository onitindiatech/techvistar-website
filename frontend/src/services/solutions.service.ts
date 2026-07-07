/**
 * @file src/services/solutions.service.ts
 * @description Client service for retrieving and managing Solutions CMS data.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

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
 * Fetches all active solutions from the backend.
 */
export async function getActiveSolutions(category?: string): Promise<any[]> {
  const url = new URL(`${API_BASE_URL}/api/solutions`);
  if (category && typeof category === 'string' && category !== 'All') {
    url.searchParams.append('category', category);
  }

  const response = await fetch(url.toString(), { cache: 'no-store' });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch solutions');
  }
  const result = await response.json();
  return Array.isArray(result.data) ? result.data : [];
}

/**
 * Fetches all solutions (active + drafts) for admin panel with optional filters.
 */
export async function getAllSolutions(params: QueryParams = {}): Promise<{ solutions: any[]; pagination: any }> {
  const url = new URL(`${API_BASE_URL}/api/solutions/admin`);

  if (params.page) url.searchParams.append('page', String(params.page));
  if (params.limit) url.searchParams.append('limit', String(params.limit));
  if (params.search) url.searchParams.append('search', params.search);
  if (params.status && params.status !== 'all') url.searchParams.append('status', params.status);
  if (params.category && params.category !== 'all') url.searchParams.append('category', params.category);
  if (params.trash !== undefined) url.searchParams.append('trash', String(params.trash));
  if (params.featured !== undefined && params.featured !== 'all') url.searchParams.append('featured', String(params.featured));
  if (params.sortBy) url.searchParams.append('sortBy', params.sortBy);
  if (params.sortOrder) url.searchParams.append('sortOrder', params.sortOrder);

  const response = await fetch(url.toString(), { credentials: 'include' });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch all solutions');
  }
  const result = await response.json();
  return {
    solutions: result.data || [],
    pagination: result.pagination || {
      total: (result.data || []).length,
      page: params.page || 1,
      limit: params.limit || 10,
      totalPages: 1,
    },
  };
}

/**
 * Fetches details for a single active solution by its slug.
 */
export async function getSolutionBySlug(slug: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/solutions/${slug}`, { cache: 'no-store' });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch solution details');
  }
  const result = await response.json();
  return result.data;
}

/**
 * Creates a new solution listing (admin).
 */
export async function createSolution(data: any): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/solutions/admin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to create solution');
  }
  const result = await response.json();
  return result.data;
}

/**
 * Updates an existing solution listing (admin).
 */
export async function updateSolution(id: string, data: any): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/solutions/admin/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update solution');
  }
  const result = await response.json();
  return result.data;
}

/**
 * Soft-deletes a solution listing (admin).
 */
export async function deleteSolution(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/solutions/admin/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to delete solution');
  }
}

/**
 * Restores a soft-deleted solution (admin).
 */
export async function restoreSolution(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/solutions/admin/${id}/restore`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to restore solution');
  }
}

/**
 * Permanently deletes a solution (admin).
 */
export async function permanentlyDeleteSolution(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/solutions/admin/${id}/permanent`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to permanently delete solution');
  }
}

/**
 * Bulk soft-deletes solutions (admin).
 */
export async function bulkDeleteSolutions(ids: string[]): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/solutions/admin/bulk-delete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
    credentials: 'include',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to bulk delete solutions');
  }
}

/**
 * Bulk restores soft-deleted solutions (admin).
 */
export async function bulkRestoreSolutions(ids: string[]): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/solutions/admin/bulk-restore`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
    credentials: 'include',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to bulk restore solutions');
  }
}

/**
 * Bulk updates the publish status of solutions (admin).
 */
export async function bulkUpdateStatus(ids: string[], status: 'draft' | 'active'): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/solutions/admin/bulk-status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids, status }),
    credentials: 'include',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to bulk update status');
  }
}
