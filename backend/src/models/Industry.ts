/**
 * @file src/models/Industry.ts
 * @description Rich Mongoose schema and model for Industries CMS.
 */

import mongoose, { Schema } from 'mongoose';
import { BaseDocument } from '@/types/common';
import { ISeoFields, seoMongooseFields } from '@/utils/seoFields';

export interface IIndustryStep {
  step: number;
  title: string;
  description: string;
}

export interface IIndustryCaseStudy {
  title: string;
  description: string;
  link?: string;
  slug?: string;
}

export interface IIndustryFaq {
  question: string;
  answer: string;
}

export interface IIndustryWhyChooseUs {
  title: string;
  description: string;
}

export interface IIndustryStat {
  value: string;
  label: string;
  iconType: string;
  colorTheme: string;
}

export interface IDetailedOffering {
  title: string;
  description: string;
  badges: string[];
  color: string;
  iconName: string;
}

export interface IIndustry extends BaseDocument, ISeoFields {
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  icon: string;
  coverImage?: string;
  coverImagePublicId?: string;
  features: string[];
  technologies: string[];
  benefits: string[];
  displayOrder: number;
  status: 'draft' | 'active';

  // Rich CMS fields
  category: string;
  thumbnail: string;
  thumbnailPublicId?: string;
  overview: string;
  overviewQuote?: string;
  offerings: string[];
  process: IIndustryStep[];
  caseStudies: IIndustryCaseStudy[];
  cta: string;
  featured: boolean;
  industries: string[];
  whyChooseUs: IIndustryWhyChooseUs[];
  stats: IIndustryStat[];
  detailedOfferings: IDetailedOffering[];
  dashboardImage?: string;
  dashboardImagePublicId?: string;
  faqs: IIndustryFaq[];

  // Audit and Soft Delete
  isDeleted?: boolean;
  deletedAt?: Date | null;
  deletedBy?: string;
  createdBy?: string;
  updatedBy?: string;
}

const industrySchema = new Schema<IIndustry>(
  {
    title: {
      type: String,
      required: [true, 'Industry title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Industry slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      trim: true,
    },
    fullDescription: {
      type: String,
      required: [true, 'Full description is required'],
      trim: true,
    },
    icon: {
      type: String,
      required: [true, 'Icon identifier is required'],
      trim: true,
    },
    coverImage: {
      type: String,
      trim: true,
      default: '',
    },
    coverImagePublicId: {
      type: String,
      trim: true,
      default: '',
    },
    features: {
      type: [String],
      default: [],
    },
    technologies: {
      type: [String],
      default: [],
    },
    benefits: {
      type: [String],
      default: [],
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['draft', 'active'],
      default: 'draft',
    },
    ...seoMongooseFields,

    // Rich CMS Fields
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    thumbnail: {
      type: String,
      trim: true,
      default: '',
    },
    thumbnailPublicId: {
      type: String,
      trim: true,
      default: '',
    },
    overview: {
      type: String,
      required: [true, 'Overview is required'],
      trim: true,
    },
    overviewQuote: {
      type: String,
      trim: true,
      default: '',
      maxlength: [500, 'Overview quote cannot exceed 500 characters'],
    },
    offerings: {
      type: [String],
      default: [],
    },
    process: [
      {
        step: { type: Number, required: true },
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
      },
    ],
    caseStudies: [
      {
        title: { type: String, required: true, trim: true },
        description: { type: String, trim: true, default: '' },
        link: { type: String, trim: true, default: '' },
        slug: { type: String, trim: true, default: '' },
      },
    ],
    faqs: [
      {
        question: { type: String, required: true, trim: true },
        answer: { type: String, required: true, trim: true },
      },
    ],
    cta: {
      type: String,
      trim: true,
      default: '',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    industries: {
      type: [String],
      default: [],
    },
    whyChooseUs: [
      {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
      },
    ],
    stats: [
      {
        value: { type: String, required: true, trim: true },
        label: { type: String, required: true, trim: true },
        iconType: { type: String, required: true, trim: true },
        colorTheme: { type: String, required: true, trim: true },
      },
    ],
    detailedOfferings: [
      {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        badges: { type: [String], default: [] },
        color: { type: String, trim: true, default: 'emerald' },
        iconName: { type: String, trim: true, default: 'Check' },
      },
    ],
    dashboardImage: {
      type: String,
      trim: true,
      default: '',
    },
    dashboardImagePublicId: {
      type: String,
      trim: true,
      default: '',
    },
    // Soft Delete & Audit Fields
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    deletedBy: {
      type: String,
      default: '',
    },
    createdBy: {
      type: String,
      default: '',
    },
    updatedBy: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Slug auto-generation fallback logic
industrySchema.pre('validate', function (this: any) {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
});

// Indexes for sorting/filtering performance
industrySchema.index({ status: 1, displayOrder: 1 });

export const Industry = mongoose.model<IIndustry>('Industry', industrySchema);
