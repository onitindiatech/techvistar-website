import type { LucideIcon } from 'lucide-react';
import { Briefcase, Brain } from 'lucide-react';
import { resolveLucideIcon } from '@/lib/resolveLucideIcon';
import { SERVICES } from '@/data/services';
import { SOLUTIONS_DATA, resolveSolutionIcon } from '@/data/solutions';

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

  let iconComp: LucideIcon = Briefcase;
  if (typeof service.icon === 'function' || (typeof service.icon === 'object' && service.icon !== null)) {
    iconComp = service.icon as LucideIcon;
  } else if (typeof service.icon === 'string' && service.icon) {
    iconComp = (resolveLucideIcon(service.icon) as LucideIcon) || Briefcase;
  }

  return {
    label: String(service.title || slug).trim(),
    to: `/services/${slug}`,
    desc: condenseMegaDesc(String(service.shortDescription || service.overview || service.fullDescription || service.longDescription || '')),
    icon: iconComp,
    slug,
  };
}

function toSolutionNavItem(solution: any): NavMegaItem | null {
  const slug = String(solution?.slug ?? '').trim();
  if (!slug) return null;

  let iconComp: LucideIcon = Brain;
  if (typeof solution.icon === 'function' || (typeof solution.icon === 'object' && solution.icon !== null)) {
    iconComp = solution.icon as LucideIcon;
  } else if (typeof solution.icon === 'string' && solution.icon) {
    iconComp = (resolveLucideIcon(solution.icon) as LucideIcon) || (resolveSolutionIcon(solution.icon) as LucideIcon) || Brain;
  }

  return {
    label: String(solution.title || slug).trim(),
    to: `/solutions/${slug}`,
    desc: condenseMegaDesc(String(solution.shortDescription || solution.subtitle || solution.desc || solution.heroDescription || '')),
    icon: iconComp,
    slug,
  };
}


/**
 * Build Services mega-menu columns. Falls back to or combines with static SERVICES if API returns a sparse list.
 */
export function buildServiceNavColumns(services: any[] | undefined | null): NavMegaColumn[] {
  const staticServices = SERVICES as any[];
  let sourceList: any[] = services && services.length > 0 ? services : staticServices;

  if (services && services.length > 0 && services.length < 6) {
    const apiSlugs = new Set(services.map((s) => s.slug));
    const extraStatic = staticServices.filter((s) => !apiSlugs.has(s.slug));
    sourceList = [...services, ...extraStatic];
  }

  let active = sortByDisplayOrder(sourceList.filter((service) => service?.slug));
  if (active.length === 0 && staticServices.length > 0) {
    active = sortByDisplayOrder(staticServices.filter((service) => service?.slug));
  }
  const items: NavMegaItem[] = [];
  const categories: string[] = [];

  for (const service of active) {
    const item = toServiceNavItem(service);
    if (!item) continue;
    items.push(item);
    categories.push(String(service.category || ''));
  }

  const columns = buildColumns(items, categories, SERVICE_COLUMN_RULES);
  const totalItems = columns.reduce((acc, col) => acc + col.items.length, 0);
  if (totalItems === 0 && sourceList !== staticServices) {
    return buildServiceNavColumns(staticServices);
  }

  return columns;
}

/**
 * Build Solutions mega-menu columns. Falls back to or combines with static SOLUTIONS_DATA if API returns a sparse list.
 */
export function buildSolutionNavColumns(solutions: any[] | undefined | null): NavMegaColumn[] {
  const staticSolutions = Object.values(SOLUTIONS_DATA);
  let sourceList: any[] = solutions && solutions.length > 0 ? solutions : (staticSolutions as any[]);

  if (solutions && solutions.length > 0 && solutions.length < 4) {
    const apiSlugs = new Set(solutions.map((s: any) => s.slug));
    const extraStatic = staticSolutions.filter((s: any) => !apiSlugs.has(s.slug));
    sourceList = [...solutions, ...extraStatic];
  }

  let active = sortByDisplayOrder(sourceList.filter((solution) => solution?.slug));
  if (active.length === 0 && staticSolutions.length > 0) {
    active = sortByDisplayOrder(staticSolutions.filter((solution) => solution?.slug));
  }
  const items: NavMegaItem[] = [];
  const categories: string[] = [];

  for (const solution of active) {
    const item = toSolutionNavItem(solution);
    if (!item) continue;
    items.push(item);
    categories.push(String(solution.category || ''));
  }

  const columns = buildColumns(items, categories, SOLUTION_COLUMN_RULES);
  const totalItems = columns.reduce((acc, col) => acc + col.items.length, 0);
  if (totalItems === 0 && sourceList !== staticSolutions) {
    return buildSolutionNavColumns(staticSolutions as any[]);
  }

  return columns;
}

