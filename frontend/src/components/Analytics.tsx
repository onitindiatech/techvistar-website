import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    dataLayer?: IArguments[];
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

const GA_MEASUREMENT_ID = (import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined)?.trim() || '';
const CLARITY_PROJECT_ID = (import.meta.env.VITE_CLARITY_PROJECT_ID as string | undefined)?.trim() || '';

const isProd = import.meta.env.PROD;
const analyticsEnabled = isProd && Boolean(GA_MEASUREMENT_ID || CLARITY_PROJECT_ID);

/**
 * Official gtag.js stub — MUST push the Arguments object into dataLayer.
 * Pushing a rest-parameter array ([...args]) is ignored by gtag.js after it loads,
 * which causes gtag.js to download but never fire /g/collect requests.
 * @see https://developers.google.com/tag-platform/gtagjs/install
 */
function installGtagStub(): void {
  window.dataLayer = window.dataLayer || [];
  // Non-arrow function required so `arguments` is the gtag command payload.
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
}

function trackGaPageView(pathname: string, search: string): void {
  if (!GA_MEASUREMENT_ID || typeof window.gtag !== 'function') return;
  const pagePath = `${pathname}${search}`;
  // SPA page views: update the GA4 config path so a collect hit is sent.
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: pagePath,
    page_location: window.location.href,
    page_title: document.title,
  });
}

/** Append gtag.js to <head> the same way Clarity is loaded. */
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
 * SPA route changes update GA4 via gtag('config', ...) on every React Router navigation.
 */
export function Analytics() {
  const location = useLocation();
  const bootstrapped = useRef(false);

  useEffect(() => {
    if (!analyticsEnabled || bootstrapped.current) return;
    bootstrapped.current = true;

    if (GA_MEASUREMENT_ID) {
      installGtagStub();
      window.gtag!('js', new Date());
      // Initial page_view is sent by the route-change effect below (covers first load + navigations).
      window.gtag!('config', GA_MEASUREMENT_ID, { send_page_view: false });
      loadGtagScript(GA_MEASUREMENT_ID);
    }

    if (CLARITY_PROJECT_ID) {
      loadClarity(CLARITY_PROJECT_ID);
    }
  }, []);

  useEffect(() => {
    if (!analyticsEnabled || !GA_MEASUREMENT_ID) return;
    // Ensure stub exists even if this effect somehow runs first.
    if (typeof window.gtag !== 'function') {
      installGtagStub();
    }
    trackGaPageView(location.pathname, location.search);
  }, [location.pathname, location.search]);

  return null;
}

export default Analytics;
