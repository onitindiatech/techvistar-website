/**
 * @file src/services/services.service.ts
 * @description Client service for retrieving and managing Services CMS data.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

/**
 * Fetches all active services from the backend API.
 */
export async function getActiveServices(): Promise<any[]> {
  const response = await fetch(`${API_BASE_URL}/api/services`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch services');
  }
  const result = await response.json();
  return result.data || [];
}

/**
 * Fetches all services (active + drafts) for admin panel.
 */
export async function getAllServices(): Promise<any[]> {
  const response = await fetch(`${API_BASE_URL}/api/services/admin`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch all services');
  }
  const result = await response.json();
  return result.data || [];
}

/**
 * Fetches details for a single active service by its slug.
 * @param slug Service slug
 */
export async function getServiceBySlug(slug: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/services/${slug}`);
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
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to delete service');
  }
}
