export interface NewsletterSubscriptionData {
  email: string;
  source: 'footer' | 'blog_popup' | 'contact_form' | 'hero';
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

/**
 * Submits the newsletter subscription to the backend API.
 * Handles fetch request, console logging, error parsing, and throws clean errors.
 * 
 * @param data NewsletterSubscriptionData Form data payload
 */
export async function subscribeNewsletter(data: NewsletterSubscriptionData): Promise<any> {
  const url = `${API_BASE_URL}/api/newsletter`;
  
  // Console logs to verify details
  console.log('[NewsletterService] Sending subscription request:', {
    url,
    payload: data,
  });

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

  const responseStatus = response.status;
  const responseBody = await response.json().catch(() => ({}));

  console.log('[NewsletterService] Subscription response received:', {
    status: responseStatus,
    body: responseBody,
  });

  if (!response.ok) {
    const description = responseBody.errors && Array.isArray(responseBody.errors)
      ? responseBody.errors.map((err: any) => err.message).join(', ')
      : responseBody.message || 'Please check your inputs and try again.';

    throw new Error(description);
  }

  return responseBody;
}
