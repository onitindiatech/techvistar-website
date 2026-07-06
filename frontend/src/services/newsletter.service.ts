export interface NewsletterSubscriptionData {
  email: string;
  source: 'footer' | 'blog_popup' | 'contact_form' | 'hero';
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

/**
 * Submits the newsletter subscription to the backend API.
 */
export async function subscribeNewsletter(data: NewsletterSubscriptionData): Promise<any> {
  const url = `${API_BASE_URL}/api/newsletter`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: data.email,
      source: data.source,
    }),
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
 * Fetches all subscribers (admin).
 */
export async function getAllSubscribers(): Promise<any[]> {
  const response = await fetch(`${API_BASE_URL}/api/newsletter`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch newsletter subscribers');
  }
  const result = await response.json();
  return result.data || [];
}

/**
 * Deletes a subscriber (admin).
 */
export async function deleteSubscriber(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/newsletter/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to delete subscriber');
  }
}
