import { createContext, useContext, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPublicPagesConfig } from '@/services/pages.service';
import { mergePagesCmsConfig } from '@/types/pagesCms';
import { DEFAULT_HOME_CMS, HomeCmsConfig } from '@/types/homeCms';

const HomeCmsContext = createContext<HomeCmsConfig>(DEFAULT_HOME_CMS);

export function HomeCmsProvider({ children }: { children: React.ReactNode }) {
  const { data } = useQuery({
    queryKey: ['pages-config'],
    queryFn: getPublicPagesConfig,
  });

  const home = useMemo(() => mergePagesCmsConfig(data).home, [data]);

  return <HomeCmsContext.Provider value={home}>{children}</HomeCmsContext.Provider>;
}

export function useHomeCms(): HomeCmsConfig {
  return useContext(HomeCmsContext);
}
