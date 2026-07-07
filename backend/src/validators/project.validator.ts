/**
 * @file src/validators/project.validator.ts
 * @description Native validator for Portfolio Project entries.
 */

import { ApiError } from '@/utils/ApiError';

interface ProjectInput {
  title?: unknown;
  slug?: unknown;
  description?: unknown;
  thumbnail?: unknown;
  category?: unknown;
  technologies?: unknown;
  liveUrl?: unknown;
  githubUrl?: unknown;
  featured?: unknown;
  date?: unknown;
  client?: unknown;
  role?: unknown;
  longDescription?: unknown;
  keyFeatures?: unknown;
  challenges?: unknown;
  gallery?: unknown;
  tags?: unknown;
  status?: unknown;
  serviceSlugs?: unknown;
  industry?: unknown;
  updatedDate?: unknown;
  displayOrder?: unknown;
  seoTitle?: unknown;
  seoDescription?: unknown;
}

export function validateProjectInput(input: ProjectInput, isUpdate = false): any {
  const errors: Array<{ field: string; message: string }> = [];

  // Title
  if (!isUpdate || input.title !== undefined) {
    if (input.title === undefined || input.title === null || String(input.title).trim() === '') {
      errors.push({ field: 'title', message: 'Project title is required' });
    }
  }

  // Slug
  if (input.slug !== undefined && input.slug !== null) {
    const slugStr = String(input.slug).trim().toLowerCase();
    if (slugStr === '') {
      errors.push({ field: 'slug', message: 'Slug cannot be empty' });
    }
  }

  // Description
  if (!isUpdate || input.description !== undefined) {
    if (input.description === undefined || input.description === null || String(input.description).trim() === '') {
      errors.push({ field: 'description', message: 'Short description is required' });
    }
  }

  // Thumbnail
  if (!isUpdate || input.thumbnail !== undefined) {
    if (input.thumbnail === undefined || input.thumbnail === null || String(input.thumbnail).trim() === '') {
      errors.push({ field: 'thumbnail', message: 'Thumbnail is required' });
    }
  }

  // Category
  if (!isUpdate || input.category !== undefined) {
    if (input.category === undefined || input.category === null || String(input.category).trim() === '') {
      errors.push({ field: 'category', message: 'Category is required' });
    }
  }

  // Date
  if (!isUpdate || input.date !== undefined) {
    if (input.date === undefined || input.date === null || String(input.date).trim() === '') {
      errors.push({ field: 'date', message: 'Project date is required' });
    }
  }

  // Client
  if (!isUpdate || input.client !== undefined) {
    if (input.client === undefined || input.client === null || String(input.client).trim() === '') {
      errors.push({ field: 'client', message: 'Client name is required' });
    }
  }

  // Role
  if (!isUpdate || input.role !== undefined) {
    if (input.role === undefined || input.role === null || String(input.role).trim() === '') {
      errors.push({ field: 'role', message: 'Team role is required' });
    }
  }

  // Long Description
  if (!isUpdate || input.longDescription !== undefined) {
    if (input.longDescription === undefined || input.longDescription === null || String(input.longDescription).trim() === '') {
      errors.push({ field: 'longDescription', message: 'Long description is required' });
    }
  }

  // Industry
  if (!isUpdate || input.industry !== undefined) {
    if (input.industry === undefined || input.industry === null || String(input.industry).trim() === '') {
      errors.push({ field: 'industry', message: 'Industry classification is required' });
    }
  }

  // Updated Date
  if (!isUpdate || input.updatedDate !== undefined) {
    if (input.updatedDate === undefined || input.updatedDate === null || String(input.updatedDate).trim() === '') {
      errors.push({ field: 'updatedDate', message: 'Updated date is required' });
    }
  }

  // Arrays parsing helper
  const parseStringArray = (field: string, val: unknown) => {
    if (val === undefined) return undefined;
    if (!Array.isArray(val)) {
      errors.push({ field, message: `${field} must be an array of strings` });
      return [];
    }
    return val.map(v => String(v).trim()).filter(Boolean);
  };

  const parsedTechnologies = parseStringArray('technologies', input.technologies);
  const parsedKeyFeatures = parseStringArray('keyFeatures', input.keyFeatures);
  const parsedChallenges = parseStringArray('challenges', input.challenges);
  const parsedGallery = parseStringArray('gallery', input.gallery);
  const parsedTags = parseStringArray('tags', input.tags);
  const parsedServiceSlugs = parseStringArray('serviceSlugs', input.serviceSlugs);

  // Status
  if (input.status !== undefined && input.status !== null) {
    const statusStr = String(input.status).trim();
    if (statusStr !== 'Completed' && statusStr !== 'In Progress' && statusStr !== 'Coming Soon') {
      errors.push({ field: 'status', message: 'Status must be "Completed", "In Progress", or "Coming Soon"' });
    }
  }

  // Display Order
  let parsedDisplayOrder: number | undefined;
  if (input.displayOrder !== undefined && input.displayOrder !== null) {
    const num = Number(input.displayOrder);
    if (isNaN(num)) {
      errors.push({ field: 'displayOrder', message: 'Display order must be a valid number' });
    } else {
      parsedDisplayOrder = num;
    }
  }

  if (errors.length > 0) {
    throw ApiError.validationError('Validation failed', errors);
  }

  if (isUpdate) {
    const updatePayload: Record<string, unknown> = {};
    if (input.title !== undefined) updatePayload.title = String(input.title).trim();
    if (input.slug !== undefined) updatePayload.slug = String(input.slug).trim().toLowerCase();
    if (input.description !== undefined) updatePayload.description = String(input.description).trim();
    if (input.thumbnail !== undefined) updatePayload.thumbnail = String(input.thumbnail).trim();
    if (input.category !== undefined) updatePayload.category = String(input.category).trim();
    if (input.liveUrl !== undefined) updatePayload.liveUrl = String(input.liveUrl).trim();
    if (input.githubUrl !== undefined) updatePayload.githubUrl = String(input.githubUrl).trim();
    if (input.featured !== undefined) {
      updatePayload.featured = input.featured === true || input.featured === 'true';
    }
    if (input.date !== undefined) updatePayload.date = String(input.date).trim();
    if (input.client !== undefined) updatePayload.client = String(input.client).trim();
    if (input.role !== undefined) updatePayload.role = String(input.role).trim();
    if (input.longDescription !== undefined) updatePayload.longDescription = String(input.longDescription).trim();
    if (input.industry !== undefined) updatePayload.industry = String(input.industry).trim();
    if (input.updatedDate !== undefined) updatePayload.updatedDate = String(input.updatedDate).trim();
    if (input.displayOrder !== undefined && input.displayOrder !== null) {
      updatePayload.displayOrder = parsedDisplayOrder;
    }
    if (input.seoTitle !== undefined) updatePayload.seoTitle = String(input.seoTitle).trim();
    if (input.seoDescription !== undefined) updatePayload.seoDescription = String(input.seoDescription).trim();
    if (input.technologies !== undefined) updatePayload.technologies = parsedTechnologies ?? [];
    if (input.keyFeatures !== undefined) updatePayload.keyFeatures = parsedKeyFeatures ?? [];
    if (input.challenges !== undefined) updatePayload.challenges = parsedChallenges ?? [];
    if (input.gallery !== undefined) updatePayload.gallery = parsedGallery ?? [];
    if (input.tags !== undefined) updatePayload.tags = parsedTags ?? [];
    if (input.serviceSlugs !== undefined) updatePayload.serviceSlugs = parsedServiceSlugs ?? [];
    if (input.status !== undefined && input.status !== null) {
      updatePayload.status = String(input.status).trim();
    }
    return updatePayload;
  }

  const result: Record<string, unknown> = {
    title: input.title ? String(input.title).trim() : undefined,
    slug: input.slug !== undefined ? String(input.slug).trim().toLowerCase() : undefined,
    description: input.description ? String(input.description).trim() : undefined,
    thumbnail: input.thumbnail ? String(input.thumbnail).trim() : undefined,
    category: input.category ? String(input.category).trim() : undefined,
    liveUrl: input.liveUrl ? String(input.liveUrl).trim() : '#',
    githubUrl: input.githubUrl ? String(input.githubUrl).trim() : '#',
    featured: input.featured !== undefined ? (input.featured === true || input.featured === 'true') : false,
    date: input.date ? String(input.date).trim() : undefined,
    client: input.client ? String(input.client).trim() : undefined,
    role: input.role ? String(input.role).trim() : undefined,
    longDescription: input.longDescription ? String(input.longDescription).trim() : undefined,
    industry: input.industry ? String(input.industry).trim() : undefined,
    updatedDate: input.updatedDate ? String(input.updatedDate).trim() : undefined,
    displayOrder: parsedDisplayOrder ?? 0,
    seoTitle: input.seoTitle !== undefined ? String(input.seoTitle).trim() : undefined,
    seoDescription: input.seoDescription !== undefined ? String(input.seoDescription).trim() : undefined,
  };

  if (parsedTechnologies) result.technologies = parsedTechnologies;
  if (parsedKeyFeatures) result.keyFeatures = parsedKeyFeatures;
  if (parsedChallenges) result.challenges = parsedChallenges;
  if (parsedGallery) result.gallery = parsedGallery;
  if (parsedTags) result.tags = parsedTags;
  if (parsedServiceSlugs) result.serviceSlugs = parsedServiceSlugs;
  if (input.status) result.status = String(input.status).trim();

  return result;
}
