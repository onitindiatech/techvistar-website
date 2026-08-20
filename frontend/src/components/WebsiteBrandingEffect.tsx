import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPublicPagesConfig } from '@/services/pages.service';
import { mergePagesCmsConfig } from '@/types/pagesCms';

/** Applies global branding from Website Settings to document head (theme-color + favicon from master Logo). */
export function WebsiteBrandingEffect() {
  const { data } = useQuery({
    queryKey: ['pages-config'],
    queryFn: getPublicPagesConfig,
  });

  const settings = mergePagesCmsConfig(data).websiteSettings;

  useEffect(() => {
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

    // Single source of truth: Website Settings Logo (favicon field kept only for API compat).
    const faviconHref = settings.logo?.trim() || settings.favicon?.trim() || '/favicon.webp';
    let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.type = faviconHref.endsWith('.webp')
      ? 'image/webp'
      : faviconHref.endsWith('.svg')
        ? 'image/svg+xml'
        : 'image/png';
    link.href = faviconHref;
  }, [settings.browserThemeColor, settings.logo, settings.favicon]);

  return null;
}
