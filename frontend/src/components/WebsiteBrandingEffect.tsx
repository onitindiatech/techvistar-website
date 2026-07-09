import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPublicPagesConfig } from '@/services/pages.service';
import { mergePagesCmsConfig } from '@/types/pagesCms';

/** Applies global branding from Website Settings to document head (title, theme-color, favicon). */
export function WebsiteBrandingEffect() {
  const { data } = useQuery({
    queryKey: ['pages-config'],
    queryFn: getPublicPagesConfig,
    staleTime: 60_000,
  });

  const settings = mergePagesCmsConfig(data).websiteSettings;

  useEffect(() => {
    if (settings.browserTitle?.trim()) {
      document.title = settings.browserTitle;
    }

    const themeMeta =
      document.querySelector('meta[name="theme-color"]') ??
      (() => {
        const el = document.createElement('meta');
        el.setAttribute('name', 'theme-color');
        document.head.appendChild(el);
        return el;
      })();
    if (settings.browserThemeColor?.trim()) {
      themeMeta.setAttribute('content', settings.browserThemeColor);
    }

    const faviconHref = settings.favicon?.trim();
    if (faviconHref) {
      let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = faviconHref;
    }
  }, [settings.browserTitle, settings.browserThemeColor, settings.favicon]);

  return null;
}
