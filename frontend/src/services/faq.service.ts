/**
 * @file src/services/faq.service.ts
 * @description Client service for retrieving FAQ CMS data from the backend API.
 *
 * Pattern mirrors services.service.ts and portfolio.service.ts exactly.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

/**
 * Fetches all active FAQs from the backend, sorted by displayOrder.
 */
export async function getActiveFAQs(): Promise<any[]> {
  const response = await fetch(`${API_BASE_URL}/api/faqs`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch FAQs');
  }
  const result = await response.json();
  return result.data || [];
}

/**
 * Fetches a single FAQ by its faqId string.
 * @param faqId The unique FAQ identifier (e.g. "faq-1")
 */
export async function getFAQById(faqId: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/faqs/${faqId}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch FAQ details');
  }
  const result = await response.json();
  return result.data;
}
