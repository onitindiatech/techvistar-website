/**
 * @file src/services/solutions.service.ts
 * @description Client service for retrieving and managing Solutions CMS data.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

/**
 * Fetches all active solutions from the backend.
 */
export async function getActiveSolutions(): Promise<any[]> {
  const response = await fetch(`${API_BASE_URL}/api/solutions`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch solutions');
  }
  const result = await response.json();
  return result.data || [];
}

/**
 * Fetches all solutions (active + drafts) for admin panel.
 */
export async function getAllSolutions(): Promise<any[]> {
  const response = await fetch(`${API_BASE_URL}/api/solutions/admin`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch all solutions');
  }
  const result = await response.json();
  return result.data || [];
}

/**
 * Fetches details for a single active solution by its slug.
 * @param slug Solution slug identifier
 */
export async function getSolutionBySlug(slug: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/solutions/${slug}`);
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
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update solution');
  }
  const result = await response.json();
  return result.data;
}

/**
 * Deletes a solution listing (admin).
 */
export async function deleteSolution(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/solutions/admin/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to delete solution');
  }
}
