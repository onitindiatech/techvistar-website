import { Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/admin/common/PageHeader';
import { SeoManager } from '@/components/admin/common/SeoManager';
import { CmsImageField } from '@/components/admin/common/CmsImageField';
import { CmsSectionCard, CmsTextFields } from '@/components/admin/common/CmsSettingsFields';
import { CmsStickySaveBar } from '@/components/admin/common/CmsAccordionLayout';
import { usePagesCmsSettings } from '@/hooks/usePagesCmsSettings';
import { seoFromItem } from '@/lib/seoAdmin';

const AboutSettings = () => {
  const { form, setForm, isLoading, save, isSaving } = usePagesCmsSettings('about');

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-slate-500">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Loading settings...
      </div>
    );
  }

  const patch = (section: keyof typeof form, key: string, value: string) => {
    if (section === 'hero' || section === 'story' || section === 'mission' || section === 'vision' || section === 'teamSection' || section === 'cta') {
      setForm((prev) => ({
        ...prev,
        [section]: { ...(prev[section] as Record<string, string>), [key]: value },
      }));
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      <PageHeader title="About CMS" description="Manage About page hero, story, mission, vision, team, CTA, and SEO." />

      <CmsSectionCard title="Hero">
        <CmsTextFields
          fields={[
            { key: 'eyebrow', label: 'Eyebrow' },
            { key: 'title', label: 'Title' },
            { key: 'description', label: 'Description', type: 'textarea' },
          ]}
          values={form.hero as unknown as Record<string, string>}
          onChange={(k, v) => patch('hero', k, v)}
        />
        <CmsImageField label="Hero background" value={form.hero.backgroundImage || ''} onChange={(url) => patch('hero', 'backgroundImage', url)} />
      </CmsSectionCard>

      <CmsSectionCard title="Story">
        <CmsTextFields
          fields={[
            { key: 'title', label: 'Title' },
            { key: 'body', label: 'Body', type: 'textarea', rows: 6 },
          ]}
          values={form.story as unknown as Record<string, string>}
          onChange={(k, v) => patch('story', k, v)}
        />
      </CmsSectionCard>

      <CmsSectionCard title="Mission & Vision">
        <CmsTextFields fields={[{ key: 'title', label: 'Mission title' }, { key: 'text', label: 'Mission text', type: 'textarea' }]} values={form.mission as unknown as Record<string, string>} onChange={(k, v) => patch('mission', k, v)} />
        <CmsTextFields fields={[{ key: 'title', label: 'Vision title' }, { key: 'text', label: 'Vision text', type: 'textarea' }]} values={form.vision as unknown as Record<string, string>} onChange={(k, v) => patch('vision', k, v)} />
      </CmsSectionCard>

      <CmsSectionCard title="Team Section">
        <CmsTextFields fields={[{ key: 'heading', label: 'Heading' }, { key: 'description', label: 'Description', type: 'textarea' }]} values={form.teamSection as unknown as Record<string, string>} onChange={(k, v) => patch('teamSection', k, v)} />
      </CmsSectionCard>

      <CmsSectionCard title="CTA">
        <CmsTextFields fields={[{ key: 'text', label: 'Text', type: 'textarea' }, { key: 'buttonText', label: 'Button text' }, { key: 'buttonLink', label: 'Button link' }]} values={form.cta as unknown as Record<string, string>} onChange={(k, v) => patch('cta', k, v)} />
      </CmsSectionCard>

      <CmsSectionCard title="SEO">
        <SeoManager value={seoFromItem(form as unknown as Record<string, unknown>)} onChange={(seo) => setForm((prev) => ({ ...prev, ...seo }))} pathPrefix="/about" defaultTitle={form.seoTitle || ''} defaultDescription={form.seoDescription || ''} />
      </CmsSectionCard>

      <CmsStickySaveBar onSave={save} isSaving={isSaving} />
    </div>
  );
};

export default AboutSettings;
