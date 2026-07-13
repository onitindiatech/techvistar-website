/**
 * @file scripts/migrate-cloudinary-assets.ts
 * @description Production-safe utility to copy Cloudinary assets from a legacy account
 *              into the current account (from .env) and update MongoDB URL fields.
 *
 * Usage:
 *   npx ts-node -r tsconfig-paths/register --transpile-only scripts/migrate-cloudinary-assets.ts --dry-run
 *   npx ts-node -r tsconfig-paths/register --transpile-only scripts/migrate-cloudinary-assets.ts
 *   npx ts-node -r tsconfig-paths/register --transpile-only scripts/migrate-cloudinary-assets.ts --verify-only
 *
 * Environment:
 *   CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET — target (new) account
 *   CLOUDINARY_LEGACY_CLOUD_NAME — source cloud name in stored URLs (default: dwjsxhryn)
 *   MONGODB_URI — database connection
 */

import 'dotenv/config';

import fs from 'fs/promises';
import path from 'path';
import { Readable } from 'stream';
import mongoose from 'mongoose';
import type { UploadApiResponse } from 'cloudinary';
import { cloudinary } from '@/config/cloudinary';
import { env } from '@/config/env';
import {
  extractCloudinaryPublicId,
  extractUrlsFromJobDescription,
  isCloudinaryDeliveryUrl,
  PROJECT_MEDIA_FIELDS,
  publicIdForUrl,
  SERVICE_MEDIA_FIELDS,
} from '@/utils/mediaAsset';

// ─── CLI ─────────────────────────────────────────────────────────────────────

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has('--dry-run');
const VERIFY_ONLY = args.has('--verify-only');

const LEGACY_CLOUD =
  process.env.CLOUDINARY_LEGACY_CLOUD_NAME?.trim() || 'dwjsxhryn';
const TARGET_CLOUD = env.cloudinaryCloudName;

// ─── Types ───────────────────────────────────────────────────────────────────

type ResourceType = 'image' | 'raw' | 'video';

type LogLevel = 'info' | 'skip' | 'success' | 'error' | 'verify';

interface LogEntry {
  at: string;
  level: LogLevel;
  collection: string;
  documentId: string;
  field: string;
  message: string;
  publicId?: string;
  oldUrl?: string;
  newUrl?: string;
}

interface MigrationStats {
  scanned: number;
  migrated: number;
  skipped: number;
  failed: number;
  mongoUpdated: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const migrationCache = new Map<string, { secureUrl: string; publicId: string }>();
const logs: LogEntry[] = [];

function log(entry: Omit<LogEntry, 'at'>): void {
  const row: LogEntry = { ...entry, at: new Date().toISOString() };
  logs.push(row);
  const prefix = `[${row.level.toUpperCase()}]`;
  console.log(
    `${prefix} ${row.collection}/${row.documentId} ${row.field}: ${row.message}` +
      (row.publicId ? ` (public_id=${row.publicId})` : ''),
  );
}

function isLegacyCloudUrl(value: string): boolean {
  return value.includes(`res.cloudinary.com/${LEGACY_CLOUD}/`);
}

function isTargetCloudUrl(value: string): boolean {
  return value.includes(`res.cloudinary.com/${TARGET_CLOUD}/`);
}

function resourceTypeFromUrl(url: string): ResourceType {
  if (/\/raw\/upload\//i.test(url)) return 'raw';
  if (/\/video\/upload\//i.test(url)) return 'video';
  return 'image';
}

function getNestedValue(obj: Record<string, unknown>, dotPath: string): unknown {
  return dotPath.split('.').reduce<unknown>((acc, key) => {
    if (acc === null || acc === undefined || typeof acc !== 'object') return undefined;
    return (acc as Record<string, unknown>)[key];
  }, obj);
}

async function resourceExists(publicId: string, resourceType: ResourceType): Promise<boolean> {
  try {
    await cloudinary.api.resource(publicId, { resource_type: resourceType });
    return true;
  } catch (err: unknown) {
    const code = (err as { http_code?: number })?.http_code;
    if (code === 404) return false;
    throw err;
  }
}

function buildDeliveryUrl(publicId: string, resourceType: ResourceType): string {
  return cloudinary.url(publicId, {
    secure: true,
    resource_type: resourceType,
  });
}

async function uploadBufferToCloudinary(
  buffer: Buffer,
  publicId: string,
  resourceType: ResourceType,
): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        public_id: publicId,
        resource_type: resourceType,
        overwrite: false,
        invalidate: true,
      },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error('Empty Cloudinary upload result'));
        resolve(result);
      },
    );
    Readable.from(buffer).pipe(uploadStream);
  });
}

async function copyAssetToTargetAccount(
  sourceUrl: string,
  explicitPublicId?: string | null,
): Promise<{ secureUrl: string; publicId: string; copied: boolean }> {
  const publicId =
    (explicitPublicId?.trim() || '') ||
    extractCloudinaryPublicId(sourceUrl) ||
    publicIdForUrl(sourceUrl, explicitPublicId);

  if (!publicId) {
    throw new Error(`Could not resolve public_id for ${sourceUrl}`);
  }

  const cacheKey = publicId;
  if (migrationCache.has(cacheKey)) {
    const cached = migrationCache.get(cacheKey)!;
    return { ...cached, copied: false };
  }

  const resourceType = resourceTypeFromUrl(sourceUrl);

  if (await resourceExists(publicId, resourceType)) {
    const secureUrl = buildDeliveryUrl(publicId, resourceType);
    const result = { secureUrl, publicId };
    migrationCache.set(cacheKey, result);
    return { ...result, copied: false };
  }

  if (DRY_RUN) {
    const secureUrl = buildDeliveryUrl(publicId, resourceType);
    return { secureUrl, publicId, copied: true };
  }

  let uploadResult: UploadApiResponse;

  try {
    uploadResult = await cloudinary.uploader.upload(sourceUrl, {
      public_id: publicId,
      resource_type: resourceType,
      overwrite: false,
      invalidate: true,
    });
  } catch (uploadErr) {
    const response = await fetch(sourceUrl);
    if (!response.ok) {
      throw new Error(
        `Cloudinary upload failed and HTTP fetch returned ${response.status}: ${
          uploadErr instanceof Error ? uploadErr.message : String(uploadErr)
        }`,
      );
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    uploadResult = await uploadBufferToCloudinary(buffer, publicId, resourceType);
  }

  const result = {
    secureUrl: uploadResult.secure_url,
    publicId: uploadResult.public_id,
  };
  migrationCache.set(cacheKey, result);
  return { ...result, copied: true };
}

async function migrateUrlField(
  collection: string,
  documentId: string,
  fieldLabel: string,
  url: string,
  publicIdHint: string | undefined,
  stats: MigrationStats,
): Promise<{ url: string; publicId: string } | null> {
  stats.scanned++;

  const trimmed = url.trim();
  if (!trimmed || !isCloudinaryDeliveryUrl(trimmed)) {
    return null;
  }

  if (isTargetCloudUrl(trimmed) && !isLegacyCloudUrl(trimmed)) {
    stats.skipped++;
    log({
      level: 'skip',
      collection,
      documentId,
      field: fieldLabel,
      message: 'Already on target Cloudinary account',
      publicId: publicIdForUrl(trimmed, publicIdHint),
      oldUrl: trimmed,
      newUrl: trimmed,
    });
    return { url: trimmed, publicId: publicIdForUrl(trimmed, publicIdHint) };
  }

  if (!isLegacyCloudUrl(trimmed)) {
    stats.skipped++;
    log({
      level: 'skip',
      collection,
      documentId,
      field: fieldLabel,
      message: `Not a legacy ${LEGACY_CLOUD} URL — left unchanged`,
      oldUrl: trimmed,
    });
    return null;
  }

  try {
    if (DRY_RUN) {
      const resolvedPublicId = publicIdForUrl(trimmed, publicIdHint);
      const preview = await copyAssetToTargetAccount(trimmed, resolvedPublicId);
      stats.migrated++;
      log({
        level: 'info',
        collection,
        documentId,
        field: fieldLabel,
        message: '[DRY RUN] Would copy asset and update MongoDB URL',
        publicId: preview.publicId,
        oldUrl: trimmed,
        newUrl: preview.secureUrl,
      });
      return { url: preview.secureUrl, publicId: preview.publicId };
    }

    const migrated = await copyAssetToTargetAccount(trimmed, publicIdHint);
    stats.migrated++;
    log({
      level: 'success',
      collection,
      documentId,
      field: fieldLabel,
      message: migrated.copied
        ? 'Asset copied to target account'
        : 'Asset already present on target account — URL updated',
      publicId: migrated.publicId,
      oldUrl: trimmed,
      newUrl: migrated.secureUrl,
    });
    return { url: migrated.secureUrl, publicId: migrated.publicId };
  } catch (err) {
    stats.failed++;
    log({
      level: 'error',
      collection,
      documentId,
      field: fieldLabel,
      message: err instanceof Error ? err.message : String(err),
      publicId: publicIdForUrl(trimmed, publicIdHint),
      oldUrl: trimmed,
    });
    return null;
  }
}

// ─── Collection migrators ────────────────────────────────────────────────────

const PAGES_CMS_MEDIA_PATHS: Array<{ urlPath: string; publicIdPath: string }> = [
  { urlPath: 'home.hero.heroPosterImage', publicIdPath: 'home.hero.heroPosterImagePublicId' },
  { urlPath: 'home.footer.logo', publicIdPath: 'home.footer.logoPublicId' },
  { urlPath: 'websiteSettings.logo', publicIdPath: 'websiteSettings.logoPublicId' },
  { urlPath: 'websiteSettings.favicon', publicIdPath: 'websiteSettings.faviconPublicId' },
  { urlPath: 'websiteSettings.footer.logo', publicIdPath: 'websiteSettings.footer.logoPublicId' },
];

async function migrateScalarDocument(
  collection: string,
  doc: Record<string, unknown>,
  fields: Array<{ urlKey: string; publicIdKey: string }>,
  stats: MigrationStats,
): Promise<Record<string, string> | null> {
  const id = String(doc._id);
  const $set: Record<string, string> = {};

  for (const { urlKey, publicIdKey } of fields) {
    const url = String(doc[urlKey] ?? '').trim();
    if (!url || !isLegacyCloudUrl(url)) continue;

    const result = await migrateUrlField(
      collection,
      id,
      urlKey,
      url,
      String(doc[publicIdKey] ?? '').trim() || undefined,
      stats,
    );
    if (!result) continue;

    $set[urlKey] = result.url;
    $set[publicIdKey] = result.publicId;
  }

  return Object.keys($set).length ? $set : null;
}

async function migrateServices(stats: MigrationStats): Promise<void> {
  const coll = mongoose.connection.collection('services');
  const docs = await coll.find({}).toArray();

  for (const doc of docs) {
    const $set = await migrateScalarDocument(
      'services',
      doc as Record<string, unknown>,
      SERVICE_MEDIA_FIELDS.filter(
        (f) => f.urlKey === 'coverImage' || f.urlKey === 'thumbnail',
      ),
      stats,
    );
    if ($set && !DRY_RUN && !VERIFY_ONLY) {
      await coll.updateOne({ _id: doc._id }, { $set });
      stats.mongoUpdated++;
    }
  }
}

async function migrateProjects(stats: MigrationStats): Promise<void> {
  const coll = mongoose.connection.collection('projects');
  const docs = await coll.find({}).toArray();

  for (const doc of docs) {
    const $set = await migrateScalarDocument(
      'projects',
      doc as Record<string, unknown>,
      PROJECT_MEDIA_FIELDS.filter((f) => f.urlKey === 'thumbnail'),
      stats,
    );
    if ($set && !DRY_RUN && !VERIFY_ONLY) {
      await coll.updateOne({ _id: doc._id }, { $set });
      stats.mongoUpdated++;
    }
  }
}

async function migrateOffices(stats: MigrationStats): Promise<void> {
  const coll = mongoose.connection.collection('offices');
  const docs = await coll.find({}).toArray();

  for (const doc of docs) {
    const $set = await migrateScalarDocument(
      'offices',
      doc as Record<string, unknown>,
      [{ urlKey: 'image', publicIdKey: 'imagePublicId' }],
      stats,
    );
    if ($set && !DRY_RUN && !VERIFY_ONLY) {
      await coll.updateOne({ _id: doc._id }, { $set });
      stats.mongoUpdated++;
    }
  }
}

async function migrateJobApplications(stats: MigrationStats): Promise<void> {
  const coll = mongoose.connection.collection('jobapplications');
  const docs = await coll.find({}).toArray();

  for (const doc of docs) {
    const record = doc as Record<string, unknown>;
    const $set = await migrateScalarDocument(
      'jobapplications',
      record,
      [{ urlKey: 'resumeUrl', publicIdKey: 'resumePublicId' }],
      stats,
    );
    if ($set && !DRY_RUN && !VERIFY_ONLY) {
      await coll.updateOne({ _id: doc._id }, { $set });
      stats.mongoUpdated++;
    }
  }
}

async function migrateJobs(stats: MigrationStats): Promise<void> {
  const coll = mongoose.connection.collection('jobs');
  const docs = await coll.find({}).toArray();

  for (const doc of docs) {
    const record = doc as Record<string, unknown>;
    const id = String(doc._id);
    const description = String(record.description ?? '');
    if (!description || !isLegacyCloudUrl(description)) continue;

    const urls = extractUrlsFromJobDescription(description).filter(isLegacyCloudUrl);
    if (!urls.length) continue;

    let nextDescription = description;
    let changed = false;

    for (const oldUrl of urls) {
      const result = await migrateUrlField(
        'jobs',
        id,
        'description (embedded)',
        oldUrl,
        undefined,
        stats,
      );
      if (!result) continue;
      nextDescription = nextDescription.split(oldUrl).join(result.url);
      changed = true;
    }

    if (changed && !DRY_RUN && !VERIFY_ONLY) {
      await coll.updateOne({ _id: doc._id }, { $set: { description: nextDescription } });
      stats.mongoUpdated++;
      log({
        level: 'success',
        collection: 'jobs',
        documentId: id,
        field: 'description',
        message: 'Embedded Cloudinary URLs replaced in job description',
      });
    }
  }
}

async function migratePagesCmsConfig(stats: MigrationStats): Promise<void> {
  const coll = mongoose.connection.collection('pagescmsconfigs');
  const doc = await coll.findOne({});
  if (!doc) return;

  const id = String(doc._id);
  const record = doc as Record<string, unknown>;
  const $set: Record<string, string> = {};

  for (const { urlPath, publicIdPath } of PAGES_CMS_MEDIA_PATHS) {
    const url = String(getNestedValue(record, urlPath) ?? '').trim();
    if (!url || !isLegacyCloudUrl(url)) continue;

    const publicIdHint = String(getNestedValue(record, publicIdPath) ?? '').trim() || undefined;
    const result = await migrateUrlField(
      'pagescmsconfigs',
      id,
      urlPath,
      url,
      publicIdHint,
      stats,
    );
    if (!result) continue;

    $set[urlPath] = result.url;
    $set[publicIdPath] = result.publicId;
  }

  if (Object.keys($set).length && !DRY_RUN && !VERIFY_ONLY) {
    await coll.updateOne({ _id: doc._id }, { $set });
    stats.mongoUpdated++;
  }
}

// ─── Verification ────────────────────────────────────────────────────────────

const VERIFY_COLLECTIONS = [
  'pagescmsconfigs',
  'services',
  'projects',
  'offices',
  'jobapplications',
  'jobs',
] as const;

function collectStringValues(value: unknown, hits: string[]): void {
  if (value === null || value === undefined) return;
  if (typeof value === 'string') {
    if (value.includes('cloudinary.com') || value.startsWith('techvistar/')) {
      hits.push(value);
    }
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item) => collectStringValues(item, hits));
    return;
  }
  if (typeof value === 'object') {
    Object.values(value as Record<string, unknown>).forEach((v) => collectStringValues(v, hits));
  }
}

async function verifyMigration(): Promise<{
  legacyUrls: Array<{ collection: string; documentId: string; value: string }>;
  invalidPublicIds: Array<{ publicId: string; resourceType: ResourceType; error: string }>;
}> {
  const legacyUrls: Array<{ collection: string; documentId: string; value: string }> = [];
  const publicIdsToVerify = new Set<string>();

  for (const collectionName of VERIFY_COLLECTIONS) {
    const coll = mongoose.connection.collection(collectionName);
    const docs = await coll.find({}).toArray();

    for (const doc of docs) {
      const id = String(doc._id);
      const strings: string[] = [];
      collectStringValues(doc, strings);

      for (const value of strings) {
        if (isLegacyCloudUrl(value)) {
          legacyUrls.push({ collection: collectionName, documentId: id, value });
          log({
            level: 'verify',
            collection: collectionName,
            documentId: id,
            field: '(scan)',
            message: `Legacy URL still present: ${value.slice(0, 120)}`,
            oldUrl: value,
          });
        }
        if (isTargetCloudUrl(value)) {
          const pid = extractCloudinaryPublicId(value);
          if (pid) publicIdsToVerify.add(pid);
        }
      }
    }
  }

  const invalidPublicIds: Array<{ publicId: string; resourceType: ResourceType; error: string }> =
    [];

  for (const publicId of publicIdsToVerify) {
    const resourceTypes: ResourceType[] = publicId.startsWith('techvistar/resumes/')
      ? ['image', 'raw']
      : ['image'];

    let verified = false;
    let lastError = 'Resource not found on target account';

    for (const resourceType of resourceTypes) {
      try {
        if (await resourceExists(publicId, resourceType)) {
          verified = true;
          log({
            level: 'verify',
            collection: '(cloudinary)',
            documentId: '-',
            field: publicId,
            message: `public_id exists on target account (${resourceType})`,
            publicId,
          });
          break;
        }
      } catch (err) {
        lastError = err instanceof Error ? err.message : String(err);
      }
    }

    if (!verified) {
      invalidPublicIds.push({
        publicId,
        resourceType: resourceTypes[0],
        error: lastError,
      });
    }
  }

  return { legacyUrls, invalidPublicIds };
}

async function writeLogFile(summary: Record<string, unknown>): Promise<string> {
  const logsDir = path.join(process.cwd(), 'logs');
  await fs.mkdir(logsDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filePath = path.join(logsDir, `cloudinary-migration-${stamp}.json`);
  await fs.writeFile(
    filePath,
    JSON.stringify({ summary, logs }, null, 2),
    'utf8',
  );
  return filePath;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log('══════════════════════════════════════════════════════════════');
  console.log(' TechVistar Cloudinary asset migration');
  console.log(` Legacy cloud : ${LEGACY_CLOUD}`);
  console.log(` Target cloud : ${TARGET_CLOUD}`);
  console.log(` Mode         : ${VERIFY_ONLY ? 'verify-only' : DRY_RUN ? 'dry-run' : 'live'}`);
  console.log('══════════════════════════════════════════════════════════════\n');

  await mongoose.connect(env.mongoUri);

  const stats: MigrationStats = {
    scanned: 0,
    migrated: 0,
    skipped: 0,
    failed: 0,
    mongoUpdated: 0,
  };

  if (!VERIFY_ONLY) {
    await migratePagesCmsConfig(stats);
    await migrateServices(stats);
    await migrateProjects(stats);
    await migrateOffices(stats);
    await migrateJobApplications(stats);
    await migrateJobs(stats);
  }

  console.log('\n── Verification ──\n');
  const verification = await verifyMigration();

  const summary = {
    legacyCloud: LEGACY_CLOUD,
    targetCloud: TARGET_CLOUD,
    dryRun: DRY_RUN,
    verifyOnly: VERIFY_ONLY,
    stats,
    verification: {
      legacyUrlCount: verification.legacyUrls.length,
      legacyUrls: verification.legacyUrls,
      invalidPublicIdCount: verification.invalidPublicIds.length,
      invalidPublicIds: verification.invalidPublicIds,
    },
  };

  const logPath = await writeLogFile(summary);

  console.log('\n══════════════════════════════════════════════════════════════');
  console.log(' Migration summary');
  console.log(`  Scanned fields : ${stats.scanned}`);
  console.log(`  Migrated       : ${stats.migrated}`);
  console.log(`  Skipped        : ${stats.skipped}`);
  console.log(`  Failed         : ${stats.failed}`);
  console.log(`  Mongo updated  : ${stats.mongoUpdated}${DRY_RUN ? ' (dry-run — none written)' : ''}`);
  console.log(`  Legacy URLs left : ${verification.legacyUrls.length}`);
  console.log(`  Invalid public_ids : ${verification.invalidPublicIds.length}`);
  console.log(`  Log file       : ${logPath}`);
  console.log('══════════════════════════════════════════════════════════════\n');

  await mongoose.disconnect();

  if (verification.legacyUrls.length > 0 || verification.invalidPublicIds.length > 0) {
    process.exitCode = 1;
  }
  if (stats.failed > 0) {
    process.exitCode = 1;
  }
}

main().catch(async (err) => {
  console.error('[FATAL]', err);
  try {
    await mongoose.disconnect();
  } catch {
    // ignore
  }
  process.exit(1);
});
