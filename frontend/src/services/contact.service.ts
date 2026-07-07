export interface ContactSubmissionData {
  name: string;
  email: string;
  phone: string;
  company?: string;
  serviceInterested: string;
  message: string;
  budget?: string;
}

export type ContactStatus = 'new' | 'in-progress' | 'resolved' | 'archived';

interface ContactQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  trash?: boolean | string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

/**
 * Submits the contact form data to the backend API (public).
 */
export async function submitContactForm(data: ContactSubmissionData): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company ?? '',
      serviceInterested: data.serviceInterested,
      message: data.message,
      budget: data.budget ?? '',
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const description = errorData.errors && Array.isArray(errorData.errors)
      ? errorData.errors.map((err: any) => err.message).join(', ')
      : errorData.message || 'Please check your inputs and try again.';
    throw new Error(description);
  }

  return response.json();
}

/**
 * Fetches contact inquiries with pagination (admin).
 */
export async function getAllContacts(params: ContactQueryParams = {}): Promise<{ contacts: any[]; pagination: any }> {
  const url = new URL(`${API_BASE_URL}/api/contact/admin`);

  if (params.page) url.searchParams.append('page', String(params.page));
  if (params.limit) url.searchParams.append('limit', String(params.limit));
  if (params.search) url.searchParams.append('search', params.search);
  if (params.status && params.status !== 'all') url.searchParams.append('status', params.status);
  if (params.trash !== undefined) url.searchParams.append('trash', String(params.trash));
  if (params.sortBy) url.searchParams.append('sortBy', params.sortBy);
  if (params.sortOrder) url.searchParams.append('sortOrder', params.sortOrder);

  const response = await fetch(url.toString(), { credentials: 'include' });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch contact inquiries');
  }
  const result = await response.json();
  return {
    contacts: result.data || [],
    pagination: result.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 },
  };
}

export async function updateContactStatus(id: string, status: ContactStatus): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/contact/admin/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
    credentials: 'include',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update contact inquiry status');
  }
  const result = await response.json();
  return result.data;
}

export async function deleteContact(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/contact/admin/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to delete contact inquiry');
  }
}

export async function restoreContact(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/contact/admin/${id}/restore`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to restore contact inquiry');
  }
}

export async function permanentlyDeleteContact(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/contact/admin/${id}/permanent`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to permanently delete contact inquiry');
  }
}

export async function bulkDeleteContacts(ids: string[]): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/contact/admin/bulk-delete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
    credentials: 'include',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to bulk delete contacts');
  }
}

export async function bulkRestoreContacts(ids: string[]): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/contact/admin/bulk-restore`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
    credentials: 'include',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to bulk restore contacts');
  }
}

export async function bulkUpdateContactStatus(ids: string[], status: ContactStatus): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/contact/admin/bulk-status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids, status }),
    credentials: 'include',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to bulk update contact status');
  }
}
