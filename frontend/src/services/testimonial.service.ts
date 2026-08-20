import { adminFetch, publicFetch, getApiBaseUrl } from '@/lib/api';

export interface Testimonial {
  _id: string;
  clientName: string;
  designation: string;
  company: string;
  profileImage: string;
  testimonial: string;
  rating: number;
  status: 'Published' | 'Draft';
  createdAt: string;
  updatedAt: string;
}

export const getTestimonials = async (): Promise<Testimonial[]> => {
  const response = await adminFetch(`${getApiBaseUrl()}/api/testimonials`);
  const data = await response.json();
  return data.data;
};

export const getPublishedTestimonials = async (): Promise<Testimonial[]> => {
  const response = await publicFetch(`${getApiBaseUrl()}/api/testimonials/published`);
  const data = await response.json();
  return data.data;
};

export const createTestimonial = async (testimonial: Partial<Testimonial>): Promise<Testimonial> => {
  const response = await adminFetch(`${getApiBaseUrl()}/api/testimonials`, {
    method: 'POST',
    body: JSON.stringify(testimonial),
  });
  const data = await response.json();
  return data.data;
};

export const updateTestimonial = async (id: string, testimonial: Partial<Testimonial>): Promise<Testimonial> => {
  const response = await adminFetch(`${getApiBaseUrl()}/api/testimonials/${id}`, {
    method: 'PUT',
    body: JSON.stringify(testimonial),
  });
  const data = await response.json();
  return data.data;
};

export const deleteTestimonial = async (id: string): Promise<void> => {
  await adminFetch(`${getApiBaseUrl()}/api/testimonials/${id}`, { method: 'DELETE' });
};
