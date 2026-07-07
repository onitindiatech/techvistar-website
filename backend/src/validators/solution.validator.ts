/**
 * @file src/validators/solution.validator.ts
 * @description Native validator for Solutions CMS entries.
 */

import { ApiError } from '@/utils/ApiError';

interface SolutionInput {
  title?: unknown;
  slug?: unknown;
  subtitle?: unknown;
  icon?: unknown;
  category?: unknown;
  challenges?: unknown;
  ourSolution?: unknown;
  features?: unknown;
  howItWorks?: unknown;
  benefits?: unknown;
  industries?: unknown;
  techStack?: unknown;
  metrics?: unknown;
  faqs?: unknown;
  status?: unknown;
  displayOrder?: unknown;
  featured?: unknown;
}

export function validateSolutionInput(input: SolutionInput, isUpdate = false): any {
  const errors: Array<{ field: string; message: string }> = [];

  // Title
  if (!isUpdate || input.title !== undefined) {
    if (input.title === undefined || input.title === null || String(input.title).trim() === '') {
      errors.push({ field: 'title', message: 'Solution title is required' });
    }
  }

  // Slug
  if (input.slug !== undefined && input.slug !== null) {
    const slugStr = String(input.slug).trim().toLowerCase();
    if (slugStr === '') {
      errors.push({ field: 'slug', message: 'Slug cannot be empty' });
    }
  }

  // Subtitle
  if (!isUpdate || input.subtitle !== undefined) {
    if (input.subtitle === undefined || input.subtitle === null || String(input.subtitle).trim() === '') {
      errors.push({ field: 'subtitle', message: 'Subtitle is required' });
    }
  }

  // Icon
  if (!isUpdate || input.icon !== undefined) {
    if (input.icon === undefined || input.icon === null || String(input.icon).trim() === '') {
      errors.push({ field: 'icon', message: 'Icon is required' });
    }
  }

  // Category
  if (!isUpdate || input.category !== undefined) {
    if (input.category === undefined || input.category === null || String(input.category).trim() === '') {
      errors.push({ field: 'category', message: 'Category is required' });
    }
  }

  // Challenges
  let parsedChallenges: any;
  if (!isUpdate || input.challenges !== undefined) {
    const ch = input.challenges as any;
    if (!ch || typeof ch !== 'object') {
      errors.push({ field: 'challenges', message: 'Challenges object is required' });
    } else {
      parsedChallenges = {
        title: String(ch.title || '').trim(),
        points: Array.isArray(ch.points) ? ch.points.map((p: any) => String(p).trim()).filter(Boolean) : [],
        impact: String(ch.impact || '').trim(),
      };
      if (!parsedChallenges.title) errors.push({ field: 'challenges.title', message: 'Challenges title is required' });
      if (!parsedChallenges.impact) errors.push({ field: 'challenges.impact', message: 'Challenges impact is required' });
    }
  }

  // Our Solution
  let parsedOurSolution: any;
  if (!isUpdate || input.ourSolution !== undefined) {
    const os = input.ourSolution as any;
    if (!os || typeof os !== 'object') {
      errors.push({ field: 'ourSolution', message: 'Our solution object is required' });
    } else {
      parsedOurSolution = {
        overview: String(os.overview || '').trim(),
        capabilities: Array.isArray(os.capabilities) ? os.capabilities.map((c: any) => String(c).trim()).filter(Boolean) : [],
      };
      if (!parsedOurSolution.overview) errors.push({ field: 'ourSolution.overview', message: 'Our solution overview is required' });
    }
  }

  // Features
  let parsedFeatures: any[] = [];
  if (input.features !== undefined) {
    if (!Array.isArray(input.features)) {
      errors.push({ field: 'features', message: 'Features must be an array' });
    } else {
      parsedFeatures = input.features.map((f: any, idx: number) => {
        if (!f || typeof f !== 'object') {
          errors.push({ field: `features[${idx}]`, message: 'Feature must be an object' });
          return null;
        }
        return {
          title: String(f.title || '').trim(),
          description: String(f.description || '').trim(),
          icon: String(f.icon || '').trim(),
        };
      }).filter(Boolean);
    }
  }

  // How It Works
  let parsedHowItWorks: any[] = [];
  if (input.howItWorks !== undefined) {
    if (!Array.isArray(input.howItWorks)) {
      errors.push({ field: 'howItWorks', message: 'howItWorks must be an array' });
    } else {
      parsedHowItWorks = input.howItWorks.map((h: any, idx: number) => {
        if (!h || typeof h !== 'object') {
          errors.push({ field: `howItWorks[${idx}]`, message: 'howItWorks step must be an object' });
          return null;
        }
        return {
          step: String(h.step || '').trim(),
          title: String(h.title || '').trim(),
          desc: String(h.desc || '').trim(),
        };
      }).filter(Boolean);
    }
  }

  // Benefits
  let parsedBenefits: any;
  if (!isUpdate || input.benefits !== undefined) {
    const b = input.benefits as any;
    if (!b || typeof b !== 'object') {
      errors.push({ field: 'benefits', message: 'Benefits object is required' });
    } else {
      parsedBenefits = {
        roi: String(b.roi || '').trim(),
        efficiency: String(b.efficiency || '').trim(),
        scalability: String(b.scalability || '').trim(),
        security: String(b.security || '').trim(),
      };
      if (!parsedBenefits.roi) errors.push({ field: 'benefits.roi', message: 'Benefits roi is required' });
      if (!parsedBenefits.efficiency) errors.push({ field: 'benefits.efficiency', message: 'Benefits efficiency is required' });
      if (!parsedBenefits.scalability) errors.push({ field: 'benefits.scalability', message: 'Benefits scalability is required' });
      if (!parsedBenefits.security) errors.push({ field: 'benefits.security', message: 'Benefits security is required' });
    }
  }

  // Industries
  let parsedIndustries: any[] = [];
  if (input.industries !== undefined) {
    if (!Array.isArray(input.industries)) {
      errors.push({ field: 'industries', message: 'Industries must be an array' });
    } else {
      parsedIndustries = input.industries.map((ind: any, idx: number) => {
        if (!ind || typeof ind !== 'object') {
          errors.push({ field: `industries[${idx}]`, message: 'Industry must be an object' });
          return null;
        }
        return {
          name: String(ind.name || '').trim(),
          slug: String(ind.slug || '').trim(),
        };
      }).filter(Boolean);
    }
  }

  // Tech Stack
  let parsedTechStack: string[] | undefined;
  if (input.techStack !== undefined) {
    if (!Array.isArray(input.techStack)) {
      errors.push({ field: 'techStack', message: 'techStack must be an array of strings' });
    } else {
      parsedTechStack = input.techStack.map((v) => String(v).trim()).filter(Boolean);
    }
  }

  // Metrics
  let parsedMetrics: any[] = [];
  if (input.metrics !== undefined) {
    if (!Array.isArray(input.metrics)) {
      errors.push({ field: 'metrics', message: 'Metrics must be an array' });
    } else {
      parsedMetrics = input.metrics.map((m: any, idx: number) => {
        if (!m || typeof m !== 'object') {
          errors.push({ field: `metrics[${idx}]`, message: 'Metric must be an object' });
          return null;
        }
        return {
          label: String(m.label || '').trim(),
          value: String(m.value || '').trim(),
        };
      }).filter(Boolean);
    }
  }

  // FAQs
  let parsedFAQs: any[] = [];
  if (input.faqs !== undefined) {
    if (!Array.isArray(input.faqs)) {
      errors.push({ field: 'faqs', message: 'FAQs must be an array' });
    } else {
      parsedFAQs = input.faqs.map((f: any, idx: number) => {
        if (!f || typeof f !== 'object') {
          errors.push({ field: `faqs[${idx}]`, message: 'FAQ must be an object' });
          return null;
        }
        return {
          q: String(f.q || '').trim(),
          a: String(f.a || '').trim(),
        };
      }).filter(Boolean);
    }
  }

  // Status
  if (input.status !== undefined && input.status !== null) {
    const statusStr = String(input.status).trim();
    if (statusStr !== 'draft' && statusStr !== 'active') {
      errors.push({ field: 'status', message: 'Status must be either "draft" or "active"' });
    }
  }

  // Display Order
  let parsedDisplayOrder = 0;
  if (input.displayOrder !== undefined && input.displayOrder !== null) {
    const num = Number(input.displayOrder);
    if (isNaN(num)) {
      errors.push({ field: 'displayOrder', message: 'Display order must be a valid number' });
    } else {
      parsedDisplayOrder = num;
    }
  }

  if (errors.length > 0) {
    throw ApiError.validationError('Validation failed', errors);
  }

  if (isUpdate) {
    const updatePayload: Record<string, unknown> = {};
    if (input.title !== undefined) updatePayload.title = String(input.title).trim();
    if (input.slug !== undefined) updatePayload.slug = String(input.slug).trim().toLowerCase();
    if (input.subtitle !== undefined) updatePayload.subtitle = String(input.subtitle).trim();
    if (input.icon !== undefined) updatePayload.icon = String(input.icon).trim();
    if (input.category !== undefined) updatePayload.category = String(input.category).trim();
    if (parsedChallenges !== undefined) updatePayload.challenges = parsedChallenges;
    if (parsedOurSolution !== undefined) updatePayload.ourSolution = parsedOurSolution;
    if (input.features !== undefined) updatePayload.features = parsedFeatures;
    if (input.howItWorks !== undefined) updatePayload.howItWorks = parsedHowItWorks;
    if (parsedBenefits !== undefined) updatePayload.benefits = parsedBenefits;
    if (input.industries !== undefined) updatePayload.industries = parsedIndustries;
    if (parsedTechStack !== undefined) updatePayload.techStack = parsedTechStack;
    if (input.metrics !== undefined) updatePayload.metrics = parsedMetrics;
    if (input.faqs !== undefined) updatePayload.faqs = parsedFAQs;
    if (input.status !== undefined && input.status !== null) {
      updatePayload.status = String(input.status).trim() as 'draft' | 'active';
    }
    if (input.displayOrder !== undefined && input.displayOrder !== null) {
      updatePayload.displayOrder = parsedDisplayOrder;
    }
    if (input.featured !== undefined) {
      updatePayload.featured = input.featured === true || input.featured === 'true';
    }
    return updatePayload;
  }

  return {
    title: String(input.title).trim(),
    ...(input.slug !== undefined && { slug: String(input.slug).trim().toLowerCase() }),
    subtitle: String(input.subtitle).trim(),
    icon: String(input.icon).trim(),
    category: String(input.category).trim(),
    challenges: parsedChallenges!,
    ourSolution: parsedOurSolution!,
    features: parsedFeatures,
    howItWorks: parsedHowItWorks,
    benefits: parsedBenefits!,
    industries: parsedIndustries,
    techStack: parsedTechStack ?? [],
    metrics: parsedMetrics,
    faqs: parsedFAQs,
    status: (input.status ? String(input.status).trim() : 'active') as 'draft' | 'active',
    displayOrder: parsedDisplayOrder,
    featured: input.featured === true || input.featured === 'true',
  };
}
