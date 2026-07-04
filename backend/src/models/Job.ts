/**
 * @file src/models/Job.ts
 * @description Mongoose schema and model for Career Job listings.
 */

import mongoose, { Schema } from 'mongoose';
import { BaseDocument } from '@/types/common';
import { VALIDATION } from '@/constants';

export interface IJob extends BaseDocument {
  title: string;
  slug: string;
  department: typeof VALIDATION.JOB_DEPARTMENTS[number];
  location: string;
  employmentType: typeof VALIDATION.JOB_EMPLOYMENT_TYPES[number];
  experience: string;
  salary: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  status: typeof VALIDATION.JOB_STATUSES[number];
  featured: boolean;
  applicationDeadline?: Date;
}

const jobSchema = new Schema<IJob>(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Job slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      enum: {
        values: VALIDATION.JOB_DEPARTMENTS,
        message: '{VALUE} is not a supported department',
      },
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Job location is required'],
      trim: true,
    },
    employmentType: {
      type: String,
      required: [true, 'Employment type is required'],
      enum: {
        values: VALIDATION.JOB_EMPLOYMENT_TYPES,
        message: '{VALUE} is not a supported employment type',
      },
    },
    experience: {
      type: String,
      required: [true, 'Experience requirement is required'],
      trim: true,
    },
    salary: {
      type: String,
      default: 'Competitive',
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
      trim: true,
    },
    requirements: {
      type: [String],
      default: [],
    },
    responsibilities: {
      type: [String],
      default: [],
    },
    benefits: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: VALIDATION.JOB_STATUSES,
      default: 'draft',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    applicationDeadline: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Slug auto-generation fallback logic
jobSchema.pre('validate', function (this: any, next: any) {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, '') // Remove non-alphanumeric chars (except dashes and spaces)
      .replace(/\s+/g, '-') // Replace spaces with dashes
      .replace(/-+/g, '-'); // Collapse double dashes
  }
  next();
});

// Indexes for performance optimization
jobSchema.index({ slug: 1 }, { unique: true });
jobSchema.index({ status: 1, featured: -1 });
jobSchema.index({ department: 1 });
jobSchema.index({ status: 1, createdAt: -1 });

export const Job = mongoose.model<IJob>('Job', jobSchema);
