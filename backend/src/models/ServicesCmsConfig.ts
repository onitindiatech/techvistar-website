/**
 * @file src/models/ServicesCmsConfig.ts
 * @description Singleton-style CMS config for Services landing, homepage section, and global defaults.
 */

import mongoose, { Schema } from 'mongoose';
import { BaseDocument } from '@/types/common';
import { ISeoFields, seoMongooseFields } from '@/utils/seoFields';

export interface IServiceSidebarBlock {
  summaryTitle: string;
  responseTimeTitle: string;
  responseTime: string;
  businessHoursTitle: string;
  businessHours: string;
  secureTitle: string;
  secureDescription: string;
  buttonLabel: string;
  directInquiriesTitle: string;
  directInquiriesBody: string;
  contactEmail: string;
}

export interface IServiceConsultationBlock {
  title: string;
  description: string;
  submitLabel: string;
  privacyText: string;
  successTitle: string;
  successMessage: string;
}

export interface IServicesLandingConfig extends ISeoFields {
  title: string;
  subtitle: string;
  description: string;
  backgroundImage: string;
  backgroundImagePublicId?: string;
  offeringsLabel: string;
  learnMoreLabel: string;
  ctaText: string;
  categoryEyebrow: string;
  featuredEyebrow: string;
  featuredTitle: string;
  featuredDescription: string;
  catalogEyebrow: string;
  catalogTitle: string;
  catalogDescription: string;
}

export interface IHomeServicesSectionConfig {
  tag: string;
  title: string;
  highlight: string;
  description: string;
  viewAllTitle: string;
  viewAllLinkText: string;
}

export interface IServicesCmsConfig extends BaseDocument {
  configKey: string;
  landing: IServicesLandingConfig;
  homeSection: IHomeServicesSectionConfig;
  sidebarDefaults: IServiceSidebarBlock;
  consultationDefaults: IServiceConsultationBlock;
  updatedBy?: string;
}

const sidebarBlockSchema = {
  summaryTitle: { type: String, trim: true, default: 'Consultation Summary' },
  responseTimeTitle: { type: String, trim: true, default: 'Average Response Time' },
  responseTime: { type: String, trim: true, default: '< 4 Hours (Within Business Days)' },
  businessHoursTitle: { type: String, trim: true, default: 'Business Hours' },
  businessHours: { type: String, trim: true, default: 'Monday – Friday, 9:00 AM – 6:00 PM' },
  secureTitle: { type: String, trim: true, default: 'Secure Consultation' },
  secureDescription: { type: String, trim: true, default: 'All SOW outlines and documentation covered by NDA.' },
  buttonLabel: { type: String, trim: true, default: 'Book Free Session' },
  directInquiriesTitle: { type: String, trim: true, default: 'Direct Inquiries' },
  directInquiriesBody: {
    type: String,
    trim: true,
    default: 'Have an SOW ready or need instant escalation? Contact our lead architect directly at:',
  },
  contactEmail: { type: String, trim: true, default: 'architect@techvistar.com' },
};

const consultationBlockSchema = {
  title: { type: String, trim: true, default: 'Request Free Consultation' },
  description: {
    type: String,
    trim: true,
    default: 'Describe your requirements and obtain a custom SOW draft from our engineering leads.',
  },
  submitLabel: { type: String, trim: true, default: 'Submit Requirements' },
  privacyText: {
    type: String,
    trim: true,
    default: 'I agree to be contacted by the TechVistar engineering team and accept the privacy policy.',
  },
  successTitle: { type: String, trim: true, default: 'Inquiry Submitted' },
  successMessage: {
    type: String,
    trim: true,
    default: 'Thank you! We will get back to you in under 4 business hours regarding your project.',
  },
};

const servicesCmsConfigSchema = new Schema<IServicesCmsConfig>(
  {
    configKey: { type: String, required: true, unique: true, default: 'global', trim: true },
    landing: {
      title: { type: String, trim: true, default: 'Our Services' },
      subtitle: { type: String, trim: true, default: 'What We Do' },
      description: {
        type: String,
        trim: true,
        default:
          'We offer structured, productized growth services spanning full-stack delivery, revenue operations, automation, and applied artificial intelligence.',
      },
      backgroundImage: { type: String, trim: true, default: '' },
      backgroundImagePublicId: { type: String, trim: true, default: '' },
      ...seoMongooseFields,
      seoTitle: { type: String, trim: true, default: 'Our Services | TechVistar' },
      seoDescription: {
        type: String,
        trim: true,
        default:
          'Explore TechVistar productized services across web development, AI, cloud, automation, and digital growth.',
      },
      canonicalUrl: { type: String, trim: true, default: 'https://techvistar.com/services' },
      offeringsLabel: { type: String, trim: true, default: 'Key Offerings' },
      learnMoreLabel: { type: String, trim: true, default: 'Learn more' },
      ctaText: { type: String, trim: true, default: 'Explore Services' },
      categoryEyebrow: { type: String, trim: true, default: 'Browse by category' },
      featuredEyebrow: { type: String, trim: true, default: 'Top Picks' },
      featuredTitle: { type: String, trim: true, default: 'Featured Services' },
      featuredDescription: {
        type: String,
        trim: true,
        default: 'Our most recommended enterprise solutions.',
      },
      catalogEyebrow: { type: String, trim: true, default: 'Full Catalog' },
      catalogTitle: { type: String, trim: true, default: 'All Services' },
      catalogDescription: {
        type: String,
        trim: true,
        default: 'Explore the complete range of enterprise-grade solutions.',
      },
    },
    homeSection: {
      tag: { type: String, trim: true, default: 'Our services' },
      title: { type: String, trim: true, default: 'Productized growth' },
      highlight: { type: String, trim: true, default: 'you can scope and measure' },
      description: {
        type: String,
        trim: true,
        default:
          'Eighteen core service verticals—from custom software engineering to digital marketing and AI integrations—each designed with transparent processes, technologies, and outcomes.',
      },
      viewAllTitle: { type: String, trim: true, default: 'View All Services' },
      viewAllLinkText: { type: String, trim: true, default: 'Explore All' },
    },
    sidebarDefaults: sidebarBlockSchema,
    consultationDefaults: consultationBlockSchema,
    updatedBy: { type: String, default: '' },
  },
  { timestamps: true }
);

export const ServicesCmsConfig = mongoose.model<IServicesCmsConfig>(
  'ServicesCmsConfig',
  servicesCmsConfigSchema
);
