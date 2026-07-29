import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface AnnouncementBarProps {
  text: string;
  link?: string;
  buttonText?: string;
  className?: string;
}

/**
 * Slim site-wide announcement strip rendered above the navbar when CMS-enabled.
 */
export function AnnouncementBar({ text, link, buttonText, className }: AnnouncementBarProps) {
  const message = text.trim();
  if (!message) return null;

  const ctaLabel = (buttonText || 'Learn more').trim();

  return (
    <div
      className={cn(
        'w-full shrink-0 border-b border-emerald-700/30 bg-emerald-600 text-white',
        className,
      )}
      role="region"
      aria-label="Site announcement"
    >
      <div className="mx-auto flex max-w-[100vw] items-center justify-center gap-3 px-4 py-2 text-center text-[11px] font-semibold leading-snug sm:text-xs md:px-6">
        <p className="min-w-0 truncate sm:whitespace-normal">{message}</p>
        {link?.trim() ? (
          <Link
            to={link.trim()}
            className="shrink-0 rounded-md border border-white/25 bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide transition-colors hover:bg-white/20 sm:text-[11px]"
          >
            {ctaLabel}
          </Link>
        ) : null}
      </div>
    </div>
  );
}

export default AnnouncementBar;
