/** Site-wide identity (used in copy + JSON-LD) */
export const SITE = {
  name: 'TechVistar',
  url: 'https://techvistar.com',
  description:
    'TechVistar is a technology-first growth partner: web systems, brand and digital presence, marketing instrumentation, automation, AI, and documentation—delivered with structured scope, measurable outcomes, and handover your team can operate.',
  address: {
    locality: 'Hyderabad',
    region: 'Telangana',
    countryCode: 'IN',
    countryName: 'India',
  },
  socials: [
    'https://www.linkedin.com/company/techvistar',
    'https://www.instagram.com/tech_vistar',
  ],
} as const;

export const SEO = {
  title: SITE.name,
  description: SITE.description,
  url: SITE.url,
} as const;

export const ABOUT_COPY = {
  tag: 'About us',
  /** Short line under the brand — plain language */
  subtitle:
    'A technology-first growth partner: we connect engineering, marketing operations, and automation so digital investments produce pipeline, efficiency, and clarity—not one-off deliverables.',
  summary:
    'We are a Hyderabad-based team partnering with startups, SMEs, and institutions to ship digital products and operating systems. Engagements are scoped in writing, demonstrated on a steady cadence, and signed off with documentation your stakeholders can audit.',
  mission: {
    title: 'Mission',
    text: 'Deliver secure, maintainable technology and clear guidance so every investment in digital, data, and AI is understandable, measurable, and ownable by your organization.',
  },
  vision: {
    title: 'Vision',
    text: 'Be the partner teams call when they need accountable delivery across applications, automation, and growth—not disconnected campaigns or undocumented handoffs.',
  },
  locationLine: 'Hyderabad, Telangana, India',
  closing:
    'We favour clarity, knowledge transfer, and steady communication over heroics, vanity metrics, and tacit-only knowledge.',
} as const;

/** Dedicated About page — extended copy */
export const ABOUT_PAGE = {
  hero: {
    eyebrow: 'Company',
    title: 'About TechVistar',
    lead:
      'TechVistar is a technology-first growth partner. We help organizations design and run digital systems—web, brand presence, marketing instrumentation, automation, AI, and documentation—with the discipline of a product team and the language of business outcomes.',
  },
  overview: {
    title: 'Who we are',
    paragraphs: [
      ABOUT_COPY.summary,
      'Across engagements we align engineering, marketing operations, and data reality: security and testing expectations, funnel truth, stakeholder review cycles, and handover artefacts are agreed in writing—not assumed. That keeps delivery predictable for your teams and credible for leadership.',
    ] as const,
  },
  focusAreasHeading: 'What we focus on',
  focusAreasDescription: 'Six practice areas—scoped standalone or as part of a broader program.',
  focusAreas: [
    {
      title: 'Product & platforms (web & mobile)',
      description:
        'Customer-facing and internal applications, APIs, and integrations—scoped with milestones, demos, acceptance criteria, and release discipline.',
    },
    {
      title: 'Revenue web & conversion systems',
      description:
        'High-trust web experiences with analytics and goal design so marketing and sales see the same truth about demand and conversion.',
    },
    {
      title: 'Brand, content & growth marketing',
      description:
        'Positioning and assets that stay consistent across channels—paired to measurable goals, not activity for its own sake.',
    },
    {
      title: 'Automation & integration layer',
      description:
        'Connect CRM, ops tools, and data flows; reduce manual work, errors, and “spreadsheet risk” with observable workflows.',
    },
    {
      title: 'Applied AI & decision support',
      description:
        'Practical AI features—classification, assistants, retrieval—deployed with evaluation, guardrails, and governance appropriate to your risk profile.',
    },
    {
      title: 'Documentation, research & academic programmes',
      description:
        'SRS and runbooks alongside builds; structured academic and research-adjacent support with reproducible artefacts where applicable.',
    },
  ] as const,
  principlesHeading: 'How we run engagements',
  principles: [
    'Scope, assumptions, and exclusions are captured before build-heavy work begins; changes flow through an agreed change path.',
    'You see working software and measurable signals on a predictable rhythm—no surprise “big reveals” at the deadline.',
    'Security, testing, and observability match the sensitivity of your data, brand, and deployment environment.',
    'Handover includes what your team needs to operate and extend the system: docs, access patterns, training, and transition checkpoints.',
  ] as const,
  principlesIntro:
    'These principles show up in statements of work, demo agendas, analytics reviews, and sign-off—so delivery stays understandable at every stage.',
  location: {
    heading: 'Headquarters',
    detail: 'Remote delivery for clients across India and overseas.',
  },
  commitmentHeading: 'Our commitment',
  missionVisionHeading: 'Mission & vision',
  ctaText: 'Discuss scope or a statement of work—we respond to new business inquiries within one business day.',
  ctaButtonText: 'Contact us',
} as const;

export const NAVBAR_REGISTER_FORM = {
  actionUrl: '',
  headerButtonText: 'Register now',
  dialog: {
    title: 'Register now',
    description: 'Share your details and our team will connect with you about the next batch.',
    fields: {
      name: {
        label: 'Full name',
        placeholder: 'Your full name',
      },
      email: {
        label: 'Email ID',
        placeholder: 'name@example.com',
      },
      phone: {
        label: 'Number',
        placeholder: '+91 9876543210',
      },
    },
    submitButton: 'Submit',
    submittingText: 'Submitting…',
  },
  toasts: {
    success: {
      title: 'Registration submitted',
      description: 'Thank you. Our team will contact you shortly.',
    },
    error: {
      title: 'Submission failed',
      description: 'Unable to submit now. Please try again shortly.',
    },
  },
} as const;
