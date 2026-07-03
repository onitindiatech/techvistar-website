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
  serviceInterested: 'web-development' | 'mobile-development' | 'ui-ux' | 'consulting' | 'other';
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
    }
  }

  // 2. Email Check
  if (input.email === undefined || input.email === null || String(input.email).trim() === '') {
    errors.push({ field: 'email', message: 'Email is required' });
  } else {
    const emailStr = String(input.email).trim().toLowerCase();
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(emailStr)) {
      errors.push({ field: 'email', message: 'Please enter a valid email address' });
    }
  }

  // 3. Phone Check
  if (input.phone === undefined || input.phone === null || String(input.phone).trim() === '') {
    errors.push({ field: 'phone', message: 'Phone number is required' });
  }

  // 4. Service Check
  const validServices = ['web-development', 'mobile-development', 'ui-ux', 'consulting', 'other'];
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

  // 5. Message Check
  if (input.message === undefined || input.message === null || String(input.message).trim() === '') {
    errors.push({ field: 'message', message: 'Message is required' });
  } else {
    const msgStr = String(input.message).trim();
    if (msgStr.length < 10) {
      errors.push({ field: 'message', message: 'Message must be at least 10 characters long' });
    } else if (msgStr.length > 1000) {
      errors.push({ field: 'message', message: 'Message cannot exceed 1000 characters' });
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
