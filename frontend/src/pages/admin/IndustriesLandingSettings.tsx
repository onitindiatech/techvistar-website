import { useState } from 'react';
import { Loader2, Plus, Trash } from 'lucide-react';
import { SeoManager } from '@/components/admin/common/SeoManager';
import { CmsImageField } from '@/components/admin/common/CmsImageField';
import { CmsSectionCard, CmsTextFields } from '@/components/admin/common/CmsSettingsFields';
import { CmsPageLayout, CmsSectionAnchor } from '@/components/admin/common/CmsPageLayout';
import { usePagesCmsSettings } from '@/hooks/usePagesCmsSettings';
import { seoFromItem } from '@/lib/seoAdmin';
import {
  IndustriesCapabilityItem,
  IndustriesLandingCmsConfig,
  CmsStatItem,
} from '@/types/pagesCms';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Image, AlignLeft, LayoutGrid, Zap, Megaphone, PanelRight, ClipboardList, Search } from 'lucide-react';

const NAV_SECTIONS = [
  { id: 'hero',         label: 'Hero',               icon: Image         },
  { id: 'intro',        label: 'Intro / Header',      icon: AlignLeft     },
  { id: 'catalog',      label: 'Industry Listing',    icon: LayoutGrid    },
  { id: 'capabilities', label: 'Capabilities',        icon: Zap           },
  { id: 'cta',          label: 'Bottom CTA',          icon: Megaphone     },
  { id: 'sidebar',      label: 'Sidebar Defaults',    icon: PanelRight    },
  { id: 'consultation', label: 'Consultation Form',   icon: ClipboardList },
  { id: 'seo',          label: 'SEO',                 icon: Search        },
];

const CAPABILITY_ICONS = ['ShieldCheck', 'Layers', 'Headphones', 'Rocket', 'Building2', 'Globe', 'Cpu', 'Cloud'];
const CAPABILITY_COLORS = [
  'from-emerald-500 to-teal-600',
  'from-blue-500 to-indigo-600',
  'from-violet-500 to-purple-600',
  'from-orange-500 to-amber-600',
  'from-rose-500 to-red-600',
  'from-cyan-500 to-blue-600',
];

const SIDEBAR_FIELDS: Array<{ key: keyof IndustriesLandingCmsConfig['sidebarDefaults']; label: string }> = [
  { key: 'summaryTitle', label: 'Summary title' },
  { key: 'responseTimeTitle', label: 'Response time title' },
  { key: 'responseTime', label: 'Response time value' },
  { key: 'businessHoursTitle', label: 'Business hours title' },
  { key: 'businessHours', label: 'Business hours value' },
  { key: 'secureTitle', label: 'Secure consultation title' },
  { key: 'secureDescription', label: 'Secure consultation description' },
  { key: 'buttonLabel', label: 'Primary button label' },
  { key: 'directInquiriesTitle', label: 'Direct inquiries title' },
  { key: 'directInquiriesBody', label: 'Direct inquiries body' },
  { key: 'contactEmail', label: 'Contact email' },
];

const CONSULTATION_FIELDS: Array<{
  key: keyof IndustriesLandingCmsConfig['consultationDefaults'];
  label: string;
}> = [
  { key: 'title', label: 'Form title' },
  { key: 'description', label: 'Form description' },
  { key: 'submitLabel', label: 'Submit button label' },
  { key: 'privacyText', label: 'Privacy / consent text' },
  { key: 'successTitle', label: 'Success title' },
  { key: 'successMessage', label: 'Success message' },
];

const IndustriesLandingSettings = () => {
  const { form, setForm, isLoading, save, isSaving, discard } = usePagesCmsSettings('industriesLanding');
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-slate-500">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Loading settings...
      </div>
    );
  }

  const patch = <S extends keyof IndustriesLandingCmsConfig>(
    section: S,
    key: string,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [section]: { ...(prev[section] as Record<string, string>), [key]: value },
    }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    await save();
    setIsDirty(false);
    setLastSaved(new Date());
  };

  const handleDiscard = () => {
    discard();
    setIsDirty(false);
  };

  const patchStat = (idx: number, key: keyof CmsStatItem, value: string) => {
    setForm((prev) => {
      const stats = [...(prev.capabilities?.stats || [])];
      stats[idx] = { ...stats[idx], [key]: value };
      return {
        ...prev,
        capabilities: { ...prev.capabilities, stats },
      };
    });
    setIsDirty(true);
  };

  const patchCapability = (idx: number, patchObj: Partial<IndustriesCapabilityItem>) => {
    setForm((prev) => {
      const cards = [...(prev.capabilities?.cards || [])];
      cards[idx] = { ...cards[idx], ...patchObj };
      return {
        ...prev,
        capabilities: { ...prev.capabilities, cards },
      };
    });
    setIsDirty(true);
  };

  return (
    <CmsPageLayout
      title="Industries Landing CMS"
      description="Manage every visible section on /industries — hero, catalog, capabilities, CTA, global sidebar defaults, and SEO."
      sections={NAV_SECTIONS}
      onSave={handleSave}
      onDiscard={handleDiscard}
      isSaving={isSaving}
      isDirty={isDirty}
      lastSaved={lastSaved}
    >
      <CmsSectionAnchor id="hero">
      <CmsSectionCard title="Hero">
        <CmsTextFields
          fields={[
            { key: 'eyebrow', label: 'Eyebrow' },
            { key: 'title', label: 'Title' },
            { key: 'subtitle', label: 'Subtitle (gradient line)' },
            { key: 'description', label: 'Description', type: 'textarea' },
            {
              key: 'ctaText',
              label: 'CTA text',
              helperText: 'Green Explore button on the industries hero.',
            },
            { key: 'ctaLink', label: 'CTA link (#all-industries or /contact)' },
          ]}
          values={form.hero as unknown as Record<string, string>}
          onChange={(k, v) => patch('hero', k, v)}
        />
        <CmsImageField
          label="Hero background"
          value={form.hero.backgroundImage || ''}
          onChange={(url) => patch('hero', 'backgroundImage', url)}
        />
      </CmsSectionCard>
      </CmsSectionAnchor>

      <CmsSectionAnchor id="intro">
      <CmsSectionCard title="Intro / Capabilities Header" description="Headline above the capabilities stats and cards section.">
        <CmsTextFields
          fields={[
            { key: 'title', label: 'Title' },
            { key: 'description', label: 'Description', type: 'textarea' },
          ]}
          values={form.intro as unknown as Record<string, string>}
          onChange={(k, v) => patch('intro', k, v)}
        />
        <CmsImageField
          label="Optional intro icon/image"
          value={form.intro.icon || ''}
          onChange={(url) => patch('intro', 'icon', url)}
        />
      </CmsSectionCard>
      </CmsSectionAnchor>

      <CmsSectionAnchor id="catalog">
      <CmsSectionCard title="Industry Listing Section">
        <CmsTextFields
          fields={[
            { key: 'eyebrow', label: 'Eyebrow' },
            { key: 'title', label: 'Section title' },
            { key: 'subtitle', label: 'Section subtitle' },
            { key: 'description', label: 'Description', type: 'textarea' },
          ]}
          values={form.catalog as unknown as Record<string, string>}
          onChange={(k, v) => patch('catalog', k, v)}
        />
      </CmsSectionCard>
      </CmsSectionAnchor>

      <CmsSectionAnchor id="capabilities">
      <CmsSectionCard title="Capabilities Section">
        <CmsTextFields
          fields={[{ key: 'eyebrow', label: 'Eyebrow' }]}
          values={form.capabilities as unknown as Record<string, string>}
          onChange={(k, v) => patch('capabilities', k, v)}
        />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Stat strip</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => {
                setForm((prev) => ({
                  ...prev,
                  capabilities: {
                    ...prev.capabilities,
                    stats: [...(prev.capabilities?.stats || []), { value: '', label: '' }],
                  },
                }));
                setIsDirty(true);
              }}
            >
              <Plus className="mr-1 h-3.5 w-3.5" /> Add stat
            </Button>
          </div>
          {(form.capabilities?.stats || []).map((stat, idx) => (
            <div key={idx} className="relative grid grid-cols-2 gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <button
                type="button"
                onClick={() => {
                  setForm((prev) => ({
                    ...prev,
                    capabilities: {
                      ...prev.capabilities,
                      stats: prev.capabilities.stats.filter((_, i) => i !== idx),
                    },
                  }));
                  setIsDirty(true);
                }}
                className="absolute right-2 top-2 text-slate-400 hover:text-red-500"
              >
                <Trash className="h-4 w-4" />
              </button>
              <Input placeholder="Value" value={stat.value} onChange={(e) => patchStat(idx, 'value', e.target.value)} />
              <Input placeholder="Label" value={stat.label} onChange={(e) => patchStat(idx, 'label', e.target.value)} />
            </div>
          ))}
        </div>

        <div className="space-y-3 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Capability cards</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => {
                setForm((prev) => ({
                  ...prev,
                  capabilities: {
                    ...prev.capabilities,
                    cards: [
                      ...(prev.capabilities?.cards || []),
                      {
                        icon: 'ShieldCheck',
                        title: '',
                        description: '',
                        color: 'from-emerald-500 to-teal-600',
                        image: '',
                      },
                    ],
                  },
                }));
                setIsDirty(true);
              }}
            >
              <Plus className="mr-1 h-3.5 w-3.5" /> Add card
            </Button>
          </div>
          {(form.capabilities?.cards || []).map((card, idx) => (
            <div key={idx} className="relative space-y-3 rounded-xl border border-slate-200 bg-white p-4">
              <button
                type="button"
                onClick={() => {
                  setForm((prev) => ({
                    ...prev,
                    capabilities: {
                      ...prev.capabilities,
                      cards: prev.capabilities.cards.filter((_, i) => i !== idx),
                    },
                  }));
                  setIsDirty(true);
                }}
                className="absolute right-2 top-2 text-slate-400 hover:text-red-500"
              >
                <Trash className="h-4 w-4" />
              </button>
              <Input placeholder="Title" value={card.title} onChange={(e) => patchCapability(idx, { title: e.target.value })} />
              <textarea
                className="min-h-[70px] w-full rounded-lg border border-slate-200 p-2 text-xs"
                placeholder="Description"
                value={card.description}
                onChange={(e) => patchCapability(idx, { description: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  className="h-9 rounded-lg border border-slate-200 px-2 text-xs"
                  value={card.icon}
                  onChange={(e) => patchCapability(idx, { icon: e.target.value })}
                >
                  {CAPABILITY_ICONS.map((icon) => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
                <select
                  className="h-9 rounded-lg border border-slate-200 px-2 text-xs"
                  value={card.color}
                  onChange={(e) => patchCapability(idx, { color: e.target.value })}
                >
                  {CAPABILITY_COLORS.map((color) => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>
              <CmsImageField
                label="Optional card image"
                value={card.image || ''}
                onChange={(url) => patchCapability(idx, { image: url })}
              />
            </div>
          ))}
        </div>
      </CmsSectionCard>
      </CmsSectionAnchor>

      <CmsSectionAnchor id="cta">
      <CmsSectionCard title="Bottom CTA">
        <CmsTextFields
          fields={[
            { key: 'badge', label: 'Badge' },
            { key: 'title', label: 'Title' },
            { key: 'description', label: 'Description', type: 'textarea' },
            { key: 'buttonText', label: 'Primary button text' },
            { key: 'buttonLink', label: 'Primary button link' },
            { key: 'secondaryButtonText', label: 'Secondary button text' },
            { key: 'secondaryButtonLink', label: 'Secondary button link' },
          ]}
          values={form.cta as unknown as Record<string, string>}
          onChange={(k, v) => patch('cta', k, v)}
        />
        <CmsImageField
          label="CTA background image (optional)"
          value={form.cta.backgroundImage || ''}
          onChange={(url) => patch('cta', 'backgroundImage', url)}
        />
      </CmsSectionCard>
      </CmsSectionAnchor>

      <CmsSectionAnchor id="sidebar">
      <CmsSectionCard title="Global Sidebar Defaults" description="Used on industry detail pages when per-industry sidebar fields are empty.">
        {SIDEBAR_FIELDS.map(({ key, label }) => (
          <div key={key}>
            <label className="text-[10px] font-bold uppercase text-slate-500">{label}</label>
            <Input
              value={form.sidebarDefaults[key]}
              onChange={(e) => {
                setForm((prev) => ({
                  ...prev,
                  sidebarDefaults: { ...prev.sidebarDefaults, [key]: e.target.value },
                }));
                setIsDirty(true);
              }}
              className="mt-1"
            />
          </div>
        ))}
      </CmsSectionCard>
      </CmsSectionAnchor>

      <CmsSectionAnchor id="consultation">
      <CmsSectionCard title="Global Consultation Form Defaults">
        {CONSULTATION_FIELDS.map(({ key, label }) => (
          <div key={key}>
            <label className="text-[10px] font-bold uppercase text-slate-500">{label}</label>
            <Input
              value={form.consultationDefaults[key]}
              onChange={(e) => {
                setForm((prev) => ({
                  ...prev,
                  consultationDefaults: { ...prev.consultationDefaults, [key]: e.target.value },
                }));
                setIsDirty(true);
              }}
              className="mt-1"
            />
          </div>
        ))}
      </CmsSectionCard>
      </CmsSectionAnchor>

      <CmsSectionAnchor id="seo">
      <CmsSectionCard title="SEO">
        <SeoManager
          value={seoFromItem(form as unknown as Record<string, unknown>)}
          onChange={(seo) => {
            setForm((prev) => ({ ...prev, ...seo }));
            setIsDirty(true);
          }}
          pathPrefix="/industries"
          defaultTitle={form.seoTitle || ''}
          defaultDescription={form.seoDescription || ''}
          defaultImage={form.hero.backgroundImage}
          scoreOptions={{
            requireSlug: false,
            pagePath: '/industries',
            h1Text: [form.hero.title, form.hero.subtitle].filter(Boolean).join(' '),
            hasStructuredData: true,
            hasInternalLinks: Boolean(
              form.hero.ctaLink?.trim() ||
                form.cta.buttonLink?.trim() ||
                form.cta.secondaryButtonLink?.trim()
            ),
            imageAltReady: true,
          }}
        />
      </CmsSectionCard>
      </CmsSectionAnchor>
    </CmsPageLayout>
  );
};

export default IndustriesLandingSettings;
