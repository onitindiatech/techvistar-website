import mongoose, { Schema } from 'mongoose';
import { BaseDocument } from '@/types/common';

export interface ITeamMember extends BaseDocument {
  name: string;
  role: string;
  profileImage: string;
  bio: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
  status: 'Active' | 'Inactive';
  displayOrder: number;
}

const teamMemberSchema = new Schema<ITeamMember>(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    profileImage: { type: String, trim: true, default: '' },
    bio: { type: String, trim: true, default: '' },
    socialLinks: {
      linkedin: { type: String, trim: true, default: '' },
      twitter: { type: String, trim: true, default: '' },
      github: { type: String, trim: true, default: '' },
    },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

teamMemberSchema.index({ status: 1, displayOrder: 1 });

export const TeamMemberModel = mongoose.model<ITeamMember>('TeamMember', teamMemberSchema);
