import { MapPin, Mail, Phone } from 'lucide-react';
import { DEFAULT_WEBSITE_SETTINGS } from '@/types/websiteSettings';
import {
  resolvePrimaryEmail,
  resolveSiteAddress,
  resolveSitePhone,
} from '@/lib/siteContact';

/** Static fallbacks aligned with Website Settings defaults (prefer live CMS at runtime). */
export const CONTACT_INFO = [
  {
    icon: MapPin,
    title: 'Office',
    details: resolveSiteAddress(DEFAULT_WEBSITE_SETTINGS),
  },
  {
    icon: Mail,
    title: 'Business inquiries',
    details: resolvePrimaryEmail(DEFAULT_WEBSITE_SETTINGS),
  },
  {
    icon: Phone,
    title: 'Phone',
    details: resolveSitePhone(DEFAULT_WEBSITE_SETTINGS),
  },
] as const;

export const SECTION_CONTACT = {
  tag: 'Contact',
  title: 'Start a',
  highlight: 'growth conversation',
  description:
    'Share goals, timeline, budget band, and constraints. We reply with clarifying questions, a suggested approach, and—where appropriate—a proposal or statement of work aligned to measurable outcomes.',
} as const;

export const CONTACT_SIDEBAR = {
  title: 'Business & project inquiries',
  lead:
    'For RFPs, vendor onboarding, or kickoff, use the form. We route messages to the right practice lead within one business day.',
  slaTitle: 'First response',
  slaBody:
    'We acknowledge new business inquiries within one business day (IST). For urgent production issues from existing clients, please call and reference your engagement ID.',
} as const;

export const CONTACT_FORM = {
  actionUrl: 'http://localhost:5000/api/contact',
  fields: {
    name: {
      label: 'Full name',
      placeholder: 'Name as per business records',
    },
    email: {
      label: 'Work email',
      placeholder: 'name@organization.com',
    },
    subject: {
      label: 'Subject / reference',
      placeholder: 'e.g. RFP — mobile app Q3',
    },
    message: {
      label: 'Requirements summary',
      placeholder: 'Goals, timeline, budget band, integrations, compliance constraints, and success criteria.',
    },
  },
  submitButton: 'Submit inquiry',
  submittingText: 'Submitting…',
  toasts: {
    success: {
      title: 'Inquiry received',
      description: 'We will respond within one business day where possible.',
    },
    error: {
      title: 'Unable to send',
      description: 'Please try again or email us directly.',
    },
  },
} as const;
