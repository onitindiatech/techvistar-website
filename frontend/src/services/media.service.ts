import { adminFetch, getApiBaseUrl } from '@/lib/api';

export interface Media {
  _id: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  createdAt: string;
  updatedAt: string;
}

export const getMedia = async (): Promise<Media[]> => {
  const response = await adminFetch(`${getApiBaseUrl()}/api/media`);
  const data = await response.json();
  return data.data;
};

export const uploadMedia = async (file: File): Promise<Media> => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await adminFetch(`${getApiBaseUrl()}/api/upload/image`, {
    method: 'POST',
    body: formData,
  });
  const data = await response.json();
  return data.data;
};

export const deleteMedia = async (id: string): Promise<void> => {
  await adminFetch(`${getApiBaseUrl()}/api/media/${id}`, { method: 'DELETE' });
};
