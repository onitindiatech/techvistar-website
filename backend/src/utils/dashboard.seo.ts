import type { Model } from 'mongoose';
import type { IPagesCmsConfig } from '@/models/PagesCmsConfig';
import { FAQModel } from '@/models/FAQ';
import { Service } from '@/models/Service';
import { Solution } from '@/models/Solution';
import { Industry } from '@/models/Industry';
import { ProjectModel } from '@/models/Project';
import { Job } from '@/models/Job';

export type SeoAnalytics = {
  totalPages: number;
  configuredPages: number;
  missingSeo: number;
  averageScore: number;
  missingMetaDescriptions: number;
  missingTitles: number;
  missingOgImage: number;
  missingCanonical: number;
  missingSchema: number;
  missingRobotsConfig: number;
  progress: Array<{ label: string; value: number; total: number }>;
};

const SEO_MATCH = { isDeleted: { $ne: true } };

function hasText(field: string) {
  return { $gt: [{ $strLenCP: { $ifNull: [field, ''] } }, 0] };
}

async function aggregateSeoForModel(model: Model<unknown>, isFaq = false) {
  const literalFalse = { $literal: false };
  const literalTrue = { $literal: true };

  const [row] = await model.aggregate([
    { $match: SEO_MATCH },
    {
      $project: {
        hasTitle: hasText('$seoTitle'),
        hasDescription: hasText('$seoDescription'),
        hasCanonical: isFaq ? literalFalse : hasText('$canonicalUrl'),
        hasOgImage: isFaq ? literalFalse : hasText('$ogImage'),
        hasOgTitle: isFaq ? literalFalse : hasText('$ogTitle'),
        hasRobots: isFaq
          ? literalTrue
          : { $and: [{ $ne: ['$robotsIndex', null] }, { $ne: ['$robotsFollow', null] }] },
        score: isFaq
          ? {
              $add: [
                { $cond: [hasText('$seoTitle'), 50, 0] },
                { $cond: [hasText('$seoDescription'), 50, 0] },
              ],
            }
          : {
              $add: [
                { $cond: [hasText('$seoTitle'), 20, 0] },
                { $cond: [hasText('$seoDescription'), 20, 0] },
                { $cond: [hasText('$canonicalUrl'), 15, 0] },
                { $cond: [hasText('$ogImage'), 15, 0] },
                { $cond: [hasText('$ogTitle'), 10, 0] },
                { $cond: [{ $and: [{ $ne: ['$robotsIndex', null] }, { $ne: ['$robotsFollow', null] }] }, 10, 0] },
                { $cond: [hasText('$twitterImage'), 10, 0] },
              ],
            },
        configured: {
          $and: [hasText('$seoTitle'), hasText('$seoDescription')],
        },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        configured: { $sum: { $cond: ['$configured', 1, 0] } },
        missingTitles: { $sum: { $cond: ['$hasTitle', 0, 1] } },
        missingMetaDescriptions: { $sum: { $cond: ['$hasDescription', 0, 1] } },
        missingCanonical: { $sum: { $cond: ['$hasCanonical', 0, 1] } },
        missingOgImage: { $sum: { $cond: ['$hasOgImage', 0, 1] } },
        missingSchema: { $sum: { $cond: ['$hasOgTitle', 0, 1] } },
        missingRobotsConfig: { $sum: { $cond: ['$hasRobots', 0, 1] } },
        scoreSum: { $sum: '$score' },
      },
    },
  ]);

  return {
    total: Number(row?.total ?? 0),
    configured: Number(row?.configured ?? 0),
    missingTitles: Number(row?.missingTitles ?? 0),
    missingMetaDescriptions: Number(row?.missingMetaDescriptions ?? 0),
    missingCanonical: Number(row?.missingCanonical ?? 0),
    missingOgImage: Number(row?.missingOgImage ?? 0),
    missingSchema: Number(row?.missingSchema ?? 0),
    missingRobotsConfig: Number(row?.missingRobotsConfig ?? 0),
    scoreSum: Number(row?.scoreSum ?? 0),
  };
}

function scorePageSeo(seo?: {
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogTitle?: string;
  robotsIndex?: boolean;
  robotsFollow?: boolean;
  twitterImage?: string;
}): { score: number; configured: boolean; missing: Record<string, boolean> } {
  const title = seo?.seoTitle?.trim() ?? '';
  const description = seo?.seoDescription?.trim() ?? '';
  const canonical = seo?.canonicalUrl?.trim() ?? '';
  const ogImage = seo?.ogImage?.trim() ?? '';
  const ogTitle = seo?.ogTitle?.trim() ?? '';
  const twitterImage = seo?.twitterImage?.trim() ?? '';
  const robotsOk = seo?.robotsIndex !== undefined && seo?.robotsFollow !== undefined;

  const score =
    (title ? 20 : 0) +
    (description ? 20 : 0) +
    (canonical ? 15 : 0) +
    (ogImage ? 15 : 0) +
    (ogTitle ? 10 : 0) +
    (robotsOk ? 10 : 0) +
    (twitterImage ? 10 : 0);

  return {
    score,
    configured: Boolean(title && description),
    missing: {
      title: !title,
      description: !description,
      canonical: !canonical,
      ogImage: !ogImage,
      schema: !ogTitle,
      robots: !robotsOk,
    },
  };
}

function aggregatePagesCmsSeo(pagesDoc: IPagesCmsConfig | null) {
  if (!pagesDoc) {
    return {
      total: 0,
      configured: 0,
      missingTitles: 0,
      missingMetaDescriptions: 0,
      missingCanonical: 0,
      missingOgImage: 0,
      missingSchema: 0,
      missingRobotsConfig: 0,
      scoreSum: 0,
    };
  }

  const pageBlocks = [
    pagesDoc.home?.seo,
    pagesDoc.about,
    pagesDoc.contact,
    pagesDoc.solutionsLanding,
    pagesDoc.industriesLanding,
    pagesDoc.portfolioLanding,
    pagesDoc.careers,
    pagesDoc.websiteSettings?.seoDefaults
      ? {
          seoTitle: String((pagesDoc.websiteSettings as Record<string, any>).seoDefaults?.siteTitle ?? ''),
          seoDescription: String((pagesDoc.websiteSettings as Record<string, any>).seoDefaults?.metaDescription ?? ''),
          canonicalUrl: String((pagesDoc.websiteSettings as Record<string, any>).seoDefaults?.canonicalUrl ?? ''),
          ogImage: String((pagesDoc.websiteSettings as Record<string, any>).seoDefaults?.defaultOgImage ?? ''),
          ogTitle: String((pagesDoc.websiteSettings as Record<string, any>).seoDefaults?.siteTitle ?? ''),
          robotsIndex: Boolean((pagesDoc.websiteSettings as Record<string, any>).seoDefaults?.robotsIndex),
          robotsFollow: true,
        }
      : undefined,
  ].filter(Boolean);

  let total = 0;
  let configured = 0;
  let scoreSum = 0;
  let missingTitles = 0;
  let missingMetaDescriptions = 0;
  let missingCanonical = 0;
  let missingOgImage = 0;
  let missingSchema = 0;
  let missingRobotsConfig = 0;

  for (const block of pageBlocks) {
    const result = scorePageSeo(block as Parameters<typeof scorePageSeo>[0]);
    total += 1;
    if (result.configured) configured += 1;
    scoreSum += result.score;
    if (result.missing.title) missingTitles += 1;
    if (result.missing.description) missingMetaDescriptions += 1;
    if (result.missing.canonical) missingCanonical += 1;
    if (result.missing.ogImage) missingOgImage += 1;
    if (result.missing.schema) missingSchema += 1;
    if (result.missing.robots) missingRobotsConfig += 1;
  }

  return {
    total,
    configured,
    missingTitles,
    missingMetaDescriptions,
    missingCanonical,
    missingOgImage,
    missingSchema,
    missingRobotsConfig,
    scoreSum,
  };
}

export async function getSeoAnalytics(pagesDoc: IPagesCmsConfig | null): Promise<SeoAnalytics> {
  const [services, solutions, industries, projects, jobs, faqs, pages] = await Promise.all([
    aggregateSeoForModel(Service),
    aggregateSeoForModel(Solution),
    aggregateSeoForModel(Industry),
    aggregateSeoForModel(ProjectModel),
    aggregateSeoForModel(Job),
    aggregateSeoForModel(FAQModel, true),
    Promise.resolve(aggregatePagesCmsSeo(pagesDoc)),
  ]);

  const buckets = [services, solutions, industries, projects, jobs, faqs, pages];
  const totalPages = buckets.reduce((sum, bucket) => sum + bucket.total, 0);
  const configuredPages = buckets.reduce((sum, bucket) => sum + bucket.configured, 0);
  const scoreSum = buckets.reduce((sum, bucket) => sum + bucket.scoreSum, 0);

  const missingTitles = buckets.reduce((sum, bucket) => sum + bucket.missingTitles, 0);
  const missingMetaDescriptions = buckets.reduce((sum, bucket) => sum + bucket.missingMetaDescriptions, 0);
  const missingCanonical = buckets.reduce((sum, bucket) => sum + bucket.missingCanonical, 0);
  const missingOgImage = buckets.reduce((sum, bucket) => sum + bucket.missingOgImage, 0);
  const missingSchema = buckets.reduce((sum, bucket) => sum + bucket.missingSchema, 0);
  const missingRobotsConfig = buckets.reduce((sum, bucket) => sum + bucket.missingRobotsConfig, 0);

  return {
    totalPages,
    configuredPages,
    missingSeo: Math.max(0, totalPages - configuredPages),
    averageScore: totalPages > 0 ? Math.round(scoreSum / totalPages) : 0,
    missingMetaDescriptions,
    missingTitles,
    missingOgImage,
    missingCanonical,
    missingSchema,
    missingRobotsConfig,
    progress: [
      { label: 'SEO titles', value: totalPages - missingTitles, total: totalPages },
      { label: 'Meta descriptions', value: totalPages - missingMetaDescriptions, total: totalPages },
      { label: 'OG images', value: totalPages - missingOgImage, total: totalPages },
      { label: 'Canonical URLs', value: totalPages - missingCanonical, total: totalPages },
      { label: 'Schema / OG titles', value: totalPages - missingSchema, total: totalPages },
      { label: 'Robots config', value: totalPages - missingRobotsConfig, total: totalPages },
    ],
  };
}
