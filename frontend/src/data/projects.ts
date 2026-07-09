import mobilityImg from '../assets/mobility_routing_dashboard.png';
import sustainabilityImg from '../assets/sustainability_dashboard.png';
import cropImg from '../assets/crop_health_analysis.png';
import nlpImg from '../assets/sentiment_nlp_dashboard.png';
import resumeReviewImg from '../assets/resume_review_assistant.png';
import clinicalRiskImg from '../assets/clinical_risk_scoring.png';
import aiTranslatorImg from '../assets/ai_translator.png';
import aiTranslatorBatchesImg from '../assets/ai_translator_batches.png';
import financeImg from '../assets/finance_reporting_analytics.png';

import { SeoMetadata } from '@/types/seo';
import { seoFromApi } from '@/lib/seoResolve';

export interface Project extends SeoMetadata {
  id: number;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  category: string;
  technologies: string[];
  liveUrl: string;
  githubUrl: string;
  featured: boolean;
  date: string; // ISO 8601 Date String (YYYY-MM-DD)
  client: string;
  role: string;
  longDescription: string;
  keyFeatures: string[];
  challenges: string[];
  gallery: string[];
  tags: string[];
  status: 'Completed' | 'In Progress' | 'Coming Soon';
  serviceSlugs: string[];
  industry: string;
  updatedDate: string; // ISO 8601 Date String (YYYY-MM-DD)
}

export const IMAGE_MAP: Record<string, string> = {
  mobilityImg,
  sustainabilityImg,
  cropImg,
  nlpImg,
  resumeReviewImg,
  clinicalRiskImg,
  aiTranslatorImg,
  aiTranslatorBatchesImg,
  financeImg
};

export function decorateProject(apiProject: any): Project {
  return {
    id: apiProject._id || apiProject.id,
    title: apiProject.title,
    slug: apiProject.slug,
    description: apiProject.description,
    thumbnail: IMAGE_MAP[apiProject.thumbnail] || apiProject.thumbnail || '',
    category: apiProject.category,
    technologies: apiProject.technologies || [],
    liveUrl: apiProject.liveUrl || '#',
    githubUrl: apiProject.githubUrl || '#',
    featured: apiProject.featured || false,
    date: apiProject.date || '',
    client: apiProject.client || '',
    role: apiProject.role || '',
    longDescription: apiProject.longDescription || '',
    keyFeatures: apiProject.keyFeatures || [],
    challenges: apiProject.challenges || [],
    gallery: (apiProject.gallery || []).map((img: string) => IMAGE_MAP[img] || img),
    tags: apiProject.tags || [],
    status: apiProject.status || 'Completed',
    serviceSlugs: apiProject.serviceSlugs || [],
    industry: apiProject.industry || '',
    updatedDate: apiProject.updatedDate || '',
    ...seoFromApi(apiProject),
  };
}

export const PROJECTS: readonly Project[] = [
  {
    id: 1,
    title: 'Navigation & route optimization',
    slug: 'navigation-route-optimization',
    description:
      'End-to-end planning workflow for multi-stop routes under time windows, capacity, and road constraints: geocoded inputs, solver-backed optimization (cost / time / distance objectives), and operator review before dispatch. Includes map visualisation, exception handling for failed legs, and auditable run history for operations.',
    thumbnail: mobilityImg,
    category: 'Mobility & logistics',
    technologies: ['Python', 'Maps APIs', 'React', 'TypeScript'],
    liveUrl: '#',
    githubUrl: '#',
    featured: true,
    date: '2025-11-15',
    client: 'LogiRoute Inc.',
    role: 'Lead Systems Architect',
    longDescription:
      'A comprehensive routing engine and logistics dashboard built to streamline multi-stop planning for commercial vehicle fleets. By combining heuristics with classic operations research solvers, the application calculates optimal sequences under tight capacity and time-window constraints, visualizing paths in real time and enabling dispatchers to manually override decisions.',
    keyFeatures: [
      'Multi-stop optimization under capacity constraints',
      'Interactive Mapbox-based visual routing editor',
      'Real-time traffic and road restriction warnings',
      'Auditable run histories with versioned solutions',
    ],
    challenges: [
      'Handling high-latency solver runs without locking the main UI thread, solved via Web Worker offloading.',
      'Reconciling manual operator route adjustments with solver constraints through dynamic incremental checks.',
    ],
    gallery: [mobilityImg],
    tags: ['routing', 'logistics', 'optimization', 'maps', 'operations-research', 'dashboard'],
    status: 'Completed',
    serviceSlugs: ['web-development', 'custom-software-development', 'automation', 'product-platform-engineering'],
    industry: 'Logistics',
    updatedDate: '2025-11-20',
  },
  {
    id: 2,
    title: 'Eco_System — environmental intelligence',
    slug: 'ecosystem-environmental-intelligence',
    description:
      'Unified dashboard for environmental indicators and programme KPIs: ingestion from sensors and third-party feeds, role-based views for field vs management users, scheduled reports, and threshold-based alerts. Designed for traceability from raw readings to consolidated scores used in review meetings.',
    thumbnail: sustainabilityImg,
    category: 'Data & sustainability',
    technologies: ['PostgreSQL', 'React', 'Docker', 'TypeScript'],
    liveUrl: '#',
    githubUrl: '#',
    featured: true,
    date: '2025-09-10',
    client: 'EnviroTrust Global',
    role: 'Backend & Data Engineer',
    longDescription:
      'Eco_System gathers diverse environmental datasets—including sensor telemetry, local weather feeds, and satellite reports—into an interactive intelligence platform. Designed to facilitate administrative and regulatory compliance reporting, the system handles data ingestion, transformation, aggregation, and anomaly alerts within a highly secure database structure.',
    keyFeatures: [
      'Automated ETL pipelines consuming public and private IoT sensors',
      'Role-based access control (RBAC) separating field operators from management',
      'Dynamic threshold alerting with SMS and Email integrations',
      'One-click PDF/CSV report generation for compliance auditing',
    ],
    challenges: [
      'Handling out-of-order and duplicate sensor readings, resolved by implementing idempotent database upserts and time-series bucketing.',
      'High-performance rendering of dense historic telemetry data, optimized through aggregate pre-computation and client-side charting downsampling.',
    ],
    gallery: [sustainabilityImg],
    tags: ['sustainability', 'sensors', 'iot', 'data-pipeline', 'reporting', 'analytics'],
    status: 'Completed',
    serviceSlugs: ['web-development', 'custom-software-development', 'digital-marketing', 'cloud', 'cloud-infrastructure'],
    industry: 'SaaS',
    updatedDate: '2025-10-01',
  },
  {
    id: 3,
    title: 'Crop Hub — crop health screening',
    slug: 'crop-hub-crop-health-screening',
    description:
      'Image-based workflow for leaf uploads, model inference, and structured reporting for field teams—designed for clarity of results and auditability of predictions.',
    thumbnail: cropImg,
    category: 'Applied ML',
    technologies: ['Python', 'TensorFlow', 'React', 'OpenAI'],
    liveUrl: '#',
    githubUrl: '#',
    featured: false,
    date: '2025-05-20',
    client: 'AgriTech Solutions',
    role: 'Machine Learning Engineer',
    longDescription:
      'Crop Hub acts as a vital tool for field agronomists, enabling them to capture images of affected crop leaves, send them to an on-premise deep learning classifier, and receive an instant prediction on diseases and deficiencies. The dashboard prioritizes clarity, showing confidence margins and highlighting actionable remediation guidelines.',
    keyFeatures: [
      'TensorFlow-powered leaf disease classification engine',
      'Offline-capable progressive web application interface',
      'Remediation guidelines and chemical/biological recommendations',
      'Audit log tracking ML model predictions against agronomist feedback',
    ],
    challenges: [
      'Deploying heavy Deep Learning models on cost-constrained hosting servers, solved through model quantization and conversion to ONNX format.',
      'Unreliable field connectivity, handled via LocalStorage queue synchronization once the device returns online.',
    ],
    gallery: [cropImg],
    tags: ['machine-learning', 'agriculture', 'computer-vision', 'tensorflow', 'classification', 'offline-first'],
    status: 'Completed',
    serviceSlugs: ['ai-automation', 'mobile-app-development', 'automation', 'ai'],
    industry: 'Agriculture',
    updatedDate: '2025-05-25',
  },
  {
    id: 4,
    title: 'Sentiment classification service',
    slug: 'sentiment-classification-service',
    description:
      'Text-in / label-out service for opinion mining with reproducible training features, evaluation metrics, and a lightweight operator UI for batch runs.',
    thumbnail: nlpImg,
    category: 'NLP',
    technologies: ['Python', 'Docker', 'TypeScript', 'React'],
    liveUrl: '#',
    githubUrl: '#',
    featured: false,
    date: '2025-03-12',
    client: 'OpinioMetric Corp',
    role: 'Data Scientist',
    longDescription:
      'A scalable text sentiment analysis platform constructed to parse consumer reviews and feedback streams. Combining a modular preprocessing pipeline with trained scikit-learn models, the service outputs label categories and probability estimates, exposing them via both a visual Streamlit playground and a fast JSON API.',
    keyFeatures: [
      'Modular text processing (stopword removal, lemmatization, TF-IDF)',
      'Streamlit operator console for ad-hoc batch processing and validation',
      'Model performance monitoring dashboard showing Precision/Recall curves',
      'Versioned model artifact registration to support rolling updates',
    ],
    challenges: [
      'Addressing domain shift when classifying specialized terminology, resolved by incorporating custom lexicon rules into the TF-IDF feature extractor.',
      'Sustaining high throughput for batch uploads, addressed through asynchronous queueing using python multiprocessing pools.',
    ],
    gallery: [nlpImg],
    tags: ['nlp', 'sentiment-analysis', 'text-processing', 'scikit-learn', 'api', 'dashboard'],
    status: 'Completed',
    serviceSlugs: ['ai-automation', 'custom-software-development', 'ai', 'enterprise-ai-integration'],
    industry: 'SaaS',
    updatedDate: '2025-03-15',
  },
  {
    id: 5,
    title: 'Resume review assistant',
    slug: 'resume-review-assistant',
    description:
      'Guided scoring against role templates, ATS-oriented formatting checks, and actionable suggestions—keeping human review in the loop.',
    thumbnail: resumeReviewImg,
    category: 'Productivity AI',
    technologies: ['Python', 'OpenAI', 'React', 'TypeScript'],
    liveUrl: '#',
    githubUrl: '#',
    featured: false,
    date: '2025-02-05',
    client: 'TalentFlow Partners',
    role: 'AI Engineer',
    longDescription:
      'This assistant assists hiring managers by grading inbound CVs against custom role definitions. The system checks structural compatibility with applicant tracking systems (ATS), points out missing key skill keywords, and drafts constructive guidance, ensuring a human remains the final arbiter of candidates.',
    keyFeatures: [
      'Semantic matching of resume content against structured role templates',
      'Automated parsing of PDF/DOCX resumes into clean plain text',
      'Interactive scoring rubric interface with slider override features',
      'Strict local data privacy mechanisms preventing raw LLM training leaks',
    ],
    challenges: [
      'Extracting clean text from highly formatted multi-column PDF layouts, resolved by implementing structured PDF miner pipelines.',
      'Minimizing API costs and latency during large batch uploads, solved through key-value caching and prompt compaction.',
    ],
    gallery: [resumeReviewImg],
    tags: ['llm', 'resume-parsing', 'ats', 'productivity', 'recruitment', 'ai-assistant'],
    status: 'Completed',
    serviceSlugs: ['ai-automation', 'ai', 'enterprise-ai-integration', 'documentation-research', 'ui-ux-design'],
    industry: 'HRTech',
    updatedDate: '2025-02-10',
  },
  {
    id: 6,
    title: 'Clinical risk scoring prototype',
    slug: 'clinical-risk-scoring-prototype',
    description:
      'Interpretable ML pipeline with calibrated outputs and confidence bands, focused on safe presentation of assistive—not diagnostic—information.',
    thumbnail: clinicalRiskImg,
    category: 'Healthcare ML',
    technologies: ['Python', 'React', 'MongoDB', 'TypeScript'],
    liveUrl: '#',
    githubUrl: '#',
    featured: false,
    date: '2024-11-30',
    client: 'HealthSys Labs',
    role: 'Full Stack ML Developer',
    longDescription:
      'A prototype designed to assist clinical researchers in modeling patient risk parameters. The system highlights which physiological variables contribute most heavily to the risk rating, giving medical professionals clear confidence ranges and explainable criteria behind predictions.',
    keyFeatures: [
      'Explainable AI metrics (SHAP value integration) displayed visually',
      'Probability calibration mapping scores directly to empirical risk',
      'Responsive interface mimicking EHR (Electronic Health Record) views',
      'Compliance logs for tracking operator overrides and comments',
    ],
    challenges: [
      'Presenting complex mathematical explanations in an intuitive, non-overwhelming UI, solved by user testing and adopting hierarchical cards.',
      'Ensuring strict data sanitization to comply with health data standards in local sandbox environments.',
    ],
    gallery: [clinicalRiskImg],
    tags: ['healthcare', 'risk-scoring', 'explainable-ai', 'machine-learning', 'ehr', 'analytics'],
    status: 'Completed',
    serviceSlugs: ['web-development', 'ai-automation', 'ai', 'enterprise-ai-integration', 'documentation-research'],
    industry: 'Healthcare',
    updatedDate: '2024-12-05',
  },
  {
    id: 7,
    title: 'AI Translator',
    slug: 'ai-translator',
    description:
      'Multilingual translation service with configurable engines (neural + optional LLM assist), customer glossary and “do-not-translate” lists, segment-level confidence, and a review queue for low-confidence spans. Exposes REST/WebSocket APIs for product embeds plus an operator console for batch runs.',
    thumbnail: aiTranslatorImg,
    category: 'NLP / GenAI',
    technologies: ['Python', 'OpenAI', 'React', 'TypeScript', 'Express'],
    liveUrl: '#',
    githubUrl: '#',
    featured: true,
    date: '2024-08-14',
    client: 'GlobalVox Media',
    role: 'Full Stack Engineer',
    longDescription:
      'An enterprise translation tool supporting neural translation models and GenAI-driven context adaptation. By defining custom glossaries and forbidden translation patterns, corporations can localize their documentation while maintaining precise brand and terminology consistency.',
    keyFeatures: [
      'Dual translation mode: speed-oriented Neural Net or context-aware LLM',
      'Dynamic glossary enforcement with inline highlights for operators',
      'Segment-by-segment confidence scoring and manual review workflows',
      'Real-time WebSocket streaming for interactive subtitle previews',
    ],
    challenges: [
      'Enforcing custom terminology rules without breaking grammatical structures, solved using hybrid regex alignment and post-translation LLM correction.',
      'Synchronizing multi-user review states in real-time, resolved using WebSocket pub/sub patterns.',
    ],
    gallery: [aiTranslatorImg],
    tags: ['translation', 'nlp', 'llm', 'websockets', 'localization', 'real-time'],
    status: 'Completed',
    serviceSlugs: ['ai-automation', 'custom-software-development', 'ai', 'saas-platforms'],
    industry: 'SaaS',
    updatedDate: '2024-09-01',
  },
  {
    id: 8,
    title: 'AI Translator — documents & batches',
    slug: 'ai-translator-documents-batches',
    description:
      'Long-form and high-volume translation pipeline: structured uploads (DOCX/PDF/HTML), layout-aware segmentation, translation memory reuse, and export that preserves headings, tables, and inline markup where feasible. Job queue with retries, per-file status, and downloadable artefacts for audit.',
    thumbnail: aiTranslatorBatchesImg,
    category: 'NLP / GenAI',
    technologies: ['Python', 'PostgreSQL', 'Docker', 'AWS'],
    liveUrl: '#',
    githubUrl: '#',
    featured: false,
    date: '2024-06-25',
    client: 'GlobalVox Media',
    role: 'Backend Architect',
    longDescription:
      'Building on the AI Translator core, this service handles batch processing of multi-page documents (Word, PDF, and HTML). It isolates and extracts translatable text fragments, queries the translation memory to reduce duplicate costs, and recompiles the final translation into the original document format.',
    keyFeatures: [
      'Layout-preserving parsing and generation for DOCX, PDF, and HTML',
      'Translation memory database (PostgreSQL/HStore) for sub-millisecond lookups',
      'Asynchronous task worker model with retry logic and telemetry logs',
      'Operator queue with granular download and review capabilities',
    ],
    challenges: [
      'Rebuilding translated documents without corrupting strict XML schemas in DOCX structures, solved by using direct AST node replacement.',
      'Managing memory limits when processing massive documents, addressed by processing sections in chunks.',
    ],
    gallery: [aiTranslatorBatchesImg],
    tags: ['translation-memory', 'batch-processing', 'document-parsing', 'docx', 'pdf', 'workers'],
    status: 'In Progress',
    serviceSlugs: ['devops', 'cloud', 'ai-automation', 'custom-software-development', 'saas-platforms', 'cloud-infrastructure', 'product-platform-engineering'],
    industry: 'SaaS',
    updatedDate: '2024-07-02',
  },
  {
    id: 9,
    title: 'Finance — reporting & analytics',
    slug: 'finance-reporting-analytics',
    description:
      'Role-based financial workspace: P&L charts, transaction log views, and automated ledger checkpoints.',
    thumbnail: financeImg,
    category: 'FinTech',
    technologies: ['React', 'TypeScript', 'PostgreSQL', 'AWS'],
    liveUrl: '#',
    githubUrl: '#',
    featured: true,
    date: '2024-04-02',
    client: 'OmniAssets LLC',
    role: 'Lead Frontend Engineer',
    longDescription:
      'A secure financial analytics platform engineered to consolidate spreadsheets and disconnected transaction books into a single audited view. It features interactive financial statements, period closing templates, and robust role-based restrictions that protect sensitive financial records.',
    keyFeatures: [
      'Consolidated multi-entity P&L and balance sheet dashboards',
      'Interactive audit log mapping summary entries back to ledger items',
      'Configurable cashflow forecast simulator based on custom parameters',
      'Role-based segregation of duties preventing unauthorized ledger close',
    ],
    challenges: [
      'Rendering dynamic tables with thousands of transactional line items without lag, resolved using row-virtualization libraries.',
      'Calculating multi-currency conversions on the fly, optimized by caching exchange rates daily and offloading calculations to backend views.',
    ],
    gallery: [financeImg],
    tags: ['finance', 'fintech', 'analytics', 'compliance', 'rbac', 'reporting'],
    status: 'Completed',
    serviceSlugs: ['web-development', 'custom-software-development', 'revenue-web-conversion-systems', 'saas-platforms', 'ui-ux-design', 'branding', 'creative-design', 'product-design'],
    industry: 'Finance',
    updatedDate: '2024-04-10',
  },
] as const;

export const SECTION_PROJECTS = {
  tag: 'Case highlights',
  title: 'Representative work',
  highlight: 'across stacks',
  description:
    'Samples span routing, NLP/ML, finance, and internal tooling—illustrative of how we scope, integrate, and hand over production-minded software. Details anonymized where required.',
} as const;
