import { Link } from 'react-router-dom';
import type { MouseEventHandler, ReactNode } from 'react';

/** True for absolute http(s), protocol-relative, mailto, or tel CMS hrefs. */
export function isExternalCmsHref(href: string): boolean {
  const value = href.trim().toLowerCase();
  return (
    value.startsWith('http://') ||
    value.startsWith('https://') ||
    value.startsWith('//') ||
    value.startsWith('mailto:') ||
    value.startsWith('tel:')
  );
}

type CmsHrefProps = {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};

/**
 * CMS-driven navigation: internal paths use React Router Link;
 * external / mailto / tel use a native anchor.
 */
export function CmsHref({ href, children, className, onClick }: CmsHrefProps) {
  const target = href?.trim() || '/';

  if (isExternalCmsHref(target)) {
    const isHttp = /^https?:/i.test(target) || target.startsWith('//');
    return (
      <a
        href={target}
        className={className}
        onClick={onClick}
        {...(isHttp ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    );
  }

  return (
    <Link to={target} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
