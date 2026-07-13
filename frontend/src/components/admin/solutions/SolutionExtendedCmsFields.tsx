import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RichTextEditor } from '@/components/admin/common/RichTextEditor';
import { CmsSortableList } from '@/components/admin/common/CmsSortableList';
import { normalizeRichContent } from '@/lib/sanitizeHtml';
import {
  DEFAULT_HERO_FLOATING_CARDS,
  DEFAULT_HERO_STATS,
  DEFAULT_SECTION_COPY,
  type SolutionHeroFloatingCard,
  type SolutionHeroStat,
  type SolutionNavItem,
  type SolutionSectionCopy,
} from '@/lib/solutionDetailDefaults';
import { Plus } from 'lucide-react';
import { CmsFutureFeatureCallout } from '@/components/admin/common/CmsFutureFeatureCallout';

export interface SolutionFaqRow {
  q: string;
  a: string;
}

export interface SolutionIndustryRow {
  name: string;
  slug: string;
}

export interface SolutionExtendedCmsState {
  heroBadge: string;
  heroDescription: string;
  backLinkText: string;
  heroFloatingCards: SolutionHeroFloatingCard[];
  heroStats: SolutionHeroStat[];
  sectionCopy: SolutionSectionCopy;
  industriesList: SolutionIndustryRow[];
  faqsList: SolutionFaqRow[];
  relatedSolutionSlugs: string[];
}

interface Props {
  activeTab: string;
  state: SolutionExtendedCmsState;
  onChange: (patch: Partial<SolutionExtendedCmsState>) => void;
  allSolutionOptions: { slug: string; title: string }[];
}

const LUCIDE_ICON_OPTIONS = [
  'Shield', 'Users', 'Sparkles', 'TrendingUp', 'Headphones', 'HeadphonesIcon',
  'Zap', 'Maximize', 'Activity', 'Brain', 'Target', 'Layers', 'Settings',
];

function toggleSlug(list: string[], slug: string): string[] {
  return list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug];
}

export function createDefaultExtendedCmsState(): SolutionExtendedCmsState {
  return {
    heroBadge: '',
    heroDescription: '',
    backLinkText: DEFAULT_SECTION_COPY.backLinkText,
    heroFloatingCards: DEFAULT_HERO_FLOATING_CARDS.map((c) => ({ ...c })),
    heroStats: DEFAULT_HERO_STATS.map((s) => ({ ...s })),
    sectionCopy: {
      ...DEFAULT_SECTION_COPY,
      navItems: DEFAULT_SECTION_COPY.navItems.map((n) => ({ ...n })),
    },
    industriesList: [],
    faqsList: [],
    relatedSolutionSlugs: [],
  };
}

export function extendedStateFromItem(item: Record<string, unknown> | null | undefined): SolutionExtendedCmsState {
  const defaults = createDefaultExtendedCmsState();
  if (!item) return defaults;

  const sectionCopyRaw = item.sectionCopy as Partial<SolutionSectionCopy> | undefined;

  return {
    heroBadge: String(item.heroBadge || ''),
    heroDescription: String(item.heroDescription || ''),
    backLinkText: String(item.backLinkText || defaults.backLinkText),
    heroFloatingCards:
      Array.isArray(item.heroFloatingCards) && item.heroFloatingCards.length > 0
        ? (item.heroFloatingCards as SolutionHeroFloatingCard[])
        : defaults.heroFloatingCards,
    heroStats:
      Array.isArray(item.heroStats) && item.heroStats.length > 0
        ? (item.heroStats as SolutionHeroStat[])
        : defaults.heroStats,
    sectionCopy: {
      ...defaults.sectionCopy,
      ...(sectionCopyRaw || {}),
      navItems:
        sectionCopyRaw?.navItems && sectionCopyRaw.navItems.length > 0
          ? sectionCopyRaw.navItems
          : defaults.sectionCopy.navItems,
    },
    industriesList: Array.isArray(item.industries) ? (item.industries as SolutionIndustryRow[]) : [],
    faqsList: Array.isArray(item.faqs) ? (item.faqs as SolutionFaqRow[]) : [],
    relatedSolutionSlugs: Array.isArray(item.relatedSolutionSlugs)
      ? (item.relatedSolutionSlugs as string[])
      : [],
  };
}

export function SolutionExtendedCmsFields({
  activeTab,
  state,
  onChange,
  allSolutionOptions,
}: Props) {
  if (activeTab === 'hero') {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Hero Badge</label>
            <Input
              value={state.heroBadge}
              onChange={(e) => onChange({ heroBadge: e.target.value })}
              placeholder="Defaults to category when empty"
              className="h-10 rounded-lg border-slate-200"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Back Link Text</label>
            <Input
              value={state.backLinkText}
              onChange={(e) => onChange({ backLinkText: e.target.value })}
              placeholder={DEFAULT_SECTION_COPY.backLinkText}
              className="h-10 rounded-lg border-slate-200"
            />
          </div>
        </div>

        <RichTextEditor
          label="Hero Description"
          value={state.heroDescription}
          onChange={(html) => onChange({ heroDescription: normalizeRichContent(html) })}
          placeholder="Main hero paragraph below the subtitle"
          minHeightClassName="min-h-[120px]"
        />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Hero Floating Cards</span>
            <Button
              type="button"
              variant="outline"
              className="h-8 text-xs"
              onClick={() =>
                onChange({
                  heroFloatingCards: [
                    ...state.heroFloatingCards,
                    { value: '', label: '', icon: 'Shield' },
                  ],
                })
              }
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Card
            </Button>
          </div>
          <CmsSortableList
            items={state.heroFloatingCards}
            onChange={(heroFloatingCards) => onChange({ heroFloatingCards })}
            onDuplicate={(item) => ({ ...item, label: `${item.label} (copy)` })}
            renderItem={(card, idx) => (
              <div className="grid grid-cols-3 gap-3">
                <Input
                  placeholder="Value (e.g. 99.9%)"
                  value={card.value}
                  onChange={(e) => {
                    const next = [...state.heroFloatingCards];
                    next[idx] = { ...next[idx], value: e.target.value };
                    onChange({ heroFloatingCards: next });
                  }}
                />
                <Input
                  placeholder="Label"
                  value={card.label}
                  onChange={(e) => {
                    const next = [...state.heroFloatingCards];
                    next[idx] = { ...next[idx], label: e.target.value };
                    onChange({ heroFloatingCards: next });
                  }}
                />
                <select
                  className="h-10 rounded-lg border border-slate-200 text-xs px-2"
                  value={card.icon}
                  onChange={(e) => {
                    const next = [...state.heroFloatingCards];
                    next[idx] = { ...next[idx], icon: e.target.value };
                    onChange({ heroFloatingCards: next });
                  }}
                >
                  {LUCIDE_ICON_OPTIONS.map((icon) => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>
            )}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Hero Statistics Grid</span>
            <Button
              type="button"
              variant="outline"
              className="h-8 text-xs"
              onClick={() =>
                onChange({
                  heroStats: [
                    ...state.heroStats,
                    { value: '', label: '', description: '', icon: 'TrendingUp' },
                  ],
                })
              }
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Stat
            </Button>
          </div>
          <CmsSortableList
            items={state.heroStats}
            onChange={(heroStats) => onChange({ heroStats })}
            onDuplicate={(item) => ({ ...item, label: `${item.label} (copy)` })}
            renderItem={(stat, idx) => (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <Input
                    placeholder="Value"
                    value={stat.value}
                    onChange={(e) => {
                      const next = [...state.heroStats];
                      next[idx] = { ...next[idx], value: e.target.value };
                      onChange({ heroStats: next });
                    }}
                  />
                  <Input
                    placeholder="Label"
                    value={stat.label}
                    onChange={(e) => {
                      const next = [...state.heroStats];
                      next[idx] = { ...next[idx], label: e.target.value };
                      onChange({ heroStats: next });
                    }}
                  />
                  <select
                    className="h-10 rounded-lg border border-slate-200 text-xs px-2"
                    value={stat.icon}
                    onChange={(e) => {
                      const next = [...state.heroStats];
                      next[idx] = { ...next[idx], icon: e.target.value };
                      onChange({ heroStats: next });
                    }}
                  >
                    {LUCIDE_ICON_OPTIONS.map((icon) => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                </div>
                <Input
                  placeholder="Description"
                  value={stat.description}
                  onChange={(e) => {
                    const next = [...state.heroStats];
                    next[idx] = { ...next[idx], description: e.target.value };
                    onChange({ heroStats: next });
                  }}
                />
              </div>
            )}
          />
        </div>
      </div>
    );
  }

  if (activeTab === 'sections') {
    const setSectionField = (key: keyof SolutionSectionCopy, value: string) => {
      onChange({ sectionCopy: { ...state.sectionCopy, [key]: value } });
    };

    return (
      <div className="space-y-6">
        <p className="text-xs text-slate-500">Section headings and navigation labels shown on the public detail page.</p>
        <div className="grid grid-cols-2 gap-4">
          {(
            [
              ['overviewTitle', 'Overview Title'],
              ['featuresTitle', 'Features Title'],
              ['featuresSubtitle', 'Features Subtitle'],
              ['processTitle', 'Process Title'],
              ['processSubtitle', 'Process Subtitle'],
              ['benefitsTitle', 'Benefits Title'],
              ['benefitsSubtitle', 'Benefits Subtitle'],
              ['techStackTitle', 'Tech Stack Title'],
              ['techStackSubtitle', 'Tech Stack Subtitle'],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{label}</label>
              <Input
                value={state.sectionCopy[key]}
                onChange={(e) => setSectionField(key, e.target.value)}
                className="h-10 rounded-lg border-slate-200"
              />
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Sticky Navigation Items</span>
            <Button
              type="button"
              variant="outline"
              className="h-8 text-xs"
              onClick={() =>
                onChange({
                  sectionCopy: {
                    ...state.sectionCopy,
                    navItems: [...state.sectionCopy.navItems, { id: 'section-id', label: 'Section' }],
                  },
                })
              }
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Nav Item
            </Button>
          </div>
          <CmsSortableList
            items={state.sectionCopy.navItems}
            onChange={(navItems) => onChange({ sectionCopy: { ...state.sectionCopy, navItems } })}
            onDuplicate={(item) => ({ ...item, id: `${item.id}-copy`, label: `${item.label} (copy)` })}
            renderItem={(item, idx) => (
              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="Section ID (e.g. overview)"
                  value={item.id}
                  onChange={(e) => {
                    const navItems = [...state.sectionCopy.navItems];
                    navItems[idx] = { ...navItems[idx], id: e.target.value };
                    onChange({ sectionCopy: { ...state.sectionCopy, navItems } });
                  }}
                />
                <Input
                  placeholder="Label"
                  value={item.label}
                  onChange={(e) => {
                    const navItems = [...state.sectionCopy.navItems];
                    navItems[idx] = { ...navItems[idx], label: e.target.value };
                    onChange({ sectionCopy: { ...state.sectionCopy, navItems } });
                  }}
                />
              </div>
            )}
          />
        </div>
      </div>
    );
  }

  if (activeTab === 'faqs') {
    return (
      <div className="space-y-4">
        <CmsFutureFeatureCallout>
          Solution FAQs are saved to the database but are not rendered on public solution detail pages yet.
        </CmsFutureFeatureCallout>
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Solution FAQs</span>
          <Button
            type="button"
            variant="outline"
            className="h-8 text-xs"
            onClick={() => onChange({ faqsList: [...state.faqsList, { q: '', a: '' }] })}
          >
            <Plus className="w-3.5 h-3.5 mr-1" /> Add FAQ
          </Button>
        </div>
        <CmsSortableList
          items={state.faqsList}
          onChange={(faqsList) => onChange({ faqsList })}
          onDuplicate={(item) => ({ ...item, q: `${item.q} (copy)` })}
          renderItem={(faq, idx) => (
            <div className="space-y-3">
              <Input
                placeholder="Question"
                value={faq.q}
                onChange={(e) => {
                  const faqsList = [...state.faqsList];
                  faqsList[idx] = { ...faqsList[idx], q: e.target.value };
                  onChange({ faqsList });
                }}
              />
              <RichTextEditor
                label="Answer"
                value={faq.a}
                onChange={(html) => {
                  const faqsList = [...state.faqsList];
                  faqsList[idx] = { ...faqsList[idx], a: normalizeRichContent(html) };
                  onChange({ faqsList });
                }}
                minHeight="100px"
              />
            </div>
          )}
        />
      </div>
    );
  }

  if (activeTab === 'industries') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Industries Served</span>
          <Button
            type="button"
            variant="outline"
            className="h-8 text-xs"
            onClick={() => onChange({ industriesList: [...state.industriesList, { name: '', slug: '' }] })}
          >
            <Plus className="w-3.5 h-3.5 mr-1" /> Add Industry
          </Button>
        </div>
        <CmsSortableList
          items={state.industriesList}
          onChange={(industriesList) => onChange({ industriesList })}
          onDuplicate={(item) => ({ ...item, name: `${item.name} (copy)` })}
          renderItem={(industry, idx) => (
            <div className="grid grid-cols-2 gap-3">
              <Input
                placeholder="Industry name"
                value={industry.name}
                onChange={(e) => {
                  const industriesList = [...state.industriesList];
                  industriesList[idx] = { ...industriesList[idx], name: e.target.value };
                  onChange({ industriesList });
                }}
              />
              <Input
                placeholder="Slug (e.g. healthcare)"
                value={industry.slug}
                onChange={(e) => {
                  const industriesList = [...state.industriesList];
                  industriesList[idx] = { ...industriesList[idx], slug: e.target.value };
                  onChange({ industriesList });
                }}
              />
            </div>
          )}
        />
      </div>
    );
  }

  if (activeTab === 'relations') {
    return (
      <div className="space-y-4">
        <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Related Solutions</span>
        <p className="text-xs text-slate-500">Live on solution detail pages when selected below (up to 3 related solutions).</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[360px] overflow-y-auto">
          {allSolutionOptions.map((opt) => (
            <label
              key={opt.slug}
              className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer hover:border-emerald-200"
            >
              <input
                type="checkbox"
                checked={state.relatedSolutionSlugs.includes(opt.slug)}
                onChange={() =>
                  onChange({
                    relatedSolutionSlugs: toggleSlug(state.relatedSolutionSlugs, opt.slug),
                  })
                }
                className="rounded border-slate-300"
              />
              <span className="text-xs font-semibold text-slate-700">{opt.title}</span>
              <span className="text-[10px] text-slate-400 font-mono ml-auto">{opt.slug}</span>
            </label>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
