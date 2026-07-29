/**
 * @file src/models/Project.ts
 * @description Mongoose model schema for Portfolio Projects.
 */

import mongoose, { Schema } from 'mongoose';
import { BaseDocument } from '@/types/common';
import { ISeoFields, seoMongooseFields } from '@/utils/seoFields';

export interface IProjectStat {
  value: string;
  label: string;
  iconType: string;
  colorTheme: string;
}

export interface IProjectDetailedFeature {
  title: string;
  description: string;
  iconName: string;
  badge?: string;
  color?: string;
}

export interface IProjectProcessStep {
  step: number;
  title: string;
  description: string;
}

export interface IProjectCtaBlock {
  badge?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
}

export interface IProject extends BaseDocument, ISeoFields {
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  thumbnailPublicId?: string;
  category: string;
  technologies: string[];
  liveUrl: string;
  githubUrl: string;
  featured: boolean;
  date: string;
  client: string;
  role: string;
  longDescription: string;
  keyFeatures: string[];
  challenges: string[];
  gallery: string[];
  galleryPublicIds?: string[];
  tags: string[];
  status: 'Completed' | 'In Progress' | 'Coming Soon';
  serviceSlugs: string[];
  industry: string;
  updatedDate: string;
  displayOrder: number;

  stats: IProjectStat[];
  detailedFeatures: IProjectDetailedFeature[];
  process: IProjectProcessStep[];
  ctaBlock?: IProjectCtaBlock;

  isDeleted?: boolean;
  deletedAt?: Date | null;
  deletedBy?: string;
  createdBy?: string;
  updatedBy?: string;
}

const projectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Project slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Short description is required'],
      trim: true,
    },
    thumbnail: {
      type: String,
      required: [true, 'Thumbnail is required'],
      trim: true,
    },
    thumbnailPublicId: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    technologies: {
      type: [String],
      default: [],
    },
    liveUrl: {
      type: String,
      default: '#',
      trim: true,
    },
    githubUrl: {
      type: String,
      default: '#',
      trim: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    date: {
      type: String,
      required: [true, 'Project date is required'],
      trim: true,
    },
    client: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Team role is required'],
      trim: true,
    },
    longDescription: {
      type: String,
      required: [true, 'Long description is required'],
      trim: true,
    },
    keyFeatures: {
      type: [String],
      default: [],
    },
    challenges: {
      type: [String],
      default: [],
    },
    gallery: {
      type: [String],
      default: [],
    },
    galleryPublicIds: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['Completed', 'In Progress', 'Coming Soon'],
      default: 'Completed',
    },
    serviceSlugs: {
      type: [String],
      default: [],
    },
    industry: {
      type: String,
      required: [true, 'Industry classification is required'],
      trim: true,
    },
    updatedDate: {
      type: String,
      required: [true, 'Updated date is required'],
      trim: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    stats: {
      type: [
        {
          value: { type: String, trim: true },
          label: { type: String, trim: true },
          iconType: { type: String, trim: true, default: 'chart' },
          colorTheme: { type: String, trim: true, default: 'green' },
        },
      ],
      default: [],
    },
    detailedFeatures: {
      type: [
        {
          title: { type: String, trim: true },
          description: { type: String, trim: true },
          iconName: { type: String, trim: true, default: 'Sparkles' },
          badge: { type: String, trim: true, default: '' },
          color: { type: String, trim: true, default: '' },
        },
      ],
      default: [],
    },
    process: {
      type: [
        {
          step: { type: Number },
          title: { type: String, trim: true },
          description: { type: String, trim: true },
        },
      ],
      default: [],
    },
    ctaBlock: {
      type: {
        badge: { type: String, trim: true, default: '' },
        title: { type: String, trim: true, default: '' },
        description: { type: String, trim: true, default: '' },
        buttonText: { type: String, trim: true, default: '' },
        buttonLink: { type: String, trim: true, default: '' },
        secondaryButtonText: { type: String, trim: true, default: '' },
        secondaryButtonLink: { type: String, trim: true, default: '' },
      },
      default: undefined,
    },
    ...seoMongooseFields,
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

// Auto slug generation hook
projectSchema.pre('validate', function (this: any) {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
});

// Indexes for query performance
projectSchema.index({ status: 1, displayOrder: 1 });

export const ProjectModel = mongoose.model<IProject>('Project', projectSchema);
