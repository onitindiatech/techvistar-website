/**
 * @file src/validators/auth.validator.ts
 * @description Native validator for admin login input.
 */

import { ApiError } from '@/utils/ApiError';

interface AdminLoginInput {
  email?: unknown;
  password?: unknown;
}

export function validateAdminLoginInput(input: AdminLoginInput): {
  email: string;
  password: string;
} {
  const errors: Array<{ field: string; message: string }> = [];

  if (input.email === undefined || input.email === null || String(input.email).trim() === '') {
    errors.push({ field: 'email', message: 'Email is required' });
  } else {
    const email = String(input.email).trim().toLowerCase();
    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      errors.push({ field: 'email', message: 'Please provide a valid email address' });
    }
  }

  if (input.password === undefined || input.password === null || String(input.password).trim() === '') {
    errors.push({ field: 'password', message: 'Password is required' });
  } else if (String(input.password).length < 6) {
    errors.push({ field: 'password', message: 'Password must be at least 6 characters long' });
  }

  if (errors.length > 0) {
    throw ApiError.validationError('Validation failed', errors);
  }

  return {
    email: String(input.email).trim().toLowerCase(),
    password: String(input.password),
  };
}
