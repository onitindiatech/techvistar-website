/**
 * @file src/utils/pagination.ts
 * @description Safe pagination helpers — enforce MAX_LIMIT without changing response shape.
 */

import { PAGINATION } from '@/constants';

export function normalizePage(page?: number | string): number {
  const parsed = Number(page);
  if (!Number.isFinite(parsed) || parsed < 1) return PAGINATION.DEFAULT_PAGE;
  return Math.floor(parsed);
}

/** Clamp list `limit` to [1, PAGINATION.MAX_LIMIT]. */
export function normalizeLimit(limit?: number | string): number {
  const parsed = Number(limit);
  const base =
    Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : PAGINATION.DEFAULT_LIMIT;
  return Math.min(Math.max(1, base), PAGINATION.MAX_LIMIT);
}
