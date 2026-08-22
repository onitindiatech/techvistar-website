/**
 * @file src/validators/job.validator.ts
 * @description Native validator for Career Job listings.
 */

import { ApiError } from '@/utils/ApiError';
import { VALIDATION } from '@/constants';
import { pickSeoForCreate, pickSeoForUpdate, SeoInput } from '@/utils/seoFields';

interface JobInput extends SeoInput {
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
  roleOverview?: unknown;
  keyHighlights?: unknown;
  preferredQualifications?: unknown;
  skills?: unknown;
  techStack?: unknown;
  whatYouWillWorkOn?: unknown;
  hiringProcess?: unknown;
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

  let parsedRoleOverview: string | undefined;
  if (input.roleOverview !== undefined && input.roleOverview !== null) {
    parsedRoleOverview = String(input.roleOverview).trim();
  }

  let parsedKeyHighlights: string[] | undefined;
  if (input.keyHighlights !== undefined) {
    if (Array.isArray(input.keyHighlights)) {
      parsedKeyHighlights = input.keyHighlights.map((k) => String(k).trim()).filter(Boolean);
    }
  }

  let parsedPreferredQualifications: string[] | undefined;
  if (input.preferredQualifications !== undefined) {
    if (Array.isArray(input.preferredQualifications)) {
      parsedPreferredQualifications = input.preferredQualifications.map((p) => String(p).trim()).filter(Boolean);
    }
  }

  let parsedSkills: string[] | undefined;
  if (input.skills !== undefined) {
    if (Array.isArray(input.skills)) {
      parsedSkills = input.skills.map((s) => String(s).trim()).filter(Boolean);
    }
  }

  let parsedTechStack: string[] | undefined;
  if (input.techStack !== undefined) {
    if (Array.isArray(input.techStack)) {
      parsedTechStack = input.techStack.map((t) => String(t).trim()).filter(Boolean);
    }
  }

  let parsedWhatYouWillWorkOn: string[] | undefined;
  if (input.whatYouWillWorkOn !== undefined) {
    if (Array.isArray(input.whatYouWillWorkOn)) {
      parsedWhatYouWillWorkOn = input.whatYouWillWorkOn.map((w) => String(w).trim()).filter(Boolean);
    }
  }

  let parsedHiringProcess: Array<{ step?: number; title: string; description: string }> | undefined;
  if (input.hiringProcess !== undefined) {
    if (Array.isArray(input.hiringProcess)) {
      parsedHiringProcess = input.hiringProcess
        .filter((item: any) => item && (item.title || item.description))
        .map((item: any, idx: number) => ({
          step: Number(item.step) || idx + 1,
          title: String(item.title || '').trim(),
          description: String(item.description || '').trim(),
        }));
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
    if (parsedRoleOverview !== undefined) updatePayload.roleOverview = parsedRoleOverview;
    if (parsedKeyHighlights !== undefined) updatePayload.keyHighlights = parsedKeyHighlights;
    if (parsedPreferredQualifications !== undefined) updatePayload.preferredQualifications = parsedPreferredQualifications;
    if (parsedSkills !== undefined) updatePayload.skills = parsedSkills;
    if (parsedTechStack !== undefined) updatePayload.techStack = parsedTechStack;
    if (parsedWhatYouWillWorkOn !== undefined) updatePayload.whatYouWillWorkOn = parsedWhatYouWillWorkOn;
    if (parsedHiringProcess !== undefined) updatePayload.hiringProcess = parsedHiringProcess;
    if (input.status !== undefined && input.status !== null) {
      updatePayload.status = String(input.status).trim();
    }
    if (parsedDisplayOrder !== undefined) updatePayload.displayOrder = parsedDisplayOrder;
    if (input.featured !== undefined) {
      updatePayload.featured = input.featured === true || input.featured === 'true';
    }
    if (parsedDeadline !== undefined) updatePayload.applicationDeadline = parsedDeadline;
    Object.assign(updatePayload, pickSeoForUpdate(input));
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
    roleOverview: parsedRoleOverview ?? '',
    keyHighlights: parsedKeyHighlights ?? [],
    preferredQualifications: parsedPreferredQualifications ?? [],
    skills: parsedSkills ?? [],
    techStack: parsedTechStack ?? [],
    whatYouWillWorkOn: parsedWhatYouWillWorkOn ?? [],
    hiringProcess: parsedHiringProcess ?? [],
    status: input.status ? String(input.status).trim() : 'draft',
    displayOrder: parsedDisplayOrder ?? 0,
    featured: input.featured === true || input.featured === 'true',
    ...(parsedDeadline && { applicationDeadline: parsedDeadline }),
    ...pickSeoForCreate(input),
  };
}
