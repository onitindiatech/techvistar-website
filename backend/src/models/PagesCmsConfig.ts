/**
 * @file src/models/PagesCmsConfig.ts
 * @description Singleton CMS config for static pages (About, Careers listing) SEO.
 */

import mongoose, { Schema } from 'mongoose';
import { BaseDocument } from '@/types/common';
import { ISeoFields, seoMongooseFields } from '@/utils/seoFields';

export interface IPageSeoBlock extends ISeoFields {}

export interface IPagesCmsConfig extends BaseDocument {
  configKey: string;
  about: IPageSeoBlock;
  careers: IPageSeoBlock;
  updatedBy?: string;
}

const pageSeoBlockSchema = {
  ...seoMongooseFields,
};

const pagesCmsConfigSchema = new Schema<IPagesCmsConfig>(
  {
    configKey: { type: String, required: true, unique: true, default: 'global', trim: true },
    about: {
      ...pageSeoBlockSchema,
      seoTitle: { type: String, trim: true, default: 'About TechVistar | Technology-first growth partner' },
      seoDescription: {
        type: String,
        trim: true,
        default:
          'Learn about TechVistar — a Hyderabad-based technology-first growth partner delivering web systems, automation, applied AI, and accountable digital delivery.',
      },
      canonicalUrl: { type: String, trim: true, default: 'https://techvistar.com/about' },
    },
    careers: {
      ...pageSeoBlockSchema,
      seoTitle: { type: String, trim: true, default: 'Careers at TechVistar | Join our engineering team' },
      seoDescription: {
        type: String,
        trim: true,
        default:
          'Explore open roles at TechVistar. Join a collaborative team building web, AI, and automation products with structured scope and measurable outcomes.',
      },
      canonicalUrl: { type: String, trim: true, default: 'https://techvistar.com/careers' },
    },
    updatedBy: { type: String, default: '' },
  },
  { timestamps: true }
);

export const PagesCmsConfig = mongoose.model<IPagesCmsConfig>('PagesCmsConfig', pagesCmsConfigSchema);
