/**
 * @file src/services/portfolio.service.ts
 * @description Client service for retrieving and managing Portfolio CMS data.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

/**
 * Fetches all active portfolio projects from the backend.
 */
export async function getActiveProjects(): Promise<any[]> {
  const response = await fetch(`${API_BASE_URL}/api/portfolio`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch portfolio projects');
  }
  const result = await response.json();
  return result.data || [];
}

/**
 * Fetches all portfolio projects (active + drafts) for admin panel.
 */
export async function getAllProjects(): Promise<any[]> {
  // Project list endpoint in backend retrieves all because ProjectModel.find() has no status filter
  const response = await fetch(`${API_BASE_URL}/api/portfolio`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch all projects');
  }
  const result = await response.json();
  return result.data || [];
}

/**
 * Fetches details for a single active project by its slug.
 * @param slug Project slug identifier
 */
export async function getProjectBySlug(slug: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/portfolio/${slug}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch project details');
  }
  const result = await response.json();
  return result.data;
}

/**
 * Creates a new portfolio project (admin).
 */
export async function createProject(data: any): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/portfolio/admin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to create project');
  }
  const result = await response.json();
  return result.data;
}

/**
 * Updates an existing portfolio project (admin).
 */
export async function updateProject(id: string, data: any): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/portfolio/admin/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update project');
  }
  const result = await response.json();
  return result.data;
}

/**
 * Deletes a portfolio project (admin).
 */
export async function deleteProject(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/portfolio/admin/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to delete project');
  }
}
