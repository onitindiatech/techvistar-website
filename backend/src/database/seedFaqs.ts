/**
 * @file src/database/seedFaqs.ts
 * @description Seeding script to populate the FAQ collection in MongoDB Atlas.
 *
 * SOURCE OF TRUTH: The FAQ data below is taken verbatim from
 * frontend/src/data/faqs.ts — every question, answer, category, page,
 * tags, and featured flag matches the current static data exactly.
 *
 * Run once after MongoDB connection is confirmed:
 *   npx ts-node -r tsconfig-paths/register src/database/seedFaqs.ts
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { FAQModel } from '../models/FAQ';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/techvistar';

// ─── Source data (mirrors frontend/src/data/faqs.ts exactly) ─────────────────
const FAQ_DATA = [
  {
    faqId:        'faq-1',
    category:     'General',
    page:         'home',
    tags:         ['company', 'process'],
    featured:     true,
    status:       'active',
    displayOrder: 1,
    question:     "What is TechVistar's delivery methodology?",
    answer:       'We run a modern, disciplined engineering process. We operate under clear deliverables, version-controlled repository updates, mirror environments to match production, and complete staging sign-offs. We avoid ambiguous timelines by structuring our projects into milestone-based handovers.',
  },
  {
    faqId:        'faq-2',
    category:     'Services',
    page:         'services',
    tags:         ['web', 'frontend'],
    featured:     true,
    status:       'active',
    displayOrder: 2,
    question:     'Which frontend frameworks and stacks do you support?',
    answer:       'We primarily build core web architectures using React, TypeScript, Next.js, and TailwindCSS for styling. For state management, we utilize lightweight tools like Zustand or TanStack Query to keep pages fast, responsive, and easy to maintain.',
  },
  {
    faqId:        'faq-3',
    category:     'AI',
    page:         'services',
    tags:         ['ai', 'automation'],
    featured:     true,
    status:       'active',
    displayOrder: 3,
    question:     'How do you design custom GenAI integrations securely?',
    answer:       'We implement strict Retrieval-Augmented Generation (RAG) structures using vector databases (like Pinecone) to restrict LLMs to your verified data. We also configure prompt guardrails and rate-limiting to prevent hallucinations, secure data storage, and keep API token costs optimized.',
  },
  {
    faqId:        'faq-4',
    category:     'Work',
    page:         'work',
    tags:         ['pricing', 'contracts'],
    featured:     true,
    status:       'active',
    displayOrder: 4,
    question:     'Do you offer fixed-price or time-and-materials engagement models?',
    answer:       'We support both models depending on project specifications. For well-defined scopes, we establish transparent fixed-price milestone terms. For dynamic R&D, scaling applications, or ongoing support, we utilize hourly sprint models with clear weekly logs.',
  },
  {
    faqId:        'faq-5',
    category:     'Contact',
    page:         'contact',
    tags:         ['support', 'communication'],
    featured:     true,
    status:       'active',
    displayOrder: 5,
    question:     'What is your response SLA for support inquiries?',
    answer:       'For active clients, we operate under a strict 1-business-day response window for standard tickets, and 1-4 hour responses for critical system outages depending on your service level agreement terms.',
  },
  {
    faqId:        'faq-6',
    category:     'Careers',
    page:         'careers',
    tags:         ['culture', 'hiring'],
    featured:     false,
    status:       'active',
    displayOrder: 6,
    question:     'What does the engineering interview cycle look like?',
    answer:       'Our hiring process involves a brief intro conversation, a practical coding review (mirroring real-world assignments, no brainteasers), a technical design session, and a culture alignment meeting with our founders.',
  },
  {
    faqId:        'faq-7',
    category:     'Backend',
    page:         'services',
    tags:         ['cloud', 'backend'],
    featured:     false,
    status:       'active',
    displayOrder: 7,
    question:     'How do you handle backend scaling and security?',
    answer:       'We construct server frameworks utilizing Node.js, Go, or Python, deployed in containerized Docker environments on AWS/Azure. We manage infrastructures via Terraform, implementing auto-scaling policies, CDN caching, and encrypted database networks.',
  },
  {
    faqId:        'faq-8',
    category:     'Frontend',
    page:         'services',
    tags:         ['performance', 'seo'],
    featured:     false,
    status:       'active',
    displayOrder: 8,
    question:     'Are your designs and web layouts fully optimized for SEO?',
    answer:       'Yes, we optimize every application to score 90+ on Google Lighthouse/Core Web Vitals. We implement server-side rendering (SSR), optimized responsive images, clean semantics, meta configurations, and microdata parameters.',
  },
  {
    faqId:        'faq-9',
    category:     'General',
    page:         'home',
    tags:         ['delivery', 'ownership'],
    featured:     true,
    status:       'active',
    displayOrder: 9,
    question:     'Will our internal team own the codebase after delivery?',
    answer:       'Absolutely. Upon completing milestones and commercial handovers, we transfer complete IP ownership, version controls, documentation, training materials, and deployment credentials directly to your team.',
  },
  {
    faqId:        'faq-10',
    category:     'Services',
    page:         'services',
    tags:         ['devops', 'deployment'],
    featured:     false,
    status:       'active',
    displayOrder: 10,
    question:     'How do you manage deployments and CI/CD operations?',
    answer:       'We configure automated CI/CD pipelines (e.g. GitHub Actions or GitLab CI) that trigger automated linting, unit tests, and build processes before deploying directly to staging or production.',
  },
];

async function seed() {
  try {
    console.log('[Seed:FAQs] Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI);
    console.log('[Seed:FAQs] Connected successfully.');

    console.log('[Seed:FAQs] Cleaning existing FAQ documents...');
    await FAQModel.deleteMany({});
    console.log('[Seed:FAQs] Existing FAQs removed.');

    console.log(`[Seed:FAQs] Inserting ${FAQ_DATA.length} FAQs...`);
    await FAQModel.insertMany(FAQ_DATA);
    console.log(`[Seed:FAQs] ✓ ${FAQ_DATA.length} FAQs seeded successfully!`);

    // Verify
    const count = await FAQModel.countDocuments();
    console.log(`[Seed:FAQs] Verification: ${count} documents in collection.`);
  } catch (error) {
    console.error('[Seed:FAQs] Seeding error:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('[Seed:FAQs] Disconnected.');
  }
}

seed();
