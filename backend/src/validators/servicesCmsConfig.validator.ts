/**
 * @file src/validators/servicesCmsConfig.validator.ts
 */

import { ApiError } from '@/utils/ApiError';

function trimStr(val: unknown, fallback = ''): string {
  if (val === undefined || val === null) return fallback;
  return String(val).trim();
}

export function validateServicesCmsConfigInput(input: Record<string, unknown>): Record<string, unknown> {
  const errors: Array<{ field: string; message: string }> = [];

  const landing = (input.landing && typeof input.landing === 'object' ? input.landing : {}) as Record<
    string,
    unknown
  >;
  const homeSection = (input.homeSection && typeof input.homeSection === 'object'
    ? input.homeSection
    : {}) as Record<string, unknown>;
  const sidebarDefaults = (input.sidebarDefaults && typeof input.sidebarDefaults === 'object'
    ? input.sidebarDefaults
    : {}) as Record<string, unknown>;
  const consultationDefaults = (input.consultationDefaults && typeof input.consultationDefaults === 'object'
    ? input.consultationDefaults
    : {}) as Record<string, unknown>;

  if (!trimStr(landing.title)) {
    errors.push({ field: 'landing.title', message: 'Landing title is required' });
  }

  if (errors.length > 0) {
    throw ApiError.validationError('Validation failed', errors);
  }

  return {
    landing: {
      title: trimStr(landing.title, 'Our Services'),
      subtitle: trimStr(landing.subtitle, 'What We Do'),
      description: trimStr(landing.description),
      backgroundImage: trimStr(landing.backgroundImage),
      backgroundImagePublicId: trimStr(landing.backgroundImagePublicId),
      seoTitle: trimStr(landing.seoTitle),
      seoDescription: trimStr(landing.seoDescription),
      offeringsLabel: trimStr(landing.offeringsLabel, 'Key Offerings'),
      learnMoreLabel: trimStr(landing.learnMoreLabel, 'Learn more'),
    },
    homeSection: {
      tag: trimStr(homeSection.tag, 'Our services'),
      title: trimStr(homeSection.title, 'Productized growth'),
      highlight: trimStr(homeSection.highlight, 'you can scope and measure'),
      description: trimStr(homeSection.description),
      viewAllTitle: trimStr(homeSection.viewAllTitle, 'View All Services'),
      viewAllLinkText: trimStr(homeSection.viewAllLinkText, 'Explore All'),
    },
    sidebarDefaults: {
      summaryTitle: trimStr(sidebarDefaults.summaryTitle, 'Consultation Summary'),
      responseTimeTitle: trimStr(sidebarDefaults.responseTimeTitle, 'Average Response Time'),
      responseTime: trimStr(sidebarDefaults.responseTime, '< 4 Hours (Within Business Days)'),
      businessHoursTitle: trimStr(sidebarDefaults.businessHoursTitle, 'Business Hours'),
      businessHours: trimStr(sidebarDefaults.businessHours, 'Monday – Friday, 9:00 AM – 6:00 PM'),
      secureTitle: trimStr(sidebarDefaults.secureTitle, 'Secure Consultation'),
      secureDescription: trimStr(
        sidebarDefaults.secureDescription,
        'All SOW outlines and documentation covered by NDA.'
      ),
      buttonLabel: trimStr(sidebarDefaults.buttonLabel, 'Book Free Session'),
      directInquiriesTitle: trimStr(sidebarDefaults.directInquiriesTitle, 'Direct Inquiries'),
      directInquiriesBody: trimStr(
        sidebarDefaults.directInquiriesBody,
        'Have an SOW ready or need instant escalation? Contact our lead architect directly at:'
      ),
      contactEmail: trimStr(sidebarDefaults.contactEmail, 'architect@techvistar.com'),
    },
    consultationDefaults: {
      title: trimStr(consultationDefaults.title, 'Request Free Consultation'),
      description: trimStr(
        consultationDefaults.description,
        'Describe your requirements and obtain a custom SOW draft from our engineering leads.'
      ),
      submitLabel: trimStr(consultationDefaults.submitLabel, 'Submit Requirements'),
      privacyText: trimStr(
        consultationDefaults.privacyText,
        'I agree to be contacted by the TechVistar engineering team and accept the privacy policy.'
      ),
      successTitle: trimStr(consultationDefaults.successTitle, 'Inquiry Submitted'),
      successMessage: trimStr(
        consultationDefaults.successMessage,
        'Thank you! We will get back to you in under 4 business hours regarding your project.'
      ),
    },
  };
}
