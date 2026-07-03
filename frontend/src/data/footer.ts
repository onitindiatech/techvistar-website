import { Linkedin, Instagram, Mail } from 'lucide-react';

export const SOCIAL_LINKS = [
  { icon: Linkedin, href: 'https://www.linkedin.com/company/techvistar', label: 'LinkedIn' },
  { icon: Instagram, href: 'https://www.instagram.com/tech_vistar?igsh=MThpMTJnZ2ZlcWVvcw==', label: 'Instagram' },
  { icon: Mail, href: 'mailto:support@techvistar.com', label: 'Email' },
] as const;

export const FOOTER_DESCRIPTION =
  'TechVistar is a technology-first growth partner: web and mobile systems, brand and digital presence, automation, applied AI, and documentation—structured delivery, clear communication, and handover your team can operate.';

export const FOOTER_LINKS = {
  services: [
    { label: 'Growth Stack Blueprint', href: '/#services' },
    { label: 'Revenue Web Engine', href: '/#services' },
    { label: 'Automate & Integrate', href: '/#services' },
    { label: 'Applied AI', href: '/#services' },
  ],
  company: [
    { label: 'About', href: '/about' },
    { label: 'Process', href: '/#process' },
    { label: 'Benefits', href: '/#benefits' },
    { label: 'Clients', href: '/#testimonials' },
    { label: 'Contact', href: '/#contact' },
  ],
  social: SOCIAL_LINKS,
} as const;

export const FOOTER_NEWSLETTER = {
  actionUrl: '',
  title: 'Updates',
  description: 'Occasional notes on product delivery and tech tips.',
  placeholder: 'Email address',
  buttonText: 'Subscribe',
  toasts: {
    success: {
      title: 'Subscribed',
      description: 'Thank you for subscribing.',
    },
    error: {
      title: 'Error',
      description: 'Failed to subscribe. Please try again.',
    },
  },
} as const;

export const FOOTER_COPYRIGHT = {
  text: 'TechVistar. All rights reserved.',
  links: [
    { label: 'Privacy', href: '#' },
    { label: 'Terms', href: '#' },
  ],
} as const;
