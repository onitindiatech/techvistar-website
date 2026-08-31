import type { LucideIcon } from 'lucide-react';
import {
  Brain,
  Globe,
} from 'lucide-react';
import { resolveLucideIcon } from '@/lib/resolveLucideIcon';
import { SOLUTIONS_DATA, resolveSolutionIcon } from '@/data/solutions';

/** Design capacity: up to 4 columns × 4 links (matches current mega-menu layout). */
export const NAV_MEGA_ITEMS_PER_COLUMN = 4;

export type NavMegaItem = {
  label: string;
  to: string;
  desc?: string;
  icon: LucideIcon;
  slug: string;
};

export type NavMegaColumn = {
  code?: string;
  title: string;
  subtitle?: string;
  items: NavMegaItem[];
};

/** Maximum number of solution category columns shown in the navbar dropdown. */
const MAX_SOLUTION_COLUMNS = 4;

const PILLAR_CONFIGS = [
  {
    code: '01',
    title: 'BRAND',
    subtitle: 'How the business is perceived.',
    match: (c: string, t: string) => /brand|design|creative|ui|ux|perceiv|identity|content/i.test(c) || /brand|design|creative|ui|ux|identity|documentation/i.test(t),
  },
  {
    code: '02',
    title: 'GROWTH',
    subtitle: 'How the business attracts and converts demand.',
    match: (c: string, t: string) => /growth|market|seo|conversion|lead|acquisition/i.test(c) || /market|growth|seo|conversion|revenue/i.test(t),
  },
  {
    code: '03',
    title: 'SYSTEMS',
    subtitle: 'How the business operates and scales.',
    match: (c: string, t: string) => /system|infra|automat|cloud|ops|operation|advanced|ai|tech/i.test(c) || /automat|cloud|devops|system|ops|ai/i.test(t),
  },
  {
    code: '04',
    title: 'DIGITAL',
    subtitle: 'How the business delivers and evolves.',
    match: (c: string, t: string) => /digital|develop|software|product|platform|app|web/i.test(c) || /develop|software|product|platform|web|app/i.test(t),
  },
];

/**
 * Dynamically builds Services mega-menu columns from backend/MongoDB active services.
 * Contains NO hardcoded, fake, or non-existent services.
 */
export function buildServiceNavColumns(services: any[] | undefined | null): NavMegaColumn[] {
  if (!services || !Array.isArray(services) || services.length === 0) {
    return [];
  }

  const activeServices = services.filter((s) => s && s.slug && s.status !== 'draft');

  const columns: NavMegaColumn[] = PILLAR_CONFIGS.map((cfg) => ({
    code: cfg.code,
    title: cfg.title,
    subtitle: cfg.subtitle,
    items: [],
  }));

  for (const s of activeServices) {
    const category = String(s.category || '').trim();
    const title = String(s.title || s.name || s.slug).trim();
    const slug = String(s.slug).trim();

    let matchedIndex = PILLAR_CONFIGS.findIndex((cfg) => cfg.match(category, title));
    if (matchedIndex === -1) matchedIndex = 3;

    let iconComp: LucideIcon = Globe;
    if (typeof s.icon === 'function' || (typeof s.icon === 'object' && s.icon !== null)) {
      iconComp = s.icon as LucideIcon;
    } else if (typeof s.icon === 'string' && s.icon) {
      iconComp = (resolveLucideIcon(s.icon) as LucideIcon) || Globe;
    }

    columns[matchedIndex].items.push({
      label: title,
      to: `/services/${slug}`,
      slug: slug,
      icon: iconComp,
      desc: s.shortDescription || s.overview || '',
    });
  }

  return columns.filter((col) => col.items.length > 0);
}

function sortByDisplayOrder<T extends { displayOrder?: number; title?: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const orderA = Number(a.displayOrder ?? 0);
    const orderB = Number(b.displayOrder ?? 0);
    if (orderA !== orderB) return orderA - orderB;
    return String(a.title ?? '').localeCompare(String(b.title ?? ''));
  });
}



const MEGA_DESC_MAX = 55;

function condenseMegaDesc(raw: string): string {
  const text = raw.trim().replace(/\s+/g, ' ');
  if (!text) return '';
  if (text.length <= MEGA_DESC_MAX) return text;

  const window = text.slice(0, MEGA_DESC_MAX + 1);
  const breakMatch = window.match(/^(.*?)[.,;](?:\s|$)/);
  if (breakMatch && breakMatch[1] && breakMatch[1].trim().length >= 8) {
    return breakMatch[1].trim();
  }

  const truncated = text.slice(0, MEGA_DESC_MAX);
  const lastSpace = truncated.lastIndexOf(' ');
  const short = lastSpace > 10 ? truncated.slice(0, lastSpace) : truncated;
  return short.trim() + '…';
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
 * Build Solutions mega-menu columns dynamically from backend/MongoDB data.
 * Discovers up to MAX_SOLUTION_COLUMNS unique categories directly from each
 * solution's `category` field — no hardcoded category names or regex matching.
 * A new category assigned in the admin panel will automatically appear as a
 * new column without any code changes.
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
  if (active.length === 0) return [];

  // Discover unique categories from the data in first-appearance order, capped at MAX_SOLUTION_COLUMNS
  const seenCategories: string[] = [];
  for (const solution of active) {
    const cat = String(solution.category || '').trim();
    if (cat && !seenCategories.includes(cat)) {
      seenCategories.push(cat);
      if (seenCategories.length === MAX_SOLUTION_COLUMNS) break;
    }
  }

  // Fallback bucket for solutions with an empty or unrecognized category
  const fallbackCat = seenCategories[seenCategories.length - 1] ?? 'Solutions';
  if (!seenCategories.includes(fallbackCat)) seenCategories.push(fallbackCat);

  // Build one column per unique category (ordered by first appearance)
  const columnMap = new Map<string, NavMegaColumn>(
    seenCategories.map((cat, idx) => [
      cat,
      {
        code: String(idx + 1).padStart(2, '0'),
        title: cat.toUpperCase(),
        items: [],
      },
    ])
  );

  // Distribute solutions into their matching column
  for (const solution of active) {
    const cat = String(solution.category || '').trim();
    const item = toSolutionNavItem(solution);
    if (!item) continue;
    const column = columnMap.get(cat) ?? columnMap.get(fallbackCat);
    if (column && column.items.length < NAV_MEGA_ITEMS_PER_COLUMN) {
      column.items.push(item);
    }
  }

  const result = Array.from(columnMap.values()).filter((col) => col.items.length > 0);
  if (result.length === 0 && sourceList !== staticSolutions) {
    return buildSolutionNavColumns(staticSolutions as any[]);
  }
  return result;
}

