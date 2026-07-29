import {
  getApiBaseUrl,
  getAccessToken,
  setAccessToken,
  clearAccessToken,
  adminFetch,
  readApiError,
} from '@/lib/api';

export { getAccessToken, setAccessToken, clearAccessToken };

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin';
}

interface AdminAuthResponse {
  admin: AdminUser;
  token?: string;
}

interface ApiEnvelope<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await adminFetch(`${getApiBaseUrl()}${path}`, init);

  let payload: ApiEnvelope<T> | null = null;
  const rawBody = await response.text();

  if (rawBody) {
    try {
      payload = JSON.parse(rawBody) as ApiEnvelope<T>;
    } catch {
      payload = null;
    }
  }

  if (!response.ok) {
    throw new Error(payload?.message || 'Authentication request failed');
  }

  return (payload?.data ?? payload) as T;
}

export async function getCurrentAdmin() {
  const data = await request<{ admin: AdminUser | null }>('/api/auth/me');
  return data.admin;
}

export async function loginAdmin(credentials: { email: string; password: string }) {
  const data = await request<AdminAuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

  if (data.token) {
    setAccessToken(data.token);
  }

  return data;
}

export async function logoutAdmin() {
  try {
    return await request<{ success: boolean }>('/api/auth/logout', {
      method: 'POST',
    });
  } finally {
    clearAccessToken();
  }
}
