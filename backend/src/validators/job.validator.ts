/**
 * @file src/validators/job.validator.ts
 * @description Native validator for Career Job listings.
 */

import { ApiError } from '@/utils/ApiError';
import { VALIDATION } from '@/constants';

interface JobInput {
  title?: unknown;
  slug?: unknown;
  department?: unknown;
  location?: unknown;
  employmentType?: unknown;
  experience?: unknown;
  salary?: unknown;
  description?: unknown;
  requirements?: unknown;
  responsibilities?: unknown;
  benefits?: unknown;
  status?: unknown;
  featured?: unknown;
  applicationDeadline?: unknown;
}

export function validateJobInput(input: JobInput, isUpdate = false): {
  title: string;
  slug?: string;
  department: typeof VALIDATION.JOB_DEPARTMENTS[number];
  location: string;
  employmentType: typeof VALIDATION.JOB_EMPLOYMENT_TYPES[number];
  experience: string;
  salary: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  status: typeof VALIDATION.JOB_STATUSES[number];
  featured: boolean;
  applicationDeadline?: Date;
} {
  const errors: Array<{ field: string; message: string }> = [];

  // Helper validation routines
  if (!isUpdate || input.title !== undefined) {
    if (input.title === undefined || input.title === null || String(input.title).trim() === '') {
      errors.push({ field: 'title', message: 'Job title is required' });
    }
  }

  if (input.slug !== undefined && input.slug !== null) {
    const slugStr = String(input.slug).trim().toLowerCase();
    if (slugStr === '') {
      errors.push({ field: 'slug', message: 'Slug cannot be empty' });
    }
  }

  if (!isUpdate || input.department !== undefined) {
    if (input.department === undefined || input.department === null || String(input.department).trim() === '') {
      errors.push({ field: 'department', message: 'Department is required' });
    } else {
      const deptStr = String(input.department).trim();
      if (!(VALIDATION.JOB_DEPARTMENTS as readonly string[]).includes(deptStr)) {
        errors.push({
          field: 'department',
          message: `Department must be one of: ${VALIDATION.JOB_DEPARTMENTS.join(', ')}`,
        });
      }
    }
  }

  if (!isUpdate || input.location !== undefined) {
    if (input.location === undefined || input.location === null || String(input.location).trim() === '') {
      errors.push({ field: 'location', message: 'Job location is required' });
    }
  }

  if (!isUpdate || input.employmentType !== undefined) {
    if (input.employmentType === undefined || input.employmentType === null || String(input.employmentType).trim() === '') {
      errors.push({ field: 'employmentType', message: 'Employment type is required' });
    } else {
      const empTypeStr = String(input.employmentType).trim();
      if (!(VALIDATION.JOB_EMPLOYMENT_TYPES as readonly string[]).includes(empTypeStr)) {
        errors.push({
          field: 'employmentType',
          message: `Employment type must be one of: ${VALIDATION.JOB_EMPLOYMENT_TYPES.join(', ')}`,
        });
      }
    }
  }

  if (!isUpdate || input.experience !== undefined) {
    if (input.experience === undefined || input.experience === null || String(input.experience).trim() === '') {
      errors.push({ field: 'experience', message: 'Experience requirement is required' });
    }
  }

  if (!isUpdate || input.description !== undefined) {
    if (input.description === undefined || input.description === null || String(input.description).trim() === '') {
      errors.push({ field: 'description', message: 'Job description is required' });
    }
  }

  let parsedRequirements: string[] = [];
  if (input.requirements !== undefined) {
    if (!Array.isArray(input.requirements)) {
      errors.push({ field: 'requirements', message: 'Requirements must be an array of strings' });
    } else {
      parsedRequirements = input.requirements.map(r => String(r).trim()).filter(Boolean);
    }
  }

  let parsedResponsibilities: string[] = [];
  if (input.responsibilities !== undefined) {
    if (!Array.isArray(input.responsibilities)) {
      errors.push({ field: 'responsibilities', message: 'Responsibilities must be an array of strings' });
    } else {
      parsedResponsibilities = input.responsibilities.map(r => String(r).trim()).filter(Boolean);
    }
  }

  let parsedBenefits: string[] = [];
  if (input.benefits !== undefined) {
    if (!Array.isArray(input.benefits)) {
      errors.push({ field: 'benefits', message: 'Benefits must be an array of strings' });
    } else {
      parsedBenefits = input.benefits.map(b => String(b).trim()).filter(Boolean);
    }
  }

  if (input.status !== undefined && input.status !== null) {
    const statusStr = String(input.status).trim();
    if (!(VALIDATION.JOB_STATUSES as readonly string[]).includes(statusStr)) {
      errors.push({
        field: 'status',
        message: `Status must be one of: ${VALIDATION.JOB_STATUSES.join(', ')}`,
      });
    }
  }

  let parsedDeadline: Date | undefined;
  if (input.applicationDeadline !== undefined && input.applicationDeadline !== null && String(input.applicationDeadline).trim() !== '') {
    const dateVal = new Date(String(input.applicationDeadline));
    if (isNaN(dateVal.getTime())) {
      errors.push({ field: 'applicationDeadline', message: 'Invalid date format' });
    } else {
      parsedDeadline = dateVal;
    }
  }

  if (errors.length > 0) {
    throw ApiError.validationError('Validation failed', errors);
  }

  return {
    title: input.title ? String(input.title).trim() : '',
    ...(input.slug !== undefined && { slug: String(input.slug).trim().toLowerCase() }),
    department: input.department ? String(input.department).trim() as any : 'Engineering',
    location: input.location ? String(input.location).trim() : '',
    employmentType: input.employmentType ? String(input.employmentType).trim() as any : 'Full-time',
    experience: input.experience ? String(input.experience).trim() : '',
    salary: input.salary ? String(input.salary).trim() : 'Competitive',
    description: input.description ? String(input.description).trim() : '',
    requirements: parsedRequirements,
    responsibilities: parsedResponsibilities,
    benefits: parsedBenefits,
    status: input.status ? String(input.status).trim() as any : 'draft',
    featured: input.featured === true || input.featured === 'true',
    ...(parsedDeadline && { applicationDeadline: parsedDeadline }),
  };
}
