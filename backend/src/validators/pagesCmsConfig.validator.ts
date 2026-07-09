/**
 * @file src/validators/pagesCmsConfig.validator.ts
 */

import { ApiError } from '@/utils/ApiError';
import { pickSeoForCreate } from '@/utils/seoFields';

function parsePageSeoBlock(block: Record<string, unknown> | undefined) {
  return pickSeoForCreate(block ?? {});
}

export function validatePagesCmsConfigInput(input: Record<string, unknown>): Record<string, unknown> {
  const about =
    input.about && typeof input.about === 'object' ? (input.about as Record<string, unknown>) : {};
  const careers =
    input.careers && typeof input.careers === 'object' ? (input.careers as Record<string, unknown>) : {};

  return {
    about: parsePageSeoBlock(about),
    careers: parsePageSeoBlock(careers),
  };
}

export function validatePagesCmsConfigPartialInput(input: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  if (input.about && typeof input.about === 'object') {
    result.about = parsePageSeoBlock(input.about as Record<string, unknown>);
  }
  if (input.careers && typeof input.careers === 'object') {
    result.careers = parsePageSeoBlock(input.careers as Record<string, unknown>);
  }

  if (!result.about && !result.careers) {
    throw ApiError.validationError('Validation failed', [
      { field: 'body', message: 'At least one of about or careers must be provided' },
    ]);
  }

  return result;
}
