import { PagesCmsConfig } from '@/types/pagesCms';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export async function getPublicPagesConfig(): Promise<Partial<PagesCmsConfig>> {
  const response = await fetch(`${API_BASE_URL}/api/pages/config`, { cache: 'no-store' });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch page CMS config');
  }
  const result = await response.json();
  return result.data;
}

export async function getAdminPagesConfig(): Promise<Partial<PagesCmsConfig>> {
  const response = await fetch(`${API_BASE_URL}/api/pages/admin/config`, { credentials: 'include' });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch page CMS config');
  }
  const result = await response.json();
  return result.data;
}

export async function updatePagesConfig(payload: Partial<PagesCmsConfig>): Promise<Partial<PagesCmsConfig>> {
  const response = await fetch(`${API_BASE_URL}/api/pages/admin/config`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'include',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update page CMS config');
  }
  const result = await response.json();
  return result.data;
}

export type { PageSeoBlock } from '@/types/pagesCms';
