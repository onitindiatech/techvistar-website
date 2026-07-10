import { PagesCmsConfig } from '@/types/pagesCms';
import { adminFetch, getApiBaseUrl, publicFetch, readApiError } from '@/lib/api';

export async function getPublicPagesConfig(): Promise<Partial<PagesCmsConfig>> {
  const response = await publicFetch(`${getApiBaseUrl()}/api/pages/config`);
  if (!response.ok) {
    throw new Error(await readApiError(response, 'Failed to fetch page CMS config'));
  }
  const result = await response.json();
  return result.data;
}

export async function getAdminPagesConfig(): Promise<Partial<PagesCmsConfig>> {
  const response = await adminFetch(`${getApiBaseUrl()}/api/pages/admin/config`);
  if (!response.ok) {
    throw new Error(await readApiError(response, 'Failed to fetch page CMS config'));
  }
  const result = await response.json();
  return result.data;
}

export async function updatePagesConfig(payload: Partial<PagesCmsConfig>): Promise<Partial<PagesCmsConfig>> {
  const response = await adminFetch(`${getApiBaseUrl()}/api/pages/admin/config`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(await readApiError(response, 'Failed to update page CMS config'));
  }
  const result = await response.json();
  return result.data;
}

export type { PageSeoBlock } from '@/types/pagesCms';
