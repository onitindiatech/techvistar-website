import { QueryClient } from '@tanstack/react-query';

/** Shared stale window for public CMS catalogs and page config. */
export const PUBLIC_CMS_STALE_MS = 5 * 60 * 1000;

/** Keep unused public CMS cache longer than staleTime for back-navigation. */
export const PUBLIC_CMS_GC_MS = 30 * 60 * 1000;

/**
 * App-wide React Query client.
 * Public CMS data is treated as semi-static; admin mutations already invalidate
 * the relevant keys so editors still see fresh data after writes.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: PUBLIC_CMS_STALE_MS,
      gcTime: PUBLIC_CMS_GC_MS,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      // Refetch on mount only when data is stale (not "always")
      refetchOnMount: true,
      retry: 1,
    },
  },
});
