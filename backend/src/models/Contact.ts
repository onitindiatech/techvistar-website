/**
 * @file src/models/Contact.ts
 * @description Mongoose schema and model for Contact form submissions.
 *
 * ARCHITECTURE DECISION:
 *   This model represents the contact inquiries collection in MongoDB.
 *   We enforce structured validations (email format, enum constraints)
 *   and enable timestamps for auditing.
 */

import mongoose, { Schema } from 'mongoose';
import { BaseDocument } from '@/types/common';

export interface IContact extends BaseDocument {
  name: string;
  email: string;
  phone: string;
  company?: string;
  serviceInterested: 'web-development' | 'mobile-development' | 'ui-ux' | 'consulting' | 'other';
  budget?: string;
  message: string;
  status: 'new' | 'in-progress' | 'resolved' | 'archived';
}

const contactSchema = new Schema<IContact>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    company: {
      type: String,
      trim: true,
      default: '',
    },
    serviceInterested: {
      type: String,
      required: [true, 'Service of interest is required'],
      enum: {
        values: ['web-development', 'mobile-development', 'ui-ux', 'consulting', 'other'],
        message: '{VALUE} is not a supported service type',
      },
    },
    budget: {
      type: String,
      trim: true,
      default: '',
    },
    message: {
      type: String,
      required: [true, 'Message content is required'],
      trim: true,
      minlength: [10, 'Message must be at least 10 characters long'],
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },
    status: {
      type: String,
      enum: ['new', 'in-progress', 'resolved', 'archived'],
      default: 'new',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for administrative querying/filtering later
contactSchema.index({ status: 1 });
contactSchema.index({ createdAt: -1 });

export const Contact = mongoose.model<IContact>('Contact', contactSchema);
