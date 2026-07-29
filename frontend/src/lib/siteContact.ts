import {
  DEFAULT_WEBSITE_SETTINGS,
  type WebsiteSettingsConfig,
} from '@/types/websiteSettings';

type ContactSource = Partial<WebsiteSettingsConfig> | null | undefined;

function firstNonEmpty(...values: Array<string | null | undefined>): string {
  for (const value of values) {
    const trimmed = String(value ?? '').trim();
    if (trimmed) return trimmed;
  }
  return '';
}

/** Primary site email (footer, general contact). */
export function resolvePrimaryEmail(settings?: ContactSource): string {
  return firstNonEmpty(settings?.email, DEFAULT_WEBSITE_SETTINGS.email);
}

/** Support / Direct Inquiries email. */
export function resolveSupportEmail(settings?: ContactSource): string {
  return firstNonEmpty(
    settings?.supportEmail,
    settings?.email,
    DEFAULT_WEBSITE_SETTINGS.supportEmail,
    DEFAULT_WEBSITE_SETTINGS.email,
  );
}

/** Sales email (optional — falls back to primary). */
export function resolveSalesEmail(settings?: ContactSource): string {
  return firstNonEmpty(
    settings?.salesEmail,
    settings?.email,
    DEFAULT_WEBSITE_SETTINGS.salesEmail,
    DEFAULT_WEBSITE_SETTINGS.email,
  );
}

/** Careers email (optional — falls back to support, then primary). */
export function resolveCareersEmail(settings?: ContactSource): string {
  return firstNonEmpty(
    settings?.careersEmail,
    settings?.supportEmail,
    settings?.email,
    DEFAULT_WEBSITE_SETTINGS.careersEmail,
    DEFAULT_WEBSITE_SETTINGS.supportEmail,
    DEFAULT_WEBSITE_SETTINGS.email,
  );
}

export function resolveSitePhone(settings?: ContactSource): string {
  return firstNonEmpty(settings?.phone, DEFAULT_WEBSITE_SETTINGS.phone);
}

export function resolveSiteAddress(settings?: ContactSource): string {
  return firstNonEmpty(settings?.address, DEFAULT_WEBSITE_SETTINGS.address);
}

export function siteMailto(email: string, subject?: string): string {
  if (!subject) return `mailto:${email}`;
  return `mailto:${email}?subject=${encodeURIComponent(subject)}`;
}
