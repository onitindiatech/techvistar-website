/**
 * @file src/models/FAQ.ts
 * @description Mongoose model schema for FAQ CMS.
 *
 * Fields mirror the static FAQ interface currently used on the frontend
 * plus admin/CMS lifecycle fields (status, displayOrder, seoTitle, seoDescription).
 */

import mongoose, { Schema } from 'mongoose';
import { BaseDocument } from '@/types/common';

export type FAQCategory =
  | 'General'
  | 'Services'
  | 'Work'
  | 'Careers'
  | 'Contact'
  | 'AI'
  | 'Backend'
  | 'Frontend';

export type FAQPage =
  | 'home'
  | 'services'
  | 'work'
  | 'careers'
  | 'contact'
  | 'all';

export interface IFAQ extends BaseDocument {
  /** Unique human-readable identifier (mirrors the static `id` field) */
  faqId: string;
  question: string;
  answer: string;
  category: FAQCategory;
  /** Controls which page section this FAQ appears in */
  page: FAQPage;
  tags: string[];
  featured: boolean;
  /** Controls visibility on the public site */
  status: 'active' | 'inactive';
  displayOrder: number;
  seoTitle?: string;
  seoDescription?: string;

  // Audit and Soft Delete
  isDeleted?: boolean;
  deletedAt?: Date | null;
  deletedBy?: string;
  createdBy?: string;
  updatedBy?: string;
}

const faqSchema = new Schema<IFAQ>(
  {
    faqId: {
      type: String,
      required: [true, 'FAQ ID is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    question: {
      type: String,
      required: [true, 'Question is required'],
      trim: true,
    },
    answer: {
      type: String,
      required: [true, 'Answer is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['General', 'Services', 'Work', 'Careers', 'Contact', 'AI', 'Backend', 'Frontend'],
      required: [true, 'Category is required'],
    },
    page: {
      type: String,
      enum: ['home', 'services', 'work', 'careers', 'contact', 'all'],
      required: [true, 'Page context is required'],
    },
    tags: {
      type: [String],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    displayOrder: {
      type: Number,
      default: 0,
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

// Indexes for public query: filter by status + sort by displayOrder
faqSchema.index({ status: 1, displayOrder: 1 });
faqSchema.index({ category: 1, status: 1 });

export const FAQModel = mongoose.model<IFAQ>('FAQ', faqSchema);
