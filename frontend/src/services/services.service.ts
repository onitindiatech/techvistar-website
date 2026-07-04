/**
 * @file src/services/services.service.ts
 * @description Client service for retrieving Services CMS data.
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
