import { ServicesCmsConfig } from '@/types/servicesCms';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export async function getServicesCmsConfig(): Promise<ServicesCmsConfig> {
  const response = await fetch(`${API_BASE_URL}/api/services/config`, { cache: 'no-store' });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch services CMS config');
  }
  const result = await response.json();
  return result.data;
}

export async function getAdminServicesCmsConfig(): Promise<ServicesCmsConfig & { _id?: string }> {
  const response = await fetch(`${API_BASE_URL}/api/services/admin/config`, { credentials: 'include' });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch services CMS config');
  }
  const result = await response.json();
  return result.data;
}

export async function updateServicesCmsConfig(data: ServicesCmsConfig): Promise<ServicesCmsConfig> {
  const response = await fetch(`${API_BASE_URL}/api/services/admin/config`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update services CMS config');
  }
  const result = await response.json();
  return result.data;
}
