import {
  Globe,
  Smartphone,
  Palette,
  Cpu,
  Cloud,
  PenTool,
  Megaphone,
  Terminal,
  LucideIcon
} from 'lucide-react';

import img1 from '../assets/1.jpg';
import img2 from '../assets/2.jpg';
import img3 from '../assets/3.jpg';
import img4 from '../assets/4.jpg';
import serviceWebDev from '../assets/service_webdevlopment.png';
import serviceMobileApp from '../assets/mobile_phone_devloper.png';
import serviceUiUx from '../assets/ui_ux_designer.png';
import serviceAiAutomation from '../assets/Ai_and_atomation.png';
import serviceCloudDevops from '../assets/Claud_Devops.png';
import serviceBranding from '../assets/brand_and_creative_design.png';
import serviceDigitalMarketing from '../assets/digital_marketing.png';
import serviceCustomSoftware from '../assets/custom_software_devlopment.png';

export interface ServiceStat {
  value: string;
  label: string;
  iconType: 'rocket' | 'clock' | 'dollar' | 'chart' | 'shield' | 'star';
  colorTheme: 'green' | 'purple' | 'gold' | 'blue';
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  category: string;
  icon: LucideIcon;
  coverImage: string;
  thumbnail: string;
  overview: string;
  offerings: string[];
  process: { step: number; title: string; description: string }[];
  caseStudies: { title: string; description: string; link?: string }[];
  technologies: string[];
  faqs: { question: string; answer: string }[];
  benefits: string[];
  cta: string;
  featured: boolean;
  order: number;
  status: 'active' | 'draft';
  industries?: string[];
  whyChooseUs?: { title: string; description: string }[];
  stats?: readonly ServiceStat[];
}

export const SERVICES: readonly Service[] = [
  {
    id: '1',
    slug: 'web-development',
    title: 'Web Development',
    shortDescription: 'High-performance, secure, and SEO-optimized web systems and platforms built for conversion and scale.',
    longDescription: 'We build fast, secure, and responsive web platforms that grow with your business. From custom corporate portals and portfolio showcases to high-conversion landing pages, e-commerce storefronts, and full-featured SaaS platforms, our systems are engineered for speed, clean UX, and seamless SEO implementation.',
    category: 'Development',
    icon: Globe,
    coverImage: serviceWebDev,
    thumbnail: serviceWebDev,
    overview: 'Complete lifecycle web engineering, building responsive systems from specification to production release.',
    offerings: [
      'Business Websites',
      'Corporate Websites',
      'Portfolio Websites',
      'High-Conversion Landing Pages',
      'E-Commerce Storefronts',
      'Custom CMS Development',
      'Web Applications',
      'SaaS Platforms'
    ],
    process: [
      { step: 1, title: 'Requirements & Scope', description: 'Align on page counts, features, user flows, and tech stacks.' },
      { step: 2, title: 'UX & UI Prototyping', description: 'Design component libraries and interactive high-fidelity layouts.' },
      { step: 3, title: 'Frontend & Backend Build', description: 'Clean, modular engineering with integrated APIs and CMS tools.' },
      { step: 4, title: 'QA & Optimization', description: 'Rigorous responsive testing, speed audits, and SEO configuration.' },
      { step: 5, title: 'Deployment & Support', description: 'Production release under version control with uptime monitoring.' }
    ],
    caseStudies: [
      { title: 'LogiRoute Inc.', description: 'Built an interactive fleet dispatch and management interface.', link: '/work/navigation-route-optimization' }
    ],
    technologies: ['React', 'TypeScript', 'Next.js', 'TailwindCSS', 'Node.js', 'Vite'],
    faqs: [
      { question: 'What CMS platforms do you support?', answer: 'We build custom CMS structures and integrate standard headless architectures like Strapi, Sanity, or WordPress APIs based on your workflow.' },
      { question: 'Are the websites responsive?', answer: 'Yes, every site we deploy is optimized for smartphones, tablets, laptops, and wide desktop displays.' }
    ],
    benefits: [
      'Optimized Core Web Vitals for higher SEO rankings',
      'Responsive layouts across all screen resolutions',
      'Component-driven frontend for easy updates'
    ],
    cta: 'Discuss Your Web Project',
    featured: true,
    order: 1,
    status: 'active',
    industries: ['E-Commerce & Retail', 'Healthcare & Wellness', 'Fintech', 'SaaS & Tech Startups'],
    whyChooseUs: [
      { title: 'Speed & SEO First', description: 'We optimize every website to score 90+ on Lighthouse/PageSpeed metrics.' },
      { title: 'Clean Architecture', description: 'Our custom React systems are modular, easy to maintain, and completely editable.' }
    ],
    stats: [
      { value: '90+', label: 'Lighthouse Speed', iconType: 'rocket', colorTheme: 'green' },
      { value: '50%', label: 'Bounce Reduction', iconType: 'clock', colorTheme: 'purple' },
      { value: '2.5x', label: 'Conversion Boost', iconType: 'chart', colorTheme: 'gold' },
      { value: '100%', label: 'Responsive Build', iconType: 'shield', colorTheme: 'blue' }
    ]
  },
  {
    id: '2',
    slug: 'mobile-app-development',
    title: 'Mobile App Development',
    shortDescription: 'Native and cross-platform mobile solutions delivering fluid performance and premium user experience.',
    longDescription: 'We develop feature-rich mobile applications that deliver native-grade performance. Utilizing cutting-edge framework stacks like React Native and Flutter alongside native platforms, we construct systems engineered for offline accessibility, smooth transitions, store compliance, and secure user data flows.',
    category: 'Development',
    icon: Smartphone,
    coverImage: serviceMobileApp,
    thumbnail: serviceMobileApp,
    overview: 'Design, compilation, testing, and deployment of native and hybrid applications to App Store and Google Play.',
    offerings: [
      'Android Apps',
      'iOS Apps',
      'Flutter Apps',
      'React Native Apps',
      'Enterprise Apps',
      'Cross Platform Apps'
    ],
    process: [
      { step: 1, title: 'Feature Specifications', description: 'Define user stories, offline requirements, and API specs.' },
      { step: 2, title: 'Mobile UI Layouts', description: 'Design platform-specific wireframes and tactile screen maps.' },
      { step: 3, title: 'Cross-Platform Build', description: 'Develop common codebases with native bridges for hardware APIs.' },
      { step: 4, title: 'Beta Testing & Auditing', description: 'Conduct TestFlight and internal track runs for bug tracking.' },
      { step: 5, title: 'App Store Submission', description: 'Manage publishing guidelines, metadata, and app store approvals.' }
    ],
    caseStudies: [],
    technologies: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase', 'Fastlane'],
    faqs: [
      { question: 'Do you help with App Store approvals?', answer: 'Yes, we handle the entire submission process, including metadata configuration, privacy policy mapping, and review guidelines.' }
    ],
    benefits: [
      'Single-codebase efficiencies for iOS and Android',
      'Smooth animations running at 60fps/120fps',
      'Secure offline-first local database architectures'
    ],
    cta: 'Build Your Mobile Application',
    featured: true,
    order: 2,
    status: 'active',
    industries: ['Logistics & Supply Chain', 'On-Demand Delivery', 'Real Estate', 'Healthcare'],
    whyChooseUs: [
      { title: 'Native-Grade Performance', description: 'Our React Native and Flutter systems are optimized to consume minimal battery and memory.' },
      { title: 'Offline-First Capabilities', description: 'We build local storage syncing so users can use the app seamlessly in remote areas.' }
    ],
    stats: [
      { value: '60fps', label: 'Fluid Animation', iconType: 'rocket', colorTheme: 'green' },
      { value: '4.8★', label: 'Average Rating', iconType: 'star', colorTheme: 'purple' },
      { value: '50%', label: 'Faster Delivery', iconType: 'clock', colorTheme: 'gold' },
      { value: '100%', label: 'Offline Syncing', iconType: 'shield', colorTheme: 'blue' }
    ]
  },
  {
    id: '3',
    slug: 'ui-ux-design',
    title: 'UI/UX Design',
    shortDescription: 'User-centric visual architectures, interactive prototypes, and scalable systems built to engage.',
    longDescription: 'We craft digital interfaces that are intuitive, accessible, and aligned with your brand identity. By conducting deep user research, compiling interactive wireframes, designing responsive design systems, and mapping custom dashboards, we translate business objectives into high-fidelity tactile layouts.',
    category: 'Design',
    icon: Palette,
    coverImage: serviceUiUx,
    thumbnail: serviceUiUx,
    overview: 'Translate user needs and brand assets into scalable, pixel-perfect design files and interactive prototypes.',
    offerings: [
      'UX Research',
      'Wireframing',
      'Prototyping',
      'Dashboard Design',
      'Design Systems',
      'Mobile UI',
      'Web UI'
    ],
    process: [
      { step: 1, title: 'User Research', description: 'Run interviews, map user journeys, and establish interface challenges.' },
      { step: 2, title: 'Wireframing & Flowcharts', description: 'Create low-fidelity structures mapping data hierarchies.' },
      { step: 3, title: 'Design System Setups', description: 'Configure grids, color tokens, typography rules, and interactive assets.' },
      { step: 4, title: 'High-Fidelity Visuals', description: 'Produce final screens with realistic states, copy, and icons.' },
      { step: 5, title: 'Interactive Hand-off', description: 'Publish click-through Figma prototypes with detailed spec files.' }
    ],
    caseStudies: [],
    technologies: ['Figma', 'Adobe XD', 'Illustrator', 'Tailwind tokens', 'Storybook'],
    faqs: [
      { question: 'Will I get editable design files?', answer: 'Yes, we provide full access to Figma source files, complete with components, variables, styles, and prototypes.' }
    ],
    benefits: [
      'Reduced friction along key registration and checkout flows',
      'Consistent brand experience across web and mobile platforms',
      'Developer-friendly specs for swift component styling'
    ],
    cta: 'Start Designing Your Interface',
    featured: false,
    order: 3,
    status: 'active',
    industries: ['SaaS Platforms', 'Fintech & Banking', 'E-Learning & Edtech', 'Enterprise Software'],
    whyChooseUs: [
      { title: 'Research-Based Design', description: 'Every visual layout we produce is backed by user testing and concrete design conventions.' },
      { title: 'Scalable Systems', description: 'We construct organized Figma design systems that developers can translate into code 2x faster.' }
    ],
    stats: [
      { value: '40%+', label: 'Engagement Lift', iconType: 'rocket', colorTheme: 'green' },
      { value: '3x', label: 'Hand-off Speed', iconType: 'clock', colorTheme: 'purple' },
      { value: '100%', label: 'Component Reuse', iconType: 'chart', colorTheme: 'gold' },
      { value: '0', label: 'UI Inconsistencies', iconType: 'shield', colorTheme: 'blue' }
    ]
  },
  {
    id: '4',
    slug: 'ai-automation',
    title: 'AI & Automation',
    shortDescription: 'Smart AI integration, language models, custom retrieval systems, and workflow automation.',
    longDescription: 'We bring artificial intelligence out of sandbox environments and embed it into daily workflows. From intelligent customer service chatbots and LLM prompt frameworks to workflow automation nodes and RAG document search engines, we construct AI systems with custom guardrails to control costs and eliminate accuracy concerns.',
    category: 'Advanced Technology',
    icon: Cpu,
    coverImage: serviceAiAutomation,
    thumbnail: serviceAiAutomation,
    overview: 'Deploy custom LLM structures, database retrievers, and background task handlers for operational efficiency.',
    offerings: [
      'AI Chatbots',
      'AI Agents',
      'Workflow Automation',
      'LLM Integration',
      'RAG Systems',
      'AI Assistants',
      'Custom AI Solutions'
    ],
    process: [
      { step: 1, title: 'Feasibility Audit', description: 'Define data pipelines, model costs, and baseline metrics.' },
      { step: 2, title: 'RAG & Retriever Setup', description: 'Structure vectors, vector stores, and parsing architectures.' },
      { step: 3, title: 'Prompt & Chain Design', description: 'Write custom validation checks, fallbacks, and agent routes.' },
      { step: 4, title: 'Monitoring & Guardrails', description: 'Implement request throttling, content logs, and accuracy tests.' }
    ],
    caseStudies: [],
    technologies: ['OpenAI API', 'LangChain', 'Python', 'n8n', 'Pinecone', 'Hugging Face'],
    faqs: [
      { question: 'How do you prevent AI hallucinations?', answer: 'We implement Retrieval-Augmented Generation (RAG) to restrict model contexts to verified internal documentation and apply strict content filters.' }
    ],
    benefits: [
      'Substantial reduction in manual administrative support ticket volume',
      'Faster data processing and automated entry times',
      'Secure, localized data containment meeting audit needs',
      'Custom AI guardrails for accuracy and cost control'
    ],
    cta: 'Automate Your Core Operations',
    featured: true,
    order: 4,
    status: 'active',
    industries: ['Customer Service', 'Fintech', 'Insurance', 'Healthcare Services'],
    whyChooseUs: [
      { title: 'Governance & Guardrails', description: 'We enforce safety parameters so the models strictly use only your data.' },
      { title: 'Cost Optimization', description: 'We optimize prompt tokens and select lighter models to minimize running fees.' }
    ],
    stats: [
      { value: '70%+', label: 'Efficiency Increase', iconType: 'rocket', colorTheme: 'green' },
      { value: '60%', label: 'Time Saved', iconType: 'clock', colorTheme: 'purple' },
      { value: '40%', label: 'Cost Reduction', iconType: 'dollar', colorTheme: 'gold' },
      { value: '98%', label: 'Accuracy Improvement', iconType: 'chart', colorTheme: 'blue' }
    ]
  },
  {
    id: '5',
    slug: 'cloud-devops',
    title: 'Cloud & DevOps',
    shortDescription: 'Scalable cloud infrastructure, automated CI/CD pipelines, containerization, and infrastructure as code.',
    longDescription: 'We architect and maintain cloud configurations that prioritize maximum availability, cost optimization, and iron-clad security. Through Infrastructure as Code (IaC), Docker orchestration, automated build paths, and multi-region failovers, we eliminate operational silos and speed up release frequencies.',
    category: 'Infrastructure',
    icon: Cloud,
    coverImage: serviceCloudDevops,
    thumbnail: serviceCloudDevops,
    overview: 'Design, configure, script, and launch modern container-driven infrastructure on global cloud platforms.',
    offerings: [
      'AWS Deployments',
      'Azure Integration',
      'Docker Containerization',
      'Kubernetes Orchestration',
      'CI/CD Pipelines',
      'Cloud Migration',
      'Infrastructure Automation'
    ],
    process: [
      { step: 1, title: 'Architecture Audit', description: 'Evaluate server layouts, load peaks, and database logs.' },
      { step: 2, title: 'IaC Declarations', description: 'Write Terraform/CloudFormation files describing network nodes.' },
      { step: 3, title: 'Container Configuration', description: 'Package apps into Docker configurations and configure local compose runs.' },
      { step: 4, title: 'CI/CD Workflow Wireup', description: 'Script automated testing, build nodes, and staging releases.' },
      { step: 5, title: 'Monitoring & Handoff', description: 'Launch dashboards for server usage, errors, and database health.' }
    ],
    caseStudies: [],
    technologies: ['AWS', 'Azure', 'Docker', 'Kubernetes', 'Terraform', 'GitHub Actions'],
    faqs: [
      { question: 'Can you help migrate existing servers with zero downtime?', answer: 'Yes, we plan greenfield environments and run side-by-side traffic routes before making final DNS switches.' }
    ],
    benefits: [
      'Auto-scaling nodes configured to handle traffic spikes',
      '99.9% uptime targets backed by multi-zone fallback layers',
      'One-click automated deployment pipelines'
    ],
    cta: 'Audit Your Cloud Infrastructure',
    featured: false,
    order: 5,
    status: 'active',
    industries: ['SaaS platforms', 'Fintech', 'Logistics', 'Large E-Commerce'],
    whyChooseUs: [
      { title: 'Zero Vendor Lock-in', description: 'We write fully open-source Infrastructure as Code declarations using Terraform.' },
      { title: '99.99% Availability Goals', description: 'We design robust multi-region setups with automated database backups.' }
    ]
  },
  {
    id: '6',
    slug: 'branding-creative-design',
    title: 'Branding & Creative Design',
    shortDescription: 'Distinct visual identities, logo marks, brand assets, and marketing collateral with cohesive brand narratives.',
    longDescription: 'We translate your business goals into premium visual marks that establish immediate market trust. From logo creation and typography guidelines to packaging designs, marketing assets, presentations, and kinetic vector movements, we establish unified identity standards that reflect your core values.',
    category: 'Design',
    icon: PenTool,
    coverImage: serviceBranding,
    thumbnail: serviceBranding,
    overview: 'Create and systemize brand logos, marketing assets, and corporate design elements.',
    offerings: [
      'Logo Design',
      'Brand Identity Systems',
      'Packaging Design',
      'Graphic Design Assets',
      'Marketing Creatives',
      'Presentation Design',
      'Motion Graphics'
    ],
    process: [
      { step: 1, title: 'Creative Concepts', description: 'Establish design moods, brand values, and color spaces.' },
      { step: 2, title: 'Typography & Logomarks', description: 'Sketch distinct geometry vector marks and review fonts.' },
      { step: 3, title: 'Asset Implementations', description: 'Mock layouts across stationery, packaging, or slide sheets.' },
      { step: 4, title: 'Identity Documentation', description: 'Draft detailed brand books defining minimum clearance rules.' }
    ],
    caseStudies: [],
    technologies: ['Illustrator', 'Photoshop', 'InDesign', 'After Effects', 'Figma'],
    faqs: [
      { question: 'What is included in the brand style guide?', answer: 'It defines your primary/secondary logomark rules, typography hierarchies, exact color formulas, and asset templates.' }
    ],
    benefits: [
      'Highly recognizable identity layout across print and digital media',
      'Pre-configured marketing templates for swift execution',
      'Vector files ready for scalable publication formats'
    ],
    cta: 'Develop Your Visual Brand',
    featured: false,
    order: 6,
    status: 'active',
    industries: ['Retail & FMCG', 'Tech Startups', 'Corporate Agencies', 'Real Estate'],
    whyChooseUs: [
      { title: 'Unique Identity', description: 'We design from scratch without utilizing premade online layouts or generic vectors.' },
      { title: 'Consistent Brand Books', description: 'We document visual guidelines so your designers can execute consistently.' }
    ]
  },
  {
    id: '7',
    slug: 'digital-marketing',
    title: 'Digital Marketing',
    shortDescription: 'Data-driven search engine optimization, paid advertising, social channels, and analytic setups.',
    longDescription: 'We align marketing spend with measurable business growth. By implementing custom SEO optimizations, target search campaigns, analytical conversion funnels, and organic distribution setups, we convert simple web traffic into stable pipelines for lead acquisition.',
    category: 'Marketing',
    icon: Megaphone,
    coverImage: serviceDigitalMarketing,
    thumbnail: serviceDigitalMarketing,
    overview: 'Configure advertising campaigns, clean up tracking pixels, and deploy search-optimized content engines.',
    offerings: [
      'Search Engine Optimization (SEO)',
      'Local SEO Campaigns',
      'Google Ads Setup & Management',
      'Meta Paid Advertisements',
      'Social Media Marketing',
      'Email Marketing Automation',
      'Advanced Attribution Analytics',
      'Content Marketing Systems'
    ],
    process: [
      { step: 1, title: 'Keyword & Channel Audit', description: 'Analyze competitor page ranks, ad bids, and traffic patterns.' },
      { step: 2, title: 'Attribution & Tracking Check', description: 'Embed conversion tags and match parameters across platform logs.' },
      { step: 3, title: 'Copywriting & Design', description: 'Draft ad texts, visual banner boards, and structure landing pages.' },
      { step: 4, title: 'Launch & A/B Testing', description: 'Launch search ads, test headline variations, and evaluate ad sets.' },
      { step: 5, title: 'Weekly Attribution Cadence', description: 'Submit conversion metrics and adjust bid allocations.' }
    ],
    caseStudies: [],
    technologies: ['Google Analytics', 'Google Tag Manager', 'Semrush', 'Meta Business Suite', 'HubSpot'],
    faqs: [
      { question: 'When will I see search engine updates?', answer: 'Organic SEO optimization changes typically take 3 to 6 months to register on major search indexes, while paid ads generate clicks immediately.' }
    ],
    benefits: [
      'Clear calculation of acquisition costs and conversions',
      'Substantially higher volume of organic inbound inquiries',
      'Clean analytics tracking eliminating attribution uncertainty'
    ],
    cta: 'Maximize Your Digital Marketing ROI',
    featured: true,
    order: 7,
    status: 'active',
    industries: ['E-Commerce Storefronts', 'Professional Services', 'SaaS Products', 'Local Brands'],
    whyChooseUs: [
      { title: 'Clear Attribution Routing', description: 'No vanity metrics. We report leads, signups, and ROI directly.' },
      { title: 'Continuous Optimization', description: 'We test and prune ad copy and landing page nodes weekly to save budget.' }
    ]
  },
  {
    id: '8',
    slug: 'custom-software-development',
    title: 'Custom Software Development',
    shortDescription: 'Tailored enterprise software, ERP/CRM implementations, APIs, and custom SaaS foundations.',
    longDescription: 'When standard SaaS tools are not enough, we develop custom enterprise software designed specifically for your workflows. We engineer robust, audit-friendly software ranging from internal management tools and secure database APIs to custom CRM implementations and multi-tenant SaaS products.',
    category: 'Development',
    icon: Terminal,
    coverImage: serviceCustomSoftware,
    thumbnail: serviceCustomSoftware,
    overview: 'Full-stack software engineering providing custom dashboards, integrations, databases, and secure APIs.',
    offerings: [
      'Enterprise Resource Planning (ERP)',
      'Custom CRM Development',
      'Internal Tools & Portals',
      'Business Process Automation',
      'API Design & Integration',
      'Enterprise Software Systems',
      'SaaS Product Development'
    ],
    process: [
      { step: 1, title: 'Process Blueprinting', description: 'Interview administrative stakeholders and map legacy software hooks.' },
      { step: 2, title: 'Database Schema Design', description: 'Normalize database diagrams and configure access roles.' },
      { step: 3, title: 'API & Dashboard Development', description: 'Build backend pipelines and responsive administration interfaces.' },
      { step: 4, title: 'System Security Auditing', description: 'Implement authorization layers, logging trails, and penetration checks.' },
      { step: 5, title: 'Onboarding & Launch', description: 'Conduct employee sandbox training and complete final staging migration.' }
    ],
    caseStudies: [],
    technologies: ['PostgreSQL', 'TypeScript', 'Node.js', 'Express', 'Prisma', 'React'],
    faqs: [
      { question: 'Do you work with custom databases?', answer: 'Yes, we routinely build API wrappers and sync systems to connect custom legacy databases with modern SaaS platforms.' }
    ],
    benefits: [
      'Software built to adapt perfectly to your business process',
      'Zero monthly per-user licensing fees for internal tools',
      'Full data control and secure database ownership'
    ],
    cta: 'Scope Your Custom Software Solution',
    featured: true,
    order: 8,
    status: 'active',
    industries: ['Logistics & Storage', 'Hospital Management', 'Manufacturing Operations', 'Fintech Ventures'],
    whyChooseUs: [
      { title: 'Uncompromising Security', description: 'All database queries are fully sanitized and run under strict authorization parameters.' },
      { title: 'Zero User Licensing Fees', description: 'Since you own the software, you can onboard unlimited staff members without recurring costs.' }
    ]
  }
];

export const SECTION_SERVICES = {
  tag: 'Our services',
  title: 'Productized growth',
  highlight: 'you can scope and measure',
  description:
    'Eight core service verticals—from custom software engineering to digital marketing and AI integrations—each designed with transparent processes, technologies, and outcomes. Build your digital foundation with us.',
  cta: 'Request a customized proposal or SOW discussion',
} as const;
