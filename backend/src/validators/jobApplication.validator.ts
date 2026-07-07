/**
 * @file src/validators/jobApplication.validator.ts
 * @description Native validator for Job Applications.
 */

import { ApiError } from '@/utils/ApiError';
import { VALIDATION } from '@/constants';
import mongoose from 'mongoose';

interface JobApplicationInput {
  jobId?: unknown;
  fullName?: unknown;
  email?: unknown;
  phone?: unknown;
  currentLocation?: unknown;
  yearsOfExperience?: unknown;
  linkedin?: unknown;
  portfolio?: unknown;
  resumeUrl?: unknown;
  coverLetter?: unknown;
  whyJoinTechVistar?: unknown;
  status?: unknown;
}

const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/i;

export function validateJobApplicationInput(input: JobApplicationInput, isUpdate = false): {
  jobId: mongoose.Types.ObjectId;
  fullName: string;
  email: string;
  phone: string;
  currentLocation: string;
  yearsOfExperience: number;
  linkedin?: string;
  portfolio?: string;
  resumeUrl: string;
  coverLetter: string;
  whyJoinTechVistar?: string;
  status?: typeof VALIDATION.JOB_APPLICATION_STATUSES[number];
} {
  const errors: Array<{ field: string; message: string }> = [];

  let parsedJobId: mongoose.Types.ObjectId | undefined;

  // 1. Job ID Check
  if (!isUpdate || input.jobId !== undefined) {
    if (input.jobId === undefined || input.jobId === null || String(input.jobId).trim() === '') {
      errors.push({ field: 'jobId', message: 'Job ID is required' });
    } else {
      const jobIdStr = String(input.jobId).trim();
      if (!mongoose.Types.ObjectId.isValid(jobIdStr)) {
        errors.push({ field: 'jobId', message: 'Invalid Job ID format' });
      } else {
        parsedJobId = new mongoose.Types.ObjectId(jobIdStr);
      }
    }
  }

  // 2. Full Name Check
  if (!isUpdate || input.fullName !== undefined) {
    if (input.fullName === undefined || input.fullName === null || String(input.fullName).trim() === '') {
      errors.push({ field: 'fullName', message: 'Full name is required' });
    } else {
      const nameStr = String(input.fullName).trim();
      if (nameStr.length < 2) {
        errors.push({ field: 'fullName', message: 'Full name must be at least 2 characters long' });
      }
    }
  }

  // 3. Email Check
  if (!isUpdate || input.email !== undefined) {
    if (input.email === undefined || input.email === null || String(input.email).trim() === '') {
      errors.push({ field: 'email', message: 'Email is required' });
    } else {
      const emailStr = String(input.email).trim().toLowerCase();
      if (!VALIDATION.EMAIL_REGEX.test(emailStr)) {
        errors.push({ field: 'email', message: 'Please enter a valid email address' });
      }
    }
  }

  // 4. Phone Check
  if (!isUpdate || input.phone !== undefined) {
    if (input.phone === undefined || input.phone === null || String(input.phone).trim() === '') {
      errors.push({ field: 'phone', message: 'Phone number is required' });
    } else {
      const phoneStr = String(input.phone).trim();
      if (!VALIDATION.PHONE_REGEX.test(phoneStr)) {
        errors.push({ field: 'phone', message: 'Please enter a valid phone number' });
      }
    }
  }

  // 5. Current Location Check
  if (!isUpdate || input.currentLocation !== undefined) {
    if (input.currentLocation === undefined || input.currentLocation === null || String(input.currentLocation).trim() === '') {
      errors.push({ field: 'currentLocation', message: 'Current location is required' });
    }
  }

  // 6. Years of Experience Check
  if (!isUpdate || input.yearsOfExperience !== undefined) {
    if (input.yearsOfExperience === undefined || input.yearsOfExperience === null || String(input.yearsOfExperience).trim() === '') {
      errors.push({ field: 'yearsOfExperience', message: 'Years of experience is required' });
    } else {
      const expNum = Number(input.yearsOfExperience);
      if (isNaN(expNum) || expNum < 0) {
        errors.push({ field: 'yearsOfExperience', message: 'Years of experience must be a non-negative number' });
      }
    }
  }

  // 7. LinkedIn URL Check (Optional)
  if (input.linkedin !== undefined && input.linkedin !== null && String(input.linkedin).trim() !== '') {
    const liStr = String(input.linkedin).trim();
    if (!urlPattern.test(liStr)) {
      errors.push({ field: 'linkedin', message: 'Please enter a valid LinkedIn URL' });
    }
  }

  // 8. Portfolio URL Check (Optional)
  if (input.portfolio !== undefined && input.portfolio !== null && String(input.portfolio).trim() !== '') {
    const portStr = String(input.portfolio).trim();
    if (!urlPattern.test(portStr)) {
      errors.push({ field: 'portfolio', message: 'Please enter a valid Portfolio URL' });
    }
  }

  // 9. Cover Letter Check
  if (!isUpdate || input.coverLetter !== undefined) {
    if (input.coverLetter === undefined || input.coverLetter === null || String(input.coverLetter).trim() === '') {
      errors.push({ field: 'coverLetter', message: 'Cover letter is required' });
    } else {
      const clStr = String(input.coverLetter).trim();
      if (clStr.length < 20) {
        errors.push({ field: 'coverLetter', message: 'Cover letter must be at least 20 characters long' });
      }
    }
  }

  // 10. Status Check (Optional/Update only)
  if (input.status !== undefined && input.status !== null) {
    const statusStr = String(input.status).trim();
    const validStatuses = VALIDATION.JOB_APPLICATION_STATUSES as readonly string[];
    if (!validStatuses.includes(statusStr)) {
      errors.push({
        field: 'status',
        message: `Status must be one of: ${validStatuses.join(', ')}`,
      });
    }
  }

  if (errors.length > 0) {
    throw ApiError.validationError('Validation failed', errors);
  }

  return {
    jobId: parsedJobId as mongoose.Types.ObjectId,
    fullName: String(input.fullName).trim(),
    email: String(input.email).trim().toLowerCase(),
    phone: String(input.phone).trim(),
    currentLocation: String(input.currentLocation).trim(),
    yearsOfExperience: Number(input.yearsOfExperience),
    linkedin: input.linkedin ? String(input.linkedin).trim() : '',
    portfolio: input.portfolio ? String(input.portfolio).trim() : '',
    resumeUrl: input.resumeUrl ? String(input.resumeUrl).trim() : 'http://localhost:5000/resumes/placeholder.pdf',
    coverLetter: String(input.coverLetter).trim(),
    whyJoinTechVistar: input.whyJoinTechVistar ? String(input.whyJoinTechVistar).trim() : '',
    status: input.status ? (String(input.status).trim() as any) : undefined,
  };
}

export function validateApplicationStatusUpdate(input: { status?: unknown }): {
  status: typeof VALIDATION.JOB_APPLICATION_STATUSES[number];
} {
  const errors: Array<{ field: string; message: string }> = [];

  if (input.status === undefined || input.status === null || String(input.status).trim() === '') {
    errors.push({ field: 'status', message: 'Status is required' });
  } else {
    const statusStr = String(input.status).trim();
    const validStatuses = VALIDATION.JOB_APPLICATION_STATUSES as readonly string[];
    if (!validStatuses.includes(statusStr)) {
      errors.push({
        field: 'status',
        message: `Status must be one of: ${validStatuses.join(', ')}`,
      });
    }
  }

  if (errors.length > 0) {
    throw ApiError.validationError('Validation failed', errors);
  }

  return { status: String(input.status).trim() as typeof VALIDATION.JOB_APPLICATION_STATUSES[number] };
}
