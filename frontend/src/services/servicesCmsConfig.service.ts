import { ServicesCmsConfig } from '@/types/servicesCms';
import { adminFetch, getApiBaseUrl, publicFetch, readApiError } from '@/lib/api';

export async function getServicesCmsConfig(): Promise<ServicesCmsConfig> {
  const response = await publicFetch(`${getApiBaseUrl()}/api/services/config`);
  if (!response.ok) {
    throw new Error(await readApiError(response, 'Failed to fetch services CMS config'));
  }
  const result = await response.json();
  return result.data;
}

export async function getAdminServicesCmsConfig(): Promise<ServicesCmsConfig & { _id?: string }> {
  const response = await adminFetch(`${getApiBaseUrl()}/api/services/admin/config`);
  if (!response.ok) {
    throw new Error(await readApiError(response, 'Failed to fetch services CMS config'));
  }
  const result = await response.json();
  return result.data;
}

export async function updateServicesCmsConfig(data: ServicesCmsConfig): Promise<ServicesCmsConfig> {
  const response = await adminFetch(`${getApiBaseUrl()}/api/services/admin/config`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(await readApiError(response, 'Failed to update services CMS config'));
  }
  const result = await response.json();
  return result.data;
}
