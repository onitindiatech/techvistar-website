import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

const GA_MEASUREMENT_ID = (import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined)?.trim() || '';
const CLARITY_PROJECT_ID = (import.meta.env.VITE_CLARITY_PROJECT_ID as string | undefined)?.trim() || '';

const isProd = import.meta.env.PROD;
const analyticsEnabled = isProd && Boolean(GA_MEASUREMENT_ID || CLARITY_PROJECT_ID);

function trackGaPageView(pathname: string, search: string): void {
  if (!GA_MEASUREMENT_ID || typeof window.gtag !== 'function') return;
  const pagePath = `${pathname}${search}`;
  window.gtag('event', 'page_view', {
    page_path: pagePath,
    page_location: window.location.href,
    page_title: document.title,
  });
}

/** Append gtag.js to <head> the same way Clarity is loaded (Helmet does not reliably inject external scripts). */
function loadGtagScript(measurementId: string): void {
  const src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  if (document.querySelector(`script[src="${src}"]`)) return;

  const script = document.createElement('script');
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

function loadClarity(projectId: string): void {
  if (document.querySelector(`script[src*="clarity.ms/tag/${projectId}"]`)) return;

  type ClarityFn = ((...args: unknown[]) => void) & { q?: unknown[][] };
  const w = window as Window & { clarity?: ClarityFn };

  if (typeof w.clarity !== 'function') {
    const queue: unknown[][] = [];
    const clarityFn: ClarityFn = (...args: unknown[]) => {
      queue.push(args);
    };
    clarityFn.q = queue;
    w.clarity = clarityFn;
  }

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${projectId}`;
  document.head.appendChild(script);
}

/**
 * Production-only GA4 + Microsoft Clarity.
 * Both scripts are appended via document.createElement so they reliably load over the network.
 * SPA route changes send GA4 page_view events via React Router location.
 */
export function Analytics() {
  const location = useLocation();
  const bootstrapped = useRef(false);

  useEffect(() => {
    if (!analyticsEnabled || bootstrapped.current) return;
    bootstrapped.current = true;

    if (GA_MEASUREMENT_ID) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag(...args: unknown[]) {
        window.dataLayer?.push(args);
      };
      window.gtag('js', new Date());
      // Automatic first page_view off — SPA navigations are tracked manually.
      window.gtag('config', GA_MEASUREMENT_ID, { send_page_view: false });
      loadGtagScript(GA_MEASUREMENT_ID);
    }

    if (CLARITY_PROJECT_ID) {
      loadClarity(CLARITY_PROJECT_ID);
    }
  }, []);

  useEffect(() => {
    if (!analyticsEnabled) return;
    trackGaPageView(location.pathname, location.search);
  }, [location.pathname, location.search]);

  return null;
}

export default Analytics;
