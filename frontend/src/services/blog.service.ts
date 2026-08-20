import { adminFetch, publicFetch, getApiBaseUrl } from '@/lib/api';

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  author: string;
  category: string;
  content: string;
  featuredImage: string;
  status: 'Published' | 'Draft';
  publicationDate: string;
  createdAt: string;
  updatedAt: string;
}

export const getBlogPosts = async (): Promise<BlogPost[]> => {
  const response = await adminFetch(`${getApiBaseUrl()}/api/blog`);
  const data = await response.json();
  return data.data;
};

export const getPublishedBlogPosts = async (): Promise<BlogPost[]> => {
  const response = await publicFetch(`${getApiBaseUrl()}/api/blog/published`);
  const data = await response.json();
  return data.data;
};

export const createBlogPost = async (post: Partial<BlogPost>): Promise<BlogPost> => {
  const response = await adminFetch(`${getApiBaseUrl()}/api/blog`, {
    method: 'POST',
    body: JSON.stringify(post),
  });
  const data = await response.json();
  return data.data;
};

export const updateBlogPost = async ({ id, data: post }: { id: string; data: Partial<BlogPost> }): Promise<BlogPost> => {
  const response = await adminFetch(`${getApiBaseUrl()}/api/blog/${id}`, {
    method: 'PUT',
    body: JSON.stringify(post),
  });
  const data = await response.json();
  return data.data;
};

export const deleteBlogPost = async (id: string): Promise<void> => {
  await adminFetch(`${getApiBaseUrl()}/api/blog/${id}`, { method: 'DELETE' });
};
