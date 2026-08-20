import mongoose, { Schema } from 'mongoose';
import { BaseDocument } from '@/types/common';

export interface IBlogPost extends BaseDocument {
  title: string;
  slug: string;
  author: string;
  category: string;
  content: string;
  featuredImage: string;
  status: 'Published' | 'Draft';
  publicationDate: Date;
}

const blogPostSchema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, unique: true },
    author: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    featuredImage: { type: String, trim: true, default: '' },
    status: { type: String, enum: ['Published', 'Draft'], default: 'Draft' },
    publicationDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

blogPostSchema.index({ status: 1, publicationDate: -1 });

export const BlogPostModel = mongoose.model<IBlogPost>('BlogPost', blogPostSchema);
