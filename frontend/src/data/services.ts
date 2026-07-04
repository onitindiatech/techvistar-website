import {
  Globe,
  Smartphone,
  Palette,
  Cpu,
  Cloud,
  PenTool,
  Megaphone,
  Terminal,
  Settings,
  Brain,
  Repeat,
  Layers,
  Shield,
  Briefcase,
  Code2,
  Workflow,
  Search,
  BookOpen,
  LineChart,
  HardDrive,
  LucideIcon
} from 'lucide-react';

import serviceWebDev from '../assets/service_webdevlopment.png';
import serviceMobileApp from '../assets/mobile_phone_devloper.png';
import serviceUiUx from '../assets/ui_ux_designer.png';
import serviceAiAutomation from '../assets/Ai_and_atomation.png';
import serviceCloudDevops from '../assets/Claud_Devops.png';
import serviceBranding from '../assets/service_branding.png';
import serviceDigitalMarketing from '../assets/digital_marketing.png';
import serviceCustomSoftware from '../assets/custom_software_devlopment.png';
import serviceAi from '../assets/service_ai.png';
import serviceAutomation from '../assets/service_automation.png';
import serviceEnterpriseAi from '../assets/service_enterprise_ai.png';
import serviceCloud from '../assets/service_cloud.png';
import serviceDevops from '../assets/service_devops.png';
import serviceCloudInfra from '../assets/service_cloud_infra.png';
import serviceCreativeDesign from '../assets/service_creative_design.png';
import serviceProductDesign from '../assets/service_product_design.png';
import serviceSaas from '../assets/service_saas.png';
import serviceProductEng from '../assets/service_product_eng.png';
import serviceRevenueWeb from '../assets/service_revenue_web.png';
import serviceDocsResearch from '../assets/service_docs_research.png';

export interface ServiceStat {
  value: string;
  label: string;
  iconType: 'rocket' | 'clock' | 'dollar' | 'chart' | 'shield' | 'star';
  colorTheme: 'green' | 'purple' | 'gold' | 'blue';
}

export interface DetailedOffering {
  title: string;
  description: string;
  badges: string[];
  color: string;
  iconName: string;
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
  detailedOfferings?: DetailedOffering[];
  dashboardImage?: string;
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
    detailedOfferings: [
      {
        title: 'Business Websites',
        description: 'Establish immediate brand authority with custom, responsive, and high-performance business web presence.',
        badges: ['React', 'Next.js', 'SEO'],
        color: 'blue',
        iconName: 'globe'
      },
      {
        title: 'E-Commerce Storefronts',
        description: 'Secure, fast-loading, and conversion-optimized checkout layouts integrated with popular payment gateways.',
        badges: ['Stripe', 'Tailwind', 'Next.js'],
        color: 'green',
        iconName: 'layout'
      },
      {
        title: 'Custom CMS Solutions',
        description: 'Provide team autonomy with flexible headless architectures tailored to your content publishing workflows.',
        badges: ['Sanity', 'Strapi', 'GraphQL'],
        color: 'purple',
        iconName: 'filetext'
      },
      {
        title: 'SaaS Platforms',
        description: 'Launch multi-tenant architectures engineered with strict subscription models and interactive dashboards.',
        badges: ['PostgreSQL', 'Node.js', 'Vite'],
        color: 'orange',
        iconName: 'layers'
      }
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
    ],
    dashboardImage: 'sustainability_dashboard'
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
    detailedOfferings: [
      {
        title: 'iOS & Android Native Development',
        description: 'Build native applications leveraging device-specific hardware APIs for optimal execution speed.',
        badges: ['Swift', 'Kotlin', 'CoreData'],
        color: 'blue',
        iconName: 'smartphone'
      },
      {
        title: 'React Native & Flutter Builds',
        description: 'Deploy uniform cross-platform codebases to save production time while maintaining 60fps animations.',
        badges: ['React Native', 'Flutter', 'TypeScript'],
        color: 'green',
        iconName: 'code'
      },
      {
        title: 'Enterprise Mobile Solutions',
        description: 'Construct secure mobile portals integrated directly with corporate single sign-on (SSO) systems.',
        badges: ['OAuth2', 'Keychain', 'Firebase'],
        color: 'purple',
        iconName: 'shield'
      },
      {
        title: 'App Store Optimization & Release',
        description: 'Manage full application publishing flows, compliance criteria, review escalations, and store descriptions.',
        badges: ['AppStore', 'PlayStore', 'Fastlane'],
        color: 'orange',
        iconName: 'checkcircle'
      }
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
    ],
    dashboardImage: 'mobility_routing_dashboard'
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
    detailedOfferings: [
      {
        title: 'User Experience Research',
        description: 'Understand target demographics via contextual inquiry, interviews, and visual behavioral tracking maps.',
        badges: ['User Testing', 'Hotjar', 'Persona Mapping'],
        color: 'blue',
        iconName: 'search'
      },
      {
        title: 'High-Fidelity Wireframes',
        description: 'Map interaction structures and information hierarchies before entering full pixel decoration.',
        badges: ['Figma', 'UX flows', 'Interactive'],
        color: 'purple',
        iconName: 'layouttemplate'
      },
      {
        title: 'Component-Based Design Systems',
        description: 'Standardize reusable typography, colors, padding rules, and element assets for easy UI builds.',
        badges: ['Figma Variables', 'Framer Tokens', 'Storybook'],
        color: 'green',
        iconName: 'palette'
      },
      {
        title: 'Tactile Interface Prototyping',
        description: 'Build clicks, custom transitions, and interactive user validation loops inside clickable wireframes.',
        badges: ['Figma Prototype', 'Micro-interactions', 'Animate'],
        color: 'orange',
        iconName: 'sparkles'
      }
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
    ],
    dashboardImage: 'sentiment_nlp_dashboard'
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
    detailedOfferings: [
      {
        title: 'AI Chatbots',
        description: 'Intelligent conversational assistants powered by LLMs for automated customer service.',
        badges: ['GPT-4', 'WhatsApp', 'Website'],
        color: 'green',
        iconName: 'message'
      },
      {
        title: 'AI Agents',
        description: 'Autonomous agents that plan and execute multi-step workflows with external tools.',
        badges: ['LangChain', 'CrewAI', 'Python'],
        color: 'blue',
        iconName: 'bot'
      },
      {
        title: 'Workflow Automation',
        description: 'Connect internal apps to automate data entries, syncs, and notification schedules.',
        badges: ['n8n', 'Make', 'REST APIs'],
        color: 'purple',
        iconName: 'repeat'
      },
      {
        title: 'LLM Integration',
        description: 'Wire state-of-the-art language models directly into your business services database.',
        badges: ['OpenAI', 'Claude', 'Llama 3'],
        color: 'orange',
        iconName: 'sparkles'
      },
      {
        title: 'RAG Systems',
        description: 'Implement Retrieval-Augmented Generation to restrict LLMs to your secure documentation.',
        badges: ['Pinecone', 'Pgvector', 'PDFs'],
        color: 'red',
        iconName: 'database'
      },
      {
        title: 'AI Assistants',
        description: 'Custom integrated tools that run contextually inside slack, browsers or local software.',
        badges: ['Copilot', 'Chrome Ext', 'Slack'],
        color: 'indigo',
        iconName: 'usercheck'
      },
      {
        title: 'Custom AI Solutions',
        description: 'Completely customized models, data pipelines, and private servers configured for operations.',
        badges: ['PyTorch', 'AWS GPU', 'Custom API'],
        color: 'green',
        iconName: 'settings'
      }
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
      { question: 'How do you prevent AI hallucinations?', answer: 'We implement Retrieval-Augmented Generation (RAG) to restrict model contexts to verified internal documentation and apply strict content filters.' },
      { question: 'How do we manage API token costs and usage limits?', answer: 'We build semantic caching layers to reuse response structures, throttle heavy consumer requests, and route lighter queries to open-source models like Llama 3.' },
      { question: 'Will our proprietary business data be used to train public LLMs?', answer: 'No. We configure private cloud instances (AWS/Azure VPC) and strictly utilize zero-data retention enterprise API contracts so your data remains entirely confidential.' },
      { question: 'Can your AI workflows connect to our legacy internal systems?', answer: 'Yes. We construct custom webhooks, secure REST API bridges, and database synchronization pipelines to connect legacy platforms with modern orchestration frameworks.' }
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
    ],
    dashboardImage: 'ai_overview_illustration'
  },
  {
    id: '5',
    slug: 'cloud',
    title: 'Cloud Solutions',
    shortDescription: 'Reliable cloud architectures, storage configurations, secure migrations, and zero-downtime hosting.',
    longDescription: 'We design high-availability cloud solutions tailored to enterprise workloads. By setting up virtual networks, redundant storage arrays, multi-region load balancers, and continuous security scanners, we establish resilient systems built to scale seamlessly during massive traffic spikes.',
    category: 'Infrastructure',
    icon: Cloud,
    coverImage: serviceCloud,
    thumbnail: serviceCloud,
    overview: 'Establish secure, elastic, and high-performance cloud networks under industry-standard isolation models.',
    offerings: [
      'AWS Deployments',
      'Azure Integration',
      'Cloud Migration',
      'Infrastructure Security',
      'Server Configuration'
    ],
    detailedOfferings: [
      {
        title: 'Virtual Private Clouds',
        description: 'Isolate sensitive database environments inside custom configured private networks.',
        badges: ['AWS VPC', 'Azure VNet', 'Subnets'],
        color: 'blue',
        iconName: 'cloud'
      },
      {
        title: 'High-Availability Hosting',
        description: 'Deploy auto-scaling web servers backed by multi-region failover rules to secure uptime.',
        badges: ['EC2', 'Load Balancers', 'Route 53'],
        color: 'green',
        iconName: 'globe'
      },
      {
        title: 'Secure Database Storage',
        description: 'Set up transactional SQL databases with automatic daily backups and encrypted volume configurations.',
        badges: ['RDS', 'DynamoDB', 'AES-256'],
        color: 'purple',
        iconName: 'database'
      },
      {
        title: 'Zero-Downtime Migration',
        description: 'Shift legacy web platforms onto cloud configurations without interrupting user interactions.',
        badges: ['DMS', 'DNS Switches', 'Rsync'],
        color: 'orange',
        iconName: 'repeat'
      }
    ],
    process: [
      { step: 1, title: 'System Auditing', description: 'Analyze existing server capacities, database sizes, and request volumes.' },
      { step: 2, title: 'Topology Blueprinting', description: 'Draw network schemas illustrating VPC setups, gateways, and load rules.' },
      { step: 3, title: 'Environment Build', description: 'Script and configure virtual servers, database layers, and storage endpoints.' },
      { step: 4, title: 'Migration Track Run', description: 'Run test datasets to confirm transfer rates and verify latency profiles.' },
      { step: 5, title: 'Final DNS Switch', description: 'Perform live cutovers with continuous monitoring during DNS updates.' }
    ],
    caseStudies: [],
    technologies: ['AWS', 'Azure', 'Linux', 'RDS', 'VPC', 'IAM'],
    faqs: [
      { question: 'Will there be any downtime during migration?', answer: 'We utilize side-by-side environments and real-time database replication to ensure your users experience absolutely zero service interruptions.' }
    ],
    benefits: [
      'Drastically reduced hosting latency for worldwide users',
      'Automatic resource scaling to easily match traffic waves',
      'Secure data containment passing formal compliance checks'
    ],
    cta: 'Discuss Your Cloud Topology',
    featured: false,
    order: 5,
    status: 'active',
    industries: ['SaaS Ventures', 'Enterprise Logistics', 'Healthcare Providers', 'Large Retail Platforms'],
    whyChooseUs: [
      { title: 'High-Availability Target', description: 'Our custom topologies are designed to exceed 99.9% uptime targets.' },
      { title: 'Strict IAM Configuration', description: 'We follow the principle of least privilege to secure all server consoles.' }
    ],
    stats: [
      { value: '99.99%', label: 'Target Uptime', iconType: 'shield', colorTheme: 'green' },
      { value: '30%', label: 'Latency Cut', iconType: 'rocket', colorTheme: 'purple' },
      { value: '2x', label: 'Elastic Scale', iconType: 'chart', colorTheme: 'gold' },
      { value: '100%', label: 'Encrypted Data', iconType: 'shield', colorTheme: 'blue' }
    ],
    dashboardImage: 'ai_translator'
  },
  {
    id: '6',
    slug: 'devops',
    title: 'DevOps & CI/CD',
    shortDescription: 'Continuous Integration pipelines, infrastructure automation, Docker containers, and environment tuning.',
    longDescription: 'We streamline development flows by bridging code changes with production servers. Through Infrastructure as Code (IaC), scriptable build nodes, Docker containerization, and automated test integrations, we help technical teams launch updates faster with minimal manual friction.',
    category: 'Infrastructure',
    icon: Settings,
    coverImage: serviceDevops,
    thumbnail: serviceDevops,
    overview: 'Automate build runs and standardize hosting nodes using clean Infrastructure as Code templates.',
    offerings: [
      'CI/CD Pipelines',
      'Infrastructure as Code',
      'Docker Containerization',
      'Kubernetes Orchestration',
      'Application Monitoring'
    ],
    detailedOfferings: [
      {
        title: 'CI/CD Pipeline Automation',
        description: 'Set up automated verification pipelines running unit checks on every code commit.',
        badges: ['GitHub Actions', 'Jenkins', 'Webhooks'],
        color: 'blue',
        iconName: 'repeat'
      },
      {
        title: 'Infrastructure as Code',
        description: 'Define your production systems as clean declarative script files for fast replication.',
        badges: ['Terraform', 'Ansible', 'YAML'],
        color: 'purple',
        iconName: 'code'
      },
      {
        title: 'Docker Containerization',
        description: 'Bundle web applications and background workers into lightweight, uniform runtime environments.',
        badges: ['Docker', 'Compose', 'Registry'],
        color: 'green',
        iconName: 'layers'
      },
      {
        title: 'Production Logs & Monitoring',
        description: 'Integrate real-time notification alerts tracking memory leaks or server CPU bottlenecks.',
        badges: ['Prometheus', 'Grafana', 'Sentry'],
        color: 'orange',
        iconName: 'settings'
      }
    ],
    process: [
      { step: 1, title: 'Workflow Inspection', description: 'Review build scripts, environment patterns, and deploy times.' },
      { step: 2, title: 'Docker Packaging', description: 'Compose multi-stage Dockerfiles to standardize software contexts.' },
      { step: 3, title: 'CI/CD Scripting', description: 'Write automation files running builds, lints, and test scripts.' },
      { step: 4, title: 'IaC Provisioning', description: 'Compile Terraform scripts declaring virtual servers and firewalls.' },
      { step: 5, title: 'Orchestration Launch', description: 'Deploy containers onto host nodes under automatic restart rules.' }
    ],
    caseStudies: [],
    technologies: ['Docker', 'Terraform', 'GitHub Actions', 'Kubernetes', 'Grafana', 'Prometheus'],
    faqs: [
      { question: 'What CI/CD platforms do you work with?', answer: 'We typically build integrations inside GitHub Actions, GitLab CI, or local Jenkins installations depending on codebase locations.' }
    ],
    benefits: [
      'Rapid code release cycle with automated testing',
      'Identical staging and production environments',
      'Instant rollback features in case of system bugs'
    ],
    cta: 'Streamline Your Deployment Pipeline',
    featured: false,
    order: 6,
    status: 'active',
    industries: ['Tech Startups', 'Fintech Teams', 'SaaS Products', 'Corporate Engineering'],
    whyChooseUs: [
      { title: 'One-Click Deployments', description: 'We automate deployments so engineers can update live code safely in under 5 minutes.' },
      { title: 'Standard Environments', description: 'No more "works on my machine" errors thanks to strict containerization.' }
    ],
    stats: [
      { value: '5 Min', label: 'Deploy Time', iconType: 'clock', colorTheme: 'green' },
      { value: '90%', label: 'Fewer Failures', iconType: 'shield', colorTheme: 'purple' },
      { value: '10x', label: 'More Releases', iconType: 'rocket', colorTheme: 'gold' },
      { value: '100%', label: 'IaC Configured', iconType: 'code', colorTheme: 'blue' }
    ],
    dashboardImage: 'crop_health_analysis'
  },
  {
    id: '7',
    slug: 'ai',
    title: 'Artificial Intelligence',
    shortDescription: 'Cognitive models, custom LLM fine-tuning, neural networks, and semantic vector indexing.',
    longDescription: 'We engineer complex machine learning architectures. By designing custom data pipelines, compiling training datasets, fine-tuning state-of-the-art open-source LLMs, and setting up secure GPU inference servers, we construct advanced cognitive models tailored to domain-specific knowledge bases.',
    category: 'Advanced Technology',
    icon: Brain,
    coverImage: serviceAi,
    thumbnail: serviceAi,
    overview: 'Develop specialized cognitive architectures capable of parsing complex tabular and text resources.',
    offerings: [
      'LLM Fine-Tuning',
      'Custom Tabular Models',
      'Semantic Search Engines',
      'Neural Architectures',
      'Vector Data Systems'
    ],
    detailedOfferings: [
      {
        title: 'Model Fine-Tuning',
        description: 'Train open-source models like Llama 3 on proprietary company logs to specialize in your terminology.',
        badges: ['Llama 3', 'PyTorch', 'LoRA'],
        color: 'blue',
        iconName: 'brain'
      },
      {
        title: 'Semantic Text Search',
        description: 'Build index nodes that retrieve documentation based on conceptual intent rather than literal words.',
        badges: ['Pinecone', 'Embeddings', 'Pgvector'],
        color: 'purple',
        iconName: 'search'
      },
      {
        title: 'GPU Inference Servers',
        description: 'Deploy hardware-accelerated endpoints configured for high-throughput model requests.',
        badges: ['vLLM', 'AWS EC2 GPU', 'Docker'],
        color: 'green',
        iconName: 'cpu'
      },
      {
        title: 'Cognitive Data Pipelines',
        description: 'Clean, parse, and structure messy PDF/Word files into uniform, audit-ready vector formats.',
        badges: ['Pandas', 'LlamaIndex', 'Python'],
        color: 'orange',
        iconName: 'filetext'
      }
    ],
    process: [
      { step: 1, title: 'Data Audit', description: 'Analyze your company document formats, cleanliness, and size profiles.' },
      { step: 2, title: 'Vector Pipeline Setup', description: 'Script scrapers and text chunkers feeding data to vector stores.' },
      { step: 3, title: 'Model Selection & Training', description: 'Select base models, write tuning scripts, and monitor training loss.' },
      { step: 4, title: 'API Wrapper Build', description: 'Build secure, gated backend endpoints to handle model inputs.' },
      { step: 5, title: 'Inference Tuning', description: 'Optimize token throughput, response cache, and model load balancing.' }
    ],
    caseStudies: [],
    technologies: ['Python', 'PyTorch', 'Hugging Face', 'Pinecone', 'vLLM', 'AWS GPU'],
    faqs: [
      { question: 'Do you host models locally or use third-party APIs?', answer: 'We support both. We configure private cloud hosting for maximum control or use secure enterprise contracts with API providers.' }
    ],
    benefits: [
      'Instant extraction of relevant insights from unstructured text',
      'Lower running fees compared to generic commercial models',
      'Complete intellectual property control over your custom model weight variables'
    ],
    cta: 'Design Your Custom AI System',
    featured: false,
    order: 7,
    status: 'active',
    industries: ['Fintech Analysts', 'Legal Documentation Teams', 'Healthcare Analytics', 'Enterprise Support'],
    whyChooseUs: [
      { title: 'Zero Data Retention', description: 'We strictly compile private networks so your data is never used to train public models.' },
      { title: 'Pragmatic Engineering', description: 'We only recommend AI when standard algorithmic code is insufficient.' }
    ],
    stats: [
      { value: '10x', label: 'Search Speedup', iconType: 'rocket', colorTheme: 'green' },
      { value: '50%', label: 'Lower Token Fee', iconType: 'dollar', colorTheme: 'purple' },
      { value: '96%', label: 'Accuracy Rating', iconType: 'shield', colorTheme: 'gold' },
      { value: '100%', label: 'Private Data IP', iconType: 'shield', colorTheme: 'blue' }
    ],
    dashboardImage: 'ai_overview_illustration'
  },
  {
    id: '8',
    slug: 'automation',
    title: 'Operations Automation',
    shortDescription: 'Workflow orchestration, legacy API wrappers, background tasks, and scheduled data syncs.',
    longDescription: 'We eliminate manual click work by bridging digital operations. By setting up event listener nodes, scheduled background tasks, automated data entry workers, and API translation wrappers, we build reliable system-to-system connections that run silently 24/7.',
    category: 'Advanced Technology',
    icon: Repeat,
    coverImage: serviceAutomation,
    thumbnail: serviceAutomation,
    overview: 'Connect disjointed software tools using clean automation paths and custom webhooks.',
    offerings: [
      'n8n Orchestration',
      'Legacy System API Wrappers',
      'Scheduled Data Syncs',
      'Notification Routines',
      'Email Parsing Automation'
    ],
    detailedOfferings: [
      {
        title: 'Workflow Orchestration',
        description: 'Configure automated paths that coordinate actions between internal apps based on live events.',
        badges: ['n8n', 'Make', 'JSON'],
        color: 'blue',
        iconName: 'repeat'
      },
      {
        title: 'Legacy System Bridges',
        description: 'Write custom API adapters to expose database read/write actions on older software.',
        badges: ['Express', 'Node.js', 'REST'],
        color: 'purple',
        iconName: 'code'
      },
      {
        title: 'Structured Email Parsing',
        description: 'Automatically extract order numbers or client names from inbound mail and update CRM records.',
        badges: ['RegEx', 'IMAP', 'Zod'],
        color: 'green',
        iconName: 'filetext'
      },
      {
        title: 'Scheduled Sync Routines',
        description: 'Deploy scheduled cron tasks to reconcile inventory levels across separate retail catalogs.',
        badges: ['Cron', 'PostgreSQL', 'Scripting'],
        color: 'orange',
        iconName: 'database'
      }
    ],
    process: [
      { step: 1, title: 'Workflow Blueprinting', description: 'Document manual employee tasks, triggers, inputs, and destination systems.' },
      { step: 2, title: 'API Access Verification', description: 'Configure secure API key variables and verify endpoint responses.' },
      { step: 3, title: 'Workflow Setup', description: 'Script translation steps and configure visual flow blocks.' },
      { step: 4, title: 'Exception Logic Build', description: 'Write validation checks, error notification pings, and data retries.' },
      { step: 5, title: 'Production Rollout', description: 'Enable trigger nodes, verify logs, and monitor execution costs.' }
    ],
    caseStudies: [],
    technologies: ['n8n', 'Node.js', 'PostgreSQL', 'Cron', 'REST APIs', 'Webhooks'],
    faqs: [
      { question: 'What happens if an API is temporarily down?', answer: 'We implement automatic backoff retry queues and instant notifications on Slack/Discord to ensure no event is lost.' }
    ],
    benefits: [
      'Fewer human typos in data entry operations',
      'Immediate actioning of incoming customer inquiries',
      'Elimination of repetitive, boring copy-paste work'
    ],
    cta: 'Automate Your Workflows Today',
    featured: false,
    order: 8,
    status: 'active',
    industries: ['Logistics Teams', 'Real Estate Agencies', 'Customer Support Departments', 'E-Commerce Retailers'],
    whyChooseUs: [
      { title: 'Audit Trail Logs', description: 'Every automated run is saved under a log showing exactly what values changed.' },
      { title: 'Clean Error Checks', description: 'We isolate failures so one broken API does not halt unrelated workflows.' }
    ],
    stats: [
      { value: '24/7', label: 'Execution', iconType: 'clock', colorTheme: 'green' },
      { value: '0', label: 'Data Typos', iconType: 'shield', colorTheme: 'purple' },
      { value: '40hr', label: 'Saved / Month', iconType: 'rocket', colorTheme: 'gold' },
      { value: '100%', label: 'Error Logged', iconType: 'shield', colorTheme: 'blue' }
    ],
    dashboardImage: 'crop_health_analysis'
  },
  {
    id: '9',
    slug: 'branding',
    title: 'Branding',
    shortDescription: 'Distinct visual identities, logo marks, brand assets, and marketing collateral with cohesive brand narratives.',
    longDescription: 'We translate your business goals into premium visual marks that establish immediate market trust. From logo creation and typography guidelines to packaging designs, marketing assets, presentations, and visual identity books, we establish unified standards that reflect your core values.',
    category: 'Design',
    icon: PenTool,
    coverImage: serviceBranding,
    thumbnail: serviceBranding,
    overview: 'Create and systemize brand logos, marketing assets, and corporate design elements.',
    offerings: [
      'Logo Design',
      'Brand Identity Systems',
      'Packaging Design',
      'Corporate Guidelines',
      'Brand Books'
    ],
    detailedOfferings: [
      {
        title: 'Brand Identity Systems',
        description: 'Establish visual guidelines defining logos, primary colors, typeface metrics, and design standards.',
        badges: ['Brand Book', 'Typography', 'Assets'],
        color: 'blue',
        iconName: 'palette'
      },
      {
        title: 'Vector Logomarks',
        description: 'Design unique, scalable logo shapes engineered to render beautifully from site headers to print cards.',
        badges: ['Illustrator', 'SVG', 'Visuals'],
        color: 'green',
        iconName: 'pentool'
      },
      {
        title: 'Packaging & Print Design',
        description: 'Create premium box mockups, label shapes, and print materials aligned with corporate branding.',
        badges: ['InDesign', 'Packaging', 'Print'],
        color: 'purple',
        iconName: 'layouttemplate'
      },
      {
        title: 'Corporate Stationery',
        description: 'Align business cards, letterheads, envelope scales, and corporate files to the visual identity.',
        badges: ['Stationery', 'Business Cards', 'PDF'],
        color: 'orange',
        iconName: 'checkcircle'
      }
    ],
    process: [
      { step: 1, title: 'Creative Concepts', description: 'Establish design moods, brand values, and color spaces.' },
      { step: 2, title: 'Typography & Logomarks', description: 'Sketch distinct geometry vector marks and review fonts.' },
      { step: 3, title: 'Asset Implementations', description: 'Mock layouts across stationery, packaging, or slide sheets.' },
      { step: 4, title: 'Identity Documentation', description: 'Draft detailed brand books defining minimum clearance rules.' }
    ],
    caseStudies: [],
    technologies: ['Illustrator', 'Photoshop', 'InDesign', 'Figma'],
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
    order: 9,
    status: 'active',
    industries: ['Retail & FMCG', 'Tech Startups', 'Corporate Agencies', 'Real Estate'],
    whyChooseUs: [
      { title: 'Unique Identity', description: 'We design from scratch without utilizing premade online layouts or generic vectors.' },
      { title: 'Consistent Brand Books', description: 'We document visual guidelines so your designers can execute consistently.' }
    ],
    stats: [
      { value: '100%', label: 'Original Vector', iconType: 'shield', colorTheme: 'green' },
      { value: '2.5x', label: 'Brand Recall', iconType: 'star', colorTheme: 'purple' },
      { value: '45+', label: 'Page Guideline', iconType: 'clock', colorTheme: 'gold' },
      { value: 'SVG', label: 'Format Export', iconType: 'rocket', colorTheme: 'blue' }
    ],
    dashboardImage: 'resume_review_assistant'
  },
  {
    id: '9-2',
    slug: 'creative-design',
    title: 'Creative Design',
    shortDescription: 'Motion graphics, digital illustrations, marketing creatives, and custom vector assets for campaigns.',
    longDescription: 'We craft compelling digital artwork and kinetic media designed to engage online audiences. From marketing banner ads and corporate slide sheets to social media vectors and custom site illustrations, we support campaign needs with fast execution pipelines.',
    category: 'Design',
    icon: Layers,
    coverImage: serviceCreativeDesign,
    thumbnail: serviceCreativeDesign,
    overview: 'Design interactive, animated, and visual assets tailored for digital platforms and social campaigns.',
    offerings: [
      'Graphic Design Assets',
      'Marketing Creatives',
      'Presentation Design',
      'Motion Graphics',
      'Digital Illustrations'
    ],
    detailedOfferings: [
      {
        title: 'Motion Graphics',
        description: 'Inject kinetic energy into assets with custom transitions, logo animation, and video loops.',
        badges: ['After Effects', 'Premiere Pro', 'Lottie'],
        color: 'blue',
        iconName: 'sparkles'
      },
      {
        title: 'Custom Illustrations',
        description: 'Compile unique UI graphics, vector scenes, and icon sets tailored to site styles.',
        badges: ['Illustrator', 'Figma', 'Vector'],
        color: 'purple',
        iconName: 'pentool'
      },
      {
        title: 'Presentation & Deck Design',
        description: 'Format corporate slide decks matching layout constraints, brand details, and font scales.',
        badges: ['Keynote', 'PowerPoint', 'Slides'],
        color: 'green',
        iconName: 'layouttemplate'
      },
      {
        title: 'Marketing & Ad Creatives',
        description: 'Draft conversion-oriented social ad banners, banner sets, and visual campaign blocks.',
        badges: ['Photoshop', 'Figma', 'Ads'],
        color: 'orange',
        iconName: 'megaphone'
      }
    ],
    process: [
      { step: 1, title: 'Visual Direction', description: 'Define asset themes, illustration styles, and animation paces.' },
      { step: 2, title: 'Storyboard & Drafting', description: 'Sketch storyboards for motion works or drafts for illustrations.' },
      { step: 3, title: 'Asset Compilation', description: 'Render high-resolution visual files and animate vector keys.' },
      { step: 4, title: 'Format Delivery', description: 'Export final works in JSON (Lottie), MP4, SVG, or layered assets.' }
    ],
    caseStudies: [],
    technologies: ['After Effects', 'Photoshop', 'Illustrator', 'Figma', 'Premiere Pro'],
    faqs: [
      { question: 'What file formats do you deliver for animation?', answer: 'We deliver in MP4, WebM, and Lottie (JSON) format for web micro-animations.' }
    ],
    benefits: [
      'Engaging animated elements enhancing interface interactions',
      'Custom vector styles unique to your brand identity',
      'Flexible sizes for diverse social platform structures'
    ],
    cta: 'Discuss Your Creative Project',
    featured: false,
    order: 9,
    status: 'active',
    industries: ['SaaS platforms', 'Digital Advertisers', 'E-Commerce Brands', 'Social Media Agencies'],
    whyChooseUs: [
      { title: 'Tailored Media Assets', description: 'We customize vector styles matching your brand layout guidelines.' },
      { title: 'Interactive Formats', description: 'We support Web/Lottie outputs for fast load speeds.' }
    ],
    stats: [
      { value: 'Lottie', label: 'Web Format', iconType: 'rocket', colorTheme: 'green' },
      { value: '24hr', label: 'Turnaround', iconType: 'clock', colorTheme: 'purple' },
      { value: '100%', label: 'Custom Drawn', iconType: 'star', colorTheme: 'gold' },
      { value: 'SVG', label: 'Vector Format', iconType: 'code', colorTheme: 'blue' }
    ],
    dashboardImage: 'resume_review_assistant'
  },
  {
    id: '10',
    slug: 'product-design',
    title: 'Product Design',
    shortDescription: 'Tactile concept development, feature scoping, detailed wireframing, and interactive usability tests.',
    longDescription: 'We translate digital ideas into tangible web products. By mapping user flows, defining feature lists, sketching low-fidelity layout structures, and building clickable prototype mockups, we validate interface directions before committing engineering resources.',
    category: 'Design',
    icon: Layers,
    coverImage: serviceProductDesign,
    thumbnail: serviceProductDesign,
    overview: 'Conceptualize and refine complex digital structures into elegant, click-tested interactive frameworks.',
    offerings: [
      'Product Wireframing',
      'UX Flow Mapping',
      'Concept Validation',
      'Usability Run Testing',
      'Design Hand-off Specs'
    ],
    detailedOfferings: [
      {
        title: 'User Journey Mapping',
        description: 'Trace step-by-step paths a user follows to register, upgrade, or complete transactions.',
        badges: ['User Flows', 'Miro', 'Mindmap'],
        color: 'blue',
        iconName: 'network'
      },
      {
        title: 'High-Fidelity Wireframes',
        description: 'Draft structural layouts indicating exact text placements, field weights, and button scales.',
        badges: ['Figma', 'Grid Rules', 'Layout'],
        color: 'purple',
        iconName: 'layouttemplate'
      },
      {
        title: 'Usability Walkthroughs',
        description: 'Coordinate test sessions with users to reveal hidden points of friction in layout interactions.',
        badges: ['UsabilityTest', 'Zoom', 'Feedback'],
        color: 'green',
        iconName: 'usercheck'
      },
      {
        title: 'Developer Spec Sheets',
        description: 'Provide spacing annotations, typography labels, and SVG assets to developers for clean styling.',
        badges: ['Figma Specs', 'Tokens', 'Hand-off'],
        color: 'orange',
        iconName: 'terminal'
      }
    ],
    process: [
      { step: 1, title: 'Concept Blueprinting', description: 'Brainstorm feature scopes, outline user profiles, and map milestones.' },
      { step: 2, title: 'Wireframe Layouts', description: 'Compile low-fidelity structural blueprints mapping information blocks.' },
      { step: 3, title: 'Interactive Prototype', description: 'Link wireframe screens inside Figma with clickable navigation paths.' },
      { step: 4, title: 'Usability Audit', description: 'Record real user interactions on prototypes and compile design edits.' }
    ],
    caseStudies: [],
    technologies: ['Figma', 'Miro', 'Loom', 'Figjam', 'Storybook'],
    faqs: [
      { question: 'What is the main difference between Product Design and UI/UX?', answer: 'Product Design focuses on business goals, features, and overall validation, while UI/UX targets the specific visual layouts and user pathways.' }
    ],
    benefits: [
      'Minimize engineering rework by validating ideas early',
      'Clean structural alignment matching business specifications',
      'Tactile prototypes ready for investor presentations'
    ],
    cta: 'Scope Your Digital Product Design',
    featured: false,
    order: 10,
    status: 'active',
    industries: ['SaaS Startups', 'Fintech Teams', 'Mobile App Ventures', 'Healthcare Portals'],
    whyChooseUs: [
      { title: 'Validation First', description: 'We test interaction flow concept structures before writing any code.' },
      { title: 'Clean Figma Hygiene', description: 'We build layouts utilizing components and variables to simplify developers jobs.' }
    ],
    stats: [
      { value: '3x', label: 'Fewer Dev Changes', iconType: 'clock', colorTheme: 'green' },
      { value: '100%', label: 'Figma Auto-Layout', iconType: 'shield', colorTheme: 'purple' },
      { value: '25+', label: 'User Test Runs', iconType: 'star', colorTheme: 'gold' },
      { value: 'Interactive', label: 'Handoff Format', iconType: 'rocket', colorTheme: 'blue' }
    ],
    dashboardImage: 'sentiment_nlp_dashboard'
  },
  {
    id: '11',
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
    detailedOfferings: [
      {
        title: 'Custom ERP Solutions',
        description: 'Unify company operations into one secure repository covering inventory logs, records, and pipelines.',
        badges: ['PostgreSQL', 'Prisma', 'React'],
        color: 'blue',
        iconName: 'database'
      },
      {
        title: 'Internal Admin Portals',
        description: 'Build fast, interactive dashboards for staff members to parse company records and trigger tasks.',
        badges: ['Vite', 'TypeScript', 'Node.js'],
        color: 'purple',
        iconName: 'layout'
      },
      {
        title: 'Robust REST APIs',
        description: 'Architect secure, fast-responding JSON endpoints with strict input checks and API specs.',
        badges: ['Express', 'Zod', 'Swagger'],
        color: 'green',
        iconName: 'code'
      },
      {
        title: 'SaaS Core Architecture',
        description: 'Deploy multi-tenant database patterns with subscription gates and multi-role user dashboards.',
        badges: ['Stripe', 'OAuth', 'NodeJS'],
        color: 'orange',
        iconName: 'layers'
      }
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
    order: 11,
    status: 'active',
    industries: ['Logistics & Storage', 'Hospital Management', 'Manufacturing Operations', 'Fintech Ventures'],
    whyChooseUs: [
      { title: 'Uncompromising Security', description: 'All database queries are fully sanitized and run under strict authorization parameters.' },
      { title: 'Zero User Licensing Fees', description: 'Since you own the software, you can onboard unlimited staff members without recurring costs.' }
    ],
    stats: [
      { value: '0$', label: 'Licensing Fee', iconType: 'dollar', colorTheme: 'green' },
      { value: '99.9%', label: 'Database Uptime', iconType: 'shield', colorTheme: 'purple' },
      { value: '100%', label: 'SQL Sanitization', iconType: 'shield', colorTheme: 'gold' },
      { value: 'REST', label: 'API Formats', iconType: 'rocket', colorTheme: 'blue' }
    ],
    dashboardImage: 'mobility_routing_dashboard'
  },
  {
    id: '12',
    slug: 'saas-platforms',
    title: 'SaaS Platforms',
    shortDescription: 'Multi-tenant databases, subscription gates, custom metrics, and scalable API layers.',
    longDescription: 'We build subscription software platforms engineered to handle growing user workloads. From configuring database multi-tenancy and Stripe payment webhooks to coding custom dashboards and structuring user privilege roles, we build the core engines of SaaS businesses.',
    category: 'Development',
    icon: Layers,
    coverImage: serviceSaas,
    thumbnail: serviceSaas,
    overview: 'Deploy secure, scalable, and audit-friendly SaaS software frameworks.',
    offerings: [
      'Multi-Tenant Databases',
      'Stripe Integration',
      'Privilege Roles Routing',
      'Custom KPI Dashboards',
      'Notification Dispatchers'
    ],
    detailedOfferings: [
      {
        title: 'Multi-Tenant Databases',
        description: 'Secure customer datasets by setting up isolated database schemas or tenant ID routing.',
        badges: ['PostgreSQL', 'Prisma', 'Row-Level'],
        color: 'blue',
        iconName: 'database'
      },
      {
        title: 'Subscription Gating',
        description: 'Integrate billing structures with webhooks to enable page access based on active levels.',
        badges: ['Stripe', 'Paddle', 'Webhooks'],
        color: 'green',
        iconName: 'shield'
      },
      {
        title: 'Interactive User Dashboards',
        description: 'Expose charts, tables, and system logs to users via fast-loading React components.',
        badges: ['Recharts', 'Tailwind', 'Vite'],
        color: 'purple',
        iconName: 'layout'
      },
      {
        title: 'Multi-Role Authorization',
        description: 'Establish privilege rules routing requests based on whether users are admins, members, or guests.',
        badges: ['JWT', 'RBAC', 'Cookies'],
        color: 'orange',
        iconName: 'usercheck'
      }
    ],
    process: [
      { step: 1, title: 'Billing & Role Specs', description: 'Define user subscription tiers, permissions, and payment details.' },
      { step: 2, title: 'DB Schema Creation', description: 'Normalize tables covering users, organizations, invoices, and logs.' },
      { step: 3, title: 'Engine & API Engineering', description: 'Code background billers, auth routes, and service controllers.' },
      { step: 4, title: 'Integration Audit', description: 'Test Stripe billing scenarios, role route gates, and page loads.' }
    ],
    caseStudies: [],
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe API', 'Prisma', 'JWT'],
    faqs: [
      { question: 'How do you handle multi-tenancy?', answer: 'We typically use logical separation with a shared database and tenant columns, or physical schema separation depending on your compliance requirements.' }
    ],
    benefits: [
      'Scalable multi-tenant databases holding separate client structures',
      'Automated subscription updates reducing manual support tasks',
      'Modular layout enabling easy addition of new features'
    ],
    cta: 'Build Your SaaS Core Platform',
    featured: false,
    order: 12,
    status: 'active',
    industries: ['B2B SaaS Startups', 'E-Learning Products', 'Proptech Ventures', 'Corporate Platforms'],
    whyChooseUs: [
      { title: 'Secure Tenant Isolation', description: 'We write strict database check parameters to ensure zero cross-tenant data leaks.' },
      { title: 'Scalable API Designs', description: 'We format endpoint caches to minimize server loads during concurrent request peaks.' }
    ],
    stats: [
      { value: '100ms', label: 'Average Load', iconType: 'rocket', colorTheme: 'green' },
      { value: '100%', label: 'Secure JWT', iconType: 'shield', colorTheme: 'purple' },
      { value: 'Multi', label: 'Tenant Build', iconType: 'chart', colorTheme: 'gold' },
      { value: 'Stripe', label: 'Webhooks Sync', iconType: 'rocket', colorTheme: 'blue' }
    ],
    dashboardImage: 'ai_translator_batches'
  },
  {
    id: '13',
    slug: 'enterprise-ai-integration',
    title: 'Enterprise AI Integration',
    shortDescription: 'Embed cognitive models into legacy platforms, vector databases, custom guardrails, and compliance logs.',
    longDescription: 'We connect cutting-edge cognitive models with traditional corporate database systems. By configuring secure API wrappers, building custom data retrieval pipelines (RAG), establishing safety guardrails, and setting up vector databases, we make advanced artificial intelligence safe and useful for enterprise operations.',
    category: 'Advanced Technology',
    icon: Cpu,
    coverImage: serviceEnterpriseAi,
    thumbnail: serviceEnterpriseAi,
    overview: 'Deploy secure cognitive adapters to connect LLMs with proprietary company records.',
    offerings: [
      'Legacy AI Integrations',
      'Document Vector Indexes',
      'Prompt Safety Guardrails',
      'Inference Cache Layers',
      'Enterprise LLM Gateways'
    ],
    detailedOfferings: [
      {
        title: 'Legacy System Integration',
        description: 'Expose legacy DB tables to LLM agents securely using custom written API schemas.',
        badges: ['REST', 'OAuth', 'NodeJS'],
        color: 'blue',
        iconName: 'code'
      },
      {
        title: 'Document Vector Databases',
        description: 'Parse thousands of corporate files and store conceptual segments inside vector stores.',
        badges: ['Pinecone', 'Embeddings', 'PDFs'],
        color: 'purple',
        iconName: 'database'
      },
      {
        title: 'Safety Guardrail Layers',
        description: 'Implement input/output check scripts to prevent model hallucinations and secure private names.',
        badges: ['LlamaGuard', 'Validation', 'Filters'],
        color: 'green',
        iconName: 'shield'
      },
      {
        title: 'Semantic Cache Layers',
        description: 'Save repeating user prompts inside memory storage to return answers instantly and save token fees.',
        badges: ['Redis', 'Embeddings', 'Caching'],
        color: 'orange',
        iconName: 'repeat'
      }
    ],
    process: [
      { step: 1, title: 'Sytem Inspection', description: 'Review target legacy database layouts, security credentials, and document formats.' },
      { step: 2, title: 'Retrieval Pipeline Setup', description: 'Configure scrapers, PDF parsers, embeddings, and vector stores.' },
      { step: 3, title: 'Safety Logic Coding', description: 'Write safety filters, verification prompts, and data masks.' },
      { step: 4, title: 'Gated API Deployment', description: 'Launch private REST gateways handling all traffic going to model nodes.' }
    ],
    caseStudies: [],
    technologies: ['Python', 'Pinecone', 'LangChain', 'Redis', 'AWS VPC', 'OpenAI Enterprise'],
    faqs: [
      { question: 'Will our data be kept confidential?', answer: 'Yes, we use enterprise API agreements or self-hosted models ensuring no company files are ever logged or used to train public datasets.' }
    ],
    benefits: [
      'Expose legacy data concepts to smart LLMs safely',
      'Prevent system hallucinations using vector context limits',
      'Optimize API operational fees using response caches'
    ],
    cta: 'Integrate AI into Your Infrastructure',
    featured: true,
    order: 13,
    status: 'active',
    industries: ['Insurance Analysts', 'Banking Operations', 'Legal Firms', 'Enterprise Logistics'],
    whyChooseUs: [
      { title: 'Iron-Clad Governance', description: 'We enforce safety parameters so the models strictly use only your data.' },
      { title: 'Token Cost Optimization', description: 'We optimize prompt structures and cache recurring requests to save budget.' }
    ],
    stats: [
      { value: '0', label: 'Data Retained', iconType: 'shield', colorTheme: 'green' },
      { value: '98%', label: 'Audit Accuracy', iconType: 'star', colorTheme: 'purple' },
      { value: '5x', label: 'Faster Search', iconType: 'rocket', colorTheme: 'gold' },
      { value: 'Redis', label: 'Prompt Cache', iconType: 'code', colorTheme: 'blue' }
    ],
    dashboardImage: 'clinical_risk_scoring'
  },
  {
    id: '14',
    slug: 'product-platform-engineering',
    title: 'Product & Platform Engineering',
    shortDescription: 'Scalable system backends, service-oriented systems, message queues, and high-performance databases.',
    longDescription: 'We build the foundational engines of digital applications. By setting up messaging broker structures, database pools, caching systems, and REST API controllers, we build backend systems engineered to handle millions of requests with low memory footprints.',
    category: 'Development',
    icon: Code2,
    coverImage: serviceProductEng,
    thumbnail: serviceProductEng,
    overview: 'Build robust, message-driven system backends that run with low latency profiles.',
    offerings: [
      'API Core Design',
      'Database Optimizations',
      'Message Queue Systems',
      'Redis Cache Systems',
      'Service Topologies'
    ],
    detailedOfferings: [
      {
        title: 'High-Performance APIs',
        description: 'Code lightning-fast backend controllers utilizing optimized query routines and connection pooling.',
        badges: ['NodeJS', 'Express', 'TypeScript'],
        color: 'blue',
        iconName: 'code'
      },
      {
        title: 'Message Broker Integrations',
        description: 'Manage heavy background task runs by routing task messages through queue handlers.',
        badges: ['RabbitMQ', 'BullMQ', 'Redis'],
        color: 'purple',
        iconName: 'network'
      },
      {
        title: 'Redis Caching Systems',
        description: 'Save static query results in high-speed RAM caches to load pages in milliseconds.',
        badges: ['Redis', 'Query Cache', 'Memory'],
        color: 'green',
        iconName: 'repeat'
      },
      {
        title: 'Database Query Tuning',
        description: 'Review database logs, configure indexes, and optimize query joins to eliminate bottlenecks.',
        badges: ['PostgreSQL', 'EXPLAIN', 'Indexes'],
        color: 'orange',
        iconName: 'database'
      }
    ],
    process: [
      { step: 1, title: 'Capacity Planning', description: 'Analyze expected request limits, record sizes, and query metrics.' },
      { step: 2, title: 'Database Index Mapping', description: 'Model database entities and outline initial index structures.' },
      { step: 3, title: 'Core API Construction', description: 'Code endpoints, validation checks, and query pools.' },
      { step: 4, title: 'Concurrency Auditing', description: 'Simulate high request volumes to verify system performance.' }
    ],
    caseStudies: [],
    technologies: ['PostgreSQL', 'NodeJS', 'Redis', 'RabbitMQ', 'TypeScript', 'Docker'],
    faqs: [
      { question: 'How do you handle heavy background tasks?', answer: 'We offload them from the main API thread using message queues like BullMQ or RabbitMQ to ensure the user interface remains responsive.' }
    ],
    benefits: [
      'Super-fast API load times under 150ms',
      'Scalable message architectures separating workflows',
      'Optimized database indexes lowering storage fees'
    ],
    cta: 'Engineer Your Platform Backend',
    featured: false,
    order: 14,
    status: 'active',
    industries: ['B2B Platforms', 'On-Demand Delivery', 'Fintech Ventures', 'API Services'],
    whyChooseUs: [
      { title: 'Clean Separation', description: 'We build service architectures separating database access, queues, and routing.' },
      { title: 'Zero Waste Systems', description: 'We optimize code to consume minimal RAM and CPU allocations.' }
    ],
    stats: [
      { value: '150ms', label: 'Response Target', iconType: 'clock', colorTheme: 'green' },
      { value: '5M+', label: 'Daily Request', iconType: 'rocket', colorTheme: 'purple' },
      { value: '100%', label: 'TypeScript Build', iconType: 'code', colorTheme: 'gold' },
      { value: 'Pool', label: 'DB Connections', iconType: 'shield', colorTheme: 'blue' }
    ],
    dashboardImage: 'mobility_routing_dashboard'
  },
  {
    id: '15',
    slug: 'revenue-web-conversion-systems',
    title: 'Revenue Web Systems',
    shortDescription: 'Conversion rate optimization, tracking pixels, speed tuning, and funnel optimizations.',
    longDescription: 'We turn web traffic into revenue. By optimizing page speed metrics, scripting custom user events, building landing pages, and conducting conversion tests, we increase the yield of marketing campaigns and help sales pages convert higher.',
    category: 'Development',
    icon: LineChart,
    coverImage: serviceRevenueWeb,
    thumbnail: serviceRevenueWeb,
    overview: 'Deploy fast, responsive landing pages configured for conversion tracking and funnel analytics.',
    offerings: [
      'Speed Optimizations',
      'Attribution Analytics',
      'A/B Experimentation',
      'Landing Page Frameworks',
      'Sales Funnel Tuning'
    ],
    detailedOfferings: [
      {
        title: 'Speed Performance Tuning',
        description: 'Cut bundle sizes and set up static rendering to hit 95+ PageSpeed metrics.',
        badges: ['Vite', 'Static Build', 'WebP'],
        color: 'blue',
        iconName: 'globe'
      },
      {
        title: 'Tracking Pixel Setups',
        description: 'Embed verification tags and custom user events to record signups and checkouts.',
        badges: ['Google Tag Manager', 'Meta Pixel', 'GA4'],
        color: 'green',
        iconName: 'target'
      },
      {
        title: 'Conversion Landing Pages',
        description: 'Design and build clean landing pages focused on single call-to-actions.',
        badges: ['TailwindCSS', 'Framer', 'Copywriting'],
        color: 'purple',
        iconName: 'layouttemplate'
      },
      {
        title: 'Attribution Auditing',
        description: 'Reconcile invoice databases with marketing dashboards to verify your exact ad spend ROI.',
        badges: ['SQL', 'Dashboard', 'Ad Attribution'],
        color: 'orange',
        iconName: 'search'
      }
    ],
    process: [
      { step: 1, title: 'Funnel Analysis', description: 'Analyze drop-off points, slow assets, and form conversions.' },
      { step: 2, title: 'Speed Optimizations', description: 'Audit images, minify scripts, and enable server cache layers.' },
      { step: 3, title: 'Tracking Installation', description: 'Script custom tag listeners and configure analytics dashboards.' },
      { step: 4, title: 'A/B Test Runs', description: 'Deploy page variations and monitor registration metrics.' }
    ],
    caseStudies: [],
    technologies: ['Vite', 'Google Tag Manager', 'GA4', 'PostgreSQL', 'TailwindCSS', 'Sentry'],
    faqs: [
      { question: 'Why is page speed important for conversion?', answer: 'A 1-second delay in page load time can reduce conversions by up to 20% on mobile devices.' }
    ],
    benefits: [
      'Lighthouse performance scores exceeding 95 points',
      'Accurate conversion metrics matching merchant records',
      'Higher ROI on paid search and social campaigns'
    ],
    cta: 'Optimize Your Conversion Funnel',
    featured: false,
    order: 15,
    status: 'active',
    industries: ['E-Commerce Retail', 'SaaS Marketing', 'Professional Services', 'Ad Agencies'],
    whyChooseUs: [
      { title: 'No Guesswork', description: 'We rely on analytics numbers and real conversion metrics to guide edits.' },
      { title: 'Performance Focus', description: 'We write clean, asset-optimized code that loads instantly on mobile networks.' }
    ],
    stats: [
      { value: '95+', label: 'Lighthouse Score', iconType: 'rocket', colorTheme: 'green' },
      { value: '+25%', label: 'Signup Conversion', iconType: 'chart', colorTheme: 'purple' },
      { value: '100%', label: 'Attribution Accuracy', iconType: 'shield', colorTheme: 'gold' },
      { value: 'Mobile', label: 'Optimized UI', iconType: 'smartphone', colorTheme: 'blue' }
    ],
    dashboardImage: 'sustainability_dashboard'
  },
  {
    id: '16',
    slug: 'documentation-research',
    title: 'Documentation & Research',
    shortDescription: 'Technical writing, API specifications, architectural schemas, and user guides.',
    longDescription: 'We translate complex code structures into readable technical documentation. From drafting API references and configuring OpenAPI/Swagger layouts to illustrating database schemas and writing developer SOW guides, we establish clear reference resources.',
    category: 'Design',
    icon: BookOpen,
    coverImage: serviceDocsResearch,
    thumbnail: serviceDocsResearch,
    overview: 'Compile clean, comprehensive developer guidelines, schemas, and API files.',
    offerings: [
      'API Reference Manuals',
      'Architectural Schemas',
      'Developer Manuals',
      'Software Specifications',
      'SOW Specifications'
    ],
    detailedOfferings: [
      {
        title: 'OpenAPI / Swagger Setups',
        description: 'Document endpoints, request parameters, JSON types, and error codes in YAML format.',
        badges: ['OpenAPI 3.0', 'Swagger', 'YAML'],
        color: 'blue',
        iconName: 'code'
      },
      {
        title: 'Architectural Schemas',
        description: 'Draw detailed topology diagrams mapping server nodes, databases, queues, and networks.',
        badges: ['Lucidchart', 'SVG', 'Network Map'],
        color: 'purple',
        iconName: 'network'
      },
      {
        title: 'User Instruction Guides',
        description: 'Write step-by-step documentation with screenshots to onboard developers onto new platforms.',
        badges: ['Markdown', 'GitBook', 'Screenshots'],
        color: 'green',
        iconName: 'filetext'
      },
      {
        title: 'Technical SOW Drafting',
        description: 'Formalize development milestones, database targets, and feature specifications.',
        badges: ['Word', 'Markdown', 'SOW Spec'],
        color: 'orange',
        iconName: 'checkcircle'
      }
    ],
    process: [
      { step: 1, title: 'Resource Review', description: 'Review codebase components, system consoles, and team workflows.' },
      { step: 2, title: 'Outline Drafting', description: 'Establish documentation sections and assign reference targets.' },
      { step: 3, title: 'Content Compilation', description: 'Draft YAML specs, write page texts, and export diagrams.' },
      { step: 4, title: 'Validation Audit', description: 'Review accuracy with engineers and format final files.' }
    ],
    caseStudies: [],
    technologies: ['Markdown', 'Swagger', 'GitBook', 'Mermaid', 'YAML', 'Confluence'],
    faqs: [
      { question: 'Do you help write internal software specifications?', answer: 'Yes, we assist product managers in scoping SOW requirements and defining database entities before coding begins.' }
    ],
    benefits: [
      'Faster onboarding of new engineers onto your codebase',
      'Consistent API implementations matching OpenAPI guidelines',
      'Accurate reference diagrams of your server networks'
    ],
    cta: 'Organize Your Technical Documentation',
    featured: false,
    order: 16,
    status: 'active',
    industries: ['Developer Platforms', 'Enterprise IT', 'SaaS Teams', 'API Startups'],
    whyChooseUs: [
      { title: 'Developer Centric', description: 'We write clear documentation that saves developers from reading source files.' },
      { title: 'Strict OpenAPI Compliance', description: 'Our API schemas validate against OpenAPI checkers.' }
    ],
    stats: [
      { value: '100%', label: 'OpenAPI Compliant', iconType: 'shield', colorTheme: 'green' },
      { value: '3x', label: 'Faster Onboarding', iconType: 'clock', colorTheme: 'purple' },
      { value: 'YAML', label: 'Schema Formats', iconType: 'code', colorTheme: 'gold' },
      { value: 'SVG', label: 'Diagram Formats', iconType: 'rocket', colorTheme: 'blue' }
    ],
    dashboardImage: 'resume_review_assistant'
  },
  {
    id: '17',
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
    detailedOfferings: [
      {
        title: 'Search Engine Optimization',
        description: 'Optimize page meta details, speed ranks, and content files to list higher on Google indexes.',
        badges: ['Semrush', 'On-Page SEO', 'Backlinks'],
        color: 'blue',
        iconName: 'search'
      },
      {
        title: 'Paid Advertising Setup',
        description: 'Configure ad campaigns targeting intent-based search queries and user demographics.',
        badges: ['Google Ads', 'Meta Ads', 'Retargeting'],
        color: 'green',
        iconName: 'target'
      },
      {
        title: 'Email Marketing Automations',
        description: 'Create scheduled auto-responders that follow up with leads based on their system actions.',
        badges: ['HubSpot', 'Mailchimp', 'Workflows'],
        color: 'purple',
        iconName: 'repeat'
      },
      {
        title: 'Analytics Attribution Reports',
        description: 'Verify your exact cost-per-acquisition metrics across multiple ad platforms.',
        badges: ['Google Analytics', 'UTM Logs', 'ROI Charts'],
        color: 'orange',
        iconName: 'linechart'
      }
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
    order: 17,
    status: 'active',
    industries: ['E-Commerce Storefronts', 'Professional Services', 'SaaS Products', 'Local Brands'],
    whyChooseUs: [
      { title: 'Clear Attribution Routing', description: 'No vanity metrics. We report leads, signups, and ROI directly.' },
      { title: 'Continuous Optimization', description: 'We test and prune ad copy and landing page nodes weekly to save budget.' }
    ],
    stats: [
      { value: '3-6 M', label: 'SEO Ramp', iconType: 'clock', colorTheme: 'green' },
      { value: 'GA4', label: 'Reporting', iconType: 'shield', colorTheme: 'purple' },
      { value: 'ROI', label: 'Driven Specs', iconType: 'dollar', colorTheme: 'gold' },
      { value: '100%', label: 'UTM Tracked', iconType: 'shield', colorTheme: 'blue' }
    ],
    dashboardImage: 'sentiment_nlp_dashboard'
  },
  {
    id: '18',
    slug: 'cloud-infrastructure',
    title: 'Cloud & Infrastructure',
    shortDescription: 'Enterprise cloud configurations, VPC isolation, continuous data replication, and monitoring setups.',
    longDescription: 'We construct secure corporate network environments on major global cloud providers. From setting up private networks and directory integrations to scripting server builds and implementing security scanners, we build standard operational baselines.',
    category: 'Infrastructure',
    icon: HardDrive,
    coverImage: serviceCloudInfra,
    thumbnail: serviceCloudInfra,
    overview: 'Launch and configure enterprise private hosting topologies under industry isolation models.',
    offerings: [
      'Enterprise AWS Layouts',
      'Azure Directory Syncs',
      'Server Storage Arrays',
      'Network Firewalls',
      'Security Compliance Scanning'
    ],
    detailedOfferings: [
      {
        title: 'Virtual Network Setups',
        description: 'Separate server environments inside secure virtual networks with custom routing rules.',
        badges: ['VPC', 'Subnets', 'Gateways'],
        color: 'blue',
        iconName: 'cloud'
      },
      {
        title: 'Active Directory Syncs',
        description: 'Connect internal employee identity lists with cloud resource permissions.',
        badges: ['AD Sync', 'IAM', 'SSO'],
        color: 'purple',
        iconName: 'usercheck'
      },
      {
        title: 'Continuous Redundancy Arrays',
        description: 'Set up real-time database replication to secure copies across multiple cities.',
        badges: ['Multi-Region', 'Replication', 'RDS'],
        color: 'green',
        iconName: 'database'
      },
      {
        title: 'Security Compliance Auditing',
        description: 'Deploy automatic vulnerability checkers scanning code and ports daily.',
        badges: ['CloudTrail', 'GuardDuty', 'Audit'],
        color: 'orange',
        iconName: 'shield'
      }
    ],
    process: [
      { step: 1, title: 'Compliance Scoping', description: 'Review network policies, security needs, and compliance frameworks.' },
      { step: 2, title: 'Topology Drafting', description: 'Map target virtual networks, servers, databases, and backup routes.' },
      { step: 3, title: 'Terraform Engineering', description: 'Script topology definitions inside reproducible YAML/Terraform files.' },
      { step: 4, title: 'Sandbox Execution', description: 'Spin up test environments to verify route layouts and access rules.' }
    ],
    caseStudies: [],
    technologies: ['AWS', 'Azure', 'Terraform', 'Active Directory', 'RDS', 'Linux'],
    faqs: [
      { question: 'What compliance frameworks do you support?', answer: 'We build infrastructures aligned with SOC2, ISO27001, and HIPAA compliance requirements.' }
    ],
    benefits: [
      'Strict tenant isolation preventing external network access',
      'Declarative script logs to easily clone server setups',
      'Automated daily backups stored across separate storage zones'
    ],
    cta: 'Audit Your Infrastructure Security',
    featured: false,
    order: 18,
    status: 'active',
    industries: ['Enterprise IT', 'Fintech Startups', 'Healthcare Providers', 'Audit Services'],
    whyChooseUs: [
      { title: 'SOC2 Ready Designs', description: 'We build following strict network isolation rules to help pass SOC2 audits.' },
      { title: 'Infrastructure as Code', description: 'All servers and networks are coded, preventing manual setup mistakes.' }
    ],
    stats: [
      { value: 'SOC2', label: 'Ready Layout', iconType: 'shield', colorTheme: 'green' },
      { value: '100%', label: 'Terraform Coded', iconType: 'code', colorTheme: 'purple' },
      { value: '24hr', label: 'Backup Cycle', iconType: 'clock', colorTheme: 'gold' },
      { value: 'VPC', label: 'Isolation', iconType: 'shield', colorTheme: 'blue' }
    ],
    dashboardImage: 'ai_translator'
  },
  {
    id: '19',
    slug: 'cybersecurity-compliance',
    title: 'Cybersecurity & Compliance',
    shortDescription: 'Penetration testing, security vulnerability assessments, security policy structures, and compliance setups.',
    longDescription: 'We secure your digital assets against threat patterns. By running custom penetration tests, auditing firewall protocols, defining access constraints, and preparing security logs, we establish systems ready for compliance checks.',
    category: 'Security',
    icon: Shield,
    coverImage: serviceCloudInfra,
    thumbnail: serviceCloudInfra,
    overview: 'Establish secure baseline controls and complete auditing guidelines covering your digital systems.',
    offerings: [
      'Vulnerability Scanning',
      'Penetration Testing',
      'IAM Policy Configs',
      'Firewall Rule Tuning',
      'Compliance Log Scans'
    ],
    detailedOfferings: [
      {
        title: 'Penetration Testing',
        description: 'Locate and resolve potential system entry points before threats exploit them.',
        badges: ['OWASP', 'BurpSuite', 'API Audit'],
        color: 'red',
        iconName: 'shield'
      },
      {
        title: 'Compliance Setups',
        description: 'Map internal network controls and audit trails to align with standard compliance targets.',
        badges: ['SOC2', 'ISO 27001', 'HIPAA'],
        color: 'blue',
        iconName: 'checkcircle'
      }
    ],
    process: [
      { step: 1, title: 'Security Auditing', description: 'Analyze server access lists, database roles, and open API ports.' },
      { step: 2, title: 'Vulnerability Analysis', description: 'Run scanners and manual testing protocols against APIs.' },
      { step: 3, title: 'Control Configuration', description: 'Tweak firewall configurations and restrict access credentials.' },
      { step: 4, title: 'Audit Verification', description: 'Confirm safety checks pass and compile final security reports.' }
    ],
    caseStudies: [],
    technologies: ['OWASP ZAP', 'Nmap', 'Burp Suite', 'CloudTrail', 'AWS IAM'],
    faqs: [
      { question: 'Do you help write security policies?', answer: 'Yes, we assist engineering teams in structuring SOW security parameters and IAM policies.' }
    ],
    benefits: [
      'Complete security logs tracking access changes',
      'Standard system configurations passing audits',
      'Reduced threat profiles across database layers'
    ],
    cta: 'Discuss Your Security Framework',
    featured: false,
    order: 19,
    status: 'active',
    industries: ['Fintech Startups', 'Healthcare Platforms', 'Enterprise IT', 'Data Providers'],
    whyChooseUs: [
      { title: 'Security First', description: 'We follow strict least-privilege constraints to protect codebases.' },
      { title: 'Continuous Checks', description: 'We deploy daily checkers monitoring server states.' }
    ],
    stats: [
      { value: 'SOC2', label: 'Ready top', iconType: 'shield', colorTheme: 'green' },
      { value: '100%', label: 'Sanitized Data', iconType: 'shield', colorTheme: 'purple' },
      { value: 'Zero', label: 'Vulnerabilities', iconType: 'shield', colorTheme: 'gold' },
      { value: 'Audit', label: 'Compliance Pass', iconType: 'shield', colorTheme: 'blue' }
    ],
    dashboardImage: 'clinical_risk_scoring'
  }
];

export const SECTION_SERVICES = {
  tag: 'Our services',
  title: 'Productized growth',
  highlight: 'you can scope and measure',
  description:
    'Eighteen core service verticals—from custom software engineering to digital marketing and AI integrations—each designed with transparent processes, technologies, and outcomes. Build your digital foundation with us.',
  cta: 'Request a customized proposal or SOW discussion',
} as const;
