import { useState, useEffect, useCallback, useRef } from 'react';
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
  const [form, setFormState] = useState<PagesCmsConfig[K]>(DEFAULT_PAGES_CMS_CONFIG[section]);
  /** Prevents query refetch from wiping unsaved local edits (e.g. MP4 upload before Save). */
  const hasLocalEditsRef = useRef(false);
  const formRef = useRef(form);
  formRef.current = form;

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'pages-config'],
    queryFn: getAdminPagesConfig,
  });

  useEffect(() => {
    if (!data) return;
    // Keep in-progress uploads/edits; only hydrate from server when pristine.
    if (hasLocalEditsRef.current) return;
    setFormState(mergePagesCmsConfig(data)[section]);
  }, [data, section]);

  const setForm = useCallback(
    (value: PagesCmsConfig[K] | ((prev: PagesCmsConfig[K]) => PagesCmsConfig[K])) => {
      hasLocalEditsRef.current = true;
      setFormState(value);
    },
    [],
  );

  const saveMutation = useMutation({
    mutationFn: (payload: PagesCmsConfig[K]) =>
      updatePagesConfig({ [section]: payload } as Partial<PagesCmsConfig>),
    onSuccess: (result) => {
      hasLocalEditsRef.current = false;
      if (result) {
        setFormState(mergePagesCmsConfig(result)[section]);
      }
      queryClient.invalidateQueries({ queryKey: ['admin', 'pages-config'] });
      queryClient.invalidateQueries({ queryKey: ['pages-config'] });
      toast({ title: 'Saved', description: 'Settings updated successfully.' });
    },
    onError: (err: Error) => {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    },
  });

  const discard = useCallback(() => {
    hasLocalEditsRef.current = false;
    if (data) {
      setFormState(mergePagesCmsConfig(data)[section]);
    } else {
      setFormState(DEFAULT_PAGES_CMS_CONFIG[section]);
    }
  }, [data, section]);

  return {
    form,
    setForm,
    isLoading,
    // Always persist the latest form snapshot (avoids stale closure after upload).
    save: () => saveMutation.mutateAsync(formRef.current),
    isSaving: saveMutation.isPending,
    discard,
  };
}
