/**
 * @file src/validators/faq.validator.ts
 * @description Native input validator for FAQ CMS entries.
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

export function validateFAQInput(input: FAQInput, isUpdate = false): Record<string, unknown> {
  const errors: Array<{ field: string; message: string }> = [];

  if (!isUpdate) {
    if (!input.faqId || String(input.faqId).trim() === '') {
      errors.push({ field: 'faqId', message: 'FAQ ID is required' });
    }
  } else if (input.faqId !== undefined) {
    if (!input.faqId || String(input.faqId).trim() === '') {
      errors.push({ field: 'faqId', message: 'FAQ ID cannot be empty' });
    }
  }

  if (!isUpdate || input.question !== undefined) {
    if (input.question === undefined || input.question === null || String(input.question).trim() === '') {
      errors.push({ field: 'question', message: 'Question is required' });
    }
  }

  if (!isUpdate || input.answer !== undefined) {
    if (input.answer === undefined || input.answer === null || String(input.answer).trim() === '') {
      errors.push({ field: 'answer', message: 'Answer is required' });
    }
  }

  if (!isUpdate || input.category !== undefined) {
    if (input.category === undefined || input.category === null || String(input.category).trim() === '') {
      errors.push({ field: 'category', message: 'Category is required' });
    } else if (!VALID_CATEGORIES.includes(input.category as typeof VALID_CATEGORIES[number])) {
      errors.push({
        field: 'category',
        message: `Category must be one of: ${VALID_CATEGORIES.join(', ')}`,
      });
    }
  }

  if (!isUpdate || input.page !== undefined) {
    if (input.page === undefined || input.page === null || String(input.page).trim() === '') {
      errors.push({ field: 'page', message: 'Page context is required' });
    } else if (!VALID_PAGES.includes(input.page as typeof VALID_PAGES[number])) {
      errors.push({
        field: 'page',
        message: `Page must be one of: ${VALID_PAGES.join(', ')}`,
      });
    }
  }

  let parsedTags: string[] | undefined;
  if (input.tags !== undefined) {
    if (!Array.isArray(input.tags)) {
      errors.push({ field: 'tags', message: 'Tags must be an array of strings' });
    } else {
      parsedTags = input.tags.map((t) => String(t).trim()).filter(Boolean);
    }
  }

  if (input.status !== undefined && input.status !== null) {
    if (!VALID_STATUSES.includes(input.status as typeof VALID_STATUSES[number])) {
      errors.push({ field: 'status', message: 'Status must be "active" or "inactive"' });
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

  if (errors.length > 0) {
    throw ApiError.validationError('Validation failed', errors);
  }

  const result: Record<string, unknown> = {};

  if (!isUpdate) {
    result.faqId = String(input.faqId).trim().toLowerCase();
    result.question = String(input.question).trim();
    result.answer = String(input.answer).trim();
    result.category = String(input.category).trim();
    result.page = String(input.page).trim();
    result.featured = input.featured === true || input.featured === 'true';
    result.status = input.status ? String(input.status).trim() : 'active';
    result.displayOrder = parsedDisplayOrder ?? 0;
    result.seoTitle = input.seoTitle !== undefined ? String(input.seoTitle).trim() : '';
    result.seoDescription = input.seoDescription !== undefined ? String(input.seoDescription).trim() : '';
    if (parsedTags !== undefined) result.tags = parsedTags;
    else result.tags = [];
    return result;
  }

  if (input.faqId !== undefined) result.faqId = String(input.faqId).trim().toLowerCase();
  if (input.question !== undefined) result.question = String(input.question).trim();
  if (input.answer !== undefined) result.answer = String(input.answer).trim();
  if (input.category !== undefined) result.category = String(input.category).trim();
  if (input.page !== undefined) result.page = String(input.page).trim();
  if (input.featured !== undefined) result.featured = input.featured === true || input.featured === 'true';
  if (input.status !== undefined) result.status = String(input.status).trim();
  if (parsedDisplayOrder !== undefined) result.displayOrder = parsedDisplayOrder;
  if (parsedTags !== undefined) result.tags = parsedTags;
  if (input.seoTitle !== undefined) result.seoTitle = String(input.seoTitle).trim();
  if (input.seoDescription !== undefined) result.seoDescription = String(input.seoDescription).trim();

  return result;
}
