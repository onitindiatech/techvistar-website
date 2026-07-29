/**
 * Central API configuration — single source for base URL and admin auth headers.
 * Vite inlines VITE_API_BASE_URL at build time (set in Vercel Production env).
 */

const LOCAL_FALLBACK = 'http://localhost:5000';
export const ACCESS_TOKEN_KEY = 'tv_admin_access_token';

export function getApiBaseUrl(): string {
  const configured = import.meta.env.VITE_API_BASE_URL?.trim();
  if (configured) return configured.replace(/\/$/, '');

  if (import.meta.env.PROD) {
    console.error(
      '[TechVistar] VITE_API_BASE_URL is not set in this production build. ' +
        'API calls will fail outside localhost. Set the variable in Vercel and redeploy.',
    );
  }

  return LOCAL_FALLBACK;
}

export function getAccessToken(): string | null {
  try {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAccessToken(token: string): void {
  try {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  } catch {
    // Private browsing / storage blocked
  }
}

export function clearAccessToken(): void {
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  } catch {
    // ignore
  }
}

function mergeAdminHeaders(init?: RequestInit): Headers {
  const headers = new Headers(init?.headers);

  const token = getAccessToken();
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const hasJsonBody =
    init?.body != null &&
    typeof init.body === 'string' &&
    !(init.body instanceof FormData);

  if (hasJsonBody && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  return headers;
}

/** Authenticated admin request — sends Bearer token + cookies (cross-origin fallback). */
export async function adminFetch(input: string, init: RequestInit = {}): Promise<Response> {
  return fetch(input, {
    ...init,
    credentials: 'include',
    headers: mergeAdminHeaders(init),
  });
}

/** Public CMS/content request — no auth, no cache. */
export async function publicFetch(input: string, init: RequestInit = {}): Promise<Response> {
  return fetch(input, {
    cache: 'no-store',
    ...init,
  });
}

export async function readApiError(response: Response, fallback: string): Promise<string> {
  const errorData = await response.json().catch(() => ({}));
  return (errorData as { message?: string }).message || fallback;
}
