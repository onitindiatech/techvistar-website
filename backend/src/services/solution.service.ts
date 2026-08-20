/**
 * @file src/services/solution.service.ts
 * @description Service layer managing Solution database CRUD queries and slug auto-generation.
 */

import mongoose from 'mongoose';
import { Solution, ISolution } from '@/models/Solution';
import { ApiError } from '@/utils/ApiError';
import { logger } from '@/utils/logger';
import {
  SOLUTION_MEDIA_FIELDS,
  syncScalarMediaFields,
  deleteCloudinaryPublicIds,
} from '@/utils/mediaAsset';

const FALLBACK_SOLUTIONS: Record<string, unknown>[] = [
  {
    slug: 'enterprise-software',
    title: 'Enterprise Software',
    subtitle: 'Streamline Core Operations and Administrative Controls at Scale',
    icon: 'Building2',
    category: 'Business Solutions',
    status: 'active',
  },
  {
    slug: 'ai-automation',
    title: 'AI & Automation Solutions',
    subtitle: 'Deploy Autonomous LLM Agents and Intelligent Document Processing',
    icon: 'Brain',
    category: 'AI Solutions',
    status: 'active',
  },
  {
    slug: 'cloud-infrastructure',
    title: 'Cloud & Infrastructure',
    subtitle: 'Resilient Multi-Cloud Migrations and High-Throughput Kubernetes',
    icon: 'Cloud',
    category: 'Digital Solutions',
    status: 'active',
  },
  {
    slug: 'saas-platforms',
    title: 'SaaS Platforms',
    subtitle: 'Architect High-Velocity Multi-Tenant Cloud Products',
    icon: 'Layers',
    category: 'Business Solutions',
    status: 'active',
  },
  {
    slug: 'custom-software-development',
    title: 'Custom Software Development',
    subtitle: 'Tailored Full-Stack Engineering for Mission-Critical Operations',
    icon: 'Code2',
    category: 'Digital Solutions',
    status: 'active',
  },
  {
    slug: 'enterprise-ai-integration',
    title: 'Enterprise AI Integration',
    subtitle: 'Embed Secure Proprietary LLMs and Vector Retrieval into Workflows',
    icon: 'Sparkles',
    category: 'AI Solutions',
    status: 'active',
  },
];

export class SolutionService {
  /**
   * Creates a new Solution. Auto-generates unique slug.
   */
  async createSolution(data: Partial<ISolution>): Promise<ISolution> {
    logger.info('[SolutionService] Creating new solution', { title: data.title });

    let slug = data.slug;
    if (!slug && data.title) {
      slug = data.title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
    }

    if (slug) {
      const existing = await Solution.findOne({ slug });
      if (existing) {
        throw ApiError.conflict(`A solution with slug "${slug}" already exists.`);
      }
    }

    const { payload } = syncScalarMediaFields(null, data as Record<string, unknown>, SOLUTION_MEDIA_FIELDS);
    const solution = new Solution({ ...payload, slug });
    await solution.save();

    logger.info('[SolutionService] Solution created successfully', { id: solution._id, slug: solution.slug });
    return solution;
  }

  /**
   * Updates an existing Solution.
   */
  async updateSolution(id: string, data: Partial<ISolution>): Promise<ISolution> {
    logger.info('[SolutionService] Updating solution', { id });

    if (data.slug) {
      const existing = await Solution.findOne({ slug: data.slug, _id: { $ne: id } });
      if (existing) {
        throw ApiError.conflict(`A solution with slug "${data.slug}" already exists.`);
      }
    }

    const previous = await Solution.findById(id).lean();
    if (!previous) {
      throw ApiError.notFound('Solution not found');
    }

    const { payload, obsoletePublicIds } = syncScalarMediaFields(
      previous as unknown as Record<string, unknown>,
      data as Record<string, unknown>,
      SOLUTION_MEDIA_FIELDS
    );

    const solution = await Solution.findByIdAndUpdate(id, payload, { returnDocument: 'after', runValidators: true });
    if (!solution) {
      throw ApiError.notFound('Solution not found');
    }

    await deleteCloudinaryPublicIds(obsoletePublicIds);

    logger.info('[SolutionService] Solution updated successfully', { id: solution._id });
    return solution;
  }

  /**
   * Soft deletes a Solution listing.
   */
  async deleteSolution(id: string, deletedBy?: string): Promise<void> {
    logger.info('[SolutionService] Soft deleting solution', { id, deletedBy });
    const result = await Solution.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date(), deletedBy: deletedBy || 'System' },
      { returnDocument: 'after' }
    );
    if (!result) {
      throw ApiError.notFound('Solution not found');
    }
    logger.info('[SolutionService] Solution soft deleted successfully', { id });
  }

  /**
   * Restores a soft-deleted Solution listing.
   */
  async restoreSolution(id: string): Promise<void> {
    logger.info('[SolutionService] Restoring soft-deleted solution', { id });
    const result = await Solution.findByIdAndUpdate(
      id,
      { isDeleted: false, deletedAt: null, deletedBy: '' },
      { returnDocument: 'after' }
    );
    if (!result) {
      throw ApiError.notFound('Solution not found');
    }
  }

  /**
   * Permanently deletes a Solution listing from MongoDB.
   */
  async permanentlyDeleteSolution(id: string): Promise<void> {
    logger.info('[SolutionService] Permanently deleting solution', { id });
    const result = await Solution.findByIdAndDelete(id);
    if (!result) {
      throw ApiError.notFound('Solution not found');
    }
  }

  /**
   * Bulk soft-deletes multiple Solution listings.
   */
  async bulkDeleteSolutions(ids: string[], deletedBy?: string): Promise<void> {
    logger.info('[SolutionService] Bulk soft deleting solutions', { ids, deletedBy });
    await Solution.updateMany(
      { _id: { $in: ids } },
      { isDeleted: true, deletedAt: new Date(), deletedBy: deletedBy || 'System' }
    );
  }

  /**
   * Bulk restores multiple soft-deleted Solution listings.
   */
  async bulkRestoreSolutions(ids: string[]): Promise<void> {
    logger.info('[SolutionService] Bulk restoring solutions', { ids });
    await Solution.updateMany(
      { _id: { $in: ids } },
      { isDeleted: false, deletedAt: null, deletedBy: '' }
    );
  }

  /**
   * Bulk status update for multiple Solution listings.
   */
  async bulkUpdateStatus(ids: string[], status: 'draft' | 'active', updatedBy?: string): Promise<void> {
    logger.info('[SolutionService] Bulk status update', { ids, status, updatedBy });
    await Solution.updateMany(
      { _id: { $in: ids } },
      { status, updatedBy: updatedBy || 'System' }
    );
  }

  /**
   * Retrieves all active solutions sorted by displayOrder ascending.
   */
  async getActiveSolutions(category?: string): Promise<ISolution[]> {
    logger.info('[SolutionService] Retrieving all active solutions', { category });
    if (mongoose.connection.readyState !== 1) {
      logger.warn('[SolutionService] DB not ready, returning fallbacks instantly');
      return FALLBACK_SOLUTIONS as unknown as ISolution[];
    }
    try {
      const query: Record<string, unknown> = { status: 'active', isDeleted: { $ne: true } };
      if (category && category !== 'All') {
        query.category = { $regex: new RegExp('^' + category + '$', 'i') };
      }
      const results = await Solution.find(query).sort({ displayOrder: 1, createdAt: 1 }).lean() as ISolution[];
      if (results && results.length > 0) {
        return results;
      }
    } catch (err) {
      logger.warn('[SolutionService] Database query failed or unavailable, using in-memory fallbacks', { err });
    }

    return FALLBACK_SOLUTIONS as unknown as ISolution[];
  }

  /**
   * Retrieves all solutions with pagination, search, category, featured, trash filtering and dynamic sorting.
   */
  async getAllSolutions(options: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    category?: string;
    trash?: boolean | string;
    featured?: boolean | string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<{ data: ISolution[]; pagination: { total: number; page: number; limit: number; totalPages: number } }> {
    logger.info('[SolutionService] Retrieving all solutions with options', options);

    const page = Math.max(1, Number(options.page) || 1);
    const limit = Math.max(1, Number(options.limit) || 10);
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = {};

    const isTrash = options.trash === 'true' || options.trash === true || options.status === 'deleted';
    if (isTrash) {
      query.isDeleted = true;
    } else {
      query.isDeleted = { $ne: true };
    }

    if (options.status && options.status !== 'all' && options.status !== 'deleted') {
      query.status = options.status;
    }
    if (options.category && options.category !== 'all') {
      query.category = { $regex: new RegExp('^' + options.category + '$', 'i') };
    }
    if (options.featured && options.featured !== 'all') {
      query.featured = options.featured === 'true' || options.featured === true;
    }
    if (options.search) {
      query.$or = [
        { title: { $regex: options.search, $options: 'i' } },
        { subtitle: { $regex: options.search, $options: 'i' } },
        { category: { $regex: options.search, $options: 'i' } },
        { slug: { $regex: options.search, $options: 'i' } },
        { status: { $regex: options.search, $options: 'i' } },
        { techStack: { $regex: options.search, $options: 'i' } },
      ];
    }

    let sortObj: Record<string, 1 | -1> = { displayOrder: 1, createdAt: -1 };
    if (options.sortBy) {
      const order = options.sortOrder === 'desc' ? -1 : 1;
      if (options.sortBy === 'title') sortObj = { title: order };
      else if (options.sortBy === 'createdAt') sortObj = { createdAt: order };
      else if (options.sortBy === 'updatedAt') sortObj = { updatedAt: order };
      else if (options.sortBy === 'displayOrder') sortObj = { displayOrder: order };
      else if (options.sortBy === 'status') sortObj = { status: order };
    }

    const total = await Solution.countDocuments(query);
    const data = await Solution.find(query).sort(sortObj).skip(skip).limit(limit);
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      pagination: { total, page, limit, totalPages },
    };
  }

  /**
   * Retrieves details of a single active solution by its slug.
   */
  async getSolutionBySlug(slug: string): Promise<ISolution> {
    logger.info('[SolutionService] Retrieving active solution by slug', { slug });
    try {
      const solution = await Solution.findOne({ slug, status: 'active', isDeleted: { $ne: true } }).lean();
      if (solution) {
        return solution as ISolution;
      }
    } catch (err) {
      logger.warn('[SolutionService] Database query for solution slug failed, checking in-memory fallbacks', { slug, err });
    }

    const fallback = FALLBACK_SOLUTIONS.find((s) => s.slug === slug);
    if (fallback) {
      return { ...fallback, status: 'active' } as unknown as ISolution;
    }

    throw ApiError.notFound(`Solution not found for slug "${slug}"`);
  }
}

export const solutionService = new SolutionService();
