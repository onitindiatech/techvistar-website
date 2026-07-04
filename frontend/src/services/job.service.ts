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
 * Submits a new job application.
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
