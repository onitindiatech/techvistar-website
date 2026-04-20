import {
  Globe,
  TrendingUp,
  BookOpen,
  Cpu,
  Shield,
  Users,
  ClipboardCheck,
  DollarSign,
  Layers,
  MapPin,
  Mail,
  Phone,
  Linkedin,
  Instagram,
  FileSearch,
  Code2,
  Share2,
  Headset,
  Sparkles,
} from 'lucide-react';

/** Site-wide identity (used in copy + JSON-LD) */
export const SITE = {
  name: 'TechVistar',
  url: 'https://techvistar.com',
  description:
    'TechVistar is a technology-first growth partner: web systems, brand and digital presence, marketing instrumentation, automation, AI, and documentation—delivered with structured scope, measurable outcomes, and handover your team can operate.',
} as const;

// Navigation — About is a dedicated route; other anchors target home sections via /#…
export const NAV_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Internship', href: '/#internship' },
  { label: 'Services', href: '/#services' },
  { label: 'Process', href: '/#process' },
  { label: 'Work', href: '/#projects' },
  { label: 'Contact', href: '/#contact' },
] as const;

/** Homepage announcement ticker (shown below navbar) */
export const INTERNSHIP_MARQUEE_SEGMENTS = [
  'New batch open — 3-Month AI & Python Internship',
  'Limited seats — register now',
  '1 hour daily training · Guest lectures · Certificate · Real-time projects',
  'Call +91 9573157982 · techvistar.com',
] as const;

/** 3-month program — aligned with public internship poster */
export const INTERNSHIP_PROGRAM = {
  eyebrow: 'Professional internship',
  title: '3-Month AI & Python',
  titleAccent: 'Internship Program',
  subtitle:
    'A structured, twelve-week pathway from Python fundamentals through applied AI and generative systems—delivered with weekly learning outcomes, guided practice, and a capstone project suitable for your portfolio.',
  summaryStats: [
    { label: 'Duration', value: '3 months' },
    { label: 'Curriculum', value: '12 weeks' },
    { label: 'Daily cadence', value: '~1 hour' },
    { label: 'Format', value: 'Live + projects' },
  ],
  phases: [
    {
      key: 'phase-1',
      monthLabel: 'Month 1',
      title: 'Python programming foundation',
      weeks: [
        { label: 'Week 1', detail: 'Python setup, variables, and data types' },
        { label: 'Week 2', detail: 'Input handling and operators' },
        { label: 'Week 3', detail: 'Control flow statements' },
        { label: 'Week 4', detail: 'Functions and parameters' },
      ],
    },
    {
      key: 'phase-2',
      monthLabel: 'Month 2',
      title: 'Advanced Python & object-oriented programming',
      weeks: [
        { label: 'Week 5', detail: 'Classes, methods, and modules' },
        { label: 'Week 6', detail: 'Object-oriented programming concepts' },
        { label: 'Week 7', detail: 'File handling and exception handling' },
        { label: 'Week 8', detail: 'Introduction to Artificial Intelligence' },
      ],
    },
    {
      key: 'phase-3',
      monthLabel: 'Month 3',
      title: 'Generative AI & final project',
      weeks: [
        { label: 'Week 9', detail: 'Large Language Models (LLMs) and RAG' },
        { label: 'Week 10', detail: 'Transformers, embeddings, and vector databases' },
        { label: 'Week 11', detail: 'Fine-tuning and prompt engineering' },
        { label: 'Week 12', detail: 'Final industry-level project development' },
      ],
    },
  ],
  highlights: [
    '1 hour daily structured training',
    'Guest lectures on alternate weeks',
    'Internship certificate on completion',
    'Real-time project experience',
  ],
  audience: [
    'B.Tech / degree students',
    'Diploma students',
    'Final-year students',
    'Beginners interested in AI',
    'Job seekers switching to tech',
  ],
  cta: {
    urgent: 'Limited seats available — register now',
    phoneDisplay: '+91 9573157982',
    phoneTel: '+919573157982',
    website: 'https://www.techvistar.com',
  },
} as const;

export const HERO_COPY = {
  /** Line 1 + accent word + line 2 — Voxvertex-style two-line headline */
  headlineLine1: 'Technology-first',
  headlineAccent: 'Growth',
  headlineLine2: 'Without the chaos',
  /** Single subline under H1 */
  tagline:
    'TechVistar helps businesses scale with integrated web systems, brand and digital presence, automation, and applied AI—structured from scope to sign-off, with outcomes you can measure and teams can run.',
  ctaPrimary: 'Get in touch',
  ctaSecondary: 'View services',
  locationLine: 'Hyderabad · Remote worldwide',
} as const;

export const ABOUT_COPY = {
  tag: 'About us',
  /** Short line under the brand — plain language */
  subtitle:
    'A technology-first growth partner: we connect engineering, marketing operations, and automation so digital investments produce pipeline, efficiency, and clarity—not one-off deliverables.',
  /** One paragraph only — who we are */
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
  principles: [
    'Scope, assumptions, and exclusions are captured before build-heavy work begins; changes flow through an agreed change path.',
    'You see working software and measurable signals on a predictable rhythm—no surprise “big reveals” at the deadline.',
    'Security, testing, and observability match the sensitivity of your data, brand, and deployment environment.',
    'Handover includes what your team needs to operate and extend the system: docs, access patterns, training, and transition checkpoints.',
  ] as const,
  principlesIntro:
    'These principles show up in statements of work, demo agendas, analytics reviews, and sign-off—so delivery stays understandable at every stage.',
} as const;

/** Service catalog — productized offers; aligned with JSON-LD OfferCatalog */
export const SERVICES = [
  {
    icon: Layers,
    title: 'Growth Stack Blueprint',
    description:
      'End-to-end product foundations: web and mobile applications, APIs, and integrations—scoped as one coherent system so marketing, sales, and ops see the same data and release cadence.',
    deliverables: ['Roadmap & milestone plan', 'Web / mobile / API delivery', 'Environments & release discipline', 'Acceptance & sign-off'],
  },
  {
    icon: Globe,
    title: 'Revenue Web Engine',
    description:
      'High-trust websites and conversion paths with analytics and goal design—so leadership sees demand, conversion, and channel truth, not vanity metrics.',
    deliverables: ['UX & performance baseline', 'Measurement plan & events', 'CRM / form integrations', 'SEO & content structure'],
  },
  {
    icon: TrendingUp,
    title: 'Brand & Growth Flywheel',
    description:
      'Positioning, content, and campaigns wired to pipeline and reporting—consistent creative, measurable experiments, and clear ownership between marketing and sales.',
    deliverables: ['Messaging & asset system', 'Organic & paid programs', 'Funnel & attribution hygiene', 'Reporting cadence'],
  },
  {
    icon: Cpu,
    title: 'Automate & Integrate',
    description:
      'Connect CRM, ops tools, and data flows; replace fragile spreadsheets with observable workflows, alerts, and audit-friendly handoffs between teams.',
    deliverables: ['Integration map & APIs', 'Workflow automation', 'Error handling & monitoring', 'Runbooks for operators'],
  },
  {
    icon: Sparkles,
    title: 'Applied AI & Decision Support',
    description:
      'Practical AI features—classification, assistants, retrieval—deployed with evaluation, guardrails, and governance suited to your data sensitivity and brand risk.',
    deliverables: ['Use-case & success metrics', 'Model / RAG architecture', 'Safety & evaluation harness', 'Rollout & owner training'],
  },
  {
    icon: BookOpen,
    title: 'Documentation & Research Desk',
    description:
      'SRS, architecture notes, API docs, and runbooks alongside the build; plus structured academic and research-adjacent support with reproducible artefacts where applicable.',
    deliverables: ['SRS & ADRs', 'API & ops documentation', 'Academic / capstone support', 'Submission-ready packaging'],
  },
] as const;

export const SECTION_SERVICES = {
  tag: 'Our services',
  title: 'Productized growth',
  highlight: 'you can scope and measure',
  description:
    'Six offers—from full-stack delivery to automation and applied AI—each with defined outcomes, written assumptions, and handover your team can run. Combine them or start where risk and ROI are highest.',
  cta: 'Request a scoped proposal or SOW discussion',
} as const;

/** Delivery process — homepage process block (VISTAR-inspired phases) */
export const SECTION_PROCESS = {
  tag: 'Delivery process',
  title: 'Vision to results,',
  highlight: 'without guesswork',
  description:
    'A four-phase VISTAR-style framework: align on vision and insight, lock strategy and build, ship technology with integration discipline, then accelerate with support and measurable optimization.',
} as const;

export const PROCESS_PILLARS = ['Vision', 'Insight', 'Strategy', 'Results'] as const;

export const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Vision & scope',
    description:
      'We align on goals, constraints, funnel truth, and success criteria—then produce a written scope, milestone plan, and risk register.',
    icon: FileSearch,
    deliverables: [
      'Scope, milestones, and assumptions in writing',
      'Risk register and dependency map',
      'Agreed demo, analytics, and reporting cadence',
    ] as const,
  },
  {
    step: '02',
    title: 'Insight & build',
    description:
      'Iterative delivery with demos, code review, and test evidence. You see product and metrics on a steady cadence—not a black box.',
    icon: Code2,
    deliverables: [
      'Incremental builds with review checkpoints',
      'Automated tests matched to critical paths',
      'Traceable backlog and release notes',
    ] as const,
  },
  {
    step: '03',
    title: 'Strategy & integration',
    description:
      'Deployment to your environments, integrations with CRM and ops tools, runbooks, and knowledge transfer so your team can operate and extend what we ship.',
    icon: Share2,
    deliverables: [
      'Environment-specific deploy and rollback paths',
      'Integration tests and data contracts',
      'Handover sessions and documentation',
    ] as const,
  },
  {
    step: '04',
    title: 'Technology & acceleration',
    description:
      'Post-launch fixes, enhancements, performance and cost tuning—with SLAs, escalation paths, and optimization tied to agreed KPIs.',
    icon: Headset,
    deliverables: [
      'Defined response times and escalation',
      'Triage for defects vs enhancements',
      'Ongoing performance, funnel, and cost visibility',
    ] as const,
  },
] as const;

/** Benefits grid — mirrors “Key benefits” style landing pages */
export const SECTION_BENEFITS = {
  tag: 'Benefits',
  title: 'Why teams choose',
  highlight: 'technology-first growth',
  description:
    'Clear scope, disciplined engineering, marketing and ops alignment, and communication leadership can audit—so pipeline, efficiency, and delivery stay aligned from kickoff to handover.',
} as const;

export const BENEFITS = [
  {
    icon: Cpu,
    title: 'Engineering discipline',
    description:
      'Version control, environments that mirror production, and repeatable releases—so deploys are boring in the right way.',
  },
  {
    icon: Shield,
    title: 'Security & reliability',
    description:
      'Threat-aware design, sensible defaults, and testing matched to your risk profile, data sensitivity, and compliance needs.',
  },
  {
    icon: Users,
    title: 'Revenue alignment',
    description:
      'Shared truth on backlog, demos, funnel metrics, and documentation so sales, marketing, and product agree on what “done” means.',
  },
  {
    icon: ClipboardCheck,
    title: 'Quality & handover',
    description:
      'Test evidence, runbooks, and training so your internal team owns the system after go-live.',
  },
  {
    icon: DollarSign,
    title: 'Transparent commercial terms',
    description:
      'Effort-based or milestone billing with written assumptions—no surprise line items without prior approval.',
  },
  {
    icon: Layers,
    title: 'Full-stack continuity',
    description:
      'One partner for UI, APIs, data, automation, and docs reduces integration risk and speeds root-cause resolution.',
  },
] as const;

export const SECTION_PROJECTS = {
  tag: 'Case highlights',
  title: 'Representative work',
  highlight: 'across stacks',
  description:
      'Samples span routing, NLP/ML, finance, and internal tooling—illustrative of how we scope, integrate, and hand over production-minded software. Details anonymized where required.',
} as const;

export const TESTIMONIALS = [
  {
    name: 'Surender G.',
    role: 'Founder',
    company: 'Early-stage product company',
    content:
      'TechVistar translated an ambiguous brief into a shippable mobile release. Written scope, demo cadence, and documentation made stakeholder alignment straightforward from sprint one to store submission.',
    rating: 5,
  },
  {
    name: 'Shailaja Swamy',
    role: 'Marketing lead',
    company: 'B2B services firm',
    content:
      'Our web rebuild and analytics instrumentation finally gave leadership a clear view of conversion paths. Communication was crisp, milestones landed on time, and handover did not leave us dependent on tacit knowledge.',
    rating: 5,
  },
  {
    name: 'Pavan Reddy',
    role: 'Graduate student',
    company: 'Engineering programme',
    content:
      'Structured support on my capstone—from problem statement through implementation and final report—meant I could defend the work with evidence, not slides alone.',
    rating: 5,
  },
  {
    name: 'Rajesh G.',
    role: 'Owner',
    company: 'Local services business',
    content:
      'A pragmatic site and enquiry funnel our front desk can update without calling a developer. Training and written handover matched what we were promised at kickoff.',
    rating: 5,
  },
  {
    name: 'Ananya Krishnan',
    role: 'Product manager',
    company: 'Health-tech SaaS',
    content:
      'They integrated with our existing backlog and release train instead of inventing a parallel process. API work, QA notes, and release checklists were audit-ready for our ISO prep.',
    rating: 5,
  },
  {
    name: 'Vikram S.',
    role: 'CTO',
    company: 'Logistics scale-up',
    content:
      'We needed a partner who could read our runbooks and improve them. Delivery included environment-specific deploy paths and rollback steps—not just “it works on my machine.”',
    rating: 5,
  },
  {
    name: 'Meera Iyer',
    role: 'Operations director',
    company: 'Professional services group',
    content:
      'Internal tooling for approvals and reporting replaced a fragile spreadsheet stack. Change requests were quoted before build, which kept finance and IT aligned.',
    rating: 5,
  },
  {
    name: 'Rahul Verma',
    role: 'Engineering lead',
    company: 'Fintech team',
    content:
      'Security expectations were taken seriously from day one: threat modeling notes, test evidence for critical paths, and sensible secrets handling. Rare in mid-size vendor engagements.',
    rating: 5,
  },
  {
    name: 'Deepa N.',
    role: 'Programme head',
    company: 'Ed-tech nonprofit',
    content:
      'Content workflows and a modest LMS integration shipped on the agreed date for our intake cycle. Their documentation made volunteer developers productive within a week.',
    rating: 5,
  },
  {
    name: 'Karthik M.',
    role: 'IT manager',
    company: 'Manufacturing SME',
    content:
      'Vendor onboarding and SSO were painful internally; TechVistar adapted to our IdP constraints and produced integration notes our infra team could sign off without rework.',
    rating: 5,
  },
] as const;

export const SECTION_TESTIMONIALS = {
  tag: 'Client references',
  title: 'What leaders and teams',
  highlight: 'say about delivery',
  description:
    'Post-engagement feedback from product, engineering, operations, and academic clients—focused on scope discipline, measurable outcomes, and handover quality. Identifiers summarized where confidentiality applies.',
} as const;

export const TESTIMONIAL_AGGREGATE = [
  { value: '98%', label: 'On-time milestone delivery' },
  { value: '60+', label: 'Completed engagements' },
  { value: '4.9/5', label: 'Post-project satisfaction' },
] as const;

export const CONTACT_INFO = [
  {
    icon: MapPin,
    title: 'Office',
    details: 'Hyderabad, Telangana, India',
  },
  {
    icon: Mail,
    title: 'Business inquiries',
    details: 'support@techvistar.com',
  },
  {
    icon: Phone,
    title: 'Phone',
    details: '+91 9573157982',
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
    { label: 'Internship', href: '/#internship' },
    { label: 'Process', href: '/#process' },
    { label: 'Benefits', href: '/#benefits' },
    { label: 'Clients', href: '/#testimonials' },
    { label: 'Contact', href: '/#contact' },
  ],
  social: [
    { icon: Linkedin, href: 'https://www.linkedin.com/company/techvistar', label: 'LinkedIn' },
    { icon: Instagram, href: 'https://www.instagram.com/tech_vistar?igsh=MThpMTJnZ2ZlcWVvcw==', label: 'Instagram' },
    { icon: Mail, href: 'mailto:support@techvistar.com', label: 'Email' },
  ],
} as const;
