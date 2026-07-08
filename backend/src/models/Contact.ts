/**
 * @file src/models/Contact.ts
 * @description Mongoose schema and model for Contact form submissions.
 */

import mongoose, { Schema } from 'mongoose';
import { BaseDocument } from '@/types/common';
import { VALIDATION } from '@/constants';

export type ContactStatus = 'new' | 'in-progress' | 'resolved' | 'archived';

export interface IContact extends BaseDocument {
  name: string;
  email: string;
  phone: string;
  company?: string;
  serviceInterested: string;
  budget?: string;
  message: string;
  status: ContactStatus;
  isDeleted?: boolean;
  deletedAt?: Date | null;
  deletedBy?: string;
  updatedBy?: string;
}

const contactSchema = new Schema<IContact>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [VALIDATION.LIMITS.NAME_MAX, `Name cannot exceed ${VALIDATION.LIMITS.NAME_MAX} characters`],
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
      maxlength: [VALIDATION.LIMITS.PHONE_MAX, `Phone number cannot exceed ${VALIDATION.LIMITS.PHONE_MAX} characters`],
    },
    company: {
      type: String,
      trim: true,
      default: '',
      maxlength: [VALIDATION.LIMITS.COMPANY_MAX, `Company name cannot exceed ${VALIDATION.LIMITS.COMPANY_MAX} characters`],
    },
    serviceInterested: {
      type: String,
      required: [true, 'Service of interest is required'],
      trim: true,
      maxlength: [120, 'Service of interest cannot exceed 120 characters'],
    },
    budget: {
      type: String,
      trim: true,
      default: '',
      maxlength: [VALIDATION.LIMITS.BUDGET_MAX, `Budget info cannot exceed ${VALIDATION.LIMITS.BUDGET_MAX} characters`],
    },
    message: {
      type: String,
      required: [true, 'Message content is required'],
      trim: true,
      minlength: [10, 'Message must be at least 10 characters long'],
      maxlength: [VALIDATION.LIMITS.MESSAGE_MAX, `Message cannot exceed ${VALIDATION.LIMITS.MESSAGE_MAX} characters`],
    },
    status: {
      type: String,
      enum: ['new', 'in-progress', 'resolved', 'archived'],
      default: 'new',
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

contactSchema.index({ status: 1 });
contactSchema.index({ createdAt: -1 });
contactSchema.index({ isDeleted: 1, status: 1 });

export const Contact = mongoose.model<IContact>('Contact', contactSchema);
