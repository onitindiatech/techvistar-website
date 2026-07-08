import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RichTextEditor } from '@/components/admin/common/RichTextEditor';
import { normalizeRichContent } from '@/lib/sanitizeHtml';
import { Trash, Plus } from 'lucide-react';
import type { DetailedOffering } from '@/data/services';

const OFFERING_COLORS = ['green', 'blue', 'purple', 'red', 'orange', 'indigo', 'gold', 'gray'];
const OFFERING_ICONS = [
  'globe', 'smartphone', 'palette', 'cpu', 'cloud', 'code', 'brain', 'sparkles',
  'database', 'shield', 'workflow', 'terminal', 'search', 'layers', 'bot',
];

export type ServiceFaqRow = { question: string; answer: string };

export interface ServiceExtendedCmsState {
  heroBadge: string;
  heroTagline: string;
  detailedOfferings: DetailedOffering[];
  faqsList: ServiceFaqRow[];
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
  state: ServiceExtendedCmsState;
  onChange: (patch: Partial<ServiceExtendedCmsState>) => void;
  allServiceOptions: { slug: string; title: string }[];
  allIndustryOptions: { slug: string; title: string }[];
}

function toggleSlug(list: string[], slug: string): string[] {
  return list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug];
}

export function ServiceExtendedCmsFields({
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
            <Plus className="w-3.5 h-3.5 mr-1" /> Add Card
          </Button>
        </div>
        {state.detailedOfferings.map((offering, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 relative">
            <button
              type="button"
              onClick={() =>
                onChange({ detailedOfferings: state.detailedOfferings.filter((_, i) => i !== idx) })
              }
              className="absolute top-3 right-3 text-slate-400 hover:text-red-500"
            >
              <Trash className="w-4 h-4" />
            </button>
            <Input placeholder="Title" value={offering.title} onChange={(e) => setOffering(idx, { title: e.target.value })} />
            <textarea
              className="w-full min-h-[80px] p-3 rounded-lg border border-slate-200 text-xs"
              placeholder="Description"
              value={offering.description}
              onChange={(e) => setOffering(idx, { description: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-3">
              <select
                className="h-9 rounded-lg border border-slate-200 text-xs px-2"
                value={offering.color}
                onChange={(e) => setOffering(idx, { color: e.target.value })}
              >
                {OFFERING_COLORS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <select
                className="h-9 rounded-lg border border-slate-200 text-xs px-2"
                value={offering.iconName}
                onChange={(e) => setOffering(idx, { iconName: e.target.value })}
              >
                {OFFERING_ICONS.map((icon) => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
            </div>
            <Input
              placeholder="Badges (comma-separated)"
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
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Service FAQs</span>
          <Button
            type="button"
            variant="outline"
            className="h-8 text-xs"
            onClick={() => onChange({ faqsList: [...state.faqsList, { question: '', answer: '' }] })}
          >
            <Plus className="w-3.5 h-3.5 mr-1" /> Add FAQ
          </Button>
        </div>
        {state.faqsList.map((faq, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 relative">
            <button
              type="button"
              onClick={() => onChange({ faqsList: state.faqsList.filter((_, i) => i !== idx) })}
              className="absolute top-3 right-3 text-slate-400 hover:text-red-500"
            >
              <Trash className="w-4 h-4" />
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
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
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
                  className={`px-3 py-1 rounded-lg text-xs font-semibold border ${
                    selected
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  {opt.title}
                </button>
              );
            })}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Related Industries</p>
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
                  className={`px-3 py-1 rounded-lg text-xs font-semibold border ${
                    selected
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  {opt.title}
                </button>
              );
            })}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Hero Overrides</p>
          <Input
            placeholder="Hero badge (e.g. Web Development Solutions)"
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
      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
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
        <p className="text-xs text-slate-500">Leave fields empty to use global defaults from Services Settings.</p>
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
        <div className="pt-4 border-t border-slate-100">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Consultation Form Overrides</p>
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
      </div>
    );
  }

  return null;
}

export const EMPTY_EXTENDED_CMS: ServiceExtendedCmsState = {
  heroBadge: '',
  heroTagline: '',
  detailedOfferings: [],
  faqsList: [],
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

export function extendedCmsFromItem(item: any): ServiceExtendedCmsState {
  return {
    heroBadge: item.heroBadge || '',
    heroTagline: item.heroTagline || '',
    detailedOfferings: item.detailedOfferings || [],
    faqsList: (item.faqs || []).map((f: any) => ({
      question: f.question || '',
      answer: f.answer || '',
    })),
    relatedServiceSlugs: item.relatedServiceSlugs || [],
    relatedIndustrySlugs: item.relatedIndustrySlugs || [],
    ctaBlock: {
      badge: item.ctaBlock?.badge || '',
      headline: item.ctaBlock?.headline || '',
      body: item.ctaBlock?.body || item.cta || '',
      primaryButtonLabel: item.ctaBlock?.primaryButtonLabel || '',
      secondaryButtonLabel: item.ctaBlock?.secondaryButtonLabel || '',
      secondaryButtonHref: item.ctaBlock?.secondaryButtonHref || '',
    },
    sidebar: { ...EMPTY_EXTENDED_CMS.sidebar, ...(item.sidebar || {}) },
    consultationForm: { ...EMPTY_EXTENDED_CMS.consultationForm, ...(item.consultationForm || {}) },
  };
}

export function extendedCmsToPayload(ext: ServiceExtendedCmsState, legacyCta: string) {
  return {
    heroBadge: ext.heroBadge,
    heroTagline: ext.heroTagline,
    detailedOfferings: ext.detailedOfferings,
    faqs: ext.faqsList.filter((f) => f.question.trim() && f.answer.trim()),
    relatedServiceSlugs: ext.relatedServiceSlugs,
    relatedIndustrySlugs: ext.relatedIndustrySlugs,
    cta: ext.ctaBlock.body?.trim() || legacyCta,
    ctaBlock: ext.ctaBlock,
    sidebar: ext.sidebar,
    consultationForm: ext.consultationForm,
  };
}
