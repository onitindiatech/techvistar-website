import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

type QueryErrorStateProps = {
  title: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
};

/**
 * Consistent, user-visible error panel for failed public CMS / catalog queries.
 * Matches existing Services/Solutions error styling without redesigning the UI.
 */
export function QueryErrorState({
  title,
  message = 'An unexpected server error occurred. Please try again.',
  onRetry,
  retryLabel = 'Try again',
}: QueryErrorStateProps) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-red-100 bg-red-50/50 p-8 text-center">
      <div className="mb-4 rounded-xl bg-red-100 p-3 text-red-600">
        <AlertCircle className="h-8 w-8" aria-hidden />
      </div>
      <h3 className="mb-1 text-lg font-bold text-red-900">{title}</h3>
      <p className="mb-6 max-w-sm text-sm leading-relaxed text-red-700">{message}</p>
      {onRetry ? (
        <Button type="button" onClick={onRetry} variant="outline">
          {retryLabel}
        </Button>
      ) : null}
    </div>
  );
}
