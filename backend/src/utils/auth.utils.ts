/**
 * @file src/utils/auth.utils.ts
 * @description Shared utilities for auth token handling.
 */

export function parseExpiryToMs(expiry: string): number {
  const match = expiry.match(/^(\d+)([smhd])$/i);

  if (!match) {
    return 15 * 60 * 1000;
  }

  const value = Number(match[1]);
  const unit = match[2].toLowerCase();

  switch (unit) {
    case 's':
      return value * 1000;
    case 'm':
      return value * 60 * 1000;
    case 'h':
      return value * 60 * 60 * 1000;
    case 'd':
      return value * 24 * 60 * 60 * 1000;
    default:
      return 15 * 60 * 1000;
  }
}
