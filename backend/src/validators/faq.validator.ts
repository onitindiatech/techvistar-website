/**
 * @file src/validators/faq.validator.ts
 * @description Native (no-library) input validator for FAQ CMS entries.
 *
 * Pattern follows project.validator.ts and service.validator.ts exactly.
 * Business logic stays in the service layer; this file only validates shape.
 */

import { ApiError } from '@/utils/ApiError';

const VALID_CATEGORIES = ['General', 'Services', 'Work', 'Careers', 'Contact', 'AI', 'Backend', 'Frontend'] as const;
const VALID_PAGES      = ['home', 'services', 'work', 'careers', 'contact', 'all'] as const;
const VALID_STATUSES   = ['active', 'inactive'] as const;

interface FAQInput {
  faqId?:          unknown;
  question?:       unknown;
  answer?:         unknown;
  category?:       unknown;
  page?:           unknown;
  tags?:           unknown;
  featured?:       unknown;
  status?:         unknown;
  displayOrder?:   unknown;
  seoTitle?:       unknown;
  seoDescription?: unknown;
}

export function validateFAQInput(input: FAQInput, isUpdate = false): any {
  const errors: Array<{ field: string; message: string }> = [];

  // faqId (required on create, optional on update)
  if (!isUpdate) {
    if (!input.faqId || String(input.faqId).trim() === '') {
      errors.push({ field: 'faqId', message: 'FAQ ID is required' });
    }
  }

  // question
  if (!isUpdate || input.question !== undefined) {
    if (!input.question || String(input.question).trim() === '') {
      errors.push({ field: 'question', message: 'Question is required' });
    }
  }

  // answer
  if (!isUpdate || input.answer !== undefined) {
    if (!input.answer || String(input.answer).trim() === '') {
      errors.push({ field: 'answer', message: 'Answer is required' });
    }
  }

  // category
  if (!isUpdate || input.category !== undefined) {
    if (!input.category || String(input.category).trim() === '') {
      errors.push({ field: 'category', message: 'Category is required' });
    } else if (!VALID_CATEGORIES.includes(input.category as any)) {
      errors.push({
        field: 'category',
        message: `Category must be one of: ${VALID_CATEGORIES.join(', ')}`,
      });
    }
  }

  // page
  if (!isUpdate || input.page !== undefined) {
    if (!input.page || String(input.page).trim() === '') {
      errors.push({ field: 'page', message: 'Page context is required' });
    } else if (!VALID_PAGES.includes(input.page as any)) {
      errors.push({
        field: 'page',
        message: `Page must be one of: ${VALID_PAGES.join(', ')}`,
      });
    }
  }

  // tags (optional array)
  let parsedTags: string[] | undefined;
  if (input.tags !== undefined) {
    if (!Array.isArray(input.tags)) {
      errors.push({ field: 'tags', message: 'Tags must be an array of strings' });
    } else {
      parsedTags = input.tags.map((t) => String(t).trim()).filter(Boolean);
    }
  }

  // status (optional, validated if present)
  if (input.status !== undefined) {
    if (!VALID_STATUSES.includes(input.status as any)) {
      errors.push({ field: 'status', message: 'Status must be "active" or "inactive"' });
    }
  }

  // displayOrder
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

  const result: any = {
    question:       input.question       ? String(input.question).trim()       : undefined,
    answer:         input.answer         ? String(input.answer).trim()         : undefined,
    category:       input.category       ? String(input.category).trim()       : undefined,
    page:           input.page           ? String(input.page).trim()           : undefined,
    featured:       input.featured !== undefined ? Boolean(input.featured)     : undefined,
    seoTitle:       input.seoTitle       !== undefined ? String(input.seoTitle).trim()       : undefined,
    seoDescription: input.seoDescription !== undefined ? String(input.seoDescription).trim() : undefined,
  };

  if (!isUpdate && input.faqId) {
    result.faqId = String(input.faqId).trim().toLowerCase();
  }

  if (parsedTags !== undefined)       result.tags           = parsedTags;
  if (parsedDisplayOrder !== undefined) result.displayOrder = parsedDisplayOrder;
  if (input.status !== undefined)     result.status         = String(input.status).trim();

  return result;
}
