/**
 * @file src/services/faq.service.ts
 * @description Client service for retrieving and managing FAQ CMS data.
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
 * Fetches all FAQs (active + drafts) for admin panel.
 */
export async function getAllFAQs(): Promise<any[]> {
  const response = await fetch(`${API_BASE_URL}/api/faqs/admin`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch all FAQs');
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

/**
 * Creates a new FAQ entry (admin).
 */
export async function createFAQ(data: any): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/faqs/admin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to create FAQ');
  }
  const result = await response.json();
  return result.data;
}

/**
 * Updates an existing FAQ entry (admin).
 */
export async function updateFAQ(id: string, data: any): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/faqs/admin/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update FAQ');
  }
  const result = await response.json();
  return result.data;
}

/**
 * Deletes a FAQ entry (admin).
 */
export async function deleteFAQ(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/faqs/admin/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to delete FAQ');
  }
}
