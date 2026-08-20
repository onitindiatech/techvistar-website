import mongoose, { Schema } from 'mongoose';
import { BaseDocument } from '@/types/common';

export interface IMedia extends BaseDocument {
  filename: string;
  url: string;
  mimeType: string;
  size: number;
}

const mediaSchema = new Schema<IMedia>(
  {
    filename: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    mimeType: { type: String, required: true, trim: true },
    size: { type: Number, required: true },
  },
  { timestamps: true }
);

export const MediaModel = mongoose.model<IMedia>('Media', mediaSchema);
