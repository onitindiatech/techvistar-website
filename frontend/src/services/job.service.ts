export interface Job {
  _id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  employmentType: string;
  experience: string;
  salary: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  displayOrder?: number;
  status: 'active' | 'closed' | 'draft';
  featured: boolean;
  applicationDeadline?: string;
  isDeleted?: boolean;
  deletedAt?: string | null;
  deletedBy?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  department?: string;
  trash?: boolean | string;
  featured?: boolean | string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Fetches the list of active job postings from the backend.
 */
export async function getActiveJobs(): Promise<Job[]> {
  const url = `${API_BASE_URL}/api/careers/jobs`;
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch job postings');
  }
  const result = await response.json();
  return result.data || [];
}

/**
 * Fetches all job postings for admin panel with pagination, search, and filtering.
 */
export async function getAllJobs(params: QueryParams = {}): Promise<{ jobs: Job[]; pagination: any }> {
  const url = new URL(`${API_BASE_URL}/api/careers/jobs/admin`);

  if (params.page) url.searchParams.append('page', String(params.page));
  if (params.limit) url.searchParams.append('limit', String(params.limit));
  if (params.search) url.searchParams.append('search', params.search);
  if (params.status && params.status !== 'all') url.searchParams.append('status', params.status);
  if (params.department && params.department !== 'all') url.searchParams.append('department', params.department);
  if (params.trash !== undefined) url.searchParams.append('trash', String(params.trash));
  if (params.featured !== undefined) url.searchParams.append('featured', String(params.featured));
  if (params.sortBy) url.searchParams.append('sortBy', params.sortBy);
  if (params.sortOrder) url.searchParams.append('sortOrder', params.sortOrder);

  const response = await fetch(url.toString(), {
    credentials: 'include',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch all job postings');
  }
  const result = await response.json();
  return {
    jobs: result.data || [],
    pagination: result.pagination || {
      total: (result.data || []).length,
      page: params.page || 1,
      limit: params.limit || 10,
      totalPages: 1,
    },
  };
}

/**
 * Fetches a single job posting by slug from the backend.
 * @param slug Job slug
 */
export async function getJobBySlug(slug: string): Promise<Job> {
  const url = `${API_BASE_URL}/api/careers/jobs/${slug}`;
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch job details');
  }
  const result = await response.json();
  return result.data;
}

/**
 * Creates a new job posting (admin).
 */
export async function createJob(data: any): Promise<Job> {
  const url = `${API_BASE_URL}/api/careers/jobs/admin`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to create job');
  }
  const result = await response.json();
  return result.data;
}

/**
 * Updates an existing job posting (admin).
 */
export async function updateJob(id: string, data: any): Promise<Job> {
  const url = `${API_BASE_URL}/api/careers/jobs/admin/${id}`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update job');
  }
  const result = await response.json();
  return result.data;
}

/**
 * Soft-deletes a job posting (admin).
 */
export async function deleteJob(id: string): Promise<void> {
  const url = `${API_BASE_URL}/api/careers/jobs/admin/${id}`;
  const response = await fetch(url, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to delete job');
  }
}

/**
 * Restores a soft-deleted job posting (admin).
 */
export async function restoreJob(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/careers/jobs/admin/${id}/restore`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to restore job');
  }
}

/**
 * Permanently deletes a job posting (admin).
 */
export async function permanentlyDeleteJob(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/careers/jobs/admin/${id}/permanent`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to permanently delete job');
  }
}

/**
 * Bulk soft-deletes job postings (admin).
 */
export async function bulkDeleteJobs(ids: string[]): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/careers/jobs/admin/bulk-delete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
    credentials: 'include',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to bulk delete jobs');
  }
}

/**
 * Bulk restores soft-deleted job postings (admin).
 */
export async function bulkRestoreJobs(ids: string[]): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/careers/jobs/admin/bulk-restore`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
    credentials: 'include',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to bulk restore jobs');
  }
}

/**
 * Bulk updates job status (admin).
 */
export async function bulkUpdateStatus(ids: string[], status: 'active' | 'closed' | 'draft'): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/careers/jobs/admin/bulk-status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids, status }),
    credentials: 'include',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to bulk update job status');
  }
}

// ─── Applications Admin CRUD ─────────────────────────────────────────────────

export type ApplicationStatus = 'Pending' | 'Shortlisted' | 'Interview' | 'Rejected' | 'Selected';

interface ApplicationQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  jobId?: string;
  trash?: boolean | string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Fetches job applications with pagination (admin).
 */
export async function getAllApplications(params: ApplicationQueryParams = {}): Promise<{ applications: any[]; pagination: any }> {
  const url = new URL(`${API_BASE_URL}/api/careers/apply/admin`);

  if (params.page) url.searchParams.append('page', String(params.page));
  if (params.limit) url.searchParams.append('limit', String(params.limit));
  if (params.search) url.searchParams.append('search', params.search);
  if (params.status && params.status !== 'all') url.searchParams.append('status', params.status);
  if (params.jobId) url.searchParams.append('jobId', params.jobId);
  if (params.trash !== undefined) url.searchParams.append('trash', String(params.trash));
  if (params.sortBy) url.searchParams.append('sortBy', params.sortBy);
  if (params.sortOrder) url.searchParams.append('sortOrder', params.sortOrder);

  const response = await fetch(url.toString(), { credentials: 'include' });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch job applications');
  }
  const result = await response.json();
  return {
    applications: result.data || [],
    pagination: result.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 },
  };
}

/**
 * Updates application status (admin).
 */
export async function updateApplicationStatus(id: string, status: ApplicationStatus): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/careers/apply/admin/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
    credentials: 'include',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update application status');
  }
  const result = await response.json();
  return result.data;
}

/**
 * Soft-deletes an application (admin).
 */
export async function deleteApplication(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/careers/apply/admin/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to delete application');
  }
}

export async function restoreApplication(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/careers/apply/admin/${id}/restore`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to restore application');
  }
}

export async function permanentlyDeleteApplication(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/careers/apply/admin/${id}/permanent`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to permanently delete application');
  }
}

export async function bulkDeleteApplications(ids: string[]): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/careers/apply/admin/bulk-delete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
    credentials: 'include',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to bulk delete applications');
  }
}

export async function bulkRestoreApplications(ids: string[]): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/careers/apply/admin/bulk-restore`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
    credentials: 'include',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to bulk restore applications');
  }
}

export async function bulkUpdateApplicationStatus(ids: string[], status: ApplicationStatus): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/careers/apply/admin/bulk-status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids, status }),
    credentials: 'include',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to bulk update application status');
  }
}

export interface JobApplicationInput {
  jobId: string;
  fullName: string;
  email: string;
  phone: string;
  currentLocation: string;
  yearsOfExperience: number;
  linkedin?: string;
  portfolio?: string;
  resumeUrl?: string;
  coverLetter: string;
  whyJoinTechVistar?: string;
}

/**
 * Submits a new job application (public).
 */
export async function submitJobApplication(data: JobApplicationInput): Promise<any> {
  const url = `${API_BASE_URL}/api/careers/apply`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const responseBody = await response.json().catch(() => ({}));
  if (!response.ok) {
    const description = responseBody.errors && Array.isArray(responseBody.errors)
      ? responseBody.errors.map((err: any) => err.message).join(', ')
      : responseBody.message || 'Failed to submit application. Please check details and try again.';
    throw new Error(description);
  }
  return responseBody;
}
