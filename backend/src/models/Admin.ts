/**
 * @file src/models/Admin.ts
 * @description Mongoose schema and model for administrator accounts.
 */

import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { BaseDocument } from '@/types/common';

export interface IAdmin extends BaseDocument {
  name: string;
  email: string;
  password: string;
  role: 'admin';
  refreshTokenHash?: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
  setRefreshToken(token: string): Promise<void>;
  clearRefreshToken(): void;
}

const adminSchema = new Schema<IAdmin>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      unique: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false,
    },
    role: {
      type: String,
      enum: ['admin'],
      default: 'admin',
    },
    refreshTokenHash: {
      type: String,
      default: undefined,
    },
  },
  {
    timestamps: true,
  }
);

adminSchema.pre('save', async function (this: IAdmin & mongoose.Document) {
  if (!this.isModified('password')) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 12);
});

adminSchema.methods.comparePassword = async function (this: IAdmin, candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

adminSchema.methods.setRefreshToken = async function (this: IAdmin, token: string): Promise<void> {
  this.refreshTokenHash = await bcrypt.hash(token, 12);
};

adminSchema.methods.clearRefreshToken = function (this: IAdmin): void {
  this.refreshTokenHash = undefined;
};

export const Admin = mongoose.model<IAdmin>('Admin', adminSchema);
