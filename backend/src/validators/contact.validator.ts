/**
 * @file src/validators/contact.validator.ts
 * @description Native validator for Contact Us form input.
 *
 * ARCHITECTURE DECISION:
 *   Validates input structure and format before invoking service logic.
 *   Accumulates all validation errors into a structured array and throws
 *   ApiError.validationError, which is captured by the global error handler.
 */

import { ApiError } from '@/utils/ApiError';
import { VALIDATION } from '@/constants';

interface ContactInput {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  company?: unknown;
  serviceInterested?: unknown;
  budget?: unknown;
  message?: unknown;
}

export function validateContactInput(input: ContactInput): {
  name: string;
  email: string;
  phone: string;
  company: string;
  serviceInterested: typeof VALIDATION.VALID_SERVICES[number];
  budget: string;
  message: string;
} {
  const errors: Array<{ field: string; message: string }> = [];

  // 1. Name Check
  if (input.name === undefined || input.name === null || String(input.name).trim() === '') {
    errors.push({ field: 'name', message: 'Name is required' });
  } else {
    const nameStr = String(input.name).trim();
    if (nameStr.length < 2) {
      errors.push({ field: 'name', message: 'Name must be at least 2 characters long' });
    } else if (nameStr.length > VALIDATION.LIMITS.NAME_MAX) {
      errors.push({ field: 'name', message: `Name cannot exceed ${VALIDATION.LIMITS.NAME_MAX} characters` });
    }
  }

  // 2. Email Check
  if (input.email === undefined || input.email === null || String(input.email).trim() === '') {
    errors.push({ field: 'email', message: 'Email is required' });
  } else {
    const emailStr = String(input.email).trim().toLowerCase();
    if (!VALIDATION.EMAIL_REGEX.test(emailStr)) {
      errors.push({ field: 'email', message: 'Please enter a valid email address' });
    }
  }

  // 3. Phone Check
  if (input.phone === undefined || input.phone === null || String(input.phone).trim() === '') {
    errors.push({ field: 'phone', message: 'Phone number is required' });
  } else {
    const phoneStr = String(input.phone).trim();
    if (!VALIDATION.PHONE_REGEX.test(phoneStr)) {
      errors.push({ field: 'phone', message: 'Please enter a valid phone number' });
    } else if (phoneStr.length > VALIDATION.LIMITS.PHONE_MAX) {
      errors.push({ field: 'phone', message: `Phone number cannot exceed ${VALIDATION.LIMITS.PHONE_MAX} characters` });
    }
  }

  // 4. Service Check
  const validServices = VALIDATION.VALID_SERVICES as readonly string[];
  if (input.serviceInterested === undefined || input.serviceInterested === null || String(input.serviceInterested).trim() === '') {
    errors.push({ field: 'serviceInterested', message: 'Service of interest is required' });
  } else {
    const serviceStr = String(input.serviceInterested).trim();
    if (!validServices.includes(serviceStr)) {
      errors.push({
        field: 'serviceInterested',
        message: `Service of interest must be one of: ${validServices.join(', ')}`,
      });
    }
  }

  // 5. Company Check (Optional but limited)
  if (input.company !== undefined && input.company !== null) {
    const companyStr = String(input.company).trim();
    if (companyStr.length > VALIDATION.LIMITS.COMPANY_MAX) {
      errors.push({ field: 'company', message: `Company name cannot exceed ${VALIDATION.LIMITS.COMPANY_MAX} characters` });
    }
  }

  // 6. Budget Check (Optional but limited)
  if (input.budget !== undefined && input.budget !== null) {
    const budgetStr = String(input.budget).trim();
    if (budgetStr.length > VALIDATION.LIMITS.BUDGET_MAX) {
      errors.push({ field: 'budget', message: `Budget info cannot exceed ${VALIDATION.LIMITS.BUDGET_MAX} characters` });
    }
  }

  // 7. Message Check
  if (input.message === undefined || input.message === null || String(input.message).trim() === '') {
    errors.push({ field: 'message', message: 'Message is required' });
  } else {
    const msgStr = String(input.message).trim();
    if (msgStr.length < 10) {
      errors.push({ field: 'message', message: 'Message must be at least 10 characters long' });
    } else if (msgStr.length > VALIDATION.LIMITS.MESSAGE_MAX) {
      errors.push({ field: 'message', message: `Message cannot exceed ${VALIDATION.LIMITS.MESSAGE_MAX} characters` });
    }
  }

  // If there are validation errors, throw a structured validation exception
  if (errors.length > 0) {
    throw ApiError.validationError('Validation failed', errors);
  }

  return {
    name: String(input.name).trim(),
    email: String(input.email).trim().toLowerCase(),
    phone: String(input.phone).trim(),
    company: input.company ? String(input.company).trim() : '',
    serviceInterested: String(input.serviceInterested).trim() as any,
    budget: input.budget ? String(input.budget).trim() : '',
    message: String(input.message).trim(),
  };
}

const CONTACT_STATUSES = ['new', 'in-progress', 'resolved', 'archived'] as const;

export function validateContactStatusUpdate(input: { status?: unknown }): {
  status: typeof CONTACT_STATUSES[number];
} {
  const errors: Array<{ field: string; message: string }> = [];

  if (input.status === undefined || input.status === null || String(input.status).trim() === '') {
    errors.push({ field: 'status', message: 'Status is required' });
  } else {
    const statusStr = String(input.status).trim();
    if (!CONTACT_STATUSES.includes(statusStr as typeof CONTACT_STATUSES[number])) {
      errors.push({
        field: 'status',
        message: `Status must be one of: ${CONTACT_STATUSES.join(', ')}`,
      });
    }
  }

  if (errors.length > 0) {
    throw ApiError.validationError('Validation failed', errors);
  }

  return { status: String(input.status).trim() as typeof CONTACT_STATUSES[number] };
}

