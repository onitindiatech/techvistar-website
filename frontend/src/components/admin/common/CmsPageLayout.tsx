/**
 * @file CmsPageLayout.tsx
 * @description Premium two-column CMS layout shell.
 *
 * Layout anatomy:
 *   ┌──── Sticky Top Header ──────────────────────────────┐
 *   │ Title + Description          [Discard]  [Save]      │
 *   └─────────────────────────────────────────────────────┘
 *   ┌── Left (scrollable) ────┬── Right (sticky sidebar) ─┐
 *   │   Section cards         │   Section jump nav         │
 *   │   #anchor-id each       │   Scrollspy highlights     │
 *   └─────────────────────────┴───────────────────────────┘
 *   ┌──── Floating Save Bar (appears when isDirty) ───────┐
 *   │ ● Unsaved changes        [Discard]  [Save Changes]  │
 *   └─────────────────────────────────────────────────────┘
 *
 * IMPORTANT: This component is layout-only. No logic, no API calls.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Loader2, Save, RotateCcw, CheckCircle2, AlertCircle, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CmsNavSection {
  id: string;
  label: string;
  icon?: LucideIcon;
}

export interface CmsPageLayoutProps {
  title: string;
  description: string;
  sections: CmsNavSection[];
  onSave: () => void;
  onDiscard?: () => void;
  isSaving: boolean;
  isDirty?: boolean;
  lastSaved?: Date | null;
  children: React.ReactNode;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatLastSaved(date: Date | null | undefined): string {
  if (!date) return '';
  const diff = Math.round((Date.now() - date.getTime()) / 1000);
  if (diff < 5) return 'Saved just now';
  if (diff < 60) return `Saved ${diff}s ago`;
  if (diff < 3600) return `Saved ${Math.floor(diff / 60)}m ago`;
  return `Saved ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

// ─── CmsPageLayout ────────────────────────────────────────────────────────────

export const CmsPageLayout = ({
  title,
  description,
  sections,
  onSave,
  onDiscard,
  isSaving,
  isDirty = false,
  lastSaved,
  children,
}: CmsPageLayoutProps) => {
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id ?? '');
  const [savedLabel, setSavedLabel] = useState('');
  const observerRef = useRef<IntersectionObserver | null>(null);

  // ── Scrollspy via IntersectionObserver ──────────────────────────────────────
  useEffect(() => {
    const sectionIds = sections.map((s) => s.id);

    observerRef.current?.disconnect();

    const entries = new Map<string, number>();

    observerRef.current = new IntersectionObserver(
      (obs) => {
        obs.forEach((entry) => {
          entries.set(entry.target.id, entry.intersectionRatio);
        });
        // pick the section with the highest visibility ratio
        let best = '';
        let bestRatio = -1;
        entries.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = id;
          }
        });
        if (best) setActiveSection(best);
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: [0, 0.1, 0.25, 0.5, 1] }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observerRef.current!.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [sections]);

  // ── Last-saved ticker ───────────────────────────────────────────────────────
  useEffect(() => {
    const tick = () => setSavedLabel(formatLastSaved(lastSaved));
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, [lastSaved]);

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const offset = 80; // sticky header height
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
    setActiveSection(id);
  }, []);

  return (
    <div className="relative min-h-screen pb-32">
      {/* ── Sticky Page Header ─────────────────────────────────────────────── */}
      <div className="sticky top-0 z-30 mb-8 -mx-6 px-6 py-3.5 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between gap-4 max-w-screen-xl mx-auto">
          {/* Left: title + description */}
          <div className="min-w-0">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight leading-tight truncate">
              {title}
            </h1>
            <p className="text-xs font-medium text-slate-400 mt-0.5 truncate hidden sm:block">
              {description}
            </p>
          </div>

          {/* Right: status + actions */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Last saved label */}
            {savedLabel && !isDirty && (
              <span className="hidden md:flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                {savedLabel}
              </span>
            )}

            {isDirty && (
              <span className="hidden md:flex items-center gap-1.5 text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                <AlertCircle className="w-3 h-3" />
                Unsaved changes
              </span>
            )}

            {onDiscard && (
              <button
                type="button"
                onClick={onDiscard}
                disabled={isSaving || !isDirty}
                className="h-8 px-3.5 rounded-lg text-[11px] font-bold text-slate-600 border border-slate-200 bg-white hover:border-slate-300 hover:text-slate-900 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Discard
              </button>
            )}

            <button
              type="button"
              onClick={onSave}
              disabled={isSaving}
              className={cn(
                'h-8 px-4 rounded-lg text-[11px] font-bold text-white flex items-center gap-1.5 transition-all shadow-sm',
                isDirty
                  ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20'
                  : 'bg-slate-800 hover:bg-slate-700',
                isSaving && 'opacity-75 cursor-not-allowed'
              )}
            >
              {isSaving ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Save className="w-3 h-3" />
              )}
              {isSaving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Two-column body ────────────────────────────────────────────────── */}
      <div className="flex gap-8 max-w-screen-xl mx-auto items-start">
        {/* Left: main content */}
        <div className="flex-1 min-w-0 space-y-6">
          {children}
        </div>

        {/* Right: sticky sidebar nav */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-[72px]">
            <div className="rounded-2xl border border-slate-200/80 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-[9px] font-black uppercase tracking-[0.12em] text-slate-400">
                  Page Sections
                </p>
              </div>
              <nav className="p-2 space-y-0.5">
                {sections.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  return (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => scrollToSection(section.id)}
                      className={cn(
                        'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all text-xs font-semibold',
                        isActive
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 border border-transparent'
                      )}
                    >
                      {Icon ? (
                        <Icon
                          className={cn(
                            'w-3.5 h-3.5 shrink-0',
                            isActive ? 'text-emerald-600' : 'text-slate-400'
                          )}
                        />
                      ) : (
                        <span
                          className={cn(
                            'w-1.5 h-1.5 rounded-full shrink-0',
                            isActive ? 'bg-emerald-500' : 'bg-slate-300'
                          )}
                        />
                      )}
                      <span className="truncate">{section.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Mini save widget inside sidebar */}
            <div className="mt-3 rounded-2xl border border-slate-200/80 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-4 space-y-2">
              <p className="text-[9px] font-black uppercase tracking-[0.12em] text-slate-400">
                Actions
              </p>
              <button
                type="button"
                onClick={onSave}
                disabled={isSaving}
                className={cn(
                  'w-full h-8 rounded-lg text-[11px] font-bold text-white flex items-center justify-center gap-1.5 transition-all',
                  isDirty ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-slate-700 hover:bg-slate-600',
                  isSaving && 'opacity-70 cursor-not-allowed'
                )}
              >
                {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                {isSaving ? 'Saving…' : 'Save'}
              </button>
              {onDiscard && (
                <button
                  type="button"
                  onClick={onDiscard}
                  disabled={isSaving || !isDirty}
                  className="w-full h-8 rounded-lg text-[11px] font-semibold text-slate-600 border border-slate-200 bg-white hover:border-slate-300 transition-all disabled:opacity-40 flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3 h-3" />
                  Discard
                </button>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* ── Floating bottom save bar (appears when isDirty) ────────────────── */}
      <div
        className={cn(
          'fixed bottom-0 left-0 right-0 z-40 transition-all duration-300',
          isDirty ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
        )}
      >
        <div className="mx-auto max-w-3xl mb-5 px-4">
          <div className="flex items-center justify-between gap-4 rounded-2xl border border-amber-200/60 bg-white/95 backdrop-blur-md px-5 py-3.5 shadow-[0_8px_40px_rgba(0,0,0,0.12)] ring-1 ring-amber-100">
            <div className="flex items-center gap-2.5">
              <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs font-bold text-slate-800">You have unsaved changes</span>
              <span className="text-[10px] font-medium text-slate-400 hidden sm:block">
                — Save or discard before leaving this page
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {onDiscard && (
                <button
                  type="button"
                  onClick={onDiscard}
                  disabled={isSaving}
                  className="h-8 px-4 rounded-lg text-[11px] font-bold text-slate-600 border border-slate-200 bg-white hover:border-slate-300 transition-all disabled:opacity-40"
                >
                  Discard
                </button>
              )}
              <button
                type="button"
                onClick={onSave}
                disabled={isSaving}
                className="h-8 px-4 rounded-lg text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-500 flex items-center gap-1.5 transition-all shadow-sm shadow-emerald-600/20 disabled:opacity-60"
              >
                {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                {isSaving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── CmsSectionAnchor ─────────────────────────────────────────────────────────
/**
 * Thin wrapper that adds an id anchor to any CMS section card.
 * Usage: wrap your <CmsSectionCard> with <CmsSectionAnchor id="hero">
 */
export const CmsSectionAnchor = ({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) => (
  <div id={id} className="scroll-mt-24">
    {children}
  </div>
);

export default CmsPageLayout;
