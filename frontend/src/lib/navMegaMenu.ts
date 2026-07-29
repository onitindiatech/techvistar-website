import type { LucideIcon } from 'lucide-react';
import { Briefcase, Brain } from 'lucide-react';
import { resolveLucideIcon } from '@/lib/resolveLucideIcon';

/** Design capacity: 3 columns × 4 links (matches current mega-menu layout). */
export const NAV_MEGA_ITEMS_PER_COLUMN = 4;

export type NavMegaItem = {
  label: string;
  to: string;
  desc: string;
  icon: LucideIcon;
  slug: string;
};

export type NavMegaColumn = {
  title: string;
  items: NavMegaItem[];
};

type ColumnRule = {
  title: string;
  match: (category: string) => boolean;
};

const SERVICE_COLUMN_RULES: ColumnRule[] = [
  {
    title: 'Development Services',
    match: (c) => /develop|saas|software|product|platform|engineering/i.test(c),
  },
  {
    title: 'Design Services',
    match: (c) => /design|brand|creative|ui|ux/i.test(c),
  },
  {
    title: 'Cloud & AI',
    match: (c) => /cloud|ai|infra|automat|security|devops|tech|data|market/i.test(c),
  },
];

const SOLUTION_COLUMN_RULES: ColumnRule[] = [
  {
    title: 'Business Solutions',
    match: (c) => /business|enterprise|crm|erp|ops|operation/i.test(c),
  },
  {
    title: 'AI Solutions',
    match: (c) => /\bai\b|agent|chatbot|generative|intelligence|ml|llm/i.test(c),
  },
  {
    title: 'Digital Solutions',
    match: (c) => /digital|cloud|api|data|security|cyber|analytics|integration/i.test(c),
  },
];

function sortByDisplayOrder<T extends { displayOrder?: number; title?: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const orderA = Number(a.displayOrder ?? 0);
    const orderB = Number(b.displayOrder ?? 0);
    if (orderA !== orderB) return orderA - orderB;
    return String(a.title ?? '').localeCompare(String(b.title ?? ''));
  });
}

function resolveColumnIndex(category: string, rules: ColumnRule[]): number {
  const normalized = String(category || '').trim();
  const matched = rules.findIndex((rule) => rule.match(normalized));
  return matched >= 0 ? matched : rules.length - 1;
}

function buildColumns(
  items: NavMegaItem[],
  categories: string[],
  rules: ColumnRule[],
): NavMegaColumn[] {
  const columns: NavMegaColumn[] = rules.map((rule) => ({ title: rule.title, items: [] }));
  const overflow: NavMegaItem[] = [];

  items.forEach((item, index) => {
    const columnIndex = resolveColumnIndex(categories[index] ?? '', rules);
    const column = columns[columnIndex];
    if (column.items.length < NAV_MEGA_ITEMS_PER_COLUMN) {
      column.items.push(item);
    } else {
      overflow.push(item);
    }
  });

  // Fill remaining slots so new CMS items still appear within design capacity.
  for (const item of overflow) {
    const target = columns.find((column) => column.items.length < NAV_MEGA_ITEMS_PER_COLUMN);
    if (!target) break;
    target.items.push(item);
  }

  return columns;
}


/**
 * Derives a concise one-liner subtitle from a potentially long CMS description.
 *
 * Strategy (in priority order):
 * 1. If the text is already ≤ MAX chars — return it as-is (no change).
 * 2. Try to cut at the first natural sentence boundary (`. `, `; `, `, `) within
 *    the MAX window, producing a clean fragment without a trailing separator.
 * 3. Fall back to the last whole-word boundary within MAX chars + "…".
 *
 * MAX is tuned so the result fits comfortably on one line in the mega-menu
 * column (≈ 6-10 words / ~55 characters).
 */
const MEGA_DESC_MAX = 55;

function condenseMegaDesc(raw: string): string {
  const text = raw.trim().replace(/\s+/g, ' ');
  if (!text) return '';
  if (text.length <= MEGA_DESC_MAX) return text;

  const window = text.slice(0, MEGA_DESC_MAX + 1);

  // 1. Natural break: first `. ` or `; ` or `, ` within the window.
  const breakMatch = window.match(/^(.*?)[.,;](?:\s|$)/);
  if (breakMatch && breakMatch[1] && breakMatch[1].trim().length >= 8) {
    return breakMatch[1].trim();
  }

  // 2. Last whole-word boundary within MAX chars.
  const truncated = text.slice(0, MEGA_DESC_MAX);
  const lastSpace = truncated.lastIndexOf(' ');
  const short = lastSpace > 10 ? truncated.slice(0, lastSpace) : truncated;
  return short.trim() + '…';
}

function toServiceNavItem(service: any): NavMegaItem | null {
  const slug = String(service?.slug ?? '').trim();
  if (!slug) return null;
  return {
    label: String(service.title || slug).trim(),
    to: `/services/${slug}`,
    desc: condenseMegaDesc(String(service.shortDescription || '')),
    icon: resolveLucideIcon(String(service.icon || 'Briefcase')) || Briefcase,
    slug,
  };
}

function toSolutionNavItem(solution: any): NavMegaItem | null {
  const slug = String(solution?.slug ?? '').trim();
  if (!slug) return null;
  return {
    label: String(solution.title || slug).trim(),
    to: `/solutions/${slug}`,
    desc: condenseMegaDesc(String(solution.shortDescription || '')),
    icon: resolveLucideIcon(String(solution.icon || 'Brain')) || Brain,
    slug,
  };
}


/**
 * Build Services mega-menu columns from active CMS records only.
 * Caps each column to the design limit; remaining items stay on the landing page.
 */
export function buildServiceNavColumns(services: any[] | undefined | null): NavMegaColumn[] {
  const active = sortByDisplayOrder((services ?? []).filter((service) => service?.slug));
  const items: NavMegaItem[] = [];
  const categories: string[] = [];

  for (const service of active) {
    const item = toServiceNavItem(service);
    if (!item) continue;
    items.push(item);
    categories.push(String(service.category || ''));
  }

  return buildColumns(items, categories, SERVICE_COLUMN_RULES);
}

/**
 * Build Solutions mega-menu columns from active CMS records only.
 * Same capacity rules as Services.
 */
export function buildSolutionNavColumns(solutions: any[] | undefined | null): NavMegaColumn[] {
  const active = sortByDisplayOrder((solutions ?? []).filter((solution) => solution?.slug));
  const items: NavMegaItem[] = [];
  const categories: string[] = [];

  for (const solution of active) {
    const item = toSolutionNavItem(solution);
    if (!item) continue;
    items.push(item);
    categories.push(String(solution.category || ''));
  }

  return buildColumns(items, categories, SOLUTION_COLUMN_RULES);
}
