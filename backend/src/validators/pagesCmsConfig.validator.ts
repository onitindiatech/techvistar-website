/**
 * @file src/validators/pagesCmsConfig.validator.ts
 */

import { ApiError } from '@/utils/ApiError';
import { pickSeoForCreate } from '@/utils/seoFields';

const SECTION_KEYS = [
  'home',
  'about',
  'contact',
  'solutionsLanding',
  'industriesLanding',
  'careers',
  'websiteSettings',
] as const;

type SectionKey = (typeof SECTION_KEYS)[number];

const SEO_SECTIONS: SectionKey[] = [
  'home',
  'about',
  'contact',
  'solutionsLanding',
  'industriesLanding',
  'careers',
];


function trimRecord(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined || value === null) continue;
    if (typeof value === 'string') {
      result[key] = value.trim();
    } else if (Array.isArray(value)) {
      result[key] = value.map((item) =>
        item && typeof item === 'object' ? trimRecord(item as Record<string, unknown>) : item
      );
    } else if (typeof value === 'object') {
      result[key] = trimRecord(value as Record<string, unknown>);
    } else {
      result[key] = value;
    }
  }
  return result;
}

function parseSection(block: Record<string, unknown>, includeSeo: boolean): Record<string, unknown> {
  const trimmed = trimRecord(block);
  if (!includeSeo) return trimmed;
  const seo = pickSeoForCreate(trimmed);
  return { ...trimmed, ...seo };
}

function parseSectionInput(
  input: Record<string, unknown>,
  key: SectionKey
): Record<string, unknown> | undefined {
  const block = input[key];
  if (!block || typeof block !== 'object') return undefined;
  const includeSeo = SEO_SECTIONS.includes(key);
  if (key === 'home') {
    const home = block as Record<string, unknown>;
    const seoBlock =
      home.seo && typeof home.seo === 'object' ? pickSeoForCreate(home.seo as Record<string, unknown>) : {};
    return {
      ...trimRecord(home),
      seo: seoBlock,
    };
  }
  return parseSection(block as Record<string, unknown>, includeSeo);
}

export function validatePagesCmsConfigInput(input: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const key of SECTION_KEYS) {
    const parsed = parseSectionInput(input, key);
    if (parsed) result[key] = parsed;
  }
  return result;
}

export function validatePagesCmsConfigPartialInput(input: Record<string, unknown>): Record<string, unknown> {
  const result = validatePagesCmsConfigInput(input);

  if (Object.keys(result).length === 0) {
    throw ApiError.validationError('Validation failed', [
      { field: 'body', message: 'At least one CMS section must be provided' },
    ]);
  }

  return result;
}

/** Legacy SEO-only validator for PageSeoSettings backward compatibility */
export function validatePagesSeoOnlyInput(input: Record<string, unknown>): Record<string, unknown> {
  const about =
    input.about && typeof input.about === 'object' ? (input.about as Record<string, unknown>) : {};
  const careers =
    input.careers && typeof input.careers === 'object' ? (input.careers as Record<string, unknown>) : {};

  return {
    about: pickSeoForCreate(about),
    careers: pickSeoForCreate(careers),
  };
}
