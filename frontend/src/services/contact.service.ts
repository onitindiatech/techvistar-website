export interface ContactSubmissionData {
  name: string;
  email: string;
  phone: string;
  company?: string;
  serviceInterested: string;
  message: string;
  budget?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

/**
 * Submits the contact form data to the backend API.
 */
export async function submitContactForm(data: ContactSubmissionData): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
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
 * Fetches all contact inquiries (admin).
 */
export async function getAllContacts(): Promise<any[]> {
  const response = await fetch(`${API_BASE_URL}/api/contact`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch contact inquiries');
  }
  const result = await response.json();
  return result.data || [];
}

/**
 * Updates the status (e.g. read/unread) of a contact inquiry (admin).
 */
export async function updateContactStatus(id: string, status: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/contact/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update contact inquiry status');
  }
  const result = await response.json();
  return result.data;
}

/**
 * Deletes a contact inquiry permanently (admin).
 */
export async function deleteContact(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/contact/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to delete contact inquiry');
  }
}
