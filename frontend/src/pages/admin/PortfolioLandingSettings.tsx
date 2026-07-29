import { useState } from 'react';
import { Loader2, Plus, Trash } from 'lucide-react';
import {
  Image,
  LayoutGrid,
  Megaphone,
  Route,
  Search,
  Star,
  BarChart3,
  MessageSquareQuote,
  SlidersHorizontal,
} from 'lucide-react';
import { SeoManager } from '@/components/admin/common/SeoManager';
import { CmsImageField } from '@/components/admin/common/CmsImageField';
import { CmsPageLayout, CmsSectionAnchor } from '@/components/admin/common/CmsPageLayout';
import { CmsSectionCard, CmsTextFields } from '@/components/admin/common/CmsSettingsFields';
import { usePagesCmsSettings } from '@/hooks/usePagesCmsSettings';
import { seoFromItem } from '@/lib/seoAdmin';
import {
  CmsStatItem,
  PortfolioLandingCmsConfig,
  PortfolioLandingWorkflowStep,
} from '@/types/pagesCms';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const NAV_SECTIONS = [
  { id: 'hero', label: 'Hero', icon: Image },
  { id: 'filters', label: 'Search & Filters', icon: SlidersHorizontal },
  { id: 'featured', label: 'Featured Projects', icon: Star },
  { id: 'recent', label: 'Recent Work', icon: LayoutGrid },
  { id: 'statistics', label: 'Statistics', icon: BarChart3 },
  { id: 'testimonial', label: 'Testimonial', icon: MessageSquareQuote },
  { id: 'workflow', label: 'Process', icon: Route },
  { id: 'cta', label: 'CTA', icon: Megaphone },
  { id: 'seo', label: 'SEO', icon: Search },
];

const STAT_ICON_OPTIONS = ['Briefcase', 'Building2', 'Globe', 'Award', 'Rocket', 'Smile', 'Package', 'Star'];

function newWorkflowStep(): PortfolioLandingWorkflowStep {
  return { title: '', description: '' };
}

const PortfolioLandingSettings = () => {
  const { form, setForm, isLoading, save, isSaving, discard } = usePagesCmsSettings('portfolioLanding');
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-slate-500">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Loading settings...
      </div>
    );
  }

  const patch = <S extends keyof PortfolioLandingCmsConfig>(
    section: S,
    key: string,
    value: string | boolean
  ) => {
    setForm((prev) => ({
      ...prev,
      [section]: { ...(prev[section] as Record<string, string | boolean>), [key]: value },
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
      const cards = [...(prev.statistics.cards || [])];
      cards[idx] = { ...cards[idx], [key]: value };
      return {
        ...prev,
        statistics: { ...prev.statistics, cards },
      };
    });
    setIsDirty(true);
  };

  const patchWorkflowStep = (idx: number, key: keyof PortfolioLandingWorkflowStep, value: string) => {
    setForm((prev) => {
      const steps = [...(prev.workflow.steps || [])];
      steps[idx] = { ...steps[idx], [key]: value };
      return {
        ...prev,
        workflow: { ...prev.workflow, steps },
      };
    });
    setIsDirty(true);
  };

  const patchSection = <K extends 'featuredProjects' | 'recentWork' | 'testimonial'>(
    section: K,
    key: string,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [section]: { ...(prev[section] as Record<string, string>), [key]: value },
    }));
    setIsDirty(true);
  };

  return (
    <CmsPageLayout
      title="Portfolio Landing CMS"
      description="Manage every visible section on /work — hero, filters, featured projects, recent work, statistics, testimonial, process, CTA, and SEO."
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
              { key: 'badge', label: 'Badge' },
              { key: 'title', label: 'Title' },
              {
                key: 'highlightedWords',
                label: 'Highlighted words',
                helperText: 'Comma-separated words that will be highlighted inside the title.',
              },
              { key: 'description', label: 'Description', type: 'textarea' },
              { key: 'primaryButtonText', label: 'Primary button text' },
              { key: 'primaryButtonLink', label: 'Primary button link' },
              { key: 'secondaryButtonText', label: 'Secondary button text' },
              { key: 'secondaryButtonLink', label: 'Secondary button link' },
            ]}
            values={form.hero as unknown as Record<string, string>}
            onChange={(k, v) => patch('hero', k, v)}
          />
          <CmsImageField
            label="Hero background"
            value={form.hero.backgroundImage || ''}
            onChange={(url) => patch('hero', 'backgroundImage', url)}
          />
          <CmsImageField
            label="Hero image"
            value={form.hero.image || ''}
            onChange={(url) => patch('hero', 'image', url)}
          />
        </CmsSectionCard>
      </CmsSectionAnchor>

      <CmsSectionAnchor id="filters">
        <CmsSectionCard title="Search & Filters" description="Controls the sticky filter bar shown above the case studies grid.">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={form.filters.enableSearch}
                onChange={(e) => patch('filters', 'enableSearch', e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-emerald-600"
              />
              Enable search input
            </label>
            <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={form.filters.enableFilters}
                onChange={(e) => patch('filters', 'enableFilters', e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-emerald-600"
              />
              Enable filter dropdowns
            </label>
          </div>
          <CmsTextFields
            fields={[
              { key: 'searchPlaceholder', label: 'Search placeholder' },
              { key: 'allIndustriesLabel', label: 'Industries dropdown label' },
              { key: 'allServicesLabel', label: 'Services dropdown label' },
              { key: 'allTechnologiesLabel', label: 'Technologies dropdown label' },
              { key: 'allStatusesLabel', label: 'Status dropdown label' },
            ]}
            values={form.filters as unknown as Record<string, string>}
            onChange={(k, v) => patch('filters', k, v)}
          />
        </CmsSectionCard>
      </CmsSectionAnchor>

      <CmsSectionAnchor id="featured">
        <CmsSectionCard title="Featured Projects">
          <CmsTextFields
            fields={[
              { key: 'badge', label: 'Badge' },
              { key: 'heading', label: 'Heading' },
              { key: 'description', label: 'Description', type: 'textarea' },
              { key: 'primaryButtonLabel', label: 'Project card button label' },
            ]}
            values={form.featuredProjects as unknown as Record<string, string>}
            onChange={(k, v) => patchSection('featuredProjects', k, v)}
          />
        </CmsSectionCard>
      </CmsSectionAnchor>

      <CmsSectionAnchor id="recent">
        <CmsSectionCard title="Recent Work">
          <CmsTextFields
            fields={[
              { key: 'badge', label: 'Badge' },
              { key: 'heading', label: 'Heading' },
              { key: 'description', label: 'Description', type: 'textarea' },
              { key: 'primaryButtonLabel', label: 'Primary button label' },
              { key: 'secondaryButtonLabel', label: 'Secondary button label' },
              { key: 'emptyStateTitle', label: 'Empty state title' },
              { key: 'emptyStateDescription', label: 'Empty state description', type: 'textarea' },
            ]}
            values={form.recentWork as unknown as Record<string, string>}
            onChange={(k, v) => patchSection('recentWork', k, v)}
          />
        </CmsSectionCard>
      </CmsSectionAnchor>

      <CmsSectionAnchor id="statistics">
        <CmsSectionCard title="Statistics" description="Cards used in the success metrics area on the portfolio page.">
          <CmsTextFields
            fields={[
              { key: 'heading', label: 'Heading' },
              { key: 'description', label: 'Description', type: 'textarea' },
            ]}
            values={form.statistics as unknown as Record<string, string>}
            onChange={(k, v) => patch('statistics', k, v)}
          />

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Stat cards</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                onClick={() => {
                  setForm((prev) => ({
                    ...prev,
                    statistics: {
                      ...prev.statistics,
                      cards: [...(prev.statistics.cards || []), { icon: 'Briefcase', value: '', label: '' }],
                    },
                  }));
                  setIsDirty(true);
                }}
              >
                <Plus className="mr-1 h-3.5 w-3.5" /> Add stat
              </Button>
            </div>
            {(form.statistics.cards || []).map((card, idx) => (
              <div key={idx} className="relative grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-3">
                <button
                  type="button"
                  onClick={() => {
                    setForm((prev) => ({
                      ...prev,
                      statistics: {
                        ...prev.statistics,
                        cards: prev.statistics.cards.filter((_, i) => i !== idx),
                      },
                    }));
                    setIsDirty(true);
                  }}
                  className="absolute right-2 top-2 text-slate-400 hover:text-red-500"
                >
                  <Trash className="h-4 w-4" />
                </button>
                <Input
                  placeholder="Value"
                  value={card.value}
                  onChange={(e) => patchStat(idx, 'value', e.target.value)}
                />
                <Input
                  placeholder="Label"
                  value={card.label}
                  onChange={(e) => patchStat(idx, 'label', e.target.value)}
                />
                <select
                  className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700"
                  value={card.icon || 'Briefcase'}
                  onChange={(e) => patchStat(idx, 'icon', e.target.value)}
                >
                  {STAT_ICON_OPTIONS.map((icon) => (
                    <option key={icon} value={icon}>
                      {icon}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </CmsSectionCard>
      </CmsSectionAnchor>

      <CmsSectionAnchor id="testimonial">
        <CmsSectionCard title="Testimonial">
          <CmsTextFields
            fields={[
              { key: 'badge', label: 'Badge' },
              { key: 'quote', label: 'Quote', type: 'textarea' },
              { key: 'author', label: 'Author' },
              { key: 'role', label: 'Role' },
              { key: 'company', label: 'Company' },
            ]}
            values={form.testimonial as unknown as Record<string, string>}
            onChange={(k, v) => patchSection('testimonial', k, v)}
          />
        </CmsSectionCard>
      </CmsSectionAnchor>

      <CmsSectionAnchor id="workflow">
        <CmsSectionCard title="Process / Workflow">
          <CmsTextFields
            fields={[
              { key: 'heading', label: 'Heading' },
              { key: 'description', label: 'Description', type: 'textarea' },
            ]}
            values={form.workflow as unknown as Record<string, string>}
            onChange={(k, v) => patch('workflow', k, v)}
          />

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Workflow steps</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                onClick={() => {
                  setForm((prev) => ({
                    ...prev,
                    workflow: {
                      ...prev.workflow,
                      steps: [...(prev.workflow.steps || []), newWorkflowStep()],
                    },
                  }));
                  setIsDirty(true);
                }}
              >
                <Plus className="mr-1 h-3.5 w-3.5" /> Add step
              </Button>
            </div>
            {(form.workflow.steps || []).map((step, idx) => (
              <div key={idx} className="relative space-y-3 rounded-xl border border-slate-200 bg-white p-4">
                <button
                  type="button"
                  onClick={() => {
                    setForm((prev) => ({
                      ...prev,
                      workflow: {
                        ...prev.workflow,
                        steps: prev.workflow.steps.filter((_, i) => i !== idx),
                      },
                    }));
                    setIsDirty(true);
                  }}
                  className="absolute right-2 top-2 text-slate-400 hover:text-red-500"
                >
                  <Trash className="h-4 w-4" />
                </button>
                <Input
                  placeholder="Step title"
                  value={step.title}
                  onChange={(e) => patchWorkflowStep(idx, 'title', e.target.value)}
                />
                <textarea
                  className="min-h-[72px] w-full rounded-lg border border-slate-200 p-2 text-xs"
                  placeholder="Step description"
                  value={step.description}
                  onChange={(e) => patchWorkflowStep(idx, 'description', e.target.value)}
                />
              </div>
            ))}
          </div>
        </CmsSectionCard>
      </CmsSectionAnchor>

      <CmsSectionAnchor id="cta">
        <CmsSectionCard title="CTA">
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
            label="CTA background image"
            value={form.cta.backgroundImage || ''}
            onChange={(url) => patch('cta', 'backgroundImage', url)}
          />
          <CmsImageField
            label="CTA image"
            value={form.cta.image || ''}
            onChange={(url) => patch('cta', 'image', url)}
          />
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
            pathPrefix="/work"
            defaultTitle={form.seoTitle || ''}
            defaultDescription={form.seoDescription || ''}
            defaultImage={form.hero.backgroundImage}
            scoreOptions={{
              requireSlug: false,
              pagePath: '/work',
              h1Text: [form.hero.title, form.hero.highlightedWords].filter(Boolean).join(' '),
              hasStructuredData: true,
              hasInternalLinks: Boolean(
                form.hero.primaryButtonLink?.trim() ||
                  form.hero.secondaryButtonLink?.trim() ||
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

export default PortfolioLandingSettings;
