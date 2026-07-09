import { PageSeoBlock } from './pages.service';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export interface PagesCmsConfig {
  about: PageSeoBlock;
  careers: PageSeoBlock;
}

export async function getPublicPagesConfig(): Promise<PagesCmsConfig> {
  const response = await fetch(`${API_BASE_URL}/api/pages/config`, { cache: 'no-store' });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch page SEO config');
  }
  const result = await response.json();
  return result.data;
}

export async function getAdminPagesConfig(): Promise<PagesCmsConfig> {
  const response = await fetch(`${API_BASE_URL}/api/pages/admin/config`, { credentials: 'include' });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch page SEO config');
  }
  const result = await response.json();
  return result.data;
}

export async function updatePagesConfig(payload: Partial<PagesCmsConfig>): Promise<PagesCmsConfig> {
  const response = await fetch(`${API_BASE_URL}/api/pages/admin/config`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'include',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update page SEO config');
  }
  const result = await response.json();
  return result.data;
}

export type { PageSeoBlock };
