import {
  ServiceCtaBlock,
  ServiceSidebarBlock,
  ServiceConsultationBlock,
  mergeSidebarBlock,
  mergeConsultationBlock,
} from '@/types/servicesCms';

export type IndustryCtaBlock = ServiceCtaBlock;
export type IndustrySidebarBlock = ServiceSidebarBlock;
export type IndustryConsultationBlock = ServiceConsultationBlock;

export { mergeSidebarBlock, mergeConsultationBlock };

export const DEFAULT_INDUSTRY_SIDEBAR: IndustrySidebarBlock = {
  summaryTitle: 'Industry Consultation',
  responseTimeTitle: 'Average Response Time',
  responseTime: '< 4 Hours (Within Business Days)',
  businessHoursTitle: 'Business Hours',
  businessHours: 'Monday – Friday, 9:00 AM – 6:00 PM',
  secureTitle: 'Secure Consultation',
  secureDescription: 'All discovery calls and documentation covered by NDA.',
  buttonLabel: 'Book Free Session',
  directInquiriesTitle: 'Direct Inquiries',
  directInquiriesBody:
    'Have compliance requirements or an RFP ready? Contact our vertical specialists directly at:',
  contactEmail: '',
};

export const DEFAULT_INDUSTRY_CONSULTATION: IndustryConsultationBlock = {
  title: 'Request Industry Consultation',
  description:
    'Share your vertical requirements and our specialists will scope a compliant delivery roadmap.',
  submitLabel: 'Submit Requirements',
  privacyText:
    'I agree to be contacted by the TechVistar team and accept the privacy policy.',
  successTitle: 'Inquiry Submitted',
  successMessage:
    'Thank you! We will respond within one business day regarding your industry engagement.',
};

export function resolveIndustryCtaBlock(
  industry: {
    title?: string;
    cta?: { title?: string; subtitle?: string; buttonText?: string };
    ctaBlock?: Partial<IndustryCtaBlock> | null;
  },
  defaults?: Partial<IndustryCtaBlock>
): IndustryCtaBlock {
  const base: IndustryCtaBlock = {
    badge: 'Industry Solutions',
    headline:
      industry.cta?.title?.trim() ||
      `Partner with TechVistar for ${industry.title || 'your industry'}`,
    body:
      industry.cta?.subtitle?.trim() ||
      'Discuss compliance, deployment, and enterprise delivery with our vertical specialists.',
    primaryButtonLabel: industry.cta?.buttonText?.trim() || 'Get in Touch',
    secondaryButtonLabel: 'Contact Us',
    secondaryButtonHref: '/contact',
    ...defaults,
  };

  if (!industry.ctaBlock) return base;

  return {
    badge: industry.ctaBlock.badge?.trim() || base.badge,
    headline: industry.ctaBlock.headline?.trim() || base.headline,
    body: industry.ctaBlock.body?.trim() || base.body,
    primaryButtonLabel:
      industry.ctaBlock.primaryButtonLabel?.trim() || base.primaryButtonLabel,
    secondaryButtonLabel:
      industry.ctaBlock.secondaryButtonLabel?.trim() || base.secondaryButtonLabel,
    secondaryButtonHref:
      industry.ctaBlock.secondaryButtonHref?.trim() || base.secondaryButtonHref,
  };
}
