/**
 * @file src/services/pagesCmsConfig.service.ts
 */

import { PagesCmsConfig, IPagesCmsConfig } from '@/models/PagesCmsConfig';
import { logger } from '@/utils/logger';
import {
  syncScalarMediaFields,
  collectDocumentPublicIds,
  deleteCloudinaryPublicIds,
  SOLUTION_MEDIA_FIELDS,
} from '@/utils/mediaAsset';

const CONFIG_KEY = 'global';

const PAGE_SEO_MEDIA_FIELDS = SOLUTION_MEDIA_FIELDS;

const MEDIA_SECTION_PATHS: Array<{ section: string; urlKey: string; publicIdKey: string }> = [
  { section: 'home', urlKey: 'hero.backgroundImage', publicIdKey: 'hero.backgroundImagePublicId' },
  { section: 'home', urlKey: 'hero.backgroundVideoUrl', publicIdKey: 'hero.backgroundVideoPublicId' },
  { section: 'home', urlKey: 'hero.heroPosterImage', publicIdKey: 'hero.heroPosterImagePublicId' },
  { section: 'home', urlKey: 'portfolio.backgroundImage', publicIdKey: 'portfolio.backgroundImagePublicId' },
  { section: 'home', urlKey: 'contactCta.backgroundImage', publicIdKey: 'contactCta.backgroundImagePublicId' },
  { section: 'home', urlKey: 'footer.logo', publicIdKey: 'footer.logoPublicId' },
  { section: 'about', urlKey: 'hero.backgroundImage', publicIdKey: 'hero.backgroundImagePublicId' },
  { section: 'contact', urlKey: 'hero.backgroundImage', publicIdKey: 'hero.backgroundImagePublicId' },
  { section: 'solutionsLanding', urlKey: 'hero.backgroundImage', publicIdKey: 'hero.backgroundImagePublicId' },
  { section: 'solutionsLanding', urlKey: 'cta.backgroundImage', publicIdKey: 'cta.backgroundImagePublicId' },
  { section: 'industriesLanding', urlKey: 'hero.backgroundImage', publicIdKey: 'hero.backgroundImagePublicId' },
  { section: 'industriesLanding', urlKey: 'intro.icon', publicIdKey: 'intro.iconPublicId' },
  { section: 'industriesLanding', urlKey: 'cta.backgroundImage', publicIdKey: 'cta.backgroundImagePublicId' },
  { section: 'careers', urlKey: 'hero.backgroundImage', publicIdKey: 'hero.backgroundImagePublicId' },
  { section: 'websiteSettings', urlKey: 'logo', publicIdKey: 'logoPublicId' },
  { section: 'websiteSettings', urlKey: 'favicon', publicIdKey: 'faviconPublicId' },
  { section: 'websiteSettings', urlKey: 'defaultOgImage', publicIdKey: 'defaultOgImagePublicId' },
  { section: 'websiteSettings', urlKey: 'footer.logo', publicIdKey: 'footer.logoPublicId' },
  { section: 'websiteSettings', urlKey: 'footer.backgroundImage', publicIdKey: 'footer.backgroundImagePublicId' },
  { section: 'websiteSettings', urlKey: 'seoDefaults.defaultOgImage', publicIdKey: 'seoDefaults.defaultOgImagePublicId' },
  { section: 'websiteSettings', urlKey: 'maintenance.backgroundImage', publicIdKey: 'maintenance.backgroundImagePublicId' },
];

function getNested(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (!acc || typeof acc !== 'object') return undefined;
    return (acc as Record<string, unknown>)[key];
  }, obj);
}

function setNested(obj: Record<string, unknown>, path: string, value: unknown): void {
  const keys = path.split('.');
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key] as Record<string, unknown>;
  }
  current[keys[keys.length - 1]] = value;
}

function flattenPageSeo(doc: Record<string, unknown> | null | undefined, section: 'about' | 'careers') {
  if (!doc) return {};
  const block = (doc[section] as Record<string, unknown>) || {};
  return {
    [`${section}.ogImage`]: block.ogImage ?? '',
    [`${section}.ogImagePublicId`]: block.ogImagePublicId ?? '',
    [`${section}.twitterImage`]: block.twitterImage ?? '',
    [`${section}.twitterImagePublicId`]: block.twitterImagePublicId ?? '',
  };
}

function applyFlattenedPageSeo(
  payload: Record<string, unknown>,
  flat: Record<string, unknown>,
  section: 'about' | 'careers'
) {
  const block = { ...((payload[section] as Record<string, unknown>) || {}) };
  const prefix = `${section}.`;
  if (flat[`${prefix}ogImage`] !== undefined) block.ogImage = flat[`${prefix}ogImage`];
  if (flat[`${prefix}ogImagePublicId`] !== undefined) block.ogImagePublicId = flat[`${prefix}ogImagePublicId`];
  if (flat[`${prefix}twitterImage`] !== undefined) block.twitterImage = flat[`${prefix}twitterImage`];
  if (flat[`${prefix}twitterImagePublicId`] !== undefined) {
    block.twitterImagePublicId = flat[`${prefix}twitterImagePublicId`];
  }
  return { ...payload, [section]: block };
}

function deepMergeSection(
  previous: Record<string, unknown> | undefined,
  incoming: Record<string, unknown>
): Record<string, unknown> {
  const base = { ...(previous || {}) };
  for (const [key, value] of Object.entries(incoming)) {
    if (value === undefined) continue;
    if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      base[key] &&
      typeof base[key] === 'object' &&
      !Array.isArray(base[key])
    ) {
      base[key] = deepMergeSection(base[key] as Record<string, unknown>, value as Record<string, unknown>);
    } else {
      base[key] = value;
    }
  }
  return base;
}

export class PagesCmsConfigService {
  async ensureConfig(): Promise<IPagesCmsConfig> {
    let config = await PagesCmsConfig.findOne({ configKey: CONFIG_KEY });
    if (!config) {
      config = await PagesCmsConfig.create({ configKey: CONFIG_KEY });
      logger.info('[PagesCmsConfigService] Created default global config');
    }
    return config;
  }

  async getPublicConfig(): Promise<IPagesCmsConfig> {
    return this.ensureConfig();
  }

  async updateConfig(data: Record<string, unknown>, updatedBy?: string): Promise<IPagesCmsConfig> {
    const previous = await PagesCmsConfig.findOne({ configKey: CONFIG_KEY }).lean();
    const prevRecord = (previous as unknown as Record<string, unknown>) || {};

    let merged: Record<string, unknown> = {
      ...prevRecord,
      configKey: CONFIG_KEY,
      updatedBy: updatedBy || 'Admin',
    };

    for (const [section, incoming] of Object.entries(data)) {
      if (section === 'configKey' || section === 'updatedBy') continue;
      if (!incoming || typeof incoming !== 'object') continue;
      merged[section] = deepMergeSection(
        prevRecord[section] as Record<string, unknown> | undefined,
        incoming as Record<string, unknown>
      );
    }

    const obsoleteIds: string[] = [];

    for (const section of ['about', 'careers'] as const) {
      if (!data[section]) continue;

      const prevFlat = flattenPageSeo(prevRecord, section);
      const incoming = (merged[section] as Record<string, unknown>) || {};
      const nextFlat = {
        [`${section}.ogImage`]: incoming.ogImage ?? prevFlat[`${section}.ogImage`] ?? '',
        [`${section}.ogImagePublicId`]:
          incoming.ogImagePublicId ?? prevFlat[`${section}.ogImagePublicId`] ?? '',
        [`${section}.twitterImage`]: incoming.twitterImage ?? prevFlat[`${section}.twitterImage`] ?? '',
        [`${section}.twitterImagePublicId`]:
          incoming.twitterImagePublicId ?? prevFlat[`${section}.twitterImagePublicId`] ?? '',
      };

      const remappedFields = PAGE_SEO_MEDIA_FIELDS.map((f) => ({
        urlKey: `${section}.${f.urlKey}`,
        publicIdKey: `${section}.${f.publicIdKey}`,
      }));

      const { payload: syncedFlat, obsoletePublicIds } = syncScalarMediaFields(
        prevFlat,
        nextFlat,
        remappedFields
      );

      merged = applyFlattenedPageSeo(merged, syncedFlat, section);
      obsoleteIds.push(...obsoletePublicIds);
    }

    for (const { section, urlKey, publicIdKey } of MEDIA_SECTION_PATHS) {
      if (!data[section]) continue;

      const prevSection = (prevRecord[section] as Record<string, unknown>) || {};
      const nextSection = (merged[section] as Record<string, unknown>) || {};
      const flatKey = `${section}.${urlKey}`;
      const flatIdKey = `${section}.${publicIdKey}`;

      const prevFlat = {
        [flatKey]: getNested(prevSection, urlKey) ?? '',
        [flatIdKey]: getNested(prevSection, publicIdKey) ?? '',
      };
      const nextFlat = {
        [flatKey]: getNested(nextSection, urlKey) ?? prevFlat[flatKey],
        [flatIdKey]: getNested(nextSection, publicIdKey) ?? prevFlat[flatIdKey],
      };

      const { payload: syncedFlat, obsoletePublicIds } = syncScalarMediaFields(prevFlat, nextFlat, [
        { urlKey: flatKey, publicIdKey: flatIdKey },
      ]);

      const updatedSection = { ...nextSection };
      setNested(updatedSection, urlKey, syncedFlat[flatKey]);
      setNested(updatedSection, publicIdKey, syncedFlat[flatIdKey]);
      merged[section] = updatedSection;
      obsoleteIds.push(...obsoletePublicIds);
    }

    const config = await PagesCmsConfig.findOneAndUpdate(
      { configKey: CONFIG_KEY },
      merged,
      { upsert: true, returnDocument: 'after', runValidators: true, setDefaultsOnInsert: true }
    );

    await deleteCloudinaryPublicIds(obsoleteIds);

    if (!config) {
      return this.ensureConfig();
    }
    return config;
  }

  async collectAllPublicIds(): Promise<string[]> {
    const doc = await PagesCmsConfig.findOne({ configKey: CONFIG_KEY }).lean();
    if (!doc) return [];
    const flat = {
      ...flattenPageSeo(doc as unknown as Record<string, unknown>, 'about'),
      ...flattenPageSeo(doc as unknown as Record<string, unknown>, 'careers'),
    };
    const fields = [
      { urlKey: 'about.ogImage', publicIdKey: 'about.ogImagePublicId' },
      { urlKey: 'about.twitterImage', publicIdKey: 'about.twitterImagePublicId' },
      { urlKey: 'careers.ogImage', publicIdKey: 'careers.ogImagePublicId' },
      { urlKey: 'careers.twitterImage', publicIdKey: 'careers.twitterImagePublicId' },
      ...MEDIA_SECTION_PATHS.map(({ section, urlKey, publicIdKey }) => ({
        urlKey: `${section}.${urlKey}`,
        publicIdKey: `${section}.${publicIdKey}`,
      })),
    ];
    return collectDocumentPublicIds(flat, fields);
  }
}

export const pagesCmsConfigService = new PagesCmsConfigService();
