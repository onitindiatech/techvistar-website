const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export interface OfficeData {
  _id?: string;
  officeId: string;
  name: string;
  badge: string;
  address: string;
  city: string;
  country: string;
  googleMapsUrl: string;
  image: string;
  imagePublicId?: string;
  imageAlt?: string;
  displayOrder?: number;
  isActive?: boolean;
}

export async function getActiveOffices(): Promise<OfficeData[]> {
  const response = await fetch(`${API_BASE_URL}/api/offices`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch offices');
  }
  const result = await response.json();
  return result.data || [];
}

export async function getAllOffices(params: { search?: string } = {}): Promise<OfficeData[]> {
  const url = new URL(`${API_BASE_URL}/api/offices/admin`);
  if (params.search) url.searchParams.append('search', params.search);

  const response = await fetch(url.toString(), {
    credentials: 'include',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch all offices');
  }
  const result = await response.json();
  return result.data || [];
}

export async function createOffice(data: OfficeData): Promise<OfficeData> {
  const response = await fetch(`${API_BASE_URL}/api/offices/admin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to create office');
  }
  const result = await response.json();
  return result.data;
}

export async function updateOffice(id: string, data: Partial<OfficeData>): Promise<OfficeData> {
  const response = await fetch(`${API_BASE_URL}/api/offices/admin/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update office');
  }
  const result = await response.json();
  return result.data;
}

export async function deleteOffice(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/offices/admin/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to delete office');
  }
}

export async function reorderOffices(officeIds: string[]): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/offices/admin/reorder`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ officeIds }),
    credentials: 'include',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to reorder offices');
  }
}
