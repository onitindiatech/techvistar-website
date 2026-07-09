import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getAdminPagesConfig, updatePagesConfig } from '@/services/pages.service';
import {
  DEFAULT_PAGES_CMS_CONFIG,
  mergePagesCmsConfig,
  PagesCmsConfig,
} from '@/types/pagesCms';
import { useToast } from '@/hooks/use-toast';

type SectionKey = keyof PagesCmsConfig;

export function usePagesCmsSettings<K extends SectionKey>(section: K) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<PagesCmsConfig[K]>(DEFAULT_PAGES_CMS_CONFIG[section]);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'pages-config'],
    queryFn: getAdminPagesConfig,
  });

  useEffect(() => {
    if (data) {
      const merged = mergePagesCmsConfig(data);
      setForm(merged[section]);
    }
  }, [data, section]);

  const saveMutation = useMutation({
    mutationFn: (payload: PagesCmsConfig[K]) =>
      updatePagesConfig({ [section]: payload } as Partial<PagesCmsConfig>),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'pages-config'] });
      queryClient.invalidateQueries({ queryKey: ['pages-config'] });
      toast({ title: 'Saved', description: 'Settings updated successfully.' });
    },
    onError: (err: Error) => {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    },
  });

  return {
    form,
    setForm,
    isLoading,
    save: () => saveMutation.mutate(form),
    isSaving: saveMutation.isPending,
  };
}
