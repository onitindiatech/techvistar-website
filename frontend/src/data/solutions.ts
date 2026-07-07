import { 
  Building2, Brain, Sparkles, Cloud, Target, 
  Layers, Code2, Cpu, Repeat, Settings, FolderGit2, Shield, Clock
} from 'lucide-react';

export interface SolutionDetail {
  slug: string;
  title: string;
  subtitle: string;
  desc?: string;
  icon: React.ComponentType<any>;
  category: string;
  challenges: {
    title: string;
    points: string[];
    impact: string;
  };
  ourSolution: {
    overview: string;
    capabilities: string[];
  };
  features: {
    title: string;
    description: string;
    icon: React.ComponentType<any>;
  }[];
  howItWorks: {
    step: string;
    title: string;
    desc: string;
  }[];
  benefits: {
    roi: string;
    efficiency: string;
    scalability: string;
    security: string;
  };
  industries: { name: string; slug: string }[];
  techStack: string[];
  metrics: {
    label: string;
    value: string;
  }[];
  faqs: { q: string; a: string }[];
}

export const ICON_MAP: Record<string, React.ComponentType<any>> = {
  Building2,
  Brain,
  Sparkles,
  Cloud,
  Target,
  Layers,
  Code2,
  Cpu,
  Repeat,
  Settings,
  FolderGit2,
  Shield,
  Clock
};

export function decorateSolution(apiSolution: any): SolutionDetail {
  return {
    slug: apiSolution.slug,
    title: apiSolution.title,
    subtitle: apiSolution.subtitle,
    desc: apiSolution.subtitle || apiSolution.desc || '',
    icon: ICON_MAP[apiSolution.icon] || Brain,
    category: apiSolution.category,
    challenges: apiSolution.challenges || { title: '', points: [], impact: '' },
    ourSolution: apiSolution.ourSolution || { overview: '', capabilities: [] },
    features: (apiSolution.features || []).map((f: any) => ({
      title: f.title,
      description: f.description,
      icon: ICON_MAP[f.icon] || Brain,
    })),
    howItWorks: apiSolution.howItWorks || [],
    benefits: apiSolution.benefits || { roi: '', efficiency: '', scalability: '', security: '' },
    industries: apiSolution.industries || [],
    techStack: apiSolution.techStack || [],
    metrics: apiSolution.metrics || [],
    faqs: apiSolution.faqs || [],
  };
}

export const SOLUTIONS_DATA: Record<string, SolutionDetail> = {
  'enterprise-software': {
    slug: 'enterprise-software',
    title: 'Enterprise Software',
    subtitle: 'Streamline Core Operations and Administrative Controls at Scale',
    icon: Building2,
    category: 'Business Solutions',
    challenges: {
      title: 'Operational Inefficiencies and System Fragmentation',
      points: [
        'High maintenance costs and security vulnerabilities in legacy architectures.',
        'Disconnected data pipelines causing manual reporting errors.',
        'Lack of role-based compliance controls leading to data leakage risks.'
      ],
      impact: 'Limits organizational agility, increases overhead costs, and creates compliance bottlenecks.'
    },
    ourSolution: {
      overview: 'We build custom core operational software systems engineered to consolidate data layers, automate background jobs, and guarantee administrative compliance.',
      capabilities: [
        'Centralized operational databases.',
        'Granular role-based access management.',
        'Automated document and log audit trails.'
      ]
    },
    features: [
      { title: 'Workflow Automation', description: 'Trigger automatic reporting runs on a scheduled cron pipeline.', icon: Repeat },
      { title: 'Role Compliance', description: 'Fine-grained policy configurations for secure data access.', icon: Shield },
      { title: 'Realtime Logs', description: 'Centralized telemetry logging to monitor system transactions.', icon: Settings }
    ],
    howItWorks: [
      { step: '01', title: 'Scoping & Architecture Design', desc: 'We detail system states, security bounds, and integration points.' },
      { step: '02', title: 'Modular Backend Construction', desc: 'We implement secure database schemas and robust API pipelines.' },
      { step: '03', title: 'Deployment & SLA Rollout', desc: 'Continuous delivery setup with automated error tracking.' }
    ],
    benefits: {
      roi: '45% reduction in manual data entry overhead.',
      efficiency: 'Consolidated reporting pipelines executing 10x faster.',
      scalability: 'Elastic containers automatically scaling up to support peak user events.',
      security: 'End-to-end data encryption satisfying ISO/IEC 27001 requirements.'
    },
    industries: [
      { name: 'Finance & Banking', slug: 'finance' },
      { name: 'Logistics', slug: 'logistics' }
    ],
    techStack: ['Node.js', 'PostgreSQL', 'Docker', 'AWS', 'Redis'],
    metrics: [
      { label: 'Manual Tasks Automated', value: '85%' },
      { label: 'Process SLA Increase', value: '4x' }
    ],
    faqs: [
      { q: 'How long does a migration take?', a: 'Depending on complexity, typical migrations take 6 to 12 weeks with zero service disruption.' },
      { q: 'Do you offer ongoing SLAs?', a: 'Yes, we provide structured 24/7 telemetry monitoring and platform updates.' }
    ]
  },
  'crm-systems': {
    slug: 'crm-systems',
    title: 'CRM Systems',
    subtitle: 'Centralize Customer Engagements, Ticketing, and Lead Pipelines',
    icon: Target,
    category: 'Business Solutions',
    challenges: {
      title: 'Siloed Communication Channels and Lost Lead Insights',
      points: [
        'Scattered customer logs across emails, chat tools, and spreadsheets.',
        'Inability to track team sales velocities or support resolutions accurately.',
        'Poor integration between frontend sites and CRM databases.'
      ],
      impact: 'Decreases customer retention, drops lead conversion rates, and slows support ticketing response times.'
    },
    ourSolution: {
      overview: 'A premium CRM solution unifying customer communications, automated pipelines, and actionable resolution matrices into a single source of truth.',
      capabilities: [
        'Omnichannel message ingestion and sorting.',
        'Predictive deal scoring metrics.',
        'Automated support ticket assignment routing.'
      ]
    },
    features: [
      { title: 'Omnichannel Pipeline', description: 'Consolidate leads from social, web forms, and direct channels.', icon: Layers },
      { title: 'Custom Metrics', description: 'Monitor closing rates, response speeds, and team activities.', icon: Settings },
      { title: 'Ticketing Bots', description: 'Auto-reply to standard FAQs and escalate high-value tickets.', icon: Repeat }
    ],
    howItWorks: [
      { step: '01', title: 'Channel Integration', desc: 'We link your email, chat, and frontend lead sources.' },
      { step: '02', title: 'Pipeline Customization', desc: 'Mapping fields, roles, and automated triggers to match your workflow.' },
      { step: '03', title: 'Agent Onboarding', desc: 'Training materials and SLA setups to hit target turnaround times.' }
    ],
    benefits: {
      roi: '30% increase in lead conversion ratios.',
      efficiency: 'Ticket routing automated, reducing support response times by 50%.',
      scalability: 'Supports unlimited concurrent agents and millions of contact logs.',
      security: 'SOC2-compliant vault for customer contact data protection.'
    },
    industries: [
      { name: 'Healthcare', slug: 'healthcare' },
      { name: 'eCommerce Retail', slug: 'ecommerce' }
    ],
    techStack: ['React', 'NestJS', 'PostgreSQL', 'ElasticSearch', 'GraphQL'],
    metrics: [
      { label: 'Retention Boost', value: '25%' },
      { label: 'Avg Ticket Resolution Time', value: '‑40%' }
    ],
    faqs: [
      { q: 'Can this integrate with our legacy databases?', a: 'Yes, we specialize in building custom API connectors to sync with existing data setups.' },
      { q: 'Is it mobile-friendly?', a: 'Absolutely, the platform includes a fully responsive design for agents on the move.' }
    ]
  },
  'erp-platforms': {
    slug: 'erp-platforms',
    title: 'ERP Platforms',
    subtitle: 'Consolidate Supply Chains, Logistics, Inventory, and Audits',
    icon: Layers,
    category: 'Business Solutions',
    challenges: {
      title: 'Inventory Mismatches and Supply Chain Instabilities',
      points: [
        'Out-of-sync supply updates causing shipping delays.',
        'Lack of real-time visibility into accounting ledgers and billing.',
        'Manual reporting cycles making audit prep slow and error-prone.'
      ],
      impact: 'Creates inventory overhead, slows fulfillment, and delays quarterly financial audits.'
    },
    ourSolution: {
      overview: 'We build unified databases consolidating logistics coordinates, supply parameters, and finance ledgers to prevent data lag across units.',
      capabilities: [
        'Real-time supply chain tracking.',
        'Double-entry audit logging engines.',
        'Unified supplier portal connections.'
      ]
    },
    features: [
      { title: 'Inventory Trace', description: 'Monitor product movements across multi-site warehouses instantly.', icon: Building2 },
      { title: 'Financial Audits', description: 'Immutable transaction trails built directly into accounting cores.', icon: Shield },
      { title: 'Supplier Webhooks', description: 'Auto-ping supplier systems when inventory dips below minimum levels.', icon: Repeat }
    ],
    howItWorks: [
      { step: '01', title: 'Data Consolidation', desc: 'We migrate inventory, purchase order, and audit logs into a unified base.' },
      { step: '02', title: 'Gateway Connection', desc: 'We integrate billing gateways, supplier APIs, and internal ledgers.' },
      { step: '03', title: 'Deployment & Training', desc: 'Gradual deployment to guarantee operations continue without downtime.' }
    ],
    benefits: {
      roi: '22% reduction in warehousing overheads.',
      efficiency: 'Audit preparation cycles reduced from weeks to seconds.',
      scalability: 'Handles high-frequency supply updates across international nodes.',
      security: 'Strict role segregation preventing unauthorized ledger entries.'
    },
    industries: [
      { name: 'Manufacturing', slug: 'manufacturing' },
      { name: 'Logistics', slug: 'logistics' }
    ],
    techStack: ['Go', 'PostgreSQL', 'Docker', 'AWS ECS', 'Kubernetes'],
    metrics: [
      { label: 'Audit Speedup', value: '15x' },
      { label: 'Logistics Cost Savings', value: '18%' }
    ],
    faqs: [
      { q: 'How do you handle migration from SAP or oracle?', a: 'We build secure migration pipelines to extract, clean, and sync schemas with minimum operational risk.' },
      { q: 'Is multi-currency supported?', a: 'Yes, our accounting engine supports localized tax rules and multi-currency updates.' }
    ]
  },
  'business-automation': {
    slug: 'business-automation',
    title: 'Business Automation',
    subtitle: 'Deploy Workflow Runners to Eliminate Manual Overhead',
    icon: Repeat,
    category: 'Business Solutions',
    challenges: {
      title: 'Repetitive Admin Tasks and Human Verification Bottlenecks',
      points: [
        'Teams spending hours copying spreadsheet details into invoicing tools.',
        'Delayed notifications causing project sign-offs to stall.',
        'Lack of centralized workflows resulting in task omissions.'
      ],
      impact: 'Slows down project delivery speeds, increases error rates, and lowers employee morale.'
    },
    ourSolution: {
      overview: 'We construct background runners, trigger webhooks, and deploy automation scripts that connect operations, generating invoice alerts and reports automatically.',
      capabilities: [
        'Event-driven action chains.',
        'Automatic document template parsing.',
        'Cross-platform webhook sync layers.'
      ]
    },
    features: [
      { title: 'Background Cron Sync', description: 'Run automated reconciliation checks every midnight.', icon: Clock },
      { title: 'Slack Triggers', description: 'Ping the target team Slack channels on pipeline errors.', icon: Settings },
      { title: 'PDF Generation', description: 'Automatically assemble and sign PDF reports on project completions.', icon: FolderGit2 }
    ],
    howItWorks: [
      { step: '01', title: 'Task Audits', desc: 'We analyze your teams workflows to identify manual bottlenecks.' },
      { step: '02', title: 'Automation Setup', desc: 'We build serverless trigger functions and API hooks.' },
      { step: '03', title: 'Validation Runs', desc: 'Testing edge cases to ensure workflows execute correctly.' }
    ],
    benefits: {
      roi: 'Saved 40+ hours per week per administrative department.',
      efficiency: 'Task completion notifications generated instantly.',
      scalability: 'Serverless architecture scaling up to thousands of automation steps.',
      security: 'Secure vault integrations protecting API tokens and credentials.'
    },
    industries: [
      { name: 'Finance & Banking', slug: 'finance' },
      { name: 'Real Estate CRM', slug: 'real-estate' }
    ],
    techStack: ['Node.js', 'AWS Lambda', 'Redis', 'BullMQ', 'Serverless'],
    metrics: [
      { label: 'Weekly Hours Saved', value: '40+' },
      { label: 'Action Success Rate', value: '99.9%' }
    ],
    faqs: [
      { q: 'Do you use tools like Zapier or code it custom?', a: 'While we can connect to integrations like Zapier, we build custom node functions for maximum reliability and lower running costs.' },
      { q: 'How are errors handled?', a: 'Our systems feature auto-retry limits and send detailed slack notifications if an action fails.' }
    ]
  },
  'ai-chatbots': {
    slug: 'ai-chatbots',
    title: 'AI Chatbots',
    subtitle: 'Provide RAG-Backed Contextual Support 24/7 in Real-Time',
    icon: Brain,
    category: 'AI Solutions',
    challenges: {
      title: 'Unhelpful Standard Auto-Replies and Slow Support Latency',
      points: [
        'Keyword-based support bots failing to resolve contextual customer queries.',
        'High ticket support volumes overwhelming customer service desks.',
        'Siloed document bases preventing agents from finding product answers.'
      ],
      impact: 'Leads to high user churn rates, customer dissatisfaction, and rising support headcount costs.'
    },
    ourSolution: {
      overview: 'We deploy cognitive support agents using Retrieval-Augmented Generation (RAG). They read your product documentation and respond with exact citations.',
      capabilities: [
        'Semantic documentation search.',
        'Multi-lingual conversation threads.',
        'Human handoff triggers for complex edge cases.'
      ]
    },
    features: [
      { title: 'Vector Databases', description: 'Translate document segments into vector vectors for search.', icon: Layers },
      { title: 'Retrieval Context', description: 'Provide context segments to LLMs to prevent text hallucinations.', icon: Brain },
      { title: 'Token Guards', description: 'Strict token budget caps to prevent excessive query costs.', icon: Shield }
    ],
    howItWorks: [
      { step: '01', title: 'Data Ingestion', desc: 'We ingest your product docs, support histories, and FAQs.' },
      { step: '02', title: 'Model Tuning', desc: 'We set tone directions, guardrails, and citation rules.' },
      { step: '03', title: 'Integration', desc: 'We mount the widget onto your site and link it to Slack or Zendesk.' }
    ],
    benefits: {
      roi: 'Deflects 60% of standard incoming support tickets.',
      efficiency: 'Initial response speed drops to under 2 seconds.',
      scalability: 'Handles thousands of concurrent customer conversations simultaneously.',
      security: 'Strict data boundaries ensuring internal documents do not leak publicly.'
    },
    industries: [
      { name: 'LMS Education', slug: 'education' },
      { name: 'eCommerce Retail', slug: 'ecommerce' }
    ],
    techStack: ['Python', 'LangChain', 'Pinecone', 'OpenAI API', 'FastAPI'],
    metrics: [
      { label: 'Ticket Deflection', value: '60%' },
      { label: 'Support SLA Rating', value: '4.9/5' }
    ],
    faqs: [
      { q: 'Will the bot make up fake answers?', a: 'We restrict the bot to ONLY answer from your provided documents, returning a "I don\'t know" response instead of hallucinating.' },
      { q: 'How often can we update the documentation?', a: 'Our automated pipelines re-sync and update the vector base within minutes of document modifications.' }
    ]
  },
  'ai-agents': {
    slug: 'ai-agents',
    title: 'AI Agents',
    subtitle: 'Deploy Autonomous System Workers for End-to-End Tasks',
    icon: Cpu,
    category: 'AI Solutions',
    challenges: {
      title: 'Manual Data Parsing and Decision Bottlenecks',
      points: [
        'Processing hundreds of structured customer emails manually.',
        'Human delay in approving standard data transactions.',
        'Difficulties in coordinating complex, multi-step backend operations.'
      ],
      impact: 'Limits transaction throughput, increases operational latency, and reduces processing scale.'
    },
    ourSolution: {
      overview: 'We build autonomous agent systems that break down high-level tasks into logical action chains, executing database lookups and file updates independently.',
      capabilities: [
        'Auto-chaining action planners.',
        'External tool utilization APIs.',
        'Self-correcting verification loops.'
      ]
    },
    features: [
      { title: 'Task Auto-Chaining', description: 'Decompose complex requests into sequential logical steps.', icon: Brain },
      { title: 'Async Callback Hooks', description: 'Verify transaction completion status via webhooks.', icon: Repeat },
      { title: 'JSON Output Formatting', description: 'Strict formatting guarantees reliable parsing by database systems.', icon: Code2 }
    ],
    howItWorks: [
      { step: '01', title: 'Workflow Scoping', desc: 'We define the agents tools, APIs, and decision bounds.' },
      { step: '02', title: 'Agent Core Training', desc: 'Programming reasoning patterns and exception fallback branches.' },
      { step: '03', title: 'Sandbox Dry Runs', desc: 'Simulating complex tasks to audit and verify execution logs.' }
    ],
    benefits: {
      roi: 'Transaction processing throughput increased by 400%.',
      efficiency: 'Average task execution latency reduced to milliseconds.',
      scalability: 'Easily scales horizontally across serverless workers.',
      security: 'Sandboxed runtimes preventing arbitrary system command executions.'
    },
    industries: [
      { name: 'Finance & Banking', slug: 'finance' },
      { name: 'Logistics', slug: 'logistics' }
    ],
    techStack: ['Python', 'LangGraph', 'Redis', 'Docker', 'FastAPI'],
    metrics: [
      { label: 'Processing Speedup', value: '4x' },
      { label: 'Execution Accuracy', value: '99.5%' }
    ],
    faqs: [
      { q: 'What safeguards prevent the agent from getting stuck?', a: 'We program max-step thresholds and loop detection limits to safely abort and escalate stuck threads.' },
      { q: 'Can the agent make real financial transactions?', a: 'Yes, within restricted limits and with mandatory multi-party approvals for high-value operations.' }
    ]
  },
  'generative-ai': {
    slug: 'generative-ai',
    title: 'Generative AI',
    subtitle: 'Custom Models Trained to Generate Premium Structured Content',
    icon: Sparkles,
    category: 'AI Solutions',
    challenges: {
      title: 'Slow Document Drafting and Inconsistent Content Formats',
      points: [
        'Manual draft creation of contracts, proposals, and designs.',
        'High labor overhead for repetitive copywriting tasks.',
        'Varying quality and formats across document creation teams.'
      ],
      impact: 'Delays sales pipeline closings, raises content production costs, and impacts brand consistency.'
    },
    ourSolution: {
      overview: 'We train and fine-tune generative neural networks to automatically draft enterprise-grade proposals, technical documents, and templates matching exact brand structures.',
      capabilities: [
        'Context-aware text drafting.',
        'Standardized template mapping.',
        'Auto-formatting schema outputs.'
      ]
    },
    features: [
      { title: 'Fine-Tuned Outputs', description: 'Train models on company archives for brand voice alignment.', icon: Sparkles },
      { title: 'Template Structures', description: 'Strict compliance matching PDF or Word formats.', icon: Layers },
      { title: 'Draft Generation', description: 'Generate structured starter documents inside your workspace.', icon: Repeat }
    ],
    howItWorks: [
      { step: '01', title: 'Data Alignment', desc: 'We gather and clean historical document archives.' },
      { step: '02', title: 'Model Training', desc: 'Fine-tuning base models for specific layout compliance.' },
      { step: '03', title: 'Workflow Integration', desc: 'Connecting drafting tools directly to client portal editors.' }
    ],
    benefits: {
      roi: '80% reduction in initial drafting times.',
      efficiency: 'Uniform content formats across all output files.',
      scalability: 'Supports simultaneous document creation across global teams.',
      security: 'Isolated training environments ensuring training inputs never leak.'
    },
    industries: [
      { name: 'LMS Education', slug: 'education' },
      { name: 'Civic Government', slug: 'civic' }
    ],
    techStack: ['Python', 'HuggingFace', 'PyTorch', 'FastAPI', 'AWS Sagemaker'],
    metrics: [
      { label: 'Drafting Efficiency', value: '80%' },
      { label: 'Output Satisfaction', value: '96%' }
    ],
    faqs: [
      { q: 'Is our corporate data safe?', a: 'Absolutely, all model training is done within your private cloud environment; your data is never sent to public OpenAI/Google servers.' },
      { q: 'Can we generate charts?', a: 'Yes, our pipelines can output structured JSON data mapped directly to rendering libraries.' }
    ]
  },
  'document-intelligence': {
    slug: 'document-intelligence',
    title: 'Document Intelligence',
    subtitle: 'Extract Clean Metadata and Lists from Raw Scans Instantly',
    icon: FolderGit2,
    category: 'AI Solutions',
    challenges: {
      title: 'Manual PDF Ingestion and Formatting Errors',
      points: [
        'Processing physical invoices, receipts, and forms manually.',
        'High OCR mismatch rates on multi-column layouts.',
        'Delays in transferring parsed details to payment gateways.'
      ],
      impact: 'Creates accounts payable bottlenecks, leads to data entry errors, and delays customer onboarding.'
    },
    ourSolution: {
      overview: 'We configure advanced OCR and document parser systems that extract metadata, items, and values from raw files with high accuracy.',
      capabilities: [
        'Layout-agnostic parser engines.',
        'Automatic field mapping tables.',
        'Direct pipeline connections to payment ledgers.'
      ]
    },
    features: [
      { title: 'Multi-Column OCR', description: 'Extract tables and charts accurately across dense PDF layouts.', icon: Layers },
      { title: 'Entity Extraction', description: 'Auto-detect billing names, invoice IDs, and tax percentages.', icon: Target },
      { title: 'Format Conversion', description: 'Transform unstructured scans into clean JSON database formats.', icon: Code2 }
    ],
    howItWorks: [
      { step: '01', title: 'File Analysis', desc: 'We review raw formats, resolutions, and output needs.' },
      { step: '02', title: 'Parser Setup', desc: 'We configure layout-agnostic parser workflows.' },
      { step: '03', title: 'Pipeline Hookup', desc: 'Connecting parsed outputs to downstream billing databases.' }
    ],
    benefits: {
      roi: '82% faster document ingestion processing.',
      efficiency: 'Error rates drop to under 0.5% with double-verification loops.',
      scalability: 'Handles millions of monthly document uploads.',
      security: 'Fully HIPAA & GDPR compliant storage nodes.'
    },
    industries: [
      { name: 'Healthcare', slug: 'healthcare' },
      { name: 'Finance & Banking', slug: 'finance' }
    ],
    techStack: ['Python', 'Tesseract OCR', 'PostgreSQL', 'FastAPI', 'Google Cloud Document AI'],
    metrics: [
      { label: 'Processing Speed', value: '‑82%' },
      { label: 'Extraction Accuracy', value: '99.5%' }
    ],
    faqs: [
      { q: 'How does it handle low-quality scans?', a: 'Our pre-processing algorithms clean, straighten, and sharpen images before parsing to maximize OCR accuracy.' },
      { q: 'Can it run offline?', a: 'Yes, we can deploy open-source models directly onto your internal local servers.' }
    ]
  },
  'cloud-migration': {
    slug: 'cloud-migration',
    title: 'Cloud Migration',
    subtitle: 'Establish Scalable, Secure Cloud Infrastructures',
    icon: Cloud,
    category: 'Digital Solutions',
    challenges: {
      title: 'Legacy Hardware Instabilities and High Maintenance Overhead',
      points: [
        'Physical servers suffering hardware issues and capacity caps.',
        'High local power and system admin team overhead.',
        'Lack of redundancy leading to single-point-of-failure risks.'
      ],
      impact: 'Creates downtime, limits business scale, and increases capital expenditure costs.'
    },
    ourSolution: {
      overview: 'We migrate legacy workloads into highly redundant, secure cloud architectures (AWS/GCP/Azure) built to scale automatically.',
      capabilities: [
        'Zero-downtime server migrations.',
        'Multi-region high availability architectures.',
        'Infrastructure-as-Code setup (Terraform).'
      ]
    },
    features: [
      { title: 'HA Cluster Setup', description: 'Deploy server clusters across multiple availability zones.', icon: Cloud },
      { title: 'Zero Downtime Cutover', description: 'Sync systems live for smooth traffic switchovers.', icon: Repeat },
      { title: 'VPC Segregation', description: 'Isolate database servers from public internet vectors.', icon: Shield }
    ],
    howItWorks: [
      { step: '01', title: 'Audit & Mapping', desc: 'We catalog servers, logs, and database requirements.' },
      { step: '02', title: 'Infrastructure Coding', desc: 'Writing Terraform scripts to spin up clean clouds.' },
      { step: '03', title: 'Live Sync & Cutover', desc: 'Syncing live data and pointing DNS to the new servers.' }
    ],
    benefits: {
      roi: '35% reduction in monthly infrastructure costs.',
      efficiency: 'System availability SLA raised to 99.99%.',
      scalability: 'Auto-scaling pools that spin up containers under spike requests.',
      security: 'Automated threat updates and cloud vulnerability reporting.'
    },
    industries: [
      { name: 'Finance & Banking', slug: 'finance' },
      { name: 'eCommerce Retail', slug: 'ecommerce' }
    ],
    techStack: ['AWS', 'Terraform', 'Kubernetes', 'Docker', 'Nginx'],
    metrics: [
      { label: 'SLA Availability', value: '99.99%' },
      { label: 'Hosting Overhead Saved', value: '35%' }
    ],
    faqs: [
      { q: 'Will our application experience downtime during migration?', a: 'No, we keep systems synced live, switching DNS only when database integrity is fully verified.' },
      { q: 'Do you configure monitoring dashboards?', a: 'Yes, we set up full Grafana or CloudWatch alert dashboards.' }
    ]
  },
  'api-integration': {
    slug: 'api-integration',
    title: 'API Integration',
    subtitle: 'Unify Platform Workflows with Secure Middleware Systems',
    icon: Code2,
    category: 'Digital Solutions',
    challenges: {
      title: 'Incompatible Formats and Broken Webhook Loops',
      points: [
        'Varying schemas causing system-to-system integrations to crash.',
        'API rate-limit exhaustions causing data drops.',
        'Lack of transaction confirmation tracing.'
      ],
      impact: 'Causes data mismatches, delays client sync, and creates transaction error tracking overhead.'
    },
    ourSolution: {
      overview: 'We build secure API gateway middleware that validates, converts, and syncs data formats between your platforms in real-time.',
      capabilities: [
        'Secure token exchange servers.',
        'Real-time payload parsing layers.',
        'Automated retry and queue databases.'
      ]
    },
    features: [
      { title: 'Webhook Sync', description: 'Trigger downstream updates instantly when frontend events occur.', icon: Repeat },
      { title: 'Rate Limiting Layers', description: 'Protect database servers from API traffic spikes.', icon: Shield },
      { title: 'Payload Validations', description: 'Validate incoming formats before writing details to db.', icon: Code2 }
    ],
    howItWorks: [
      { step: '01', title: 'Schema Mapping', desc: 'We detail API fields, endpoints, and validation requirements.' },
      { step: '02', title: 'Middleware Construction', desc: 'Building gateway routes and caching layers.' },
      { step: '03', title: 'Stress Testing', desc: 'Simulating traffic spikes to verify rate limits.' }
    ],
    benefits: {
      roi: 'Eliminated integration error logs.',
      efficiency: 'Data synchronization completed in under 15ms.',
      scalability: 'Handles millions of weekly webhook transactions.',
      security: 'OAuth2/mTLS integrations ensuring secure data handshakes.'
    },
    industries: [
      { name: 'Logistics', slug: 'logistics' },
      { name: 'Real Estate CRM', slug: 'real-estate' }
    ],
    techStack: ['Node.js', 'Redis', 'Express', 'JWT', 'Nginx'],
    metrics: [
      { label: 'Sync Latency', value: '<15ms' },
      { label: 'Webhook Success Rate', value: '99.99%' }
    ],
    faqs: [
      { q: 'Can you build custom API endpoints for legacy software?', a: 'Yes, we specialize in building custom adapters to expose secure REST APIs for older platforms.' },
      { q: 'How is security handled?', a: 'We use OAuth2 frameworks, API keys, and IP whitelisting to secure endpoints.' }
    ]
  },
  'data-analytics': {
    slug: 'data-analytics',
    title: 'Data Analytics',
    subtitle: 'Consolidate Siloed Databases into Unified Visual Dashboards',
    icon: Settings,
    category: 'Digital Solutions',
    challenges: {
      title: 'Scattered Performance Data and Blind Business Decisions',
      points: [
        'Analytics files scattered across separate services and logs.',
        'Massive delay in generating quarterly performance tables.',
        'Lack of real-time visibility into operational metrics.'
      ],
      impact: 'Delays business decisions, hides operational costs, and limits sales tracking.'
    },
    ourSolution: {
      overview: 'We construct data lakes and configure interactive dashboards that gather databases from sales, marketing, and logistics into a single, real-time visual system.',
      capabilities: [
        'Consolidated data warehousing.',
        'Real-time query engines.',
        'Custom report builders.'
      ]
    },
    features: [
      { title: 'Realtime Reporting', description: 'Watch dashboard statistics update live as orders process.', icon: Clock },
      { title: 'Pre-Baked Queries', description: 'Instantly load high-weight analytical tables.', icon: Settings },
      { title: 'Secure Exports', description: 'Export filtered data securely into CSV or PDF formats.', icon: FolderGit2 }
    ],
    howItWorks: [
      { step: '01', title: 'Sourcing & Cleaning', desc: 'We link your databases and clean formatting mismatches.' },
      { step: '02', title: 'Data Lake Construction', desc: 'Setting up structured warehouse queries.' },
      { step: '03', title: 'UI Design & Launch', desc: 'Polishing dashboards to make data-insights intuitive.' }
    ],
    benefits: {
      roi: 'Reduced time-to-decision by 80%.',
      efficiency: 'Reports generated instantly without database lag.',
      scalability: 'Stores and processes billions of historical transaction logs.',
      security: 'Role-based visualization restrictions protecting sensitive parameters.'
    },
    industries: [
      { name: 'eCommerce Retail', slug: 'ecommerce' },
      { name: 'Manufacturing', slug: 'manufacturing' }
    ],
    techStack: ['Python', 'PostgreSQL', 'ClickHouse', 'Metabase', 'Docker'],
    metrics: [
      { label: 'Time-to-Decision', value: '‑80%' },
      { label: 'Monthly Data Indexed', value: '1B+' }
    ],
    faqs: [
      { q: 'Is there a limit on databases we can connect?', a: 'No, we build pipelines to pool details from multiple SQL/NoSQL databases and APIs.' },
      { q: 'Can we configure automated email reports?', a: 'Yes, we can schedule dashboards to email PDF digests daily or weekly.' }
    ]
  },
  'cyber-security': {
    slug: 'cyber-security',
    title: 'Cyber Security',
    subtitle: 'Deploy Endpoint Encryption and Access Control Compliance Layers',
    icon: Shield,
    category: 'Digital Solutions',
    challenges: {
      title: 'Vulnerable System Endpoints and Credential Theft Risks',
      points: [
        'Weak password rules and lack of multi-factor authentication (MFA).',
        'Unencrypted internal network communications.',
        'Lack of access logs preventing audit checks.'
      ],
      impact: 'Exposes systems to breaches, runs risk of compliance fines, and affects customer trust.'
    },
    ourSolution: {
      overview: 'We secure your infrastructure by implementing Zero Trust authentication, system-wide data encryption, and automatic threat detection scans.',
      capabilities: [
        'Zero Trust system authorization.',
        'mTLS network encryption.',
        '24/7 security audit logs.'
      ]
    },
    features: [
      { title: 'SSO Integrations', description: 'Unify logins using secure Active Directory or Okta configs.', icon: Shield },
      { title: 'Vulnerability Scans', description: 'Run automated daily checks to scan library vulnerabilities.', icon: Settings },
      { title: 'Audit Trails', description: 'Trace every system transaction, change, and access log.', icon: Code2 }
    ],
    howItWorks: [
      { step: '01', title: 'Security Audit', desc: 'We scan your codebase and hosting configurations.' },
      { step: '02', title: 'Hardening & MFA', desc: 'Enforcing endpoint encryptions and authentication rules.' },
      { step: '03', title: 'Continuous Logs', desc: 'Launching automated alerts and log auditing monitors.' }
    ],
    benefits: {
      roi: 'Zero security breaches since deployment.',
      efficiency: 'Audit verification cycles automated and streamlined.',
      scalability: 'Security parameters scale alongside server clusters.',
      security: 'Fully compliant with SOC2, ISO 27001, and GDPR metrics.'
    },
    industries: [
      { name: 'Finance & Banking', slug: 'finance' },
      { name: 'Healthcare', slug: 'healthcare' }
    ],
    techStack: ['Okta', 'Vault', 'Nginx', 'Docker', 'mTLS'],
    metrics: [
      { label: 'Security Breach Rate', value: '0%' },
      { label: 'Audit Readiness', value: '100%' }
    ],
    faqs: [
      { q: 'What compliance frameworks do you support?', a: 'We specialize in aligning systems to SOC2, ISO 27001, HIPAA, and GDPR specifications.' },
      { q: 'How often are security scans run?', a: 'Our CI/CD pipelines run code dependency scans on every commit, and host scans execute daily.' }
    ]
  }
};
