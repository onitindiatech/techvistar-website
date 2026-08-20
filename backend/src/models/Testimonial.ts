import mongoose, { Schema } from 'mongoose';
import { BaseDocument } from '@/types/common';

export interface ITestimonial extends BaseDocument {
  clientName: string;
  designation: string;
  company: string;
  profileImage: string;
  testimonialText: string;
  rating: number;
  status: 'Published' | 'Draft';
  displayOrder: number;
}

const testimonialSchema = new Schema<ITestimonial>(
  {
    clientName: { type: String, required: true, trim: true },
    designation: { type: String, trim: true, default: '' },
    company: { type: String, trim: true, default: '' },
    profileImage: { type: String, trim: true, default: '' },
    testimonialText: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5, default: 5 },
    status: { type: String, enum: ['Published', 'Draft'], default: 'Published' },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

testimonialSchema.index({ status: 1, displayOrder: 1 });

export const TestimonialModel = mongoose.model<ITestimonial>('Testimonial', testimonialSchema);
