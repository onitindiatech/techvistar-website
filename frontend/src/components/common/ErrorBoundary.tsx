import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ErrorBoundaryProps = {
  children: ReactNode;
  /** Optional label for logs (e.g. "route", "admin") */
  scope?: string;
  /** Custom fallback; defaults to professional full-page recovery UI */
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
};

type ErrorBoundaryState = {
  error: Error | null;
};

/**
 * Catches unexpected render errors so a single crash does not blank the whole SPA.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    const scope = this.props.scope || 'app';
    console.error(`[ErrorBoundary:${scope}]`, error.message, {
      stack: error.stack,
      componentStack: info.componentStack,
    });
  }

  reset = (): void => {
    this.setState({ error: null });
  };

  render(): ReactNode {
    const { error } = this.state;
    if (!error) return this.props.children;

    if (typeof this.props.fallback === 'function') {
      return this.props.fallback(error, this.reset);
    }
    if (this.props.fallback) return this.props.fallback;

    return <DefaultErrorFallback error={error} onReset={this.reset} />;
  }
}

function DefaultErrorFallback({ error, onReset }: { error: Error; onReset: () => void }) {
  const isProd = import.meta.env.PROD;

  return (
    <div
      className="flex min-h-[60vh] w-full items-center justify-center bg-slate-50 px-4 py-16"
      role="alert"
    >
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
          <AlertTriangle className="h-6 w-6" aria-hidden />
        </div>
        <h1 className="font-display text-xl font-extrabold tracking-tight text-slate-900">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          This page hit an unexpected error. You can try again or return to the homepage.
          Your data was not affected.
        </p>
        {!isProd ? (
          <p className="mt-3 break-words rounded-lg bg-slate-50 px-3 py-2 text-left font-mono text-[11px] text-slate-500">
            {error.message}
          </p>
        ) : null}
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button type="button" onClick={onReset} className="gap-2 bg-emerald-600 hover:bg-emerald-500">
            <RotateCcw className="h-4 w-4" aria-hidden />
            Try again
          </Button>
          <Button type="button" variant="outline" asChild className="gap-2">
            <Link to="/">
              <Home className="h-4 w-4" aria-hidden />
              Go home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
