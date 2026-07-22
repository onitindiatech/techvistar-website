/**
 * @file src/services/servicesCmsConfig.service.ts
 */

import { ServicesCmsConfig, IServicesCmsConfig } from '@/models/ServicesCmsConfig';
import { logger } from '@/utils/logger';
import {
  syncScalarMediaFields,
  collectDocumentPublicIds,
  deleteCloudinaryPublicIds,
} from '@/utils/mediaAsset';

const CONFIG_KEY = 'global';

const CMS_CONFIG_MEDIA_FIELDS = [
  { urlKey: 'landing.backgroundImage', publicIdKey: 'landing.backgroundImagePublicId' },
] as const;

function flattenConfigMedia(doc: Record<string, unknown> | null | undefined): Record<string, unknown> {
  if (!doc) return {};
  const landing = (doc.landing as Record<string, unknown>) || {};
  return {
    'landing.backgroundImage': landing.backgroundImage ?? '',
    'landing.backgroundImagePublicId': landing.backgroundImagePublicId ?? '',
  };
}

function applyFlattenedMedia(
  payload: Record<string, unknown>,
  flat: Record<string, unknown>
): Record<string, unknown> {
  const landing = { ...((payload.landing as Record<string, unknown>) || {}) };
  if (flat['landing.backgroundImage'] !== undefined) {
    landing.backgroundImage = flat['landing.backgroundImage'];
  }
  if (flat['landing.backgroundImagePublicId'] !== undefined) {
    landing.backgroundImagePublicId = flat['landing.backgroundImagePublicId'];
  }
  return { ...payload, landing };
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

export class ServicesCmsConfigService {
  async ensureConfig(): Promise<IServicesCmsConfig> {
    let config = await ServicesCmsConfig.findOne({ configKey: CONFIG_KEY });
    if (!config) {
      config = await ServicesCmsConfig.create({ configKey: CONFIG_KEY });
      logger.info('[ServicesCmsConfigService] Created default global config');
    }
    return config;
  }

  async getPublicConfig(): Promise<IServicesCmsConfig> {
    const config = await ServicesCmsConfig.findOne({ configKey: CONFIG_KEY }).lean();
    if (config) return config as IServicesCmsConfig;
    return this.ensureConfig();
  }

  async updateConfig(data: Record<string, unknown>, updatedBy?: string): Promise<IServicesCmsConfig> {
    const previous = await ServicesCmsConfig.findOne({ configKey: CONFIG_KEY }).lean();
    const prevRecord = (previous as unknown as Record<string, unknown>) || {};

    let merged: Record<string, unknown> = {
      ...prevRecord,
      configKey: CONFIG_KEY,
      updatedBy: updatedBy || 'Admin',
    };

    for (const [section, incoming] of Object.entries(data)) {
      if (section === 'configKey' || section === 'updatedBy') continue;
      if (!incoming || typeof incoming !== 'object' || Array.isArray(incoming)) continue;
      merged[section] = deepMergeSection(
        prevRecord[section] as Record<string, unknown> | undefined,
        incoming as Record<string, unknown>
      );
    }

    const prevFlat = flattenConfigMedia(previous as unknown as Record<string, unknown>);
    const mergedLanding = (merged.landing as Record<string, unknown>) || {};
    const nextFlat = {
      'landing.backgroundImage':
        (mergedLanding.backgroundImage as string) ?? prevFlat['landing.backgroundImage'] ?? '',
      'landing.backgroundImagePublicId':
        (mergedLanding.backgroundImagePublicId as string) ??
        prevFlat['landing.backgroundImagePublicId'] ??
        '',
    };

    const { payload: syncedFlat, obsoletePublicIds } = syncScalarMediaFields(
      prevFlat,
      nextFlat,
      CMS_CONFIG_MEDIA_FIELDS as unknown as { urlKey: string; publicIdKey: string }[]
    );

    const payloadWithMedia = applyFlattenedMedia(merged, syncedFlat);

    const config = await ServicesCmsConfig.findOneAndUpdate(
      { configKey: CONFIG_KEY },
      payloadWithMedia,
      { upsert: true, returnDocument: 'after', runValidators: true, setDefaultsOnInsert: true }
    );

    await deleteCloudinaryPublicIds(obsoletePublicIds);

    if (!config) {
      return this.ensureConfig();
    }
    return config;
  }

  async collectAllPublicIds(): Promise<string[]> {
    const doc = await ServicesCmsConfig.findOne({ configKey: CONFIG_KEY }).lean();
    if (!doc) return [];
    return collectDocumentPublicIds(flattenConfigMedia(doc as unknown as Record<string, unknown>), [
      { urlKey: 'landing.backgroundImage', publicIdKey: 'landing.backgroundImagePublicId' },
    ]);
  }
}

export const servicesCmsConfigService = new ServicesCmsConfigService();
