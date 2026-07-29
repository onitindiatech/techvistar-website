import { useState } from 'react';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { SeoManager } from '@/components/admin/common/SeoManager';
import { CmsImageField } from '@/components/admin/common/CmsImageField';
import { CmsSectionCard, CmsTextFields } from '@/components/admin/common/CmsSettingsFields';
import { CmsPageLayout, CmsSectionAnchor } from '@/components/admin/common/CmsPageLayout';
import { usePagesCmsSettings } from '@/hooks/usePagesCmsSettings';
import { seoFromItem } from '@/lib/seoAdmin';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Image, Heart, Gift, ListOrdered, Megaphone, Search } from 'lucide-react';

const NAV_SECTIONS = [
  { id: 'hero',    label: 'Hero',           icon: Image       },
  { id: 'culture', label: 'Culture',        icon: Heart       },
  { id: 'benefits',label: 'Benefits',       icon: Gift        },
  { id: 'process', label: 'Hiring Process', icon: ListOrdered },
  { id: 'cta',     label: 'CTA',            icon: Megaphone   },
  { id: 'seo',     label: 'SEO',            icon: Search      },
];

const CareersLandingSettings = () => {
  const { form, setForm, isLoading, save, isSaving } = usePagesCmsSettings('careers');
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-slate-500">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Loading settings...
      </div>
    );
  }

  const patch = (section: 'hero' | 'culture' | 'cta', key: string, value: string) => {
    setForm((prev) => ({ ...prev, [section]: { ...prev[section], [key]: value } }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    await save();
    setIsDirty(false);
    setLastSaved(new Date());
  };

  return (
    <CmsPageLayout
      title="Careers Landing CMS"
      description="Manage Careers page hero, culture, benefits, hiring process, CTA, and SEO."
      sections={NAV_SECTIONS}
      onSave={handleSave}
      onDiscard={() => setIsDirty(false)}
      isSaving={isSaving}
      isDirty={isDirty}
      lastSaved={lastSaved}
    >
      <CmsSectionAnchor id="hero">
        <CmsSectionCard title="Hero" description="Headline and background for the Careers landing page." icon={Image}>
          <CmsTextFields
            twoColumn
            fields={[
              { key: 'eyebrow', label: 'Eyebrow' },
              { key: 'title', label: 'Title' },
              { key: 'subtitle', label: 'Subtitle (gradient line)' },
              { key: 'description', label: 'Description', type: 'textarea', fullWidth: true },
            ]}
            values={form.hero as unknown as Record<string, string>}
            onChange={(k, v) => patch('hero', k, v)}
          />
          <CmsImageField label="Hero background" value={form.hero.backgroundImage || ''} onChange={(url) => patch('hero', 'backgroundImage', url)} />
        </CmsSectionCard>
      </CmsSectionAnchor>

      <CmsSectionAnchor id="culture">
        <CmsSectionCard title="Company Culture" description="Culture section headline and description." icon={Heart}>
          <CmsTextFields
            fields={[
              { key: 'title', label: 'Title' },
              { key: 'description', label: 'Description', type: 'textarea' },
            ]}
            values={form.culture as unknown as Record<string, string>}
            onChange={(k, v) => patch('culture', k, v)}
          />
        </CmsSectionCard>
      </CmsSectionAnchor>

      <CmsSectionAnchor id="benefits">
        <CmsSectionCard title="Benefits" description="List of employee benefits shown on the Careers page." icon={Gift}>
          <div className="space-y-3">
            {form.benefits.map((item, index) => (
              <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                <Input
                  placeholder="Title"
                  value={item.title}
                  onChange={(e) => {
                    const benefits = [...form.benefits];
                    benefits[index] = { ...benefits[index], title: e.target.value };
                    setForm((prev) => ({ ...prev, benefits }));
                    setIsDirty(true);
                  }}
                  className="h-9 rounded-lg border-slate-200 bg-white text-sm"
                />
                <Input
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => {
                    const benefits = [...form.benefits];
                    benefits[index] = { ...benefits[index], description: e.target.value };
                    setForm((prev) => ({ ...prev, benefits }));
                    setIsDirty(true);
                  }}
                  className="h-9 rounded-lg border-slate-200 bg-white text-sm"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => { setForm((prev) => ({ ...prev, benefits: prev.benefits.filter((_, i) => i !== index) })); setIsDirty(true); }}
                  className="h-9 w-9 p-0 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5 rounded-xl border-dashed"
              onClick={() => { setForm((prev) => ({ ...prev, benefits: [...prev.benefits, { title: '', description: '' }] })); setIsDirty(true); }}
            >
              <Plus className="h-3.5 w-3.5" /> Add Benefit
            </Button>
          </div>
        </CmsSectionCard>
      </CmsSectionAnchor>

      <CmsSectionAnchor id="process">
        <CmsSectionCard title="Hiring Process" description="Step-by-step hiring process steps." icon={ListOrdered}>
          <div className="space-y-3">
            {form.hiringProcess.map((item, index) => (
              <div key={index} className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
                <div className="grid grid-cols-3 gap-3">
                  <Input
                    placeholder="Step (e.g. 01)"
                    value={item.step}
                    onChange={(e) => {
                      const hiringProcess = [...form.hiringProcess];
                      hiringProcess[index] = { ...hiringProcess[index], step: e.target.value };
                      setForm((prev) => ({ ...prev, hiringProcess }));
                      setIsDirty(true);
                    }}
                    className="h-9 rounded-lg border-slate-200 bg-white text-sm"
                  />
                  <Input
                    placeholder="Title"
                    value={item.title}
                    onChange={(e) => {
                      const hiringProcess = [...form.hiringProcess];
                      hiringProcess[index] = { ...hiringProcess[index], title: e.target.value };
                      setForm((prev) => ({ ...prev, hiringProcess }));
                      setIsDirty(true);
                    }}
                    className="h-9 rounded-lg border-slate-200 bg-white text-sm"
                  />
                  <Input
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => {
                      const hiringProcess = [...form.hiringProcess];
                      hiringProcess[index] = { ...hiringProcess[index], description: e.target.value };
                      setForm((prev) => ({ ...prev, hiringProcess }));
                      setIsDirty(true);
                    }}
                    className="h-9 rounded-lg border-slate-200 bg-white text-sm"
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => { setForm((prev) => ({ ...prev, hiringProcess: prev.hiringProcess.filter((_, i) => i !== index) })); setIsDirty(true); }}
                    className="h-7 text-[11px] text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg gap-1"
                  >
                    <Trash2 className="h-3 w-3" /> Remove
                  </Button>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5 rounded-xl border-dashed"
              onClick={() => { setForm((prev) => ({ ...prev, hiringProcess: [...prev.hiringProcess, { step: '', title: '', description: '' }] })); setIsDirty(true); }}
            >
              <Plus className="h-3.5 w-3.5" /> Add Step
            </Button>
          </div>
        </CmsSectionCard>
      </CmsSectionAnchor>

      <CmsSectionAnchor id="cta">
        <CmsSectionCard title="CTA" description="Call-to-action block at the bottom of the Careers page." icon={Megaphone}>
          <CmsTextFields
            twoColumn
            fields={[
              { key: 'title', label: 'Title' },
              { key: 'buttonText', label: 'Button Text' },
              { key: 'description', label: 'Description', type: 'textarea', fullWidth: true },
              { key: 'buttonLink', label: 'Button Link', fullWidth: true },
            ]}
            values={form.cta as unknown as Record<string, string>}
            onChange={(k, v) => patch('cta', k, v)}
          />
        </CmsSectionCard>
      </CmsSectionAnchor>

      <CmsSectionAnchor id="seo">
        <CmsSectionCard title="SEO" description="Search engine optimisation for the Careers listing page." icon={Search}>
          <SeoManager
            value={seoFromItem(form as unknown as Record<string, unknown>)}
            onChange={(seo) => { setForm((prev) => ({ ...prev, ...seo })); setIsDirty(true); }}
            pathPrefix="/careers"
            defaultTitle={form.seoTitle || ''}
            defaultDescription={form.seoDescription || ''}
          />
        </CmsSectionCard>
      </CmsSectionAnchor>
    </CmsPageLayout>
  );
};

export default CareersLandingSettings;
