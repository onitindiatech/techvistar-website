/**
 * @file src/validators/service.validator.ts
 * @description Native validator for Services CMS entries including rich CMS parameters.
 */

import { ApiError } from '@/utils/ApiError';

interface ServiceInput {
  title?: unknown;
  slug?: unknown;
  shortDescription?: unknown;
  fullDescription?: unknown;
  icon?: unknown;
  coverImage?: unknown;
  features?: unknown;
  technologies?: unknown;
  benefits?: unknown;
  displayOrder?: unknown;
  status?: unknown;
  seoTitle?: unknown;
  seoDescription?: unknown;

  // Rich CMS fields
  category?: unknown;
  thumbnail?: unknown;
  overview?: unknown;
  offerings?: unknown;
  process?: unknown;
  caseStudies?: unknown;
  cta?: unknown;
  featured?: unknown;
  industries?: unknown;
  whyChooseUs?: unknown;
  stats?: unknown;
  detailedOfferings?: unknown;
  dashboardImage?: unknown;
}

export function validateServiceInput(input: ServiceInput, isUpdate = false): any {
  const errors: Array<{ field: string; message: string }> = [];

  // Title
  if (!isUpdate || input.title !== undefined) {
    if (input.title === undefined || input.title === null || String(input.title).trim() === '') {
      errors.push({ field: 'title', message: 'Service title is required' });
    }
  }

  // Slug
  if (input.slug !== undefined && input.slug !== null) {
    const slugStr = String(input.slug).trim().toLowerCase();
    if (slugStr === '') {
      errors.push({ field: 'slug', message: 'Slug cannot be empty' });
    }
  }

  // Short Description
  if (!isUpdate || input.shortDescription !== undefined) {
    if (input.shortDescription === undefined || input.shortDescription === null || String(input.shortDescription).trim() === '') {
      errors.push({ field: 'shortDescription', message: 'Short description is required' });
    }
  }

  // Full Description
  if (!isUpdate || input.fullDescription !== undefined) {
    if (input.fullDescription === undefined || input.fullDescription === null || String(input.fullDescription).trim() === '') {
      errors.push({ field: 'fullDescription', message: 'Full description is required' });
    }
  }

  // Icon
  if (!isUpdate || input.icon !== undefined) {
    if (input.icon === undefined || input.icon === null || String(input.icon).trim() === '') {
      errors.push({ field: 'icon', message: 'Icon identifier is required' });
    }
  }

  // Category
  if (!isUpdate || input.category !== undefined) {
    if (input.category === undefined || input.category === null || String(input.category).trim() === '') {
      errors.push({ field: 'category', message: 'Category is required' });
    }
  }

  // Overview
  if (!isUpdate || input.overview !== undefined) {
    if (input.overview === undefined || input.overview === null || String(input.overview).trim() === '') {
      errors.push({ field: 'overview', message: 'Overview is required' });
    }
  }

  // Arrays validation helpers
  const parseStringArray = (field: string, val: unknown) => {
    if (val === undefined) return [];
    if (!Array.isArray(val)) {
      errors.push({ field, message: `${field} must be an array of strings` });
      return [];
    }
    return val.map(v => String(v).trim()).filter(Boolean);
  };

  const parsedFeatures = parseStringArray('features', input.features);
  const parsedTechnologies = parseStringArray('technologies', input.technologies);
  const parsedBenefits = parseStringArray('benefits', input.benefits);
  const parsedOfferings = parseStringArray('offerings', input.offerings);
  const parsedIndustries = parseStringArray('industries', input.industries);

  // Process
  let parsedProcess: any[] = [];
  if (input.process !== undefined) {
    if (!Array.isArray(input.process)) {
      errors.push({ field: 'process', message: 'Process must be an array of steps' });
    } else {
      parsedProcess = input.process.map((p: any, idx: number) => {
        if (!p || typeof p !== 'object') {
          errors.push({ field: `process[${idx}]`, message: 'Process step must be an object' });
          return null;
        }
        return {
          step: Number(p.step) || idx + 1,
          title: String(p.title || '').trim(),
          description: String(p.description || '').trim()
        };
      }).filter(Boolean);
    }
  }

  // Case Studies
  let parsedCaseStudies: any[] = [];
  if (input.caseStudies !== undefined) {
    if (!Array.isArray(input.caseStudies)) {
      errors.push({ field: 'caseStudies', message: 'Case studies must be an array' });
    } else {
      parsedCaseStudies = input.caseStudies.map((c: any, idx: number) => {
        if (!c || typeof c !== 'object') {
          errors.push({ field: `caseStudies[${idx}]`, message: 'Case study must be an object' });
          return null;
        }
        return {
          title: String(c.title || '').trim(),
          description: String(c.description || '').trim(),
          link: String(c.link || '').trim()
        };
      }).filter(Boolean);
    }
  }

  // Why Choose Us
  let parsedWhyChooseUs: any[] = [];
  if (input.whyChooseUs !== undefined) {
    if (!Array.isArray(input.whyChooseUs)) {
      errors.push({ field: 'whyChooseUs', message: 'whyChooseUs must be an array' });
    } else {
      parsedWhyChooseUs = input.whyChooseUs.map((w: any, idx: number) => {
        if (!w || typeof w !== 'object') {
          errors.push({ field: `whyChooseUs[${idx}]`, message: 'Why Choose Us item must be an object' });
          return null;
        }
        return {
          title: String(w.title || '').trim(),
          description: String(w.description || '').trim()
        };
      }).filter(Boolean);
    }
  }

  // Stats
  let parsedStats: any[] = [];
  if (input.stats !== undefined) {
    if (!Array.isArray(input.stats)) {
      errors.push({ field: 'stats', message: 'Stats must be an array' });
    } else {
      parsedStats = input.stats.map((s: any, idx: number) => {
        if (!s || typeof s !== 'object') {
          errors.push({ field: `stats[${idx}]`, message: 'Stat must be an object' });
          return null;
        }
        return {
          value: String(s.value || '').trim(),
          label: String(s.label || '').trim(),
          iconType: String(s.iconType || '').trim(),
          colorTheme: String(s.colorTheme || '').trim()
        };
      }).filter(Boolean);
    }
  }

  // Detailed Offerings
  let parsedDetailedOfferings: any[] = [];
  if (input.detailedOfferings !== undefined) {
    if (!Array.isArray(input.detailedOfferings)) {
      errors.push({ field: 'detailedOfferings', message: 'Detailed offerings must be an array' });
    } else {
      parsedDetailedOfferings = input.detailedOfferings.map((d: any, idx: number) => {
        if (!d || typeof d !== 'object') {
          errors.push({ field: `detailedOfferings[${idx}]`, message: 'Detailed offering must be an object' });
          return null;
        }
        return {
          title: String(d.title || '').trim(),
          description: String(d.description || '').trim(),
          badges: Array.isArray(d.badges) ? d.badges.map((b: any) => String(b).trim()).filter(Boolean) : [],
          color: String(d.color || '').trim(),
          iconName: String(d.iconName || '').trim()
        };
      }).filter(Boolean);
    }
  }

  // Display Order
  let parsedDisplayOrder = 0;
  if (input.displayOrder !== undefined && input.displayOrder !== null) {
    const num = Number(input.displayOrder);
    if (isNaN(num)) {
      errors.push({ field: 'displayOrder', message: 'Display order must be a valid number' });
    } else {
      parsedDisplayOrder = num;
    }
  }

  // Status
  if (input.status !== undefined && input.status !== null) {
    const statusStr = String(input.status).trim();
    if (statusStr !== 'draft' && statusStr !== 'active') {
      errors.push({ field: 'status', message: 'Status must be either "draft" or "active"' });
    }
  }

  if (errors.length > 0) {
    throw ApiError.validationError('Validation failed', errors);
  }

  return {
    title: input.title ? String(input.title).trim() : '',
    ...(input.slug !== undefined && { slug: String(input.slug).trim().toLowerCase() }),
    shortDescription: input.shortDescription ? String(input.shortDescription).trim() : '',
    fullDescription: input.fullDescription ? String(input.fullDescription).trim() : '',
    icon: input.icon ? String(input.icon).trim() : '',
    coverImage: input.coverImage ? String(input.coverImage).trim() : '',
    features: parsedFeatures,
    technologies: parsedTechnologies,
    benefits: parsedBenefits,
    displayOrder: parsedDisplayOrder,
    status: (input.status ? String(input.status).trim() : 'draft') as 'draft' | 'active',
    seoTitle: input.seoTitle ? String(input.seoTitle).trim() : '',
    seoDescription: input.seoDescription ? String(input.seoDescription).trim() : '',

    category: input.category ? String(input.category).trim() : '',
    thumbnail: input.thumbnail ? String(input.thumbnail).trim() : '',
    overview: input.overview ? String(input.overview).trim() : '',
    offerings: parsedOfferings,
    ...(input.process !== undefined && { process: parsedProcess }),
    ...(input.caseStudies !== undefined && { caseStudies: parsedCaseStudies }),
    cta: input.cta ? String(input.cta).trim() : '',
    featured: input.featured === true || input.featured === 'true',
    industries: parsedIndustries,
    ...(input.whyChooseUs !== undefined && { whyChooseUs: parsedWhyChooseUs }),
    ...(input.stats !== undefined && { stats: parsedStats }),
    ...(input.detailedOfferings !== undefined && { detailedOfferings: parsedDetailedOfferings }),
    dashboardImage: input.dashboardImage ? String(input.dashboardImage).trim() : '',
  };
}
