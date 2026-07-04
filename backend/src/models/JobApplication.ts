/**
 * @file src/models/JobApplication.ts
 * @description Mongoose schema and model for Job Applications.
 */

import mongoose, { Schema } from 'mongoose';
import { BaseDocument } from '@/types/common';
import { VALIDATION } from '@/constants';

export interface IJobApplication extends BaseDocument {
  jobId: mongoose.Types.ObjectId;
  fullName: string;
  email: string;
  phone: string;
  currentLocation: string;
  yearsOfExperience: number;
  linkedin?: string;
  portfolio?: string;
  resumeUrl: string;
  coverLetter: string;
  whyJoinTechVistar?: string;
  status: typeof VALIDATION.JOB_APPLICATION_STATUSES[number];
}

const jobApplicationSchema = new Schema<IJobApplication>(
  {
    jobId: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Job ID is required'],
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Full name must be at least 2 characters long'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [VALIDATION.EMAIL_REGEX, 'Please fill a valid email address'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [VALIDATION.PHONE_REGEX, 'Please enter a valid phone number'],
    },
    currentLocation: {
      type: String,
      required: [true, 'Current location is required'],
      trim: true,
    },
    yearsOfExperience: {
      type: Number,
      required: [true, 'Years of experience is required'],
      min: [0, 'Years of experience cannot be negative'],
    },
    linkedin: {
      type: String,
      trim: true,
      default: '',
    },
    portfolio: {
      type: String,
      trim: true,
      default: '',
    },
    resumeUrl: {
      type: String,
      required: [true, 'Resume URL is required'],
      trim: true,
    },
    coverLetter: {
      type: String,
      required: [true, 'Cover letter is required'],
      trim: true,
      minlength: [20, 'Cover letter must be at least 20 characters long'],
    },
    whyJoinTechVistar: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: VALIDATION.JOB_APPLICATION_STATUSES,
        message: '{VALUE} is not a valid status',
      },
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent candidate from applying twice for the same job listing
jobApplicationSchema.index({ email: 1, jobId: 1 }, { unique: true });
jobApplicationSchema.index({ jobId: 1 });
jobApplicationSchema.index({ status: 1 });
jobApplicationSchema.index({ createdAt: -1 });

export const JobApplication = mongoose.model<IJobApplication>('JobApplication', jobApplicationSchema);
