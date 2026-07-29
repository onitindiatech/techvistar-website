import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SeoManager } from '@/components/admin/common/SeoManager';
import { seoFromItem } from '@/lib/seoAdmin';
import { EMPTY_SEO, SeoMetadata } from '@/types/seo';
import { getAdminPagesConfig, updatePagesConfig } from '@/services/pages.service';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Globe, Briefcase, Building2 } from 'lucide-react';
import { CmsSectionCard } from '@/components/admin/common/CmsSettingsFields';
import { CmsPageLayout, CmsSectionAnchor } from '@/components/admin/common/CmsPageLayout';

type Tab = 'about' | 'careers';

const NAV_SECTIONS = [
  { id: 'about',   label: 'About Page',   icon: Building2 },
  { id: 'careers', label: 'Careers Page', icon: Briefcase },
];

const PageSeoSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<Tab>('about');
  const [aboutSeo, setAboutSeo] = useState<SeoMetadata>(EMPTY_SEO);
  const [careersSeo, setCareersSeo] = useState<SeoMetadata>(EMPTY_SEO);
  const [loaded, setLoaded] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const { isLoading } = useQuery({
    queryKey: ['admin', 'pages-config'],
    queryFn: async () => {
      const data = await getAdminPagesConfig();
      setAboutSeo(seoFromItem(data.about as Record<string, unknown>));
      setCareersSeo(seoFromItem(data.careers as Record<string, unknown>));
      setLoaded(true);
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: () => updatePagesConfig({ about: aboutSeo, careers: careersSeo }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'pages-config'] });
      queryClient.invalidateQueries({ queryKey: ['pages-config'] });
      toast({ title: 'Saved', description: 'Page SEO settings updated successfully.' });
      setIsDirty(false);
      setLastSaved(new Date());
    },
    onError: (err: Error) => {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    },
  });

  if (isLoading || !loaded) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400 gap-2">
        <Loader2 className="w-5 h-5 animate-spin" /> Loading SEO settings…
      </div>
    );
  }

  return (
    <CmsPageLayout
      title="Page SEO Settings"
      description="Manage search and social metadata for static site pages (About, Careers listing)."
      sections={NAV_SECTIONS}
      onSave={() => saveMutation.mutate()}
      onDiscard={() => setIsDirty(false)}
      isSaving={saveMutation.isPending}
      isDirty={isDirty}
      lastSaved={lastSaved}
    >
      {/* Page tab switcher */}
      <div className="flex gap-2 mb-2">
        {([
          { id: 'about' as Tab, label: 'About Page', icon: Building2 },
          { id: 'careers' as Tab, label: 'Careers Page', icon: Briefcase },
        ]).map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 border transition-all ${
                activeTab === tab.id
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <CmsSectionAnchor id="about">
        <CmsSectionCard
          title="About Page SEO"
          description="Search engine and social metadata for the /about page."
          icon={Building2}
          className={activeTab !== 'about' ? 'opacity-50 pointer-events-none' : ''}
        >
          <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider text-slate-500">
            <Globe className="w-4 h-4" /> /about
          </div>
          <SeoManager
            value={aboutSeo}
            onChange={(seo) => { setAboutSeo(seo); setIsDirty(true); }}
            slug=""
            pathPrefix="/about"
            defaultTitle="About TechVistar | Technology-first growth partner"
            defaultDescription="Learn about TechVistar — a Hyderabad-based technology-first growth partner."
          />
        </CmsSectionCard>
      </CmsSectionAnchor>

      <CmsSectionAnchor id="careers">
        <CmsSectionCard
          title="Careers Page SEO"
          description="Search engine and social metadata for the /careers listing page."
          icon={Briefcase}
          className={activeTab !== 'careers' ? 'opacity-50 pointer-events-none' : ''}
        >
          <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider text-slate-500">
            <Globe className="w-4 h-4" /> /careers
          </div>
          <SeoManager
            value={careersSeo}
            onChange={(seo) => { setCareersSeo(seo); setIsDirty(true); }}
            slug=""
            pathPrefix="/careers"
            defaultTitle="Careers at TechVistar | Join our engineering team"
            defaultDescription="Explore open roles at TechVistar and join our engineering team."
          />
        </CmsSectionCard>
      </CmsSectionAnchor>
    </CmsPageLayout>
  );
};

export default PageSeoSettings;
