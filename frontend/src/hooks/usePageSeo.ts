import { useEffect } from 'react';

interface PageSeoOptions {
  title?: string;
  description?: string;
  fallbackTitle?: string;
}

export function usePageSeo({ title, description, fallbackTitle }: PageSeoOptions) {
  useEffect(() => {
    const resolvedTitle = title?.trim() || fallbackTitle?.trim() || document.title;
    document.title = resolvedTitle;

    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    const previousContent = meta?.getAttribute('content') ?? '';

    if (description?.trim()) {
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'description');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', description.trim());
    }

    return () => {
      if (meta && description?.trim()) {
        meta.setAttribute('content', previousContent);
      }
    };
  }, [title, description, fallbackTitle]);
}
