/**
 * @file src/models/Newsletter.ts
 * @description Mongoose schema and model for Newsletter subscriptions.
 */

import mongoose, { Schema } from 'mongoose';
import { BaseDocument } from '@/types/common';
import { VALIDATION } from '@/constants';

export type NewsletterStatus = 'subscribed' | 'unsubscribed';

export interface INewsletter extends BaseDocument {
  email: string;
  status: NewsletterStatus;
  source: typeof VALIDATION.NEWSLETTER_SOURCES[number];
  isDeleted?: boolean;
  deletedAt?: Date | null;
  deletedBy?: string;
  updatedBy?: string;
}

const newsletterSchema = new Schema<INewsletter>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [VALIDATION.EMAIL_REGEX, 'Please fill a valid email address'],
    },
    status: {
      type: String,
      enum: ['subscribed', 'unsubscribed'],
      default: 'subscribed',
    },
    source: {
      type: String,
      enum: VALIDATION.NEWSLETTER_SOURCES,
      default: 'footer',
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
    updatedBy: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

newsletterSchema.index({ status: 1 });
newsletterSchema.index({ isDeleted: 1, status: 1 });
newsletterSchema.index({ source: 1 });

export const Newsletter = mongoose.model<INewsletter>('Newsletter', newsletterSchema);
