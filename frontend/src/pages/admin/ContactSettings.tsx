import { Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/admin/common/PageHeader';
import { SeoManager } from '@/components/admin/common/SeoManager';
import { CmsImageField } from '@/components/admin/common/CmsImageField';
import { CmsSectionCard, CmsTextFields } from '@/components/admin/common/CmsSettingsFields';
import { CmsStickySaveBar } from '@/components/admin/common/CmsAccordionLayout';
import { usePagesCmsSettings } from '@/hooks/usePagesCmsSettings';
import { seoFromItem } from '@/lib/seoAdmin';

const ContactSettings = () => {
  const { form, setForm, isLoading, save, isSaving } = usePagesCmsSettings('contact');

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-slate-500">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Loading settings...
      </div>
    );
  }

  const patchNested = (section: 'hero' | 'office' | 'contactInfo' | 'cta', key: string, value: string) =>
    setForm((prev) => ({ ...prev, [section]: { ...prev[section], [key]: value } }));

  return (
    <div className="max-w-4xl space-y-8">
      <PageHeader title="Contact CMS" description="Manage Contact page hero, office details, contact info, CTA, and SEO." />

      <CmsSectionCard title="Hero">
        <CmsTextFields fields={[{ key: 'eyebrow', label: 'Eyebrow' }, { key: 'title', label: 'Title' }, { key: 'description', label: 'Description', type: 'textarea' }]} values={form.hero as unknown as Record<string, string>} onChange={(k, v) => patchNested('hero', k, v)} />
        <CmsImageField label="Hero background" value={form.hero.backgroundImage || ''} onChange={(url) => patchNested('hero', 'backgroundImage', url)} />
      </CmsSectionCard>

      <CmsSectionCard title="Office Details">
        <CmsTextFields fields={[{ key: 'heading', label: 'Heading' }, { key: 'address', label: 'Address', type: 'textarea' }, { key: 'hours', label: 'Hours' }]} values={form.office as unknown as Record<string, string>} onChange={(k, v) => patchNested('office', k, v)} />
      </CmsSectionCard>

      <CmsSectionCard title="Contact Information">
        <CmsTextFields fields={[{ key: 'email', label: 'Email' }, { key: 'phone', label: 'Phone' }, { key: 'supportText', label: 'Support text', type: 'textarea' }]} values={form.contactInfo as unknown as Record<string, string>} onChange={(k, v) => patchNested('contactInfo', k, v)} />
      </CmsSectionCard>

      <CmsSectionCard title="CTA">
        <CmsTextFields fields={[{ key: 'title', label: 'Title' }, { key: 'description', label: 'Description', type: 'textarea' }, { key: 'buttonText', label: 'Button text' }, { key: 'buttonLink', label: 'Button link' }]} values={form.cta as unknown as Record<string, string>} onChange={(k, v) => patchNested('cta', k, v)} />
      </CmsSectionCard>

      <CmsSectionCard title="SEO">
        <SeoManager value={seoFromItem(form as unknown as Record<string, unknown>)} onChange={(seo) => setForm((prev) => ({ ...prev, ...seo }))} pathPrefix="/contact" defaultTitle={form.seoTitle || ''} defaultDescription={form.seoDescription || ''} />
      </CmsSectionCard>

      <CmsStickySaveBar onSave={save} isSaving={isSaving} />
    </div>
  );
};

export default ContactSettings;
