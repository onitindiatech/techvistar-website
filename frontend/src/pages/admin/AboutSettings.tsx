import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { SeoManager } from '@/components/admin/common/SeoManager';
import { CmsImageField } from '@/components/admin/common/CmsImageField';
import { CmsSectionCard, CmsTextFields } from '@/components/admin/common/CmsSettingsFields';
import { CmsPageLayout, CmsSectionAnchor } from '@/components/admin/common/CmsPageLayout';
import { usePagesCmsSettings } from '@/hooks/usePagesCmsSettings';
import { seoFromItem } from '@/lib/seoAdmin';
import { FileText, Image, Target, Users, Megaphone, Search } from 'lucide-react';

const NAV_SECTIONS = [
  { id: 'hero',    label: 'Hero',           icon: Image     },
  { id: 'story',   label: 'Our Story',      icon: FileText  },
  { id: 'mission', label: 'Mission & Vision',icon: Target   },
  { id: 'team',    label: 'Team Section',   icon: Users     },
  { id: 'cta',     label: 'CTA',            icon: Megaphone },
  { id: 'seo',     label: 'SEO',            icon: Search    },
];

const AboutSettings = () => {
  const { form, setForm, isLoading, save, isSaving } = usePagesCmsSettings('about');
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

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
      setIsDirty(true);
    }
  };

  const handleSave = async () => {
    await save();
    setIsDirty(false);
    setLastSaved(new Date());
  };

  return (
    <CmsPageLayout
      title="About CMS"
      description="Manage About page hero, story, mission, vision, team, CTA, and SEO."
      sections={NAV_SECTIONS}
      onSave={handleSave}
      onDiscard={() => setIsDirty(false)}
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
          <CmsImageField label="Hero background" value={form.hero.backgroundImage || ''} onChange={(url) => patch('hero', 'backgroundImage', url)} />
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
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">Mission</p>
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
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">Vision</p>
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

      <CmsSectionAnchor id="team">
        <CmsSectionCard title="Team Section" description="Heading and description for the team showcase." icon={Users}>
          <CmsTextFields
            fields={[
              { key: 'heading', label: 'Heading' },
              { key: 'description', label: 'Description', type: 'textarea' },
            ]}
            values={form.teamSection as unknown as Record<string, string>}
            onChange={(k, v) => patch('teamSection', k, v)}
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
            onChange={(seo) => { setForm((prev) => ({ ...prev, ...seo })); setIsDirty(true); }}
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
