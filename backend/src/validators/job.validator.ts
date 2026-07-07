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
  displayOrder?: unknown;
  status?: unknown;
  featured?: unknown;
  applicationDeadline?: unknown;
}

export function validateJobInput(input: JobInput, isUpdate = false): Record<string, unknown> {
  const errors: Array<{ field: string; message: string }> = [];

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

  let parsedRequirements: string[] | undefined;
  if (input.requirements !== undefined) {
    if (!Array.isArray(input.requirements)) {
      errors.push({ field: 'requirements', message: 'Requirements must be an array of strings' });
    } else {
      parsedRequirements = input.requirements.map((r) => String(r).trim()).filter(Boolean);
    }
  }

  let parsedResponsibilities: string[] | undefined;
  if (input.responsibilities !== undefined) {
    if (!Array.isArray(input.responsibilities)) {
      errors.push({ field: 'responsibilities', message: 'Responsibilities must be an array of strings' });
    } else {
      parsedResponsibilities = input.responsibilities.map((r) => String(r).trim()).filter(Boolean);
    }
  }

  let parsedBenefits: string[] | undefined;
  if (input.benefits !== undefined) {
    if (!Array.isArray(input.benefits)) {
      errors.push({ field: 'benefits', message: 'Benefits must be an array of strings' });
    } else {
      parsedBenefits = input.benefits.map((b) => String(b).trim()).filter(Boolean);
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

  let parsedDisplayOrder: number | undefined;
  if (input.displayOrder !== undefined && input.displayOrder !== null) {
    const num = Number(input.displayOrder);
    if (isNaN(num)) {
      errors.push({ field: 'displayOrder', message: 'Display order must be a valid number' });
    } else {
      parsedDisplayOrder = num;
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

  if (isUpdate) {
    const updatePayload: Record<string, unknown> = {};
    if (input.title !== undefined) updatePayload.title = String(input.title).trim();
    if (input.slug !== undefined) updatePayload.slug = String(input.slug).trim().toLowerCase();
    if (input.department !== undefined) updatePayload.department = String(input.department).trim();
    if (input.location !== undefined) updatePayload.location = String(input.location).trim();
    if (input.employmentType !== undefined) updatePayload.employmentType = String(input.employmentType).trim();
    if (input.experience !== undefined) updatePayload.experience = String(input.experience).trim();
    if (input.salary !== undefined) updatePayload.salary = String(input.salary).trim();
    if (input.description !== undefined) updatePayload.description = String(input.description).trim();
    if (parsedRequirements !== undefined) updatePayload.requirements = parsedRequirements;
    if (parsedResponsibilities !== undefined) updatePayload.responsibilities = parsedResponsibilities;
    if (parsedBenefits !== undefined) updatePayload.benefits = parsedBenefits;
    if (input.status !== undefined && input.status !== null) {
      updatePayload.status = String(input.status).trim();
    }
    if (parsedDisplayOrder !== undefined) updatePayload.displayOrder = parsedDisplayOrder;
    if (input.featured !== undefined) {
      updatePayload.featured = input.featured === true || input.featured === 'true';
    }
    if (parsedDeadline !== undefined) updatePayload.applicationDeadline = parsedDeadline;
    return updatePayload;
  }

  return {
    title: String(input.title).trim(),
    ...(input.slug !== undefined && { slug: String(input.slug).trim().toLowerCase() }),
    department: String(input.department).trim(),
    location: String(input.location).trim(),
    employmentType: String(input.employmentType).trim(),
    experience: String(input.experience).trim(),
    salary: input.salary ? String(input.salary).trim() : 'Competitive',
    description: String(input.description).trim(),
    requirements: parsedRequirements ?? [],
    responsibilities: parsedResponsibilities ?? [],
    benefits: parsedBenefits ?? [],
    status: input.status ? String(input.status).trim() : 'draft',
    displayOrder: parsedDisplayOrder ?? 0,
    featured: input.featured === true || input.featured === 'true',
    ...(parsedDeadline && { applicationDeadline: parsedDeadline }),
  };
}
