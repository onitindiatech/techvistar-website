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
  status: 'active' | 'closed' | 'draft';
  featured: boolean;
  applicationDeadline?: string;
  createdAt: string;
  updatedAt: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

/**
 * Fetches the list of active job postings from the backend.
 */
export async function getActiveJobs(): Promise<Job[]> {
  const url = `${API_BASE_URL}/api/careers/jobs?status=active`;
  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch job postings');
  }
  const result = await response.json();
  return result.data || [];
}

/**
 * Fetches all job postings (active + closed + drafts) for admin panel.
 */
export async function getAllJobs(): Promise<Job[]> {
  const url = `${API_BASE_URL}/api/careers/jobs`;
  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch all job postings');
  }
  const result = await response.json();
  return result.data || [];
}

/**
 * Fetches a single job posting by slug from the backend.
 * @param slug Job slug
 */
export async function getJobBySlug(slug: string): Promise<Job> {
  const url = `${API_BASE_URL}/api/careers/jobs/${slug}`;
  const response = await fetch(url);
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
  const url = `${API_BASE_URL}/api/careers/jobs`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
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
  const url = `${API_BASE_URL}/api/careers/jobs/${id}`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update job');
  }
  const result = await response.json();
  return result.data;
}

/**
 * Patches a job's status (admin).
 */
export async function updateJobStatus(id: string, status: 'active' | 'closed' | 'draft'): Promise<Job> {
  const url = `${API_BASE_URL}/api/careers/jobs/${id}/status`;
  const response = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update job status');
  }
  const result = await response.json();
  return result.data;
}

/**
 * Deletes a job posting (admin).
 */
export async function deleteJob(id: string): Promise<void> {
  const url = `${API_BASE_URL}/api/careers/jobs/${id}`;
  const response = await fetch(url, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to delete job');
  }
}

// ─── Applications Admin CRUD ─────────────────────────────────────────────────

/**
 * Fetches all job applications submitted.
 */
export async function getAllApplications(): Promise<any[]> {
  const url = `${API_BASE_URL}/api/careers/apply`;
  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch job applications');
  }
  const result = await response.json();
  return result.data || [];
}

/**
 * Updates application status.
 */
export async function updateApplicationStatus(id: string, status: string): Promise<any> {
  const url = `${API_BASE_URL}/api/careers/apply/${id}/status`;
  const response = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update application status');
  }
  const result = await response.json();
  return result.data;
}

/**
 * Deletes an application permanently.
 */
export async function deleteApplication(id: string): Promise<void> {
  const url = `${API_BASE_URL}/api/careers/apply/${id}`;
  const response = await fetch(url, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to delete application');
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
