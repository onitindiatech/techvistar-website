export interface NewsletterSubscriptionData {
  email: string;
  source: 'footer' | 'blog_popup' | 'contact_form' | 'hero';
}

export type NewsletterStatus = 'subscribed' | 'unsubscribed';

interface NewsletterQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  source?: string;
  trash?: boolean | string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

/**
 * Submits the newsletter subscription to the backend API (public).
 */
export async function subscribeNewsletter(data: NewsletterSubscriptionData): Promise<any> {
  const url = `${API_BASE_URL}/api/newsletter`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: data.email, source: data.source }),
  });

  const responseBody = await response.json().catch(() => ({}));
  if (!response.ok) {
    const description = responseBody.errors && Array.isArray(responseBody.errors)
      ? responseBody.errors.map((err: any) => err.message).join(', ')
      : responseBody.message || 'Please check your inputs and try again.';
    throw new Error(description);
  }
  return responseBody;
}

/**
 * Fetches subscribers with pagination (admin).
 */
export async function getAllSubscribers(params: NewsletterQueryParams = {}): Promise<{ subscribers: any[]; pagination: any }> {
  const url = new URL(`${API_BASE_URL}/api/newsletter/admin`);

  if (params.page) url.searchParams.append('page', String(params.page));
  if (params.limit) url.searchParams.append('limit', String(params.limit));
  if (params.search) url.searchParams.append('search', params.search);
  if (params.status && params.status !== 'all') url.searchParams.append('status', params.status);
  if (params.source && params.source !== 'all') url.searchParams.append('source', params.source);
  if (params.trash !== undefined) url.searchParams.append('trash', String(params.trash));
  if (params.sortBy) url.searchParams.append('sortBy', params.sortBy);
  if (params.sortOrder) url.searchParams.append('sortOrder', params.sortOrder);

  const response = await fetch(url.toString(), { credentials: 'include' });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch newsletter subscribers');
  }
  const result = await response.json();
  return {
    subscribers: result.data || [],
    pagination: result.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 },
  };
}

export async function updateSubscriberStatus(id: string, status: NewsletterStatus): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/newsletter/admin/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
    credentials: 'include',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update subscriber status');
  }
  const result = await response.json();
  return result.data;
}

export async function deleteSubscriber(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/newsletter/admin/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to delete subscriber');
  }
}

export async function restoreSubscriber(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/newsletter/admin/${id}/restore`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to restore subscriber');
  }
}

export async function permanentlyDeleteSubscriber(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/newsletter/admin/${id}/permanent`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to permanently delete subscriber');
  }
}

export async function bulkDeleteSubscribers(ids: string[]): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/newsletter/admin/bulk-delete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
    credentials: 'include',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to bulk delete subscribers');
  }
}

export async function bulkRestoreSubscribers(ids: string[]): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/newsletter/admin/bulk-restore`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
    credentials: 'include',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to bulk restore subscribers');
  }
}

export async function bulkUpdateSubscriberStatus(ids: string[], status: NewsletterStatus): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/newsletter/admin/bulk-status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids, status }),
    credentials: 'include',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to bulk update subscriber status');
  }
}
