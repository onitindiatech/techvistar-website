/**
 * @file src/services/services.service.ts
 * @description Client service for retrieving and managing Services CMS data.
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
 * Fetches all active services from the backend API.
 */
export async function getActiveServices(category?: string): Promise<any[]> {
  const url = new URL(`${API_BASE_URL}/api/services`);
  if (typeof category === 'string' && category && category !== 'All') {
    url.searchParams.append('category', category);
  }

  const response = await fetch(url.toString(), { cache: 'no-store' });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch services');
  }
  const result = await response.json();
  return Array.isArray(result.data) ? result.data : [];
}

/**
 * Fetches all services (active + drafts) for admin panel with pagination, search, and filtering.
 */
export async function getAllServices(params: QueryParams = {}): Promise<{ services: any[]; pagination: any }> {
  const url = new URL(`${API_BASE_URL}/api/services/admin`);
  
  if (params.page) url.searchParams.append('page', String(params.page));
  if (params.limit) url.searchParams.append('limit', String(params.limit));
  if (params.search) url.searchParams.append('search', params.search);
  if (params.status && params.status !== 'all') url.searchParams.append('status', params.status);
  if (params.category && params.category !== 'all') url.searchParams.append('category', params.category);
  if (params.trash !== undefined) url.searchParams.append('trash', String(params.trash));
  if (params.featured !== undefined) url.searchParams.append('featured', String(params.featured));
  if (params.sortBy) url.searchParams.append('sortBy', params.sortBy);
  if (params.sortOrder) url.searchParams.append('sortOrder', params.sortOrder);

  const response = await fetch(url.toString(), {
    credentials: 'include'
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch all services');
  }
  const result = await response.json();
  return {
    services: result.data || [],
    pagination: result.pagination || {
      total: (result.data || []).length,
      page: params.page || 1,
      limit: params.limit || 10,
      totalPages: 1
    }
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
  activeSlugs: ReadonlySet<string>
): T[] {
  return items.filter((item) => {
    const slug = serviceSlugFromNavPath(item.to);
    return slug ? activeSlugs.has(slug) : false;
  });
}

/**
 * Fetches details for a single active service by its slug.
 * Trashed or missing services return an error (no static fallback).
 * @param slug Service slug
 */
export async function getServiceBySlug(slug: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/services/${slug}`, { cache: 'no-store' });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch service details');
  }
  const result = await response.json();
  return result.data;
}

/**
 * Creates a new service listing (admin).
 */
export async function createService(data: any): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/services/admin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include'
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to create service');
  }
  const result = await response.json();
  return result.data;
}

/**
 * Updates an existing service listing (admin).
 */
export async function updateService(id: string, data: any): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/services/admin/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include'
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update service');
  }
  const result = await response.json();
  return result.data;
}

/**
 * Deletes a service listing (admin).
 */
export async function deleteService(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/services/admin/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to delete service');
  }
}

/**
 * Restores a soft-deleted service (admin).
 */
export async function restoreService(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/services/admin/${id}/restore`, {
    method: 'POST',
    credentials: 'include'
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to restore service');
  }
}

/**
 * Permanently deletes a service (admin).
 */
export async function permanentlyDeleteService(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/services/admin/${id}/permanent`, {
    method: 'DELETE',
    credentials: 'include'
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to permanently delete service');
  }
}

/**
 * Bulk soft-deletes services (admin).
 */
export async function bulkDeleteServices(ids: string[]): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/services/admin/bulk-delete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
    credentials: 'include'
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to bulk delete services');
  }
}

/**
 * Bulk restores soft-deleted services (admin).
 */
export async function bulkRestoreServices(ids: string[]): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/services/admin/bulk-restore`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
    credentials: 'include'
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to bulk restore services');
  }
}

/**
 * Bulk updates the publish status of services (admin).
 */
export async function bulkUpdateStatus(ids: string[], status: 'draft' | 'active'): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/services/admin/bulk-status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids, status }),
    credentials: 'include'
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to bulk update status');
  }
}
