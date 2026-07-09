import { Loader2, Plus } from 'lucide-react';
import { PageHeader } from '@/components/admin/common/PageHeader';
import { SeoManager } from '@/components/admin/common/SeoManager';
import { CmsImageField } from '@/components/admin/common/CmsImageField';
import { CmsMediaField } from '@/components/admin/common/CmsMediaField';
import { CmsTextFields } from '@/components/admin/common/CmsSettingsFields';
import { CmsAccordionLayout, CmsStickySaveBar } from '@/components/admin/common/CmsAccordionLayout';
import { CmsSortableList } from '@/components/admin/common/CmsSortableList';
import { usePagesCmsSettings } from '@/hooks/usePagesCmsSettings';
import { seoFromItem } from '@/lib/seoAdmin';
import { CMS_ICON_OPTIONS } from '@/lib/cmsIcons';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import type { HomeCmsConfig, HomeStatItem, HomeBenefitCard } from '@/types/homeCms';

const HomeSettings = () => {
  const { form, setForm, isLoading, save, isSaving } = usePagesCmsSettings('home');

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-slate-500">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Loading settings...
      </div>
    );
  }

  const patchHero = <K extends keyof HomeCmsConfig['hero']>(key: K, value: HomeCmsConfig['hero'][K]) =>
    setForm((prev) => ({ ...prev, hero: { ...prev.hero, [key]: value } }));

  const patchBlock = <K extends keyof HomeCmsConfig>(block: K, partial: Partial<HomeCmsConfig[K]>) =>
    setForm((prev) => ({ ...prev, [block]: { ...prev[block], ...partial } }));

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
    <div className="relative max-w-4xl space-y-6 pb-24">
      <PageHeader
        title="Home CMS"
        description="Manage every homepage section — hero, stats, benefits, featured content, portfolio, contact, footer, and SEO."
      />
      <CmsAccordionLayout sections={sections} />
      <CmsStickySaveBar onSave={save} isSaving={isSaving} />
    </div>
  );
};

export default HomeSettings;
