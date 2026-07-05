const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

interface AdminAuthResponse {
  admin: {
    id: string;
    name: string;
    email: string;
    role: "admin";
  };
}

interface ApiEnvelope<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    ...init,
  });

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
    throw new Error((payload as ApiEnvelope<T> | null)?.message || "Authentication request failed");
  }

  return ((payload?.data ?? payload) as T);
}

export async function getCurrentAdmin() {
  const data = await request<AdminAuthResponse>("/api/auth/me");
  return data.admin;
}

export async function loginAdmin(credentials: { email: string; password: string }) {
  return request<AdminAuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export async function logoutAdmin() {
  return request<{ success: boolean }>("/api/auth/logout", {
    method: "POST",
  });
}
