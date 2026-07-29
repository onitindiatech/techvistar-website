import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getAdminServicesCmsConfig, updateServicesCmsConfig } from '@/services/servicesCmsConfig.service';
import { DEFAULT_SERVICES_CMS_CONFIG, ServicesLandingConfig } from '@/types/servicesCms';
import { useToast } from '@/hooks/use-toast';
import { Loader2, LayoutTemplate, Layers, Star, LayoutGrid, Search } from 'lucide-react';
import { SeoManager } from '@/components/admin/common/SeoManager';
import { CmsImageField } from '@/components/admin/common/CmsImageField';
import { CmsSectionCard, CmsTextFields } from '@/components/admin/common/CmsSettingsFields';
import { CmsPageLayout, CmsSectionAnchor } from '@/components/admin/common/CmsPageLayout';
import { seoFromItem } from '@/lib/seoAdmin';

const NAV_SECTIONS = [
  { id: 'hero',         label: 'Hero',               icon: LayoutTemplate },
  { id: 'category-nav', label: 'Category Navigation', icon: Layers         },
  { id: 'featured',     label: 'Featured Services',   icon: Star           },
  { id: 'catalog',      label: 'Services Grid',       icon: LayoutGrid     },
  { id: 'seo',          label: 'SEO',                 icon: Search         },
];

const ServicesSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<ServicesLandingConfig>(DEFAULT_SERVICES_CMS_CONFIG.landing);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'servicesCmsConfig'],
    queryFn: getAdminServicesCmsConfig,
  });

  useEffect(() => {
    if (data?.landing) {
      setForm({ ...DEFAULT_SERVICES_CMS_CONFIG.landing, ...data.landing });
    }
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: () => updateServicesCmsConfig({ landing: form }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'servicesCmsConfig'] });
      queryClient.invalidateQueries({ queryKey: ['servicesCmsConfig'] });
      toast({ title: 'Saved', description: 'Services landing settings updated.' });
      setIsDirty(false);
      setLastSaved(new Date());
    },
    onError: (err: Error) => {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    },
  });

  const patch = (key: keyof ServicesLandingConfig, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-slate-500">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Loading settings...
      </div>
    );
  }

  return (
    <CmsPageLayout
      title="Services Landing CMS"
      description="Manage every visible section on /services — hero, category navigation, featured services, catalog grid, and SEO."
      sections={NAV_SECTIONS}
      onSave={() => saveMutation.mutate()}
      onDiscard={() => setIsDirty(false)}
      isSaving={saveMutation.isPending}
      isDirty={isDirty}
      lastSaved={lastSaved}
    >
      <CmsSectionAnchor id="hero">
        <CmsSectionCard title="Hero">
          <CmsTextFields
            fields={[
              { key: 'subtitle', label: 'Badge' },
              { key: 'title', label: 'Title' },
              { key: 'description', label: 'Description', type: 'textarea' },
              { key: 'ctaText', label: 'CTA text' },
            ]}
            values={form as unknown as Record<string, string>}
            onChange={(k, v) => patch(k as keyof ServicesLandingConfig, v)}
          />
          <CmsImageField
            label="Hero background"
            value={form.backgroundImage}
            onChange={(url) => patch('backgroundImage', url)}
          />
        </CmsSectionCard>
      </CmsSectionAnchor>

      <CmsSectionAnchor id="category-nav">
        <CmsSectionCard title="Category Navigation" description="Label for the category filter bar. Tabs are generated from active services.">
          <CmsTextFields
            fields={[{ key: 'categoryEyebrow', label: 'Eyebrow' }]}
            values={form as unknown as Record<string, string>}
            onChange={(k, v) => patch(k as keyof ServicesLandingConfig, v)}
          />
        </CmsSectionCard>
      </CmsSectionAnchor>

      <CmsSectionAnchor id="featured">
        <CmsSectionCard title="Featured Services" description="Section presentation and service card labels. Featured flags are managed in Services CRUD.">
          <CmsTextFields
            fields={[
              { key: 'featuredEyebrow', label: 'Eyebrow' },
              { key: 'featuredTitle', label: 'Section title' },
              { key: 'featuredDescription', label: 'Description', type: 'textarea' },
              { key: 'offeringsLabel', label: 'Card offerings label' },
              { key: 'learnMoreLabel', label: 'Card CTA label' },
            ]}
            values={form as unknown as Record<string, string>}
            onChange={(k, v) => patch(k as keyof ServicesLandingConfig, v)}
          />
        </CmsSectionCard>
      </CmsSectionAnchor>

      <CmsSectionAnchor id="catalog">
        <CmsSectionCard title="Services Grid">
          <CmsTextFields
            fields={[
              { key: 'catalogEyebrow', label: 'Eyebrow' },
              { key: 'catalogTitle', label: 'Section title' },
              { key: 'catalogDescription', label: 'Description', type: 'textarea' },
            ]}
            values={form as unknown as Record<string, string>}
            onChange={(k, v) => patch(k as keyof ServicesLandingConfig, v)}
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
            pathPrefix="/services"
            defaultTitle={form.seoTitle || ''}
            defaultDescription={form.seoDescription || ''}
            defaultImage={form.backgroundImage}
          />
        </CmsSectionCard>
      </CmsSectionAnchor>
    </CmsPageLayout>
  );
};

export default ServicesSettings;
