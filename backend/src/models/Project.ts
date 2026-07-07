/**
 * @file src/models/Project.ts
 * @description Mongoose model schema for Portfolio Projects.
 */

import mongoose, { Schema } from 'mongoose';
import { BaseDocument } from '@/types/common';

export interface IProject extends BaseDocument {
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
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
  tags: string[];
  status: 'Completed' | 'In Progress' | 'Coming Soon';
  serviceSlugs: string[];
  industry: string;
  updatedDate: string;
  displayOrder: number;
  seoTitle?: string;
  seoDescription?: string;
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
    seoTitle: {
      type: String,
      trim: true,
    },
    seoDescription: {
      type: String,
      trim: true,
    },
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
