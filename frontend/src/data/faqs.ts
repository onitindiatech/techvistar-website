export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'General' | 'Services' | 'Work' | 'Careers' | 'Contact' | 'AI' | 'Backend' | 'Frontend';
  page: 'home' | 'services' | 'work' | 'careers' | 'contact' | 'all';
  tags: string[];
  featured: boolean;
}

export const FAQs: readonly FAQ[] = [
  {
    id: 'faq-1',
    category: 'General',
    page: 'home',
    tags: ['company', 'process'],
    featured: true,
    question: 'What is TechVistar\'s delivery methodology?',
    answer: 'We run a modern, disciplined engineering process. We operate under clear deliverables, version-controlled repository updates, mirror environments to match production, and complete staging sign-offs. We avoid ambiguous timelines by structuring our projects into milestone-based handovers.'
  },
  {
    id: 'faq-2',
    category: 'Services',
    page: 'services',
    tags: ['web', 'frontend'],
    featured: true,
    question: 'Which frontend frameworks and stacks do you support?',
    answer: 'We primarily build core web architectures using React, TypeScript, Next.js, and TailwindCSS for styling. For state management, we utilize lightweight tools like Zustand or TanStack Query to keep pages fast, responsive, and easy to maintain.'
  },
  {
    id: 'faq-3',
    category: 'AI',
    page: 'services',
    tags: ['ai', 'automation'],
    featured: true,
    question: 'How do you design custom GenAI integrations securely?',
    answer: 'We implement strict Retrieval-Augmented Generation (RAG) structures using vector databases (like Pinecone) to restrict LLMs to your verified data. We also configure prompt guardrails and rate-limiting to prevent hallucinations, secure data storage, and keep API token costs optimized.'
  },
  {
    id: 'faq-4',
    category: 'Work',
    page: 'work',
    tags: ['pricing', 'contracts'],
    featured: true,
    question: 'Do you offer fixed-price or time-and-materials engagement models?',
    answer: 'We support both models depending on project specifications. For well-defined scopes, we establish transparent fixed-price milestone terms. For dynamic R&D, scaling applications, or ongoing support, we utilize hourly sprint models with clear weekly logs.'
  },
  {
    id: 'faq-5',
    category: 'Contact',
    page: 'contact',
    tags: ['support', 'communication'],
    featured: true,
    question: 'What is your response SLA for support inquiries?',
    answer: 'For active clients, we operate under a strict 1-business-day response window for standard tickets, and 1-4 hour responses for critical system outages depending on your service level agreement terms.'
  },
  {
    id: 'faq-6',
    category: 'Careers',
    page: 'careers',
    tags: ['culture', 'hiring'],
    featured: false,
    question: 'What does the engineering interview cycle look like?',
    answer: 'Our hiring process involves a brief intro conversation, a practical coding review (mirroring real-world assignments, no brainteasers), a technical design session, and a culture alignment meeting with our founders.'
  },
  {
    id: 'faq-7',
    category: 'Backend',
    page: 'services',
    tags: ['cloud', 'backend'],
    featured: false,
    question: 'How do you handle backend scaling and security?',
    answer: 'We construct server frameworks utilizing Node.js, Go, or Python, deployed in containerized Docker environments on AWS/Azure. We manage infrastructures via Terraform, implementing auto-scaling policies, CDN caching, and encrypted database networks.'
  },
  {
    id: 'faq-8',
    category: 'Frontend',
    page: 'services',
    tags: ['performance', 'seo'],
    featured: false,
    question: 'Are your designs and web layouts fully optimized for SEO?',
    answer: 'Yes, we optimize every application to score 90+ on Google Lighthouse/Core Web Vitals. We implement server-side rendering (SSR), optimized responsive images, clean semantics, meta configurations, and microdata parameters.'
  },
  {
    id: 'faq-9',
    category: 'General',
    page: 'home',
    tags: ['delivery', 'ownership'],
    featured: true,
    question: 'Will our internal team own the codebase after delivery?',
    answer: 'Absolutely. Upon completing milestones and commercial handovers, we transfer complete IP ownership, version controls, documentation, training materials, and deployment credentials directly to your team.'
  },
  {
    id: 'faq-10',
    category: 'Services',
    page: 'services',
    tags: ['devops', 'deployment'],
    featured: false,
    question: 'How do you manage deployments and CI/CD operations?',
    answer: 'We configure automated CI/CD pipelines (e.g. GitHub Actions or GitLab CI) that trigger automated linting, unit tests, and build processes before deploying directly to staging or production.'
  }
];
