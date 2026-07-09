import { Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/admin/common/PageHeader';
import { CmsImageField } from '@/components/admin/common/CmsImageField';
import { CmsTextFields } from '@/components/admin/common/CmsSettingsFields';
import { CmsAccordionLayout, CmsStickySaveBar } from '@/components/admin/common/CmsAccordionLayout';
import { usePagesCmsSettings } from '@/hooks/usePagesCmsSettings';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { WebsiteSettingsConfig } from '@/types/websiteSettings';

const WebsiteSettings = () => {
  const { form, setForm, isLoading, save, isSaving } = usePagesCmsSettings('websiteSettings');

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-slate-500">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Loading settings...
      </div>
    );
  }

  const patchRoot = <K extends keyof WebsiteSettingsConfig>(key: K, value: WebsiteSettingsConfig[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const patchNavbar = <K extends keyof WebsiteSettingsConfig['navbar']>(
    key: K,
    value: WebsiteSettingsConfig['navbar'][K],
  ) => setForm((prev) => ({ ...prev, navbar: { ...prev.navbar, [key]: value } }));

  const patchFooter = <K extends keyof WebsiteSettingsConfig['footer']>(
    key: K,
    value: WebsiteSettingsConfig['footer'][K],
  ) => setForm((prev) => ({ ...prev, footer: { ...prev.footer, [key]: value } }));

  const patchSocial = (key: keyof WebsiteSettingsConfig['socialLinks'], value: string) =>
    setForm((prev) => ({ ...prev, socialLinks: { ...prev.socialLinks, [key]: value } }));

  const patchSeo = <K extends keyof WebsiteSettingsConfig['seoDefaults']>(
    key: K,
    value: WebsiteSettingsConfig['seoDefaults'][K],
  ) => setForm((prev) => ({ ...prev, seoDefaults: { ...prev.seoDefaults, [key]: value } }));

  const patchAnalytics = <K extends keyof WebsiteSettingsConfig['analytics']>(
    key: K,
    value: WebsiteSettingsConfig['analytics'][K],
  ) => setForm((prev) => ({ ...prev, analytics: { ...prev.analytics, [key]: value } }));

  const patchMaintenance = <K extends keyof WebsiteSettingsConfig['maintenance']>(
    key: K,
    value: WebsiteSettingsConfig['maintenance'][K],
  ) => setForm((prev) => ({ ...prev, maintenance: { ...prev.maintenance, [key]: value } }));

  const toggleRow = (label: string, description: string, checked: boolean, onChange: (v: boolean) => void) => (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3">
      <div>
        <Label className="text-sm font-semibold text-slate-800">{label}</Label>
        <p className="text-[11px] text-slate-500">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );

  const sections = [
    {
      id: 'branding',
      title: 'Branding',
      description: 'Logo, favicon, company identity, browser chrome, and default OG image.',
      children: (
        <>
          <CmsImageField
            label="Logo"
            value={form.logo}
            onChange={(url, publicId) =>
              setForm((prev) => ({
                ...prev,
                logo: url,
                logoPublicId: publicId ?? prev.logoPublicId,
              }))
            }
          />
          <CmsImageField
            label="Favicon"
            value={form.favicon}
            onChange={(url, publicId) =>
              setForm((prev) => ({
                ...prev,
                favicon: url,
                faviconPublicId: publicId ?? prev.faviconPublicId,
              }))
            }
          />
          <CmsTextFields
            fields={[
              { key: 'companyName', label: 'Company name' },
              { key: 'companyTagline', label: 'Company tagline' },
              { key: 'browserTitle', label: 'Browser title' },
              { key: 'browserThemeColor', label: 'Browser theme color' },
            ]}
            values={{
              companyName: form.companyName,
              companyTagline: form.companyTagline,
              browserTitle: form.browserTitle,
              browserThemeColor: form.browserThemeColor,
            }}
            onChange={(key, value) => patchRoot(key as keyof WebsiteSettingsConfig, value)}
          />
          <CmsImageField
            label="Default website OG image"
            value={form.defaultOgImage}
            onChange={(url, publicId) =>
              setForm((prev) => ({
                ...prev,
                defaultOgImage: url,
                defaultOgImagePublicId: publicId ?? prev.defaultOgImagePublicId,
              }))
            }
          />
        </>
      ),
    },
    {
      id: 'navigation',
      title: 'Navigation',
      description: 'Navbar CTA, layout toggles, and optional announcement bar.',
      children: (
        <>
          <CmsTextFields
            fields={[
              { key: 'ctaButtonText', label: 'CTA button text' },
              { key: 'ctaButtonLink', label: 'CTA button link' },
            ]}
            values={form.navbar as unknown as Record<string, string>}
            onChange={(key, value) => patchNavbar(key as keyof WebsiteSettingsConfig['navbar'], value)}
          />
          {toggleRow('Sticky navbar', 'Keep the navbar fixed while scrolling.', form.navbar.stickyEnabled, (v) =>
            patchNavbar('stickyEnabled', v),
          )}
          {toggleRow(
            'Transparent navbar',
            'Use transparent styling at the top of the page.',
            form.navbar.transparentEnabled,
            (v) => patchNavbar('transparentEnabled', v),
          )}
          {toggleRow('Show search', 'Display a search control in the navbar.', form.navbar.showSearch, (v) =>
            patchNavbar('showSearch', v),
          )}
          {toggleRow(
            'Announcement bar',
            'Show a slim announcement strip above the navbar.',
            form.navbar.announcementBarEnabled,
            (v) => patchNavbar('announcementBarEnabled', v),
          )}
          <CmsTextFields
            fields={[
              { key: 'announcementText', label: 'Announcement text', type: 'textarea' },
              { key: 'announcementLink', label: 'Announcement link' },
              { key: 'announcementButtonText', label: 'Announcement button text' },
            ]}
            values={form.navbar as unknown as Record<string, string>}
            onChange={(key, value) => patchNavbar(key as keyof WebsiteSettingsConfig['navbar'], value)}
          />
        </>
      ),
    },
    {
      id: 'contact',
      title: 'Contact Details',
      description: 'Global contact channels shown across the site.',
      children: (
        <CmsTextFields
          fields={[
            { key: 'email', label: 'Primary email' },
            { key: 'phone', label: 'Phone' },
            { key: 'address', label: 'Address', type: 'textarea' },
            { key: 'whatsappNumber', label: 'WhatsApp number' },
            { key: 'supportEmail', label: 'Support email' },
            { key: 'salesEmail', label: 'Sales email' },
            { key: 'googleMapsUrl', label: 'Google Maps URL' },
            { key: 'workingHours', label: 'Working hours' },
            { key: 'emergencyContact', label: 'Emergency contact (optional)' },
          ]}
          values={{
            email: form.email,
            phone: form.phone,
            address: form.address,
            whatsappNumber: form.whatsappNumber,
            supportEmail: form.supportEmail,
            salesEmail: form.salesEmail,
            googleMapsUrl: form.googleMapsUrl,
            workingHours: form.workingHours,
            emergencyContact: form.emergencyContact,
          }}
          onChange={(key, value) => patchRoot(key as keyof WebsiteSettingsConfig, value)}
        />
      ),
    },
    {
      id: 'footer',
      title: 'Footer',
      description: 'Footer copy, newsletter block, branding, and optional background styling.',
      children: (
        <>
          <CmsTextFields
            fields={[
              { key: 'heading', label: 'Footer heading' },
              { key: 'description', label: 'Footer description', type: 'textarea' },
              { key: 'newsletterHeading', label: 'Newsletter heading' },
              { key: 'newsletterDescription', label: 'Newsletter description', type: 'textarea' },
              { key: 'bottomText', label: 'Footer bottom text' },
              { key: 'copyright', label: 'Footer copyright' },
              { key: 'backgroundColor', label: 'Footer background color' },
            ]}
            values={form.footer as unknown as Record<string, string>}
            onChange={(key, value) => patchFooter(key as keyof WebsiteSettingsConfig['footer'], value)}
          />
          <CmsImageField
            label="Footer logo"
            value={form.footer.logo}
            onChange={(url, publicId) =>
              setForm((prev) => ({
                ...prev,
                footer: {
                  ...prev.footer,
                  logo: url,
                  logoPublicId: publicId ?? prev.footer.logoPublicId,
                },
              }))
            }
          />
          <CmsImageField
            label="Footer background image (optional)"
            value={form.footer.backgroundImage}
            onChange={(url, publicId) =>
              setForm((prev) => ({
                ...prev,
                footer: {
                  ...prev.footer,
                  backgroundImage: url,
                  backgroundImagePublicId: publicId ?? prev.footer.backgroundImagePublicId,
                },
              }))
            }
          />
        </>
      ),
    },
    {
      id: 'social',
      title: 'Social Links',
      description: 'Platform URLs — empty links are hidden on the public site.',
      children: (
        <CmsTextFields
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
      ),
    },
    {
      id: 'seo',
      title: 'SEO Defaults',
      description: 'Global SEO fallbacks when individual pages do not override metadata.',
      children: (
        <>
          <CmsTextFields
            fields={[
              { key: 'siteTitle', label: 'Site title' },
              { key: 'metaDescription', label: 'Default meta description', type: 'textarea' },
              { key: 'keywords', label: 'Default keywords', type: 'textarea' },
              { key: 'canonicalUrl', label: 'Canonical URL' },
              { key: 'twitterCard', label: 'Twitter card type' },
              { key: 'twitterHandle', label: 'Twitter handle' },
              { key: 'openGraphType', label: 'Open Graph type' },
            ]}
            values={form.seoDefaults as unknown as Record<string, string>}
            onChange={(key, value) => patchSeo(key as keyof WebsiteSettingsConfig['seoDefaults'], value)}
          />
          {toggleRow('Robots index', 'Allow search engines to index the site by default.', form.seoDefaults.robotsIndex, (v) =>
            patchSeo('robotsIndex', v),
          )}
          <CmsImageField
            label="Default OG image"
            value={form.seoDefaults.defaultOgImage}
            onChange={(url, publicId) =>
              setForm((prev) => ({
                ...prev,
                seoDefaults: {
                  ...prev.seoDefaults,
                  defaultOgImage: url,
                  defaultOgImagePublicId: publicId ?? prev.seoDefaults.defaultOgImagePublicId,
                },
              }))
            }
          />
        </>
      ),
    },
    {
      id: 'analytics',
      title: 'Analytics (Optional)',
      description: 'Store tracking IDs for future integration. No scripts are injected yet.',
      children: (
        <CmsTextFields
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
      ),
    },
    {
      id: 'maintenance',
      title: 'Maintenance (Optional)',
      description: 'Maintenance page content for future rollout. Not active on the public site yet.',
      children: (
        <>
          {toggleRow('Enable maintenance mode', 'Stored for future use — no public redirect yet.', form.maintenance.enabled, (v) =>
            patchMaintenance('enabled', v),
          )}
          <CmsTextFields
            fields={[
              { key: 'title', label: 'Title' },
              { key: 'subtitle', label: 'Subtitle' },
              { key: 'description', label: 'Description', type: 'textarea' },
              { key: 'expectedReturnDate', label: 'Expected return date' },
              { key: 'buttonText', label: 'Button text' },
              { key: 'buttonLink', label: 'Button link' },
            ]}
            values={form.maintenance as unknown as Record<string, string>}
            onChange={(key, value) => patchMaintenance(key as keyof WebsiteSettingsConfig['maintenance'], value)}
          />
          <CmsImageField
            label="Background image"
            value={form.maintenance.backgroundImage}
            onChange={(url, publicId) =>
              setForm((prev) => ({
                ...prev,
                maintenance: {
                  ...prev.maintenance,
                  backgroundImage: url,
                  backgroundImagePublicId: publicId ?? prev.maintenance.backgroundImagePublicId,
                },
              }))
            }
          />
        </>
      ),
    },
  ];

  return (
    <div className="max-w-4xl space-y-6 pb-24">
      <PageHeader
        title="Website Settings"
        description="Global branding, navigation, contact, footer, SEO defaults, analytics, and maintenance."
      />
      <CmsAccordionLayout sections={sections} defaultOpen={['branding', 'navigation']} />
      <CmsStickySaveBar onSave={save} isSaving={isSaving} label="Save Website Settings" />
    </div>
  );
};

export default WebsiteSettings;
