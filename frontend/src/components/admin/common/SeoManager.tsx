/**
 * @file SeoManager.tsx
 * @description Enterprise SEO editor with live Google / Facebook / Twitter previews and score.
 */

import { useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { CmsImageField } from '@/components/admin/common/CmsImageField';
import { calculateSeoScore, type SeoScoreOptions } from '@/lib/seoScore';
import { buildCanonical, resolveCanonical, resolveSeo } from '@/lib/seoResolve';
import { SeoMetadata, SITE_DEFAULTS } from '@/types/seo';
import { AlertCircle, CheckCircle2, Globe, Facebook, Twitter, AlertTriangle } from 'lucide-react';

export interface SeoManagerProps {
  value: SeoMetadata;
  onChange: (value: SeoMetadata) => void;
  slug?: string;
  pathPrefix: string;
  defaultTitle?: string;
  defaultDescription?: string;
  defaultImage?: string;
  showSlug?: boolean;
  onSlugChange?: (slug: string) => void;
  /** Extra context for Lighthouse-style weighted scoring */
  scoreOptions?: Omit<SeoScoreOptions, 'slug'>;
}

function field(
  value: SeoMetadata,
  onChange: (v: SeoMetadata) => void,
  key: keyof SeoMetadata,
  next: string | boolean
): SeoMetadata {
  return { ...value, [key]: next };
}

export function SeoManager({
  value,
  onChange,
  slug = '',
  pathPrefix,
  defaultTitle = '',
  defaultDescription = '',
  defaultImage = '',
  showSlug = false,
  onSlugChange,
  scoreOptions,
}: SeoManagerProps) {
  const pageUrl = useMemo(() => {
    const normalizedPrefix = pathPrefix.endsWith('/') ? pathPrefix : `${pathPrefix}/`;
    const path = slug ? `${normalizedPrefix}${slug}` : normalizedPrefix.replace(/\/$/, '') || '/';
    const routeCanonical = buildCanonical(path);
    return resolveCanonical(value.canonicalUrl, routeCanonical);
  }, [value.canonicalUrl, pathPrefix, slug]);

  const pagePath = useMemo(() => {
    const normalizedPrefix = pathPrefix.endsWith('/') ? pathPrefix.slice(0, -1) : pathPrefix;
    return slug ? `${normalizedPrefix}/${slug}` : normalizedPrefix || '/';
  }, [pathPrefix, slug]);

  const previewDefaults = useMemo(
    () => ({
      title: defaultTitle || `${SITE_DEFAULTS.siteName}`,
      description: defaultDescription || '',
      image: defaultImage || '',
      url: pageUrl,
      siteName: SITE_DEFAULTS.siteName,
    }),
    [defaultTitle, defaultDescription, defaultImage, pageUrl]
  );

  const resolved = useMemo(() => resolveSeo(value, previewDefaults), [value, previewDefaults]);
  const scoreResult = useMemo(
    () =>
      calculateSeoScore(value, {
        slug,
        requireSlug: showSlug,
        pagePath: scoreOptions?.pagePath || pagePath,
        h1Text: scoreOptions?.h1Text,
        hasStructuredData: scoreOptions?.hasStructuredData,
        hasInternalLinks: scoreOptions?.hasInternalLinks,
        imageAltReady: scoreOptions?.imageAltReady,
        existingTitles: scoreOptions?.existingTitles,
        existingDescriptions: scoreOptions?.existingDescriptions,
      }),
    [value, slug, showSlug, pagePath, scoreOptions]
  );

  const { score, critical, warnings, passed, recommendations } = scoreResult;

  const scoreColor =
    score >= 80 ? 'bg-emerald-500' : score >= 50 ? 'bg-amber-500' : 'bg-rose-500';

  return (
    <div className="space-y-8">
      {/* Score */}
      <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Overall Score</h4>
          <span className="text-sm font-black text-slate-800">{score}%</span>
        </div>
        <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-300 ${scoreColor}`} style={{ width: `${score}%` }} />
        </div>
        <p className="text-[11px] text-slate-500">
          Weighted Lighthouse-style audit — indexability and document signals weigh more than ideal string lengths.
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-rose-100 bg-rose-50/60 p-3">
            <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-rose-700">
              <AlertCircle className="h-3.5 w-3.5" /> Critical Issues
            </div>
            <p className="text-lg font-black text-rose-800">{critical.length}</p>
          </div>
          <div className="rounded-lg border border-amber-100 bg-amber-50/60 p-3">
            <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-700">
              <AlertTriangle className="h-3.5 w-3.5" /> Warnings
            </div>
            <p className="text-lg font-black text-amber-800">{warnings.length}</p>
          </div>
          <div className="rounded-lg border border-emerald-100 bg-emerald-50/60 p-3">
            <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
              <CheckCircle2 className="h-3.5 w-3.5" /> Passed Checks
            </div>
            <p className="text-lg font-black text-emerald-800">{passed.length}</p>
          </div>
        </div>

        {recommendations.length > 0 && (
          <div className="space-y-2 border-t border-slate-100 pt-3">
            <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Recommendations</h5>
            <ul className="space-y-1.5">
              {recommendations.map((s) => (
                <li key={s} className="flex items-start gap-2 text-xs text-amber-800">
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-amber-500" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        <details className="rounded-lg border border-slate-100 bg-slate-50/80 p-3">
          <summary className="cursor-pointer text-[10px] font-bold uppercase tracking-wider text-slate-500">
            All checks ({scoreResult.checks.length})
          </summary>
          <ul className="mt-2 space-y-1.5">
            {scoreResult.checks.map((check) => (
              <li key={check.id} className="flex items-start justify-between gap-3 text-xs">
                <span className="text-slate-700">
                  {check.status === 'pass' ? '✓' : check.status === 'warning' ? '!' : '×'} {check.label}
                </span>
                <span className="shrink-0 font-mono text-[10px] text-slate-400">
                  {check.earned}/{check.weight}
                </span>
              </li>
            ))}
          </ul>
        </details>
      </div>

      {/* Fields */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {showSlug && onSlugChange && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Slug</label>
              <Input
                value={slug}
                onChange={(e) => onSlugChange(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                placeholder="page-slug"
                className="h-10 rounded-lg border-slate-200 font-mono text-sm"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <div className="flex justify-between">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">SEO Title</label>
              <span className={`text-[10px] font-bold ${(value.seoTitle?.length ?? 0) > 60 ? 'text-rose-500' : 'text-slate-400'}`}>
                {value.seoTitle?.length ?? 0} / 60
              </span>
            </div>
            <Input
              value={value.seoTitle ?? ''}
              onChange={(e) => onChange(field(value, onChange, 'seoTitle', e.target.value))}
              placeholder={defaultTitle || 'Page title for search engines'}
              className="h-10 rounded-lg border-slate-200"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Meta Description</label>
              <span className={`text-[10px] font-bold ${(value.seoDescription?.length ?? 0) > 160 ? 'text-rose-500' : 'text-slate-400'}`}>
                {value.seoDescription?.length ?? 0} / 160
              </span>
            </div>
            <textarea
              value={value.seoDescription ?? ''}
              onChange={(e) => onChange(field(value, onChange, 'seoDescription', e.target.value))}
              placeholder={defaultDescription || 'Brief description for search results'}
              className="w-full min-h-[88px] p-3 rounded-lg border border-slate-200 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Canonical URL</label>
            <Input
              value={value.canonicalUrl ?? ''}
              onChange={(e) => onChange(field(value, onChange, 'canonicalUrl', e.target.value))}
              placeholder={pageUrl}
              className="h-10 rounded-lg border-slate-200 font-mono text-xs"
            />
          </div>

          <div className="flex flex-wrap gap-6 pt-1">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <Switch
                checked={value.robotsIndex !== false}
                onCheckedChange={(checked) => onChange(field(value, onChange, 'robotsIndex', checked))}
              />
              Index
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <Switch
                checked={value.robotsFollow !== false}
                onCheckedChange={(checked) => onChange(field(value, onChange, 'robotsFollow', checked))}
              />
              Follow
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">OpenGraph Title</label>
            <Input
              value={value.ogTitle ?? ''}
              onChange={(e) => onChange(field(value, onChange, 'ogTitle', e.target.value))}
              placeholder="Defaults to SEO title"
              className="h-10 rounded-lg border-slate-200"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">OpenGraph Description</label>
            <textarea
              value={value.ogDescription ?? ''}
              onChange={(e) => onChange(field(value, onChange, 'ogDescription', e.target.value))}
              placeholder="Defaults to meta description"
              className="w-full min-h-[72px] p-3 rounded-lg border border-slate-200 text-sm focus-visible:outline-none"
            />
          </div>
          <CmsImageField
            label="OpenGraph Image"
            value={value.ogImage ?? ''}
            onChange={(url) => onChange(field(value, onChange, 'ogImage', url))}
            helperText="Recommended 1200×630 — JPG, PNG, or WEBP"
          />
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Twitter Title</label>
            <Input
              value={value.twitterTitle ?? ''}
              onChange={(e) => onChange(field(value, onChange, 'twitterTitle', e.target.value))}
              placeholder="Defaults to OG title"
              className="h-10 rounded-lg border-slate-200"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Twitter Description</label>
            <textarea
              value={value.twitterDescription ?? ''}
              onChange={(e) => onChange(field(value, onChange, 'twitterDescription', e.target.value))}
              placeholder="Defaults to OG description"
              className="w-full min-h-[72px] p-3 rounded-lg border border-slate-200 text-sm focus-visible:outline-none"
            />
          </div>
          <CmsImageField
            label="Twitter Image"
            value={value.twitterImage ?? ''}
            onChange={(url) => onChange(field(value, onChange, 'twitterImage', url))}
            helperText="Defaults to OG image if empty"
          />
        </div>
      </div>

      {/* Live previews */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
          <Globe className="w-3.5 h-3.5" /> Google Search Preview
        </h4>
        <div className="p-4 rounded-xl border border-slate-200 bg-white max-w-xl">
          <p className="text-[#1a0dab] text-lg leading-snug font-medium truncate">{resolved.title}</p>
          <p className="text-[#006621] text-sm mt-0.5 truncate">{resolved.canonical}</p>
          <p className="text-slate-600 text-sm mt-1 line-clamp-2">{resolved.description}</p>
        </div>

        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2 pt-2">
          <Facebook className="w-3.5 h-3.5 text-blue-600" /> Facebook Preview
        </h4>
        <div className="rounded-xl border border-slate-200 bg-white max-w-md overflow-hidden">
          {resolved.ogImage ? (
            <div className="aspect-[1.91/1] bg-slate-100">
              <img src={resolved.ogImage} alt="" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="aspect-[1.91/1] bg-slate-100 flex items-center justify-center text-xs text-slate-400">
              No OG image
            </div>
          )}
          <div className="p-3 border-t border-slate-100">
            <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">{SITE_DEFAULTS.siteUrl.replace(/^https?:\/\//, '')}</p>
            <p className="text-sm font-semibold text-slate-900 mt-0.5 line-clamp-1">{resolved.ogTitle}</p>
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{resolved.ogDescription}</p>
          </div>
        </div>

        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2 pt-2">
          <Twitter className="w-3.5 h-3.5 text-sky-500" /> Twitter Preview
        </h4>
        <div className="rounded-xl border border-slate-200 bg-white max-w-md overflow-hidden">
          {resolved.twitterImage ? (
            <div className="aspect-[2/1] bg-slate-100">
              <img src={resolved.twitterImage} alt="" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="aspect-[2/1] bg-slate-100 flex items-center justify-center text-xs text-slate-400">
              No Twitter image
            </div>
          )}
          <div className="p-3 border-t border-slate-100">
            <p className="text-sm font-semibold text-slate-900 line-clamp-1">{resolved.twitterTitle}</p>
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{resolved.twitterDescription}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
