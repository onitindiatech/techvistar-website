import { useState } from 'react';
import { Loader2, Plus, Image, BarChart2, Gift, Briefcase, FolderOpen, Phone, AlignJustify, Search, Smartphone } from 'lucide-react';
import { SeoManager } from '@/components/admin/common/SeoManager';
import { CmsImageField } from '@/components/admin/common/CmsImageField';
import { CmsMediaField } from '@/components/admin/common/CmsMediaField';
import { CmsTextFields, CmsSectionCard } from '@/components/admin/common/CmsSettingsFields';
import { CmsAccordionLayout } from '@/components/admin/common/CmsAccordionLayout';
import { CmsPageLayout, CmsSectionAnchor } from '@/components/admin/common/CmsPageLayout';
import { CmsSortableList } from '@/components/admin/common/CmsSortableList';
import { usePagesCmsSettings } from '@/hooks/usePagesCmsSettings';
import { seoFromItem } from '@/lib/seoAdmin';
import { CMS_ICON_OPTIONS } from '@/lib/cmsIcons';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  DEFAULT_HOME_CMS,
  type HomeCmsConfig,
  type HomeStatItem,
  type HomeBenefitCard,
  type HomeMobileHeroConfig,
} from '@/types/homeCms';

const HOME_NAV_SECTIONS = [
  { id: 'hero',         label: 'Hero',              icon: Image       },
  { id: 'mobile-hero',  label: 'Mobile Hero',       icon: Smartphone  },
  { id: 'stats',        label: 'Stats',             icon: BarChart2   },
  { id: 'benefits',  label: 'Benefits',          icon: Gift        },
  { id: 'services',  label: 'Services Section',  icon: Briefcase   },
  { id: 'portfolio', label: 'Portfolio Section', icon: FolderOpen  },
  { id: 'contact',   label: 'Contact Section',   icon: Phone       },
  { id: 'footer',    label: 'Footer',            icon: AlignJustify },
  { id: 'seo',       label: 'SEO',               icon: Search      },
];

const HomeSettings = () => {
  const { form, setForm, isLoading, save, isSaving } = usePagesCmsSettings('home');
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-slate-500">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Loading settings...
      </div>
    );
  }

  const patchHero = <K extends keyof HomeCmsConfig['hero']>(key: K, value: HomeCmsConfig['hero'][K]) => {
    setForm((prev) => ({ ...prev, hero: { ...prev.hero, [key]: value } }));
    setIsDirty(true);
  };

  const patchMobileHero = <K extends keyof HomeMobileHeroConfig>(key: K, value: HomeMobileHeroConfig[K]) => {
    setForm((prev) => ({
      ...prev,
      mobileHero: { ...DEFAULT_HOME_CMS.mobileHero, ...prev.mobileHero, [key]: value },
    }));
    setIsDirty(true);
  };

  const patchBlock = <K extends keyof HomeCmsConfig>(block: K, partial: Partial<HomeCmsConfig[K]>) => {
    setForm((prev) => ({ ...prev, [block]: { ...prev[block], ...partial } }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    await save();
    setIsDirty(false);
    setLastSaved(new Date());
  };

  const sections = [
    {
      id: 'hero',
      title: 'Hero',
      description: 'Headline, CTAs, background media, trust logos, and scroll indicator.',
      children: (
        <>
          <CmsTextFields
            fields={[
              { key: 'badge', label: 'Badge' },
              { key: 'headlineLine1', label: 'Heading line 1' },
              { key: 'headlineLine2', label: 'Heading line 2' },
              { key: 'headlineAccent', label: 'Highlighted heading' },
              { key: 'tagline', label: 'Description', type: 'textarea' },
              { key: 'ctaPrimary', label: 'Primary CTA' },
              { key: 'ctaPrimaryLink', label: 'Primary CTA link' },
              { key: 'ctaSecondary', label: 'Secondary CTA' },
              { key: 'ctaSecondaryLink', label: 'Secondary CTA link' },
              { key: 'locationLine', label: 'Location line' },
            ]}
            values={form.hero as unknown as Record<string, string>}
            onChange={(key, value) => patchHero(key as keyof HomeCmsConfig['hero'], value)}
          />
          <CmsMediaField
            mediaType={form.hero.mediaType}
            onMediaTypeChange={(type) => patchHero('mediaType', type)}
            imageUrl={form.hero.backgroundImage}
            onImageChange={(url, publicId) =>
              setForm((prev) => ({
                ...prev,
                hero: {
                  ...prev.hero,
                  backgroundImage: url,
                  backgroundImagePublicId: publicId ?? prev.hero.backgroundImagePublicId,
                },
              }))
            }
            videoMp4={form.hero.backgroundVideoMp4}
            videoWebm={form.hero.backgroundVideoWebm}
            videoUrl={form.hero.backgroundVideoUrl}
            onVideoMp4Change={(url, publicId) =>
              setForm((prev) => ({
                ...prev,
                hero: {
                  ...prev.hero,
                  backgroundVideoMp4: url,
                  backgroundVideoPublicId: publicId ?? prev.hero.backgroundVideoPublicId,
                },
              }))
            }
            onVideoWebmChange={(url) => patchHero('backgroundVideoWebm', url)}
            onVideoUrlChange={(url, publicId) =>
              setForm((prev) => ({
                ...prev,
                hero: {
                  ...prev.hero,
                  backgroundVideoUrl: url,
                  backgroundVideoPublicId: publicId ?? prev.hero.backgroundVideoPublicId,
                },
              }))
            }
            youtubeUrl={form.hero.youtubeUrl}
            onYoutubeUrlChange={(url) => patchHero('youtubeUrl', url)}
          />
          {form.hero.mediaType === 'video' ? (
            <CmsImageField
              label="Hero poster image (optional)"
              value={form.hero.heroPosterImage}
              onChange={(url, publicId) =>
                setForm((prev) => ({
                  ...prev,
                  hero: {
                    ...prev.hero,
                    heroPosterImage: url,
                    heroPosterImagePublicId: publicId ?? prev.hero.heroPosterImagePublicId,
                  },
                }))
              }
              helperText="Shown instantly while the hero video loads. JPG, PNG, or WEBP — max 5 MB"
            />
          ) : null}
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-500">YouTube start time (seconds)</label>
            <Input
              type="number"
              min={0}
              max={600}
              value={form.hero.youtubeStartTime}
              onChange={(e) => patchHero('youtubeStartTime', Math.max(0, Number(e.target.value) || 0))}
              className="mt-1 max-w-xs"
              disabled={!form.hero.youtubeUrl?.trim()}
            />
            <p className="mt-1 text-[11px] text-slate-400">
              Only applies when YouTube is the active hero background (no MP4/WebM uploaded).
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-500">Overlay opacity (%)</label>
              <Input
                type="number"
                min={0}
                max={90}
                value={form.hero.overlayOpacity}
                onChange={(e) => patchHero('overlayOpacity', Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <Switch checked={form.hero.backgroundBlur} onCheckedChange={(v) => patchHero('backgroundBlur', v)} id="hero-blur" />
              <Label htmlFor="hero-blur">Background blur</Label>
            </div>
            <div className="flex items-center gap-2 pt-6">
              <Switch checked={form.hero.animationEnabled} onCheckedChange={(v) => patchHero('animationEnabled', v)} id="hero-anim" />
              <Label htmlFor="hero-anim">Hero animation</Label>
            </div>
            <div className="flex items-center gap-2 pt-6">
              <Switch checked={form.hero.showScrollIndicator} onCheckedChange={(v) => patchHero('showScrollIndicator', v)} id="hero-scroll" />
              <Label htmlFor="hero-scroll">Scroll indicator</Label>
            </div>
          </div>
        </>
      ),
    },
    {
      id: 'mobile-hero',
      title: 'Mobile Hero Settings',
      description: 'Copy shown on phones (≤767px) when enabled. Desktop and tablet hero is unchanged.',
      children: (
        <>
          <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3">
            <Switch
              checked={form.mobileHero.enabled}
              onCheckedChange={(v) => patchMobileHero('enabled', v)}
              id="mobile-hero-enabled"
            />
            <div>
              <Label htmlFor="mobile-hero-enabled" className="text-sm font-semibold text-slate-800">
                Enable Mobile Hero
              </Label>
              <p className="text-[11px] text-slate-500">
                When off, phones use the desktop hero CMS content.
              </p>
            </div>
          </div>
          <CmsTextFields
            fields={[
              { key: 'badge', label: 'Mobile Badge' },
              { key: 'heading', label: 'Mobile Heading (Line 1)', type: 'textarea' },
              { key: 'headingLine2', label: 'Mobile Heading (Line 2)', type: 'textarea' },
              { key: 'mobileHighlightedHeading', label: 'Mobile Highlighted Heading', type: 'textarea' },
              { key: 'description', label: 'Mobile Description', type: 'textarea' },
              { key: 'ctaPrimary', label: 'Primary Button Text' },
              { key: 'ctaPrimaryLink', label: 'Primary Button Link' },
              { key: 'ctaSecondary', label: 'Secondary Button Text' },
              { key: 'ctaSecondaryLink', label: 'Secondary Button Link' },
              { key: 'maxWidth', label: 'Mobile Hero Max Width (e.g. 360 or 360px)' },
            ]}
            values={form.mobileHero as unknown as Record<string, string>}
            onChange={(key, value) => patchMobileHero(key as keyof HomeMobileHeroConfig, value)}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-600">Mobile Hero Alignment</Label>
              <select
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={form.mobileHero.alignment}
                onChange={(e) => patchMobileHero('alignment', e.target.value as HomeMobileHeroConfig['alignment'])}
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-600">Mobile Hero CTA Layout</Label>
              <select
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={form.mobileHero.ctaLayout}
                onChange={(e) => patchMobileHero('ctaLayout', e.target.value as HomeMobileHeroConfig['ctaLayout'])}
              >
                <option value="stack">Stack</option>
                <option value="inline">Inline</option>
              </select>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-zinc-950 p-4 text-white">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-emerald-400">Mobile preview (≤767px)</p>
            <div
              className="mx-auto w-full max-w-[280px] rounded-xl border border-white/10 bg-black/40 p-4"
              style={{
                maxWidth: form.mobileHero.maxWidth
                  ? form.mobileHero.maxWidth.includes('px')
                    ? form.mobileHero.maxWidth
                    : `${form.mobileHero.maxWidth}px`
                  : undefined,
                textAlign:
                  form.mobileHero.alignment === 'center'
                    ? 'center'
                    : form.mobileHero.alignment === 'right'
                      ? 'right'
                      : 'left',
              }}
            >
              {form.mobileHero.badge ? (
                <span className="mb-2 inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-300">
                  {form.mobileHero.badge}
                </span>
              ) : null}
              <p className="text-sm font-extrabold leading-snug text-white">
                {form.mobileHero.heading || form.hero.headlineLine1}
              </p>
              {(form.mobileHero.headingLine2 || form.hero.headlineLine2) ? (
                <p className="mt-1 text-sm font-extrabold leading-snug text-white">
                  {form.mobileHero.headingLine2 || form.hero.headlineLine2}
                </p>
              ) : null}
              {(form.mobileHero.mobileHighlightedHeading || form.hero.headlineAccent) ? (
                <p className="mt-1 text-sm font-black leading-snug text-emerald-400">
                  {form.mobileHero.mobileHighlightedHeading || form.hero.headlineAccent}
                </p>
              ) : null}
              {(form.mobileHero.description || form.hero.tagline) ? (
                <p className="mt-2 text-[11px] leading-relaxed text-zinc-300">
                  {form.mobileHero.description || form.hero.tagline}
                </p>
              ) : null}
              <div
                className={
                  form.mobileHero.ctaLayout === 'inline'
                    ? 'mt-3 flex flex-wrap gap-2'
                    : 'mt-3 flex flex-col gap-2'
                }
              >
                <span className="rounded-lg bg-emerald-600 px-3 py-2 text-center text-[10px] font-semibold">
                  {form.mobileHero.ctaPrimary || form.hero.ctaPrimary}
                </span>
                <span className="rounded-lg border border-white/20 px-3 py-2 text-center text-[10px] font-semibold">
                  {form.mobileHero.ctaSecondary || form.hero.ctaSecondary}
                </span>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      id: 'stats',
      title: 'Stats',
      description: 'Drag to reorder. Duplicate or remove items.',
      children: (
        <>
          <CmsSortableList<HomeStatItem>
            items={form.stats}
            onChange={(stats) => setForm((prev) => ({ ...prev, stats }))}
            onDuplicate={(item) => ({ ...item, sortOrder: item.sortOrder + 1 })}
            renderItem={(stat, index) => (
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                <select
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                  value={stat.icon}
                  onChange={(e) => {
                    const stats = [...form.stats];
                    stats[index] = { ...stats[index], icon: e.target.value };
                    setForm((prev) => ({ ...prev, stats }));
                  }}
                >
                  {CMS_ICON_OPTIONS.map((icon) => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
                <Input placeholder="Prefix" value={stat.prefix} onChange={(e) => {
                  const stats = [...form.stats];
                  stats[index] = { ...stats[index], prefix: e.target.value };
                  setForm((prev) => ({ ...prev, stats }));
                }} />
                <Input placeholder="Number" value={stat.value} onChange={(e) => {
                  const stats = [...form.stats];
                  stats[index] = { ...stats[index], value: e.target.value };
                  setForm((prev) => ({ ...prev, stats }));
                }} />
                <Input placeholder="Suffix" value={stat.suffix} onChange={(e) => {
                  const stats = [...form.stats];
                  stats[index] = { ...stats[index], suffix: e.target.value };
                  setForm((prev) => ({ ...prev, stats }));
                }} />
                <Input placeholder="Label" className="sm:col-span-2" value={stat.label} onChange={(e) => {
                  const stats = [...form.stats];
                  stats[index] = { ...stats[index], label: e.target.value };
                  setForm((prev) => ({ ...prev, stats }));
                }} />
              </div>
            )}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              setForm((prev) => ({
                ...prev,
                stats: [
                  ...prev.stats,
                  { icon: 'Circle', value: '', prefix: '', suffix: '', label: '', sortOrder: prev.stats.length },
                ],
              }))
            }
          >
            <Plus className="mr-1 h-4 w-4" /> Add stat
          </Button>
        </>
      ),
    },
    {
      id: 'benefits',
      title: 'Benefits',
      description: 'Section copy and benefit cards.',
      children: (
        <>
          <div className="flex items-center gap-2">
            <Switch checked={form.benefits.visible} onCheckedChange={(v) => patchBlock('benefits', { visible: v })} id="benefits-visible" />
            <Label htmlFor="benefits-visible">Section visible</Label>
          </div>
          <CmsTextFields
            fields={[
              { key: 'badge', label: 'Section badge' },
              { key: 'heading', label: 'Heading' },
              { key: 'highlight', label: 'Highlight' },
              { key: 'subtitle', label: 'Subtitle' },
              { key: 'description', label: 'Description', type: 'textarea' },
            ]}
            values={form.benefits as unknown as Record<string, string>}
            onChange={(key, value) => patchBlock('benefits', { [key]: value })}
          />
          <CmsSortableList<HomeBenefitCard>
            items={form.benefits.cards}
            onChange={(cards) => patchBlock('benefits', { cards })}
            onDuplicate={(item) => ({ ...item, sortOrder: item.sortOrder + 1, title: `${item.title} (copy)` })}
            renderItem={(card, index) => (
              <div className="space-y-2">
                <div className="grid gap-2 sm:grid-cols-2">
                  <select
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                    value={card.icon}
                    onChange={(e) => {
                      const cards = [...form.benefits.cards];
                      cards[index] = { ...cards[index], icon: e.target.value };
                      patchBlock('benefits', { cards });
                    }}
                  >
                    {CMS_ICON_OPTIONS.map((icon) => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                  <Input placeholder="Accent color" value={card.accentColor} onChange={(e) => {
                    const cards = [...form.benefits.cards];
                    cards[index] = { ...cards[index], accentColor: e.target.value };
                    patchBlock('benefits', { cards });
                  }} />
                </div>
                <Input placeholder="Title" value={card.title} onChange={(e) => {
                  const cards = [...form.benefits.cards];
                  cards[index] = { ...cards[index], title: e.target.value };
                  patchBlock('benefits', { cards });
                }} />
                <Input placeholder="Description" value={card.description} onChange={(e) => {
                  const cards = [...form.benefits.cards];
                  cards[index] = { ...cards[index], description: e.target.value };
                  patchBlock('benefits', { cards });
                }} />
                <CmsImageField
                  label="Card image (optional)"
                  value={card.image}
                  onChange={(url) => {
                    const cards = [...form.benefits.cards];
                    cards[index] = { ...cards[index], image: url };
                    patchBlock('benefits', { cards });
                  }}
                />
              </div>
            )}
          />
          <Button type="button" variant="outline" onClick={() => patchBlock('benefits', {
            cards: [...form.benefits.cards, { icon: 'Circle', image: '', title: '', description: '', accentColor: '#10b981', sortOrder: form.benefits.cards.length }],
          })}>
            <Plus className="mr-1 h-4 w-4" /> Add card
          </Button>
        </>
      ),
    },
    {
      id: 'featured-services',
      title: 'Featured Services',
      description: 'Presentation only — reuses Services API data.',
      children: (
        <>
          <div className="flex items-center gap-2">
            <Switch checked={form.featuredServices.visible} onCheckedChange={(v) => patchBlock('featuredServices', { visible: v })} id="fs-visible" />
            <Label htmlFor="fs-visible">Section visible</Label>
          </div>
          <CmsTextFields
            fields={[
              { key: 'heading', label: 'Section heading' },
              { key: 'subtitle', label: 'Subtitle' },
              { key: 'ctaText', label: 'CTA text' },
              { key: 'ctaLink', label: 'CTA link' },
            ]}
            values={form.featuredServices as unknown as Record<string, string>}
            onChange={(key, value) => patchBlock('featuredServices', { [key]: value })}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-500">Layout</label>
              <select
                className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={form.featuredServices.layout}
                onChange={(e) => patchBlock('featuredServices', { layout: e.target.value as HomeCmsConfig['featuredServices']['layout'] })}
              >
                <option value="featured-grid">Featured grid</option>
                <option value="compact-grid">Compact grid</option>
                <option value="horizontal">Horizontal</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-500">Limit</label>
              <Input type="number" min={1} max={24} value={form.featuredServices.limit} onChange={(e) => patchBlock('featuredServices', { limit: Number(e.target.value) })} className="mt-1" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={form.featuredServices.featuredOnly} onCheckedChange={(v) => patchBlock('featuredServices', { featuredOnly: v })} id="fs-featured" />
            <Label htmlFor="fs-featured">Featured only</Label>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-500">Manual selection (slugs, comma-separated)</label>
            <Input
              value={form.featuredServices.manualSelection.join(', ')}
              onChange={(e) =>
                patchBlock('featuredServices', {
                  manualSelection: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                })
              }
              className="mt-1"
              placeholder="web-development, ai-automation"
            />
          </div>
        </>
      ),
    },
    {
      id: 'featured-industries',
      title: 'Featured Industries',
      description: 'Presentation only — reuses Industries API data.',
      children: (
        <>
          <div className="flex items-center gap-2">
            <Switch checked={form.featuredIndustries.visible} onCheckedChange={(v) => patchBlock('featuredIndustries', { visible: v })} id="fi-visible" />
            <Label htmlFor="fi-visible">Section visible</Label>
          </div>
          <CmsTextFields
            fields={[
              { key: 'heading', label: 'Section heading' },
              { key: 'subtitle', label: 'Subtitle' },
              { key: 'ctaText', label: 'CTA text' },
              { key: 'ctaLink', label: 'CTA link' },
            ]}
            values={form.featuredIndustries as unknown as Record<string, string>}
            onChange={(key, value) => patchBlock('featuredIndustries', { [key]: value })}
          />
          <Input type="number" min={1} max={24} value={form.featuredIndustries.limit} onChange={(e) => patchBlock('featuredIndustries', { limit: Number(e.target.value) })} />
        </>
      ),
    },
    {
      id: 'portfolio',
      title: 'Portfolio Preview',
      description: 'Interactive globe / project showcase section.',
      children: (
        <>
          <div className="flex items-center gap-2">
            <Switch checked={form.portfolio.visible} onCheckedChange={(v) => patchBlock('portfolio', { visible: v })} id="portfolio-visible" />
            <Label htmlFor="portfolio-visible">Section visible</Label>
          </div>
          <CmsTextFields
            fields={[
              { key: 'badge', label: 'Badge' },
              { key: 'heading', label: 'Heading' },
              { key: 'highlight', label: 'Highlight' },
              { key: 'description', label: 'Description', type: 'textarea' },
              { key: 'primaryButtonText', label: 'Primary button' },
              { key: 'primaryButtonLink', label: 'Primary link' },
              { key: 'secondaryButtonText', label: 'Secondary button' },
              { key: 'secondaryButtonLink', label: 'Secondary link' },
            ]}
            values={form.portfolio as unknown as Record<string, string>}
            onChange={(key, value) => patchBlock('portfolio', { [key]: value })}
          />
          <div className="flex items-center gap-2">
            <Switch checked={form.portfolio.globeEnabled} onCheckedChange={(v) => patchBlock('portfolio', { globeEnabled: v })} id="globe-enabled" />
            <Label htmlFor="globe-enabled">Globe enabled</Label>
          </div>
          <Input type="number" step={0.1} min={0.1} max={3} value={form.portfolio.animationSpeed} onChange={(e) => patchBlock('portfolio', { animationSpeed: Number(e.target.value) })} />
          <CmsImageField label="Section background" value={form.portfolio.backgroundImage} onChange={(url) => patchBlock('portfolio', { backgroundImage: url })} />
        </>
      ),
    },
    {
      id: 'contact-cta',
      title: 'Contact CTA',
      description: 'Homepage contact form section.',
      children: (
        <>
          <div className="flex items-center gap-2">
            <Switch checked={form.contactCta.visible} onCheckedChange={(v) => patchBlock('contactCta', { visible: v })} id="contact-visible" />
            <Label htmlFor="contact-visible">Section visible</Label>
          </div>
          <CmsTextFields
            fields={[
              { key: 'badge', label: 'Badge' },
              { key: 'heading', label: 'Heading' },
              { key: 'highlight', label: 'Highlight' },
              { key: 'description', label: 'Description', type: 'textarea' },
              { key: 'ctaText', label: 'Submit button' },
              { key: 'successMessage', label: 'Success message' },
            ]}
            values={form.contactCta as unknown as Record<string, string>}
            onChange={(key, value) => patchBlock('contactCta', { [key]: value })}
          />
          <CmsImageField label="Background" value={form.contactCta.backgroundImage} onChange={(url) => patchBlock('contactCta', { backgroundImage: url })} />
        </>
      ),
    },
    {
      id: 'footer',
      title: 'Footer',
      description: 'Company info, links, newsletter, and legal.',
      children: (
        <>
          <CmsImageField label="Footer logo" value={form.footer.logo} onChange={(url, publicId) => patchBlock('footer', { logo: url, logoPublicId: publicId })} />
          <CmsTextFields
            fields={[
              { key: 'companyDescription', label: 'Company description', type: 'textarea' },
              { key: 'phone', label: 'Phone' },
              { key: 'email', label: 'Email' },
              { key: 'address', label: 'Address' },
              { key: 'workingHours', label: 'Working hours' },
              { key: 'newsletterHeading', label: 'Newsletter heading' },
              { key: 'newsletterDescription', label: 'Newsletter description', type: 'textarea' },
              { key: 'copyright', label: 'Copyright' },
              { key: 'bottomText', label: 'Bottom footer text' },
            ]}
            values={form.footer as unknown as Record<string, string>}
            onChange={(key, value) => patchBlock('footer', { [key]: value })}
          />
        </>
      ),
    },
    {
      id: 'seo',
      title: 'SEO',
      description: 'Home page search metadata.',
      children: (
        <SeoManager
          value={seoFromItem(form.seo as unknown as Record<string, unknown>)}
          onChange={(seo) => setForm((prev) => ({ ...prev, seo: { ...prev.seo, ...seo } }))}
          pathPrefix="/"
          defaultTitle={form.seo.seoTitle}
          defaultDescription={form.seo.seoDescription}
        />
      ),
    },
  ];

  return (
    <CmsPageLayout
      title="Home CMS"
      description="Manage every homepage section — hero, mobile hero, stats, benefits, featured content, portfolio, contact, footer, and SEO."
      sections={HOME_NAV_SECTIONS}
      onSave={handleSave}
      onDiscard={() => setIsDirty(false)}
      isSaving={isSaving}
      isDirty={isDirty}
      lastSaved={lastSaved}
    >
      {sections.map((section) => (
        <CmsSectionAnchor key={section.id} id={section.id}>
          <CmsSectionCard title={section.title} description={section.description}>
            {section.children}
          </CmsSectionCard>
        </CmsSectionAnchor>
      ))}
    </CmsPageLayout>
  );
};

export default HomeSettings;
