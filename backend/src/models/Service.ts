/**
 * @file src/models/Service.ts
 * @description Rich Mongoose schema and model for Services CMS.
 */

import mongoose, { Schema } from 'mongoose';
import { BaseDocument } from '@/types/common';

export interface IServiceStep {
  step: number;
  title: string;
  description: string;
}

export interface IServiceCaseStudy {
  title: string;
  description: string;
  link?: string;
}

export interface IServiceWhyChooseUs {
  title: string;
  description: string;
}

export interface IServiceStat {
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

export interface IService extends BaseDocument {
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string; // maps to longDescription
  icon: string;
  coverImage?: string;
  features: string[];
  technologies: string[];
  benefits: string[];
  displayOrder: number; // maps to order
  status: 'draft' | 'active';
  seoTitle?: string;
  seoDescription?: string;

  // Rich CMS fields
  category: string;
  thumbnail: string;
  overview: string;
  offerings: string[];
  process: IServiceStep[];
  caseStudies: IServiceCaseStudy[];
  cta: string;
  featured: boolean;
  industries: string[];
  whyChooseUs: IServiceWhyChooseUs[];
  stats: IServiceStat[];
  detailedOfferings: IDetailedOffering[];
  dashboardImage?: string;
}

const serviceSchema = new Schema<IService>(
  {
    title: {
      type: String,
      required: [true, 'Service title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Service slug is required'],
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
    seoTitle: {
      type: String,
      trim: true,
      default: '',
    },
    seoDescription: {
      type: String,
      trim: true,
      default: '',
    },

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
    overview: {
      type: String,
      required: [true, 'Overview is required'],
      trim: true,
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
        description: { type: String, required: true, trim: true },
        link: { type: String, trim: true },
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
        color: { type: String, required: true, trim: true },
        iconName: { type: String, required: true, trim: true },
      },
    ],
    dashboardImage: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Slug auto-generation fallback logic
serviceSchema.pre('validate', function (this: any) {
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
serviceSchema.index({ status: 1, displayOrder: 1 });

export const Service = mongoose.model<IService>('Service', serviceSchema);
