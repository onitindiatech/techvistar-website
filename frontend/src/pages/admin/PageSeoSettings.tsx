import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '@/components/admin/common/PageHeader';
import { SeoManager } from '@/components/admin/common/SeoManager';
import { seoFromItem } from '@/lib/seoAdmin';
import { EMPTY_SEO, SeoMetadata } from '@/types/seo';
import { getAdminPagesConfig, updatePagesConfig } from '@/services/pages.service';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Loader2, Globe, Briefcase, Building2 } from 'lucide-react';

type Tab = 'about' | 'careers';

const PageSeoSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<Tab>('about');
  const [aboutSeo, setAboutSeo] = useState<SeoMetadata>(EMPTY_SEO);
  const [careersSeo, setCareersSeo] = useState<SeoMetadata>(EMPTY_SEO);
  const [loaded, setLoaded] = useState(false);

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
    mutationFn: () =>
      updatePagesConfig({
        about: aboutSeo,
        careers: careersSeo,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'pages-config'] });
      queryClient.invalidateQueries({ queryKey: ['pages-config'] });
      toast({ title: 'Saved', description: 'Page SEO settings updated successfully.' });
    },
    onError: (err: Error) => {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    },
  });

  const currentSeo = activeTab === 'about' ? aboutSeo : careersSeo;
  const setCurrentSeo = activeTab === 'about' ? setAboutSeo : setCareersSeo;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Page SEO Settings"
        description="Manage search and social metadata for static site pages (About, Careers listing)."
      />

      <div className="flex gap-2">
        {([
          { id: 'about' as Tab, label: 'About', icon: Building2, path: '/about' },
          { id: 'careers' as Tab, label: 'Careers', icon: Briefcase, path: '/careers' },
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

      {isLoading || !loaded ? (
        <div className="flex items-center justify-center py-20 text-slate-400 gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading SEO settings…
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6 text-xs font-bold uppercase tracking-wider text-slate-500">
            <Globe className="w-4 h-4" />
            {activeTab === 'about' ? 'About Page' : 'Careers Listing Page'}
          </div>
          <SeoManager
            value={currentSeo}
            onChange={setCurrentSeo}
            slug=""
            pathPrefix={activeTab === 'about' ? '/about' : '/careers'}
            defaultTitle={
              activeTab === 'about'
                ? 'About TechVistar | Technology-first growth partner'
                : 'Careers at TechVistar | Join our engineering team'
            }
            defaultDescription={
              activeTab === 'about'
                ? 'Learn about TechVistar — a Hyderabad-based technology-first growth partner.'
                : 'Explore open roles at TechVistar and join our engineering team.'
            }
          />
        </div>
      )}

      <div className="flex justify-end">
        <Button
          onClick={() => saveMutation.mutate()}
          disabled={saveMutation.isPending || isLoading}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          Save SEO Settings
        </Button>
      </div>
    </div>
  );
};

export default PageSeoSettings;
