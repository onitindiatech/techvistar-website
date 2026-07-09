import { Loader2, Plus, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/admin/common/PageHeader';
import { SeoManager } from '@/components/admin/common/SeoManager';
import { CmsImageField } from '@/components/admin/common/CmsImageField';
import { CmsSectionCard, CmsTextFields } from '@/components/admin/common/CmsSettingsFields';
import { CmsStickySaveBar } from '@/components/admin/common/CmsAccordionLayout';
import { usePagesCmsSettings } from '@/hooks/usePagesCmsSettings';
import { seoFromItem } from '@/lib/seoAdmin';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const CareersLandingSettings = () => {
  const { form, setForm, isLoading, save, isSaving } = usePagesCmsSettings('careers');

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-slate-500">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Loading settings...
      </div>
    );
  }

  const patch = (section: 'hero' | 'culture' | 'cta', key: string, value: string) =>
    setForm((prev) => ({ ...prev, [section]: { ...prev[section], [key]: value } }));

  return (
    <div className="max-w-4xl space-y-8">
      <PageHeader title="Careers Landing CMS" description="Manage Careers page hero, culture, benefits, hiring process, CTA, and SEO." />

      <CmsSectionCard title="Hero">
        <CmsTextFields fields={[{ key: 'eyebrow', label: 'Eyebrow' }, { key: 'title', label: 'Title' }, { key: 'description', label: 'Description', type: 'textarea' }]} values={form.hero as unknown as Record<string, string>} onChange={(k, v) => patch('hero', k, v)} />
        <CmsImageField label="Hero background" value={form.hero.backgroundImage || ''} onChange={(url) => patch('hero', 'backgroundImage', url)} />
      </CmsSectionCard>

      <CmsSectionCard title="Company Culture">
        <CmsTextFields fields={[{ key: 'title', label: 'Title' }, { key: 'description', label: 'Description', type: 'textarea' }]} values={form.culture as unknown as Record<string, string>} onChange={(k, v) => patch('culture', k, v)} />
      </CmsSectionCard>

      <CmsSectionCard title="Benefits">
        {form.benefits.map((item, index) => (
          <div key={index} className="space-y-2 rounded-xl border border-slate-100 p-3">
            <Input placeholder="Title" value={item.title} onChange={(e) => { const benefits = [...form.benefits]; benefits[index] = { ...benefits[index], title: e.target.value }; setForm((prev) => ({ ...prev, benefits })); }} />
            <Input placeholder="Description" value={item.description} onChange={(e) => { const benefits = [...form.benefits]; benefits[index] = { ...benefits[index], description: e.target.value }; setForm((prev) => ({ ...prev, benefits })); }} />
            <Button type="button" variant="ghost" size="sm" onClick={() => setForm((prev) => ({ ...prev, benefits: prev.benefits.filter((_, i) => i !== index) }))}><Trash2 className="mr-1 h-3.5 w-3.5" /> Remove</Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" className="gap-1" onClick={() => setForm((prev) => ({ ...prev, benefits: [...prev.benefits, { title: '', description: '' }] }))}><Plus className="h-3.5 w-3.5" /> Add benefit</Button>
      </CmsSectionCard>

      <CmsSectionCard title="Hiring Process">
        {form.hiringProcess.map((item, index) => (
          <div key={index} className="grid gap-2 rounded-xl border border-slate-100 p-3 sm:grid-cols-3">
            <Input placeholder="Step" value={item.step} onChange={(e) => { const hiringProcess = [...form.hiringProcess]; hiringProcess[index] = { ...hiringProcess[index], step: e.target.value }; setForm((prev) => ({ ...prev, hiringProcess })); }} />
            <Input placeholder="Title" value={item.title} onChange={(e) => { const hiringProcess = [...form.hiringProcess]; hiringProcess[index] = { ...hiringProcess[index], title: e.target.value }; setForm((prev) => ({ ...prev, hiringProcess })); }} />
            <Input placeholder="Description" value={item.description} onChange={(e) => { const hiringProcess = [...form.hiringProcess]; hiringProcess[index] = { ...hiringProcess[index], description: e.target.value }; setForm((prev) => ({ ...prev, hiringProcess })); }} />
            <Button type="button" variant="ghost" size="sm" className="sm:col-span-3" onClick={() => setForm((prev) => ({ ...prev, hiringProcess: prev.hiringProcess.filter((_, i) => i !== index) }))}><Trash2 className="mr-1 h-3.5 w-3.5" /> Remove</Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" className="gap-1" onClick={() => setForm((prev) => ({ ...prev, hiringProcess: [...prev.hiringProcess, { step: '', title: '', description: '' }] }))}><Plus className="h-3.5 w-3.5" /> Add step</Button>
      </CmsSectionCard>

      <CmsSectionCard title="CTA">
        <CmsTextFields fields={[{ key: 'title', label: 'Title' }, { key: 'description', label: 'Description', type: 'textarea' }, { key: 'buttonText', label: 'Button text' }, { key: 'buttonLink', label: 'Button link' }]} values={form.cta as unknown as Record<string, string>} onChange={(k, v) => patch('cta', k, v)} />
      </CmsSectionCard>

      <CmsSectionCard title="SEO">
        <SeoManager value={seoFromItem(form as unknown as Record<string, unknown>)} onChange={(seo) => setForm((prev) => ({ ...prev, ...seo }))} pathPrefix="/careers" defaultTitle={form.seoTitle || ''} defaultDescription={form.seoDescription || ''} />
      </CmsSectionCard>

      <CmsStickySaveBar onSave={save} isSaving={isSaving} />
    </div>
  );
};

export default CareersLandingSettings;
