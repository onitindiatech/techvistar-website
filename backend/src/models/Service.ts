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

export interface IServiceFaq {
  question: string;
  answer: string;
}

export interface IServiceCtaBlock {
  badge: string;
  headline: string;
  body: string;
  primaryButtonLabel: string;
  secondaryButtonLabel: string;
  secondaryButtonHref: string;
}

export interface IServiceSidebarBlock {
  summaryTitle: string;
  responseTimeTitle: string;
  responseTime: string;
  businessHoursTitle: string;
  businessHours: string;
  secureTitle: string;
  secureDescription: string;
  buttonLabel: string;
  directInquiriesTitle: string;
  directInquiriesBody: string;
  contactEmail: string;
}

export interface IServiceConsultationBlock {
  title: string;
  description: string;
  submitLabel: string;
  privacyText: string;
  successTitle: string;
  successMessage: string;
}

export interface IService extends BaseDocument {
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string; // maps to longDescription
  icon: string;
  coverImage?: string;
  coverImagePublicId?: string;
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
  thumbnailPublicId?: string;
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
  dashboardImagePublicId?: string;
  faqs: IServiceFaq[];
  relatedServiceSlugs: string[];
  relatedIndustrySlugs: string[];
  heroBadge?: string;
  heroTagline?: string;
  ctaBlock?: IServiceCtaBlock;
  sidebar?: IServiceSidebarBlock;
  consultationForm?: IServiceConsultationBlock;
  isDeleted?: boolean;
  deletedAt?: Date | null;
  deletedBy?: string;
  createdBy?: string;
  updatedBy?: string;
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
    dashboardImagePublicId: {
      type: String,
      trim: true,
      default: '',
    },
    faqs: [
      {
        question: { type: String, required: true, trim: true },
        answer: { type: String, required: true, trim: true },
      },
    ],
    relatedServiceSlugs: {
      type: [String],
      default: [],
    },
    relatedIndustrySlugs: {
      type: [String],
      default: [],
    },
    heroBadge: {
      type: String,
      trim: true,
      default: '',
    },
    heroTagline: {
      type: String,
      trim: true,
      default: '',
    },
    ctaBlock: {
      badge: { type: String, trim: true, default: "Let's collaborate" },
      headline: { type: String, trim: true, default: 'Ready to build your next digital product?' },
      body: { type: String, trim: true, default: '' },
      primaryButtonLabel: { type: String, trim: true, default: 'Book Free Consultation' },
      secondaryButtonLabel: { type: String, trim: true, default: 'Talk to an Expert' },
      secondaryButtonHref: {
        type: String,
        trim: true,
        default: 'mailto:architect@techvistar.com?subject=Consultation%20Escalation',
      },
    },
    sidebar: {
      summaryTitle: { type: String, trim: true, default: '' },
      responseTimeTitle: { type: String, trim: true, default: '' },
      responseTime: { type: String, trim: true, default: '' },
      businessHoursTitle: { type: String, trim: true, default: '' },
      businessHours: { type: String, trim: true, default: '' },
      secureTitle: { type: String, trim: true, default: '' },
      secureDescription: { type: String, trim: true, default: '' },
      buttonLabel: { type: String, trim: true, default: '' },
      directInquiriesTitle: { type: String, trim: true, default: '' },
      directInquiriesBody: { type: String, trim: true, default: '' },
      contactEmail: { type: String, trim: true, default: '' },
    },
    consultationForm: {
      title: { type: String, trim: true, default: '' },
      description: { type: String, trim: true, default: '' },
      submitLabel: { type: String, trim: true, default: '' },
      privacyText: { type: String, trim: true, default: '' },
      successTitle: { type: String, trim: true, default: '' },
      successMessage: { type: String, trim: true, default: '' },
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
