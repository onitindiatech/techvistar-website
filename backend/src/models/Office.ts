import mongoose, { Schema } from 'mongoose';
import { BaseDocument } from '@/types/common';

export interface IOffice extends BaseDocument {
  officeId: string;
  name: string;
  badge: string;
  address: string;
  city: string;
  country: string;
  googleMapsUrl: string;
  image: string;
  imagePublicId?: string;
  imageAlt?: string;
  displayOrder: number;
  isActive: boolean;
  
  isDeleted?: boolean;
  deletedAt?: Date | null;
  deletedBy?: string;
  createdBy?: string;
  updatedBy?: string;
}

const officeSchema = new Schema<IOffice>(
  {
    officeId: {
      type: String,
      required: [true, 'Office ID is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    badge: {
      type: String,
      required: [true, 'Badge is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
    },
    googleMapsUrl: {
      type: String,
      required: [true, 'Google Maps URL is required'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true,
    },
    imagePublicId: {
      type: String,
      trim: true,
    },
    imageAlt: {
      type: String,
      trim: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
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
    },
    createdBy: {
      type: String,
    },
    updatedBy: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Office = mongoose.model<IOffice>('Office', officeSchema);
