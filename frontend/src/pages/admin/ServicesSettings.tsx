import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '@/components/admin/common/PageHeader';
import { getAdminServicesCmsConfig, updateServicesCmsConfig } from '@/services/servicesCmsConfig.service';
import { DEFAULT_SERVICES_CMS_CONFIG, ServicesCmsConfig } from '@/types/servicesCms';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Save } from 'lucide-react';
import { CmsImageField } from '@/components/admin/common/CmsImageField';

const ServicesSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<ServicesCmsConfig>(DEFAULT_SERVICES_CMS_CONFIG);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'servicesCmsConfig'],
    queryFn: getAdminServicesCmsConfig,
  });

  useEffect(() => {
    if (data) {
      setForm({
        landing: { ...DEFAULT_SERVICES_CMS_CONFIG.landing, ...(data.landing || {}) },
        homeSection: { ...DEFAULT_SERVICES_CMS_CONFIG.homeSection, ...(data.homeSection || {}) },
        sidebarDefaults: { ...DEFAULT_SERVICES_CMS_CONFIG.sidebarDefaults, ...(data.sidebarDefaults || {}) },
        consultationDefaults: {
          ...DEFAULT_SERVICES_CMS_CONFIG.consultationDefaults,
          ...(data.consultationDefaults || {}),
        },
      });
    }
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: updateServicesCmsConfig,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'servicesCmsConfig'] });
      queryClient.invalidateQueries({ queryKey: ['servicesCmsConfig'] });
      toast({ title: 'Saved', description: 'Services page settings updated.' });
    },
    onError: (err: Error) => {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    },
  });

  const patch = (section: keyof ServicesCmsConfig, key: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [section]: { ...prev[section], [key]: value },
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] text-slate-500">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading settings...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <PageHeader
        title="Services Page Settings"
        description="Manage the Services landing page, homepage section, and global sidebar / consultation defaults."
      />

      <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-900">Services Landing Page (/services)</h2>
        {(['title', 'subtitle', 'description', 'seoTitle', 'seoDescription', 'offeringsLabel', 'learnMoreLabel'] as const).map(
          (key) => (
            <div key={key}>
              <label className="text-[10px] font-bold uppercase text-slate-500">{key}</label>
              <Input
                value={form.landing[key]}
                onChange={(e) => patch('landing', key, e.target.value)}
                className="mt-1"
              />
            </div>
          )
        )}
        <CmsImageField
          label="Hero Background Image"
          value={form.landing.backgroundImage}
          onChange={(url) => patch('landing', 'backgroundImage', url)}
        />
      </section>

      <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-900">Homepage Services Section</h2>
        {(['tag', 'title', 'highlight', 'description', 'viewAllTitle', 'viewAllLinkText'] as const).map((key) => (
          <div key={key}>
            <label className="text-[10px] font-bold uppercase text-slate-500">{key}</label>
            <Input
              value={form.homeSection[key]}
              onChange={(e) => patch('homeSection', key, e.target.value)}
              className="mt-1"
            />
          </div>
        ))}
      </section>

      <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-900">Global Sidebar Defaults</h2>
        {(Object.keys(form.sidebarDefaults) as Array<keyof typeof form.sidebarDefaults>).map((key) => (
          <div key={key}>
            <label className="text-[10px] font-bold uppercase text-slate-500">{key}</label>
            <Input
              value={form.sidebarDefaults[key]}
              onChange={(e) => patch('sidebarDefaults', key, e.target.value)}
              className="mt-1"
            />
          </div>
        ))}
      </section>

      <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-900">Global Consultation Form Defaults</h2>
        {(Object.keys(form.consultationDefaults) as Array<keyof typeof form.consultationDefaults>).map((key) => (
          <div key={key}>
            <label className="text-[10px] font-bold uppercase text-slate-500">{key}</label>
            <Input
              value={form.consultationDefaults[key]}
              onChange={(e) => patch('consultationDefaults', key, e.target.value)}
              className="mt-1"
            />
          </div>
        ))}
      </section>

      <Button
        onClick={() => saveMutation.mutate(form)}
        disabled={saveMutation.isPending}
        className="gap-2"
      >
        {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        Save Settings
      </Button>
    </div>
  );
};

export default ServicesSettings;
