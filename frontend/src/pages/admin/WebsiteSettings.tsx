import { useState } from 'react';
import { Loader2, Plus } from 'lucide-react';
import { CmsImageField } from '@/components/admin/common/CmsImageField';
import { CmsTextFields, CmsSectionCard } from '@/components/admin/common/CmsSettingsFields';
import { CmsPageLayout, CmsSectionAnchor } from '@/components/admin/common/CmsPageLayout';
import { CmsSortableList } from '@/components/admin/common/CmsSortableList';
import { CmsFutureFeatureCallout } from '@/components/admin/common/CmsFutureFeatureCallout';
import { usePagesCmsSettings } from '@/hooks/usePagesCmsSettings';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { WebsiteFooterLink, WebsiteSettingsConfig } from '@/types/websiteSettings';
import { Palette, Navigation, Phone, AlignJustify, Share2, Search, BarChart2, Wrench } from 'lucide-react';

const NAV_SECTIONS = [
  { id: 'branding',    label: 'Branding',        icon: Palette     },
  { id: 'navigation',  label: 'Navigation',      icon: Navigation  },
  { id: 'contact',     label: 'Contact Details', icon: Phone       },
  { id: 'footer',      label: 'Footer',          icon: AlignJustify },
  { id: 'social',      label: 'Social Links',    icon: Share2      },
  { id: 'seo',         label: 'SEO Defaults',    icon: Search      },
  { id: 'analytics',   label: 'Analytics',       icon: BarChart2   },
  { id: 'maintenance', label: 'Maintenance',     icon: Wrench      },
];

const WebsiteSettings = () => {
  const { form, setForm, isLoading, save, isSaving } = usePagesCmsSettings('websiteSettings');
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-slate-500">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Loading settings...
      </div>
    );
  }

  const patchRoot = <K extends keyof WebsiteSettingsConfig>(key: K, value: WebsiteSettingsConfig[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  const patchNavbar = <K extends keyof WebsiteSettingsConfig['navbar']>(
    key: K,
    value: WebsiteSettingsConfig['navbar'][K],
  ) => { setForm((prev) => ({ ...prev, navbar: { ...prev.navbar, [key]: value } })); setIsDirty(true); };

  const patchFooter = <K extends keyof WebsiteSettingsConfig['footer']>(
    key: K,
    value: WebsiteSettingsConfig['footer'][K],
  ) => { setForm((prev) => ({ ...prev, footer: { ...prev.footer, [key]: value } })); setIsDirty(true); };

  const patchSocial = (key: keyof WebsiteSettingsConfig['socialLinks'], value: string) => {
    setForm((prev) => ({ ...prev, socialLinks: { ...prev.socialLinks, [key]: value } }));
    setIsDirty(true);
  };

  const patchSeo = <K extends keyof WebsiteSettingsConfig['seoDefaults']>(
    key: K,
    value: WebsiteSettingsConfig['seoDefaults'][K],
  ) => { setForm((prev) => ({ ...prev, seoDefaults: { ...prev.seoDefaults, [key]: value } })); setIsDirty(true); };

  const patchAnalytics = <K extends keyof WebsiteSettingsConfig['analytics']>(
    key: K,
    value: WebsiteSettingsConfig['analytics'][K],
  ) => { setForm((prev) => ({ ...prev, analytics: { ...prev.analytics, [key]: value } })); setIsDirty(true); };

  const patchMaintenance = <K extends keyof WebsiteSettingsConfig['maintenance']>(
    key: K,
    value: WebsiteSettingsConfig['maintenance'][K],
  ) => { setForm((prev) => ({ ...prev, maintenance: { ...prev.maintenance, [key]: value } })); setIsDirty(true); };

  const toggleRow = (label: string, description: string, checked: boolean, onChange: (v: boolean) => void) => (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3">
      <div>
        <Label className="text-sm font-semibold text-slate-800">{label}</Label>
        <p className="text-[11px] text-slate-500">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );

  const handleSave = async () => {
    await save();
    setIsDirty(false);
    setLastSaved(new Date());
  };

  return (
    <CmsPageLayout
      title="Website Settings"
      description="Global branding, navigation, contact, footer, SEO defaults, analytics, and maintenance."
      sections={NAV_SECTIONS}
      onSave={handleSave}
      onDiscard={() => setIsDirty(false)}
      isSaving={isSaving}
      isDirty={isDirty}
      lastSaved={lastSaved}
    >
      <CmsSectionAnchor id="branding">
        <CmsSectionCard title="Branding" description="Logo, favicon, company identity, browser chrome, and default OG image." icon={Palette}>
          <CmsImageField label="Logo" value={form.logo} onChange={(url, publicId) => setForm((prev) => ({ ...prev, logo: url, logoPublicId: publicId ?? prev.logoPublicId }))} />
          <CmsImageField label="Favicon" value={form.favicon} onChange={(url, publicId) => setForm((prev) => ({ ...prev, favicon: url, faviconPublicId: publicId ?? prev.faviconPublicId }))} />
          <CmsTextFields
            twoColumn
            fields={[
              { key: 'companyName', label: 'Company name' },
              { key: 'companyTagline', label: 'Company tagline' },
              { key: 'browserTitle', label: 'Browser title' },
              { key: 'browserThemeColor', label: 'Browser theme color' },
            ]}
            values={{ companyName: form.companyName, companyTagline: form.companyTagline, browserTitle: form.browserTitle, browserThemeColor: form.browserThemeColor }}
            onChange={(key, value) => patchRoot(key as keyof WebsiteSettingsConfig, value)}
          />
          <CmsImageField label="Default website OG image" value={form.defaultOgImage} onChange={(url, publicId) => setForm((prev) => ({ ...prev, defaultOgImage: url, defaultOgImagePublicId: publicId ?? prev.defaultOgImagePublicId }))} />
        </CmsSectionCard>
      </CmsSectionAnchor>

      <CmsSectionAnchor id="navigation">
        <CmsSectionCard title="Navigation" description="Navbar CTA, layout toggles, and site-wide announcement bar." icon={Navigation}>
          <CmsTextFields
            twoColumn
            fields={[{ key: 'ctaButtonText', label: 'CTA button text' }, { key: 'ctaButtonLink', label: 'CTA button link' }]}
            values={form.navbar as unknown as Record<string, string>}
            onChange={(key, value) => patchNavbar(key as keyof WebsiteSettingsConfig['navbar'], value)}
          />
          <CmsFutureFeatureCallout>
            Sticky navbar, transparent navbar, and search controls are saved for a future release. They do not
            change the public navbar yet. The navbar remains fixed with the current styling.
          </CmsFutureFeatureCallout>
          {toggleRow('Sticky navbar (future)', 'Not connected to the public navbar yet.', form.navbar.stickyEnabled, (v) => patchNavbar('stickyEnabled', v))}
          {toggleRow('Transparent navbar (future)', 'Not connected to the public navbar yet.', form.navbar.transparentEnabled, (v) => patchNavbar('transparentEnabled', v))}
          {toggleRow('Show search (future)', 'Not connected to the public navbar yet.', form.navbar.showSearch, (v) => patchNavbar('showSearch', v))}
          {toggleRow('Announcement bar', 'Shows a slim strip above the navbar on all public pages when enabled and text is provided.', form.navbar.announcementBarEnabled, (v) => patchNavbar('announcementBarEnabled', v))}
          <CmsTextFields
            fields={[
              { key: 'announcementText', label: 'Announcement text', type: 'textarea' },
              { key: 'announcementLink', label: 'Announcement link' },
              { key: 'announcementButtonText', label: 'Announcement button text' },
            ]}
            values={form.navbar as unknown as Record<string, string>}
            onChange={(key, value) => patchNavbar(key as keyof WebsiteSettingsConfig['navbar'], value)}
          />
        </CmsSectionCard>
      </CmsSectionAnchor>

      <CmsSectionAnchor id="contact">
        <CmsSectionCard title="Contact Details" description="Global contact channels shown across the site." icon={Phone}>
          <CmsTextFields
            twoColumn
            fields={[
              { key: 'email', label: 'Primary email' },
              { key: 'phone', label: 'Phone' },
              { key: 'whatsappNumber', label: 'WhatsApp number' },
              { key: 'supportEmail', label: 'Support email' },
              { key: 'salesEmail', label: 'Sales email' },
              { key: 'workingHours', label: 'Working hours' },
              { key: 'emergencyContact', label: 'Emergency contact' },
              { key: 'googleMapsUrl', label: 'Google Maps URL' },
              { key: 'address', label: 'Address', type: 'textarea', fullWidth: true },
            ]}
            values={{ email: form.email, phone: form.phone, address: form.address, whatsappNumber: form.whatsappNumber, supportEmail: form.supportEmail, salesEmail: form.salesEmail, googleMapsUrl: form.googleMapsUrl, workingHours: form.workingHours, emergencyContact: form.emergencyContact }}
            onChange={(key, value) => patchRoot(key as keyof WebsiteSettingsConfig, value)}
          />
        </CmsSectionCard>
      </CmsSectionAnchor>

      <CmsSectionAnchor id="footer">
        <CmsSectionCard
          title="Footer"
          description="Global footer used on every page — branding, newsletter, links, and background styling. Contact details come from Contact Details above."
          icon={AlignJustify}
        >
          <CmsTextFields
            twoColumn
            fields={[
              { key: 'heading', label: 'Footer heading' },
              { key: 'copyright', label: 'Footer copyright' },
              { key: 'bottomText', label: 'Footer bottom text' },
              { key: 'backgroundColor', label: 'Footer background color' },
              { key: 'description', label: 'Footer description', type: 'textarea', fullWidth: true },
              { key: 'newsletterHeading', label: 'Newsletter heading', fullWidth: true },
              { key: 'newsletterDescription', label: 'Newsletter description', type: 'textarea', fullWidth: true },
            ]}
            values={form.footer as unknown as Record<string, string>}
            onChange={(key, value) => patchFooter(key as keyof WebsiteSettingsConfig['footer'], value)}
          />
          <CmsImageField label="Footer logo" value={form.footer.logo} onChange={(url, publicId) => setForm((prev) => ({ ...prev, footer: { ...prev.footer, logo: url, logoPublicId: publicId ?? prev.footer.logoPublicId } }))} />
          <CmsImageField label="Footer background image (optional)" value={form.footer.backgroundImage} onChange={(url, publicId) => setForm((prev) => ({ ...prev, footer: { ...prev.footer, backgroundImage: url, backgroundImagePublicId: publicId ?? prev.footer.backgroundImagePublicId } }))} />

          <div className="space-y-3 border-t border-slate-100 pt-4">
            <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Company links</Label>
            <CmsSortableList<WebsiteFooterLink>
              items={form.footer.companyLinks}
              onChange={(companyLinks) => patchFooter('companyLinks', companyLinks)}
              onDuplicate={(item) => ({ ...item, sortOrder: item.sortOrder + 1 })}
              renderItem={(link, index) => (
                <div className="grid gap-2 sm:grid-cols-2">
                  <Input
                    placeholder="Label"
                    value={link.label}
                    onChange={(e) => {
                      const companyLinks = [...form.footer.companyLinks];
                      companyLinks[index] = { ...companyLinks[index], label: e.target.value };
                      patchFooter('companyLinks', companyLinks);
                    }}
                  />
                  <Input
                    placeholder="Href (e.g. /about)"
                    value={link.href}
                    onChange={(e) => {
                      const companyLinks = [...form.footer.companyLinks];
                      companyLinks[index] = { ...companyLinks[index], href: e.target.value };
                      patchFooter('companyLinks', companyLinks);
                    }}
                  />
                </div>
              )}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                patchFooter('companyLinks', [
                  ...form.footer.companyLinks,
                  { label: '', href: '', sortOrder: form.footer.companyLinks.length },
                ])
              }
            >
              <Plus className="mr-1 h-4 w-4" /> Add company link
            </Button>
          </div>

          <div className="space-y-3 border-t border-slate-100 pt-4">
            <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Legal links</Label>
            <CmsSortableList<WebsiteFooterLink>
              items={form.footer.legalLinks}
              onChange={(legalLinks) => patchFooter('legalLinks', legalLinks)}
              onDuplicate={(item) => ({ ...item, sortOrder: item.sortOrder + 1 })}
              renderItem={(link, index) => (
                <div className="grid gap-2 sm:grid-cols-2">
                  <Input
                    placeholder="Label"
                    value={link.label}
                    onChange={(e) => {
                      const legalLinks = [...form.footer.legalLinks];
                      legalLinks[index] = { ...legalLinks[index], label: e.target.value };
                      patchFooter('legalLinks', legalLinks);
                    }}
                  />
                  <Input
                    placeholder="Href"
                    value={link.href}
                    onChange={(e) => {
                      const legalLinks = [...form.footer.legalLinks];
                      legalLinks[index] = { ...legalLinks[index], href: e.target.value };
                      patchFooter('legalLinks', legalLinks);
                    }}
                  />
                </div>
              )}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                patchFooter('legalLinks', [
                  ...form.footer.legalLinks,
                  { label: '', href: '', sortOrder: form.footer.legalLinks.length },
                ])
              }
            >
              <Plus className="mr-1 h-4 w-4" /> Add legal link
            </Button>
            <p className="text-[11px] text-slate-500">
              Services and Industries columns are populated automatically from published services and industries.
            </p>
          </div>
        </CmsSectionCard>
      </CmsSectionAnchor>

      <CmsSectionAnchor id="social">
        <CmsSectionCard title="Social Links" description="Platform URLs — empty links are hidden on the public site." icon={Share2}>
          <CmsTextFields
            twoColumn
            fields={[
              { key: 'linkedin', label: 'LinkedIn' },
              { key: 'instagram', label: 'Instagram' },
              { key: 'twitter', label: 'Twitter / X' },
              { key: 'facebook', label: 'Facebook' },
              { key: 'github', label: 'GitHub' },
              { key: 'youtube', label: 'YouTube' },
              { key: 'discord', label: 'Discord' },
              { key: 'medium', label: 'Medium' },
              { key: 'behance', label: 'Behance' },
              { key: 'dribbble', label: 'Dribbble' },
            ]}
            values={form.socialLinks as unknown as Record<string, string>}
            onChange={(key, value) => patchSocial(key as keyof WebsiteSettingsConfig['socialLinks'], value)}
          />
        </CmsSectionCard>
      </CmsSectionAnchor>

      <CmsSectionAnchor id="seo">
        <CmsSectionCard title="SEO Defaults" description="Global SEO fallbacks when individual pages do not override metadata." icon={Search}>
          <CmsTextFields
            twoColumn
            fields={[
              { key: 'siteTitle', label: 'Site title' },
              { key: 'twitterCard', label: 'Twitter card type' },
              { key: 'twitterHandle', label: 'Twitter handle' },
              { key: 'openGraphType', label: 'Open Graph type' },
              { key: 'canonicalUrl', label: 'Canonical URL', fullWidth: true },
              { key: 'metaDescription', label: 'Default meta description', type: 'textarea', fullWidth: true },
              { key: 'keywords', label: 'Default keywords', type: 'textarea', fullWidth: true },
            ]}
            values={form.seoDefaults as unknown as Record<string, string>}
            onChange={(key, value) => patchSeo(key as keyof WebsiteSettingsConfig['seoDefaults'], value)}
          />
          {toggleRow('Robots index', 'Allow search engines to index the site by default.', form.seoDefaults.robotsIndex, (v) => patchSeo('robotsIndex', v))}
          <CmsImageField label="Default OG image" value={form.seoDefaults.defaultOgImage} onChange={(url, publicId) => setForm((prev) => ({ ...prev, seoDefaults: { ...prev.seoDefaults, defaultOgImage: url, defaultOgImagePublicId: publicId ?? prev.seoDefaults.defaultOgImagePublicId } }))} />
        </CmsSectionCard>
      </CmsSectionAnchor>

      <CmsSectionAnchor id="analytics">
        <CmsSectionCard title="Analytics (Optional)" description="Store tracking IDs for future integration. No scripts are injected yet." icon={BarChart2}>
          <CmsTextFields
            twoColumn
            fields={[
              { key: 'googleAnalyticsId', label: 'Google Analytics ID' },
              { key: 'googleTagManagerId', label: 'Google Tag Manager ID' },
              { key: 'metaPixelId', label: 'Meta Pixel ID' },
              { key: 'microsoftClarityId', label: 'Microsoft Clarity ID' },
              { key: 'linkedInInsightTag', label: 'LinkedIn Insight Tag' },
            ]}
            values={form.analytics as unknown as Record<string, string>}
            onChange={(key, value) => patchAnalytics(key as keyof WebsiteSettingsConfig['analytics'], value)}
          />
        </CmsSectionCard>
      </CmsSectionAnchor>

      <CmsSectionAnchor id="maintenance">
        <CmsSectionCard title="Maintenance (Optional)" description="Maintenance page content for future rollout. Not active on the public site yet." icon={Wrench}>
          {toggleRow('Enable maintenance mode', 'Stored for future use — no public redirect yet.', form.maintenance.enabled, (v) => patchMaintenance('enabled', v))}
          <CmsTextFields
            twoColumn
            fields={[
              { key: 'title', label: 'Title' },
              { key: 'subtitle', label: 'Subtitle' },
              { key: 'expectedReturnDate', label: 'Expected return date' },
              { key: 'buttonText', label: 'Button text' },
              { key: 'buttonLink', label: 'Button link' },
              { key: 'description', label: 'Description', type: 'textarea', fullWidth: true },
            ]}
            values={form.maintenance as unknown as Record<string, string>}
            onChange={(key, value) => patchMaintenance(key as keyof WebsiteSettingsConfig['maintenance'], value)}
          />
          <CmsImageField label="Background image" value={form.maintenance.backgroundImage} onChange={(url, publicId) => setForm((prev) => ({ ...prev, maintenance: { ...prev.maintenance, backgroundImage: url, backgroundImagePublicId: publicId ?? prev.maintenance.backgroundImagePublicId } }))} />
        </CmsSectionCard>
      </CmsSectionAnchor>

    </CmsPageLayout>
  );
};

export default WebsiteSettings;
