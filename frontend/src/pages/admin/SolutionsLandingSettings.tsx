import { Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/admin/common/PageHeader';
import { SeoManager } from '@/components/admin/common/SeoManager';
import { CmsImageField } from '@/components/admin/common/CmsImageField';
import { CmsSectionCard, CmsTextFields } from '@/components/admin/common/CmsSettingsFields';
import { CmsStickySaveBar } from '@/components/admin/common/CmsAccordionLayout';
import { usePagesCmsSettings } from '@/hooks/usePagesCmsSettings';
import { seoFromItem } from '@/lib/seoAdmin';

const SolutionsLandingSettings = () => {
  const { form, setForm, isLoading, save, isSaving } = usePagesCmsSettings('solutionsLanding');

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-slate-500">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Loading settings...
      </div>
    );
  }

  const patch = (section: 'hero' | 'intro' | 'cta', key: string, value: string) =>
    setForm((prev) => ({ ...prev, [section]: { ...prev[section], [key]: value } }));

  return (
    <div className="max-w-4xl space-y-8">
      <PageHeader title="Solutions Landing CMS" description="Manage Solutions listing page hero, intro, CTA, and SEO. Featured solutions come from the Solutions CRUD." />

      <CmsSectionCard title="Hero">
        <CmsTextFields fields={[{ key: 'eyebrow', label: 'Eyebrow' }, { key: 'title', label: 'Title' }, { key: 'description', label: 'Description', type: 'textarea' }]} values={form.hero as unknown as Record<string, string>} onChange={(k, v) => patch('hero', k, v)} />
        <CmsImageField label="Hero background" value={form.hero.backgroundImage || ''} onChange={(url) => patch('hero', 'backgroundImage', url)} />
      </CmsSectionCard>

      <CmsSectionCard title="Intro">
        <CmsTextFields fields={[{ key: 'title', label: 'Title' }, { key: 'description', label: 'Description', type: 'textarea' }]} values={form.intro as unknown as Record<string, string>} onChange={(k, v) => patch('intro', k, v)} />
      </CmsSectionCard>

      <CmsSectionCard title="CTA">
        <CmsTextFields fields={[{ key: 'title', label: 'Title' }, { key: 'description', label: 'Description', type: 'textarea' }, { key: 'buttonText', label: 'Button text' }, { key: 'buttonLink', label: 'Button link' }]} values={form.cta as unknown as Record<string, string>} onChange={(k, v) => patch('cta', k, v)} />
      </CmsSectionCard>

      <CmsSectionCard title="SEO">
        <SeoManager value={seoFromItem(form as unknown as Record<string, unknown>)} onChange={(seo) => setForm((prev) => ({ ...prev, ...seo }))} pathPrefix="/solutions" defaultTitle={form.seoTitle || ''} defaultDescription={form.seoDescription || ''} defaultImage={form.hero.backgroundImage} />
      </CmsSectionCard>

      <CmsStickySaveBar onSave={save} isSaving={isSaving} />
    </div>
  );
};

export default SolutionsLandingSettings;
