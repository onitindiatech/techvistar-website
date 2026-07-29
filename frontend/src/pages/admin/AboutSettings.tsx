import { useState } from 'react';
import { Loader2, Plus } from 'lucide-react';
import { SeoManager } from '@/components/admin/common/SeoManager';
import { CmsImageField } from '@/components/admin/common/CmsImageField';
import { CmsSectionCard, CmsTextFields } from '@/components/admin/common/CmsSettingsFields';
import { CmsPageLayout, CmsSectionAnchor } from '@/components/admin/common/CmsPageLayout';
import { CmsSortableList } from '@/components/admin/common/CmsSortableList';
import { usePagesCmsSettings } from '@/hooks/usePagesCmsSettings';
import { seoFromItem } from '@/lib/seoAdmin';
import { CMS_ICON_OPTIONS } from '@/lib/cmsIcons';
import {
  AboutContentCard,
  AboutCmsConfig,
} from '@/types/pagesCms';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, Image, Target, Megaphone, Search, LayoutGrid, Building2 } from 'lucide-react';

const NAV_SECTIONS = [
  { id: 'hero', label: 'Hero', icon: Image },
  { id: 'story', label: 'Our Story', icon: FileText },
  { id: 'mission', label: 'Mission & Vision', icon: Target },
  { id: 'focus', label: 'What we focus on', icon: LayoutGrid },
  { id: 'industries', label: 'Industries We Serve', icon: Building2 },
  { id: 'cta', label: 'CTA', icon: Megaphone },
  { id: 'seo', label: 'SEO', icon: Search },
];

const CARD_THEMES = [
  { value: 'blue', label: 'Blue' },
  { value: 'emerald', label: 'Emerald' },
  { value: 'violet', label: 'Violet' },
  { value: 'amber', label: 'Amber' },
  { value: 'cyan', label: 'Cyan' },
  { value: 'rose', label: 'Rose' },
  { value: 'teal', label: 'Teal' },
] as const;

const emptyCard = (order: number): AboutContentCard => ({
  icon: 'Globe',
  title: '',
  description: '',
  color: 'emerald',
  image: '',
  imagePublicId: '',
  displayOrder: order,
  active: true,
});

const withDisplayOrder = (cards: AboutContentCard[]): AboutContentCard[] =>
  cards.map((card, index) => ({ ...card, displayOrder: index }));

const AboutSettings = () => {
  const { form, setForm, isLoading, save, isSaving, discard } = usePagesCmsSettings('about');
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-slate-500">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Loading settings...
      </div>
    );
  }

  const patch = (section: keyof AboutCmsConfig, key: string, value: string) => {
    if (
      section === 'hero' ||
      section === 'story' ||
      section === 'mission' ||
      section === 'vision' ||
      section === 'cta'
    ) {
      setForm((prev) => ({
        ...prev,
        [section]: { ...(prev[section] as Record<string, string>), [key]: value },
      }));
      setIsDirty(true);
    }
  };

  const patchCardsSection = (
    section: 'focusAreas' | 'industriesServe',
    patchObj: Partial<AboutCmsConfig['focusAreas']>
  ) => {
    setForm((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...patchObj },
    }));
    setIsDirty(true);
  };

  const patchCard = (
    section: 'focusAreas' | 'industriesServe',
    index: number,
    patchObj: Partial<AboutContentCard>
  ) => {
    setForm((prev) => {
      const cards = [...(prev[section]?.cards || [])];
      cards[index] = { ...cards[index], ...patchObj };
      return {
        ...prev,
        [section]: { ...prev[section], cards },
      };
    });
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

  const renderCardEditor = (
    section: 'focusAreas' | 'industriesServe',
    card: AboutContentCard,
    index: number
  ) => (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-xs font-medium text-slate-600">
          <input
            type="checkbox"
            checked={card.active !== false}
            onChange={(e) => patchCard(section, index, { active: e.target.checked })}
            className="rounded border-slate-300"
          />
          Active
        </label>
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Order {card.displayOrder ?? index}
        </span>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <select
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          value={card.icon || 'Globe'}
          onChange={(e) => patchCard(section, index, { icon: e.target.value })}
        >
          {CMS_ICON_OPTIONS.map((icon) => (
            <option key={icon} value={icon}>
              {icon}
            </option>
          ))}
        </select>
        <select
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          value={card.color || 'emerald'}
          onChange={(e) => patchCard(section, index, { color: e.target.value })}
        >
          {CARD_THEMES.map((theme) => (
            <option key={theme.value} value={theme.value}>
              {theme.label}
            </option>
          ))}
        </select>
      </div>
      <Input
        placeholder="Title"
        value={card.title}
        onChange={(e) => patchCard(section, index, { title: e.target.value })}
      />
      <textarea
        className="min-h-[70px] w-full rounded-lg border border-slate-200 p-2 text-xs"
        placeholder="Description"
        value={card.description}
        onChange={(e) => patchCard(section, index, { description: e.target.value })}
      />
      <CmsImageField
        label="Optional image"
        value={card.image || ''}
        onChange={(url, publicId) =>
          patchCard(section, index, {
            image: url,
            imagePublicId: publicId ?? card.imagePublicId ?? '',
          })
        }
      />
    </div>
  );

  return (
    <CmsPageLayout
      title="About CMS"
      description="Manage About page hero, story, mission, vision, focus areas, industries, CTA, and SEO."
      sections={NAV_SECTIONS}
      onSave={handleSave}
      onDiscard={handleDiscard}
      isSaving={isSaving}
      isDirty={isDirty}
      lastSaved={lastSaved}
    >
      <CmsSectionAnchor id="hero">
        <CmsSectionCard title="Hero" description="Page headline and background image." icon={Image}>
          <CmsTextFields
            twoColumn
            fields={[
              { key: 'eyebrow', label: 'Eyebrow' },
              { key: 'title', label: 'Title' },
              { key: 'description', label: 'Description', type: 'textarea', fullWidth: true },
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

      <CmsSectionAnchor id="story">
        <CmsSectionCard title="Our Story" description="Company story narrative shown on the About page." icon={FileText}>
          <CmsTextFields
            fields={[
              { key: 'title', label: 'Title' },
              { key: 'body', label: 'Body', type: 'textarea', rows: 6 },
            ]}
            values={form.story as unknown as Record<string, string>}
            onChange={(k, v) => patch('story', k, v)}
          />
        </CmsSectionCard>
      </CmsSectionAnchor>

      <CmsSectionAnchor id="mission">
        <CmsSectionCard title="Mission & Vision" description="Core mission and vision statements." icon={Target}>
          <div className="space-y-6">
            <div>
              <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Mission</p>
              <CmsTextFields
                twoColumn
                fields={[
                  { key: 'title', label: 'Mission Title' },
                  { key: 'text', label: 'Mission Text', type: 'textarea', fullWidth: true },
                ]}
                values={form.mission as unknown as Record<string, string>}
                onChange={(k, v) => patch('mission', k, v)}
              />
            </div>
            <div className="border-t border-slate-100 pt-5">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Vision</p>
              <CmsTextFields
                twoColumn
                fields={[
                  { key: 'title', label: 'Vision Title' },
                  { key: 'text', label: 'Vision Text', type: 'textarea', fullWidth: true },
                ]}
                values={form.vision as unknown as Record<string, string>}
                onChange={(k, v) => patch('vision', k, v)}
              />
            </div>
          </div>
        </CmsSectionCard>
      </CmsSectionAnchor>

      <CmsSectionAnchor id="focus">
        <CmsSectionCard
          title="What we focus on"
          description="Practice-area cards on the About page. Drag to reorder."
          icon={LayoutGrid}
        >
          <CmsTextFields
            fields={[
              { key: 'heading', label: 'Section Heading' },
              { key: 'description', label: 'Section Description', type: 'textarea' },
            ]}
            values={{
              heading: form.focusAreas?.heading || '',
              description: form.focusAreas?.description || '',
            }}
            onChange={(k, v) => patchCardsSection('focusAreas', { [k]: v })}
          />
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Focus cards</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => {
                const cards = form.focusAreas?.cards || [];
                patchCardsSection('focusAreas', {
                  cards: withDisplayOrder([...cards, emptyCard(cards.length)]),
                });
              }}
            >
              <Plus className="mr-1 h-3.5 w-3.5" /> Add card
            </Button>
          </div>
          <CmsSortableList<AboutContentCard>
            items={form.focusAreas?.cards || []}
            onChange={(cards) => patchCardsSection('focusAreas', { cards: withDisplayOrder(cards) })}
            onDuplicate={(item) => ({
              ...item,
              title: `${item.title} (copy)`,
              displayOrder: (form.focusAreas?.cards || []).length,
            })}
            renderItem={(card, index) => renderCardEditor('focusAreas', card, index)}
          />
        </CmsSectionCard>
      </CmsSectionAnchor>

      <CmsSectionAnchor id="industries">
        <CmsSectionCard
          title="Industries We Serve"
          description="Industry cards on the About page. Drag to reorder."
          icon={Building2}
        >
          <CmsTextFields
            fields={[
              { key: 'heading', label: 'Section Heading' },
              { key: 'description', label: 'Section Description', type: 'textarea' },
            ]}
            values={{
              heading: form.industriesServe?.heading || '',
              description: form.industriesServe?.description || '',
            }}
            onChange={(k, v) => patchCardsSection('industriesServe', { [k]: v })}
          />
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Industry cards</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => {
                const cards = form.industriesServe?.cards || [];
                patchCardsSection('industriesServe', {
                  cards: withDisplayOrder([...cards, emptyCard(cards.length)]),
                });
              }}
            >
              <Plus className="mr-1 h-3.5 w-3.5" /> Add card
            </Button>
          </div>
          <CmsSortableList<AboutContentCard>
            items={form.industriesServe?.cards || []}
            onChange={(cards) => patchCardsSection('industriesServe', { cards: withDisplayOrder(cards) })}
            onDuplicate={(item) => ({
              ...item,
              title: `${item.title} (copy)`,
              displayOrder: (form.industriesServe?.cards || []).length,
            })}
            renderItem={(card, index) => renderCardEditor('industriesServe', card, index)}
          />
        </CmsSectionCard>
      </CmsSectionAnchor>

      <CmsSectionAnchor id="cta">
        <CmsSectionCard title="CTA" description="Call-to-action block at the bottom of the About page." icon={Megaphone}>
          <CmsTextFields
            twoColumn
            fields={[
              { key: 'buttonText', label: 'Button Text' },
              { key: 'buttonLink', label: 'Button Link' },
              { key: 'text', label: 'CTA Text', type: 'textarea', fullWidth: true },
            ]}
            values={form.cta as unknown as Record<string, string>}
            onChange={(k, v) => patch('cta', k, v)}
          />
        </CmsSectionCard>
      </CmsSectionAnchor>

      <CmsSectionAnchor id="seo">
        <CmsSectionCard title="SEO" description="Search engine optimisation for the About page." icon={Search}>
          <SeoManager
            value={seoFromItem(form as unknown as Record<string, unknown>)}
            onChange={(seo) => {
              setForm((prev) => ({ ...prev, ...seo }));
              setIsDirty(true);
            }}
            pathPrefix="/about"
            defaultTitle={form.seoTitle || ''}
            defaultDescription={form.seoDescription || ''}
          />
        </CmsSectionCard>
      </CmsSectionAnchor>
    </CmsPageLayout>
  );
};

export default AboutSettings;
