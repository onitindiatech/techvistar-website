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
    let merged: Record<string, unknown> = {
      ...(previous ? (previous as unknown as Record<string, unknown>) : {}),
      ...data,
      configKey: CONFIG_KEY,
      updatedBy: updatedBy || 'Admin',
    };

    const obsoleteIds: string[] = [];

    for (const section of ['about', 'careers'] as const) {
      if (!data[section]) continue;

      const prevFlat = flattenPageSeo(previous as unknown as Record<string, unknown>, section);
      const incoming = data[section] as Record<string, unknown>;
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
    return collectDocumentPublicIds(flat, [
      { urlKey: 'about.ogImage', publicIdKey: 'about.ogImagePublicId' },
      { urlKey: 'about.twitterImage', publicIdKey: 'about.twitterImagePublicId' },
      { urlKey: 'careers.ogImage', publicIdKey: 'careers.ogImagePublicId' },
      { urlKey: 'careers.twitterImage', publicIdKey: 'careers.twitterImagePublicId' },
    ]);
  }
}

export const pagesCmsConfigService = new PagesCmsConfigService();
