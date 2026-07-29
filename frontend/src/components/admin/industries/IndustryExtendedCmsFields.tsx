import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RichTextEditor } from '@/components/admin/common/RichTextEditor';
import { normalizeRichContent } from '@/lib/sanitizeHtml';
import { Trash, Plus } from 'lucide-react';
import { CmsFutureFeatureCallout } from '@/components/admin/common/CmsFutureFeatureCallout';
import type { DetailedOffering } from '@/data/services';

const OFFERING_COLORS = ['green', 'blue', 'purple', 'red', 'orange', 'indigo', 'gold', 'gray'];
const OFFERING_ICONS = [
  'globe', 'smartphone', 'palette', 'cpu', 'cloud', 'code', 'brain', 'sparkles',
  'database', 'shield', 'workflow', 'terminal', 'search', 'layers', 'bot',
];

export type IndustryFaqRow = { question: string; answer: string };
export type IndustryWhyChooseRow = { title: string; description: string };

export interface IndustryExtendedCmsState {
  heroBadge: string;
  heroTagline: string;
  detailedOfferings: DetailedOffering[];
  faqsList: IndustryFaqRow[];
  whyChooseUsList: IndustryWhyChooseRow[];
  relatedServiceSlugs: string[];
  relatedIndustrySlugs: string[];
  ctaBlock: {
    badge: string;
    headline: string;
    body: string;
    primaryButtonLabel: string;
    secondaryButtonLabel: string;
    secondaryButtonHref: string;
  };
  sidebar: {
    summaryTitle: string;
    responseTimeTitle: string;
    responseTime: string;
    businessHoursTitle: string;
    businessHours: string;
    secureTitle: string;
    secureDescription: string;
    buttonLabel: string;
    directInquiriesTitle: string;
    directInquiriesBody: string;
    contactEmail: string;
  };
  consultationForm: {
    title: string;
    description: string;
    submitLabel: string;
    privacyText: string;
    successTitle: string;
    successMessage: string;
  };
}

interface Props {
  activeTab: string;
  state: IndustryExtendedCmsState;
  onChange: (patch: Partial<IndustryExtendedCmsState>) => void;
  allServiceOptions: { slug: string; title: string }[];
  allIndustryOptions: { slug: string; title: string }[];
}

function toggleSlug(list: string[], slug: string): string[] {
  return list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug];
}

export function IndustryExtendedCmsFields({
  activeTab,
  state,
  onChange,
  allServiceOptions,
  allIndustryOptions,
}: Props) {
  const setOffering = (idx: number, patch: Partial<DetailedOffering>) => {
    const next = [...state.detailedOfferings];
    next[idx] = { ...next[idx], ...patch };
    onChange({ detailedOfferings: next });
  };

  if (activeTab === 'offerings') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Detailed Offering Cards</span>
          <Button
            type="button"
            variant="outline"
            className="h-8 text-xs"
            onClick={() =>
              onChange({
                detailedOfferings: [
                  ...state.detailedOfferings,
                  { title: '', description: '', badges: [], color: 'green', iconName: 'sparkles' },
                ],
              })
            }
          >
            <Plus className="mr-1 h-3.5 w-3.5" /> Add Card
          </Button>
        </div>
        {state.detailedOfferings.map((offering, idx) => (
          <div key={idx} className="relative space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
            <button
              type="button"
              onClick={() =>
                onChange({ detailedOfferings: state.detailedOfferings.filter((_, i) => i !== idx) })
              }
              className="absolute right-3 top-3 text-slate-400 hover:text-red-500"
            >
              <Trash className="h-4 w-4" />
            </button>
            <Input placeholder="Title" value={offering.title} onChange={(e) => setOffering(idx, { title: e.target.value })} />
            <textarea
              className="min-h-[80px] w-full rounded-lg border border-slate-200 p-3 text-xs"
              placeholder="Description"
              value={offering.description}
              onChange={(e) => setOffering(idx, { description: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-3">
              <select
                className="h-9 rounded-lg border border-slate-200 px-2 text-xs"
                value={offering.color}
                onChange={(e) => setOffering(idx, { color: e.target.value })}
              >
                {OFFERING_COLORS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <select
                className="h-9 rounded-lg border border-slate-200 px-2 text-xs"
                value={offering.iconName}
                onChange={(e) => setOffering(idx, { iconName: e.target.value })}
              >
                {OFFERING_ICONS.map((icon) => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
            </div>
            <Input
              placeholder="Technology chips (comma-separated)"
              value={offering.badges.join(', ')}
              onChange={(e) =>
                setOffering(idx, {
                  badges: e.target.value.split(',').map((b) => b.trim()).filter(Boolean),
                })
              }
            />
          </div>
        ))}
      </div>
    );
  }

  if (activeTab === 'faqs') {
    return (
      <div className="space-y-4">
        <CmsFutureFeatureCallout>
          Industry FAQs are saved to the database but are not rendered on public industry detail pages yet.
        </CmsFutureFeatureCallout>
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Industry FAQs</span>
          <Button
            type="button"
            variant="outline"
            className="h-8 text-xs"
            onClick={() => onChange({ faqsList: [...state.faqsList, { question: '', answer: '' }] })}
          >
            <Plus className="mr-1 h-3.5 w-3.5" /> Add FAQ
          </Button>
        </div>
        {state.faqsList.map((faq, idx) => (
          <div key={idx} className="relative space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
            <button
              type="button"
              onClick={() => onChange({ faqsList: state.faqsList.filter((_, i) => i !== idx) })}
              className="absolute right-3 top-3 text-slate-400 hover:text-red-500"
            >
              <Trash className="h-4 w-4" />
            </button>
            <Input
              placeholder="Question"
              value={faq.question}
              onChange={(e) => {
                const faqsList = [...state.faqsList];
                faqsList[idx] = { ...faqsList[idx], question: e.target.value };
                onChange({ faqsList });
              }}
            />
            <RichTextEditor
              label="Answer"
              value={faq.answer}
              onChange={(html) => {
                const faqsList = [...state.faqsList];
                faqsList[idx] = { ...faqsList[idx], answer: normalizeRichContent(html) };
                onChange({ faqsList });
              }}
              minHeight="120px"
            />
          </div>
        ))}
      </div>
    );
  }

  if (activeTab === 'relations') {
    return (
      <div className="space-y-6">
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
          <CmsFutureFeatureCallout>
            Related services selections are saved but not rendered on public industry detail pages yet.
          </CmsFutureFeatureCallout>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Related Services</p>
          <div className="flex flex-wrap gap-2">
            {allServiceOptions.map((opt) => {
              const selected = state.relatedServiceSlugs.includes(opt.slug);
              return (
                <button
                  key={opt.slug}
                  type="button"
                  onClick={() =>
                    onChange({ relatedServiceSlugs: toggleSlug(state.relatedServiceSlugs, opt.slug) })
                  }
                  className={`rounded-lg border px-3 py-1 text-xs font-semibold ${
                    selected
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      : 'border-slate-200 bg-slate-50 text-slate-600'
                  }`}
                >
                  {opt.title}
                </button>
              );
            })}
          </div>
        </div>
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Related Industries</p>
          <p className="text-[11px] text-slate-500">Leave empty to auto-suggest other active industries on the public page.</p>
          <div className="flex flex-wrap gap-2">
            {allIndustryOptions.map((opt) => {
              const selected = state.relatedIndustrySlugs.includes(opt.slug);
              return (
                <button
                  key={opt.slug}
                  type="button"
                  onClick={() =>
                    onChange({ relatedIndustrySlugs: toggleSlug(state.relatedIndustrySlugs, opt.slug) })
                  }
                  className={`rounded-lg border px-3 py-1 text-xs font-semibold ${
                    selected
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      : 'border-slate-200 bg-slate-50 text-slate-600'
                  }`}
                >
                  {opt.title}
                </button>
              );
            })}
          </div>
        </div>
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Hero Overrides</p>
          <Input
            placeholder="Hero badge (e.g. Healthcare Solutions)"
            value={state.heroBadge}
            onChange={(e) => onChange({ heroBadge: e.target.value })}
          />
          <Input
            placeholder="Hero tagline"
            value={state.heroTagline}
            onChange={(e) => onChange({ heroTagline: e.target.value })}
          />
        </div>
      </div>
    );
  }

  if (activeTab === 'cta') {
    return (
      <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
        {(['badge', 'headline', 'body', 'primaryButtonLabel', 'secondaryButtonLabel', 'secondaryButtonHref'] as const).map(
          (key) => (
            <div key={key}>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{key}</label>
              <Input
                value={state.ctaBlock[key]}
                onChange={(e) => onChange({ ctaBlock: { ...state.ctaBlock, [key]: e.target.value } })}
                className="mt-1"
              />
            </div>
          )
        )}
      </div>
    );
  }

  if (activeTab === 'sidebar') {
    return (
      <div className="space-y-4">
        <p className="text-xs text-slate-500">Leave fields empty to use global defaults from Industries Landing CMS.</p>
        {(Object.keys(state.sidebar) as Array<keyof typeof state.sidebar>).map((key) => (
          <div key={key}>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{key}</label>
            <Input
              value={state.sidebar[key]}
              onChange={(e) => onChange({ sidebar: { ...state.sidebar, [key]: e.target.value } })}
              className="mt-1"
            />
          </div>
        ))}
        <div className="border-t border-slate-100 pt-4">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Consultation Form Overrides</p>
          {(Object.keys(state.consultationForm) as Array<keyof typeof state.consultationForm>).map((key) => (
            <div key={key} className="mb-3">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{key}</label>
              <Input
                value={state.consultationForm[key]}
                onChange={(e) =>
                  onChange({ consultationForm: { ...state.consultationForm, [key]: e.target.value } })
                }
                className="mt-1"
              />
            </div>
          ))}
        </div>
        <div className="border-t border-slate-100 pt-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Why Choose TechVistar</p>
            <Button
              type="button"
              variant="outline"
              className="h-8 text-xs"
              onClick={() =>
                onChange({ whyChooseUsList: [...state.whyChooseUsList, { title: '', description: '' }] })
              }
            >
              <Plus className="mr-1 h-3.5 w-3.5" /> Add Item
            </Button>
          </div>
          {state.whyChooseUsList.map((item, idx) => (
            <div key={idx} className="relative mb-3 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <button
                type="button"
                onClick={() =>
                  onChange({ whyChooseUsList: state.whyChooseUsList.filter((_, i) => i !== idx) })
                }
                className="absolute right-2 top-2 text-slate-400 hover:text-red-500"
              >
                <Trash className="h-4 w-4" />
              </button>
              <Input
                placeholder="Title"
                value={item.title}
                onChange={(e) => {
                  const whyChooseUsList = [...state.whyChooseUsList];
                  whyChooseUsList[idx] = { ...whyChooseUsList[idx], title: e.target.value };
                  onChange({ whyChooseUsList });
                }}
              />
              <textarea
                className="min-h-[60px] w-full rounded-lg border border-slate-200 p-2 text-xs"
                placeholder="Description"
                value={item.description}
                onChange={(e) => {
                  const whyChooseUsList = [...state.whyChooseUsList];
                  whyChooseUsList[idx] = { ...whyChooseUsList[idx], description: e.target.value };
                  onChange({ whyChooseUsList });
                }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

export const EMPTY_INDUSTRY_EXTENDED_CMS: IndustryExtendedCmsState = {
  heroBadge: '',
  heroTagline: '',
  detailedOfferings: [],
  faqsList: [],
  whyChooseUsList: [],
  relatedServiceSlugs: [],
  relatedIndustrySlugs: [],
  ctaBlock: {
    badge: '',
    headline: '',
    body: '',
    primaryButtonLabel: '',
    secondaryButtonLabel: '',
    secondaryButtonHref: '',
  },
  sidebar: {
    summaryTitle: '',
    responseTimeTitle: '',
    responseTime: '',
    businessHoursTitle: '',
    businessHours: '',
    secureTitle: '',
    secureDescription: '',
    buttonLabel: '',
    directInquiriesTitle: '',
    directInquiriesBody: '',
    contactEmail: '',
  },
  consultationForm: {
    title: '',
    description: '',
    submitLabel: '',
    privacyText: '',
    successTitle: '',
    successMessage: '',
  },
};

export function extendedCmsFromIndustryItem(item: any): IndustryExtendedCmsState {
  return {
    heroBadge: item.heroBadge || '',
    heroTagline: item.heroTagline || item.overviewQuote || '',
    detailedOfferings: item.detailedOfferings || [],
    faqsList: (item.faqs || []).map((f: any) => ({
      question: f.question || '',
      answer: f.answer || '',
    })),
    whyChooseUsList: (item.whyChooseUs || []).map((w: any) => ({
      title: w.title || '',
      description: w.description || '',
    })),
    relatedServiceSlugs: item.industries || [],
    relatedIndustrySlugs: item.relatedIndustrySlugs || [],
    ctaBlock: {
      badge: item.ctaBlock?.badge || '',
      headline: item.ctaBlock?.headline || '',
      body: item.ctaBlock?.body || item.cta || '',
      primaryButtonLabel: item.ctaBlock?.primaryButtonLabel || '',
      secondaryButtonLabel: item.ctaBlock?.secondaryButtonLabel || '',
      secondaryButtonHref: item.ctaBlock?.secondaryButtonHref || '',
    },
    sidebar: { ...EMPTY_INDUSTRY_EXTENDED_CMS.sidebar, ...(item.sidebar || {}) },
    consultationForm: { ...EMPTY_INDUSTRY_EXTENDED_CMS.consultationForm, ...(item.consultationForm || {}) },
  };
}

export function extendedCmsToIndustryPayload(ext: IndustryExtendedCmsState, legacyCta: string) {
  return {
    heroBadge: ext.heroBadge,
    heroTagline: ext.heroTagline,
    detailedOfferings: ext.detailedOfferings,
    faqs: ext.faqsList.filter((f) => f.question.trim() && f.answer.trim()),
    whyChooseUs: ext.whyChooseUsList.filter((w) => w.title.trim() && w.description.trim()),
    industries: ext.relatedServiceSlugs,
    relatedIndustrySlugs: ext.relatedIndustrySlugs,
    cta: ext.ctaBlock.body?.trim() || legacyCta,
    ctaBlock: ext.ctaBlock,
    sidebar: ext.sidebar,
    consultationForm: ext.consultationForm,
  };
}
