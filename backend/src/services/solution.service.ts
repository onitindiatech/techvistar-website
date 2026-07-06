/**
 * @file src/services/solution.service.ts
 * @description Service layer managing Solution database CRUD queries and slug auto-generation.
 */

import { Solution, ISolution } from '@/models/Solution';
import { ApiError } from '@/utils/ApiError';
import { logger } from '@/utils/logger';

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

    const solution = new Solution({ ...data, slug });
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

    const solution = await Solution.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!solution) {
      throw ApiError.notFound('Solution not found');
    }

    logger.info('[SolutionService] Solution updated successfully', { id: solution._id });
    return solution;
  }

  /**
   * Deletes a Solution.
   */
  async deleteSolution(id: string): Promise<void> {
    logger.info('[SolutionService] Deleting solution', { id });
    const result = await Solution.findByIdAndDelete(id);
    if (!result) {
      throw ApiError.notFound('Solution not found');
    }
    logger.info('[SolutionService] Solution deleted successfully', { id });
  }

  /**
   * Retrieves all active solutions sorted by displayOrder ascending.
   */
  async getActiveSolutions(): Promise<ISolution[]> {
    logger.info('[SolutionService] Retrieving all active solutions');
    return Solution.find({ status: 'active' })
      .sort({ displayOrder: 1, createdAt: 1 });
  }

  /**
   * Retrieves all solutions (active + drafts).
   */
  async getAllSolutions(): Promise<ISolution[]> {
    logger.info('[SolutionService] Retrieving all solutions (active + drafts)');
    return Solution.find().sort({ displayOrder: 1, createdAt: -1 });
  }

  /**
   * Retrieves details of a single active solution by its slug.
   */
  async getSolutionBySlug(slug: string): Promise<ISolution> {
    logger.info('[SolutionService] Retrieving active solution by slug', { slug });
    const solution = await Solution.findOne({ slug, status: 'active' });
    if (!solution) {
      throw ApiError.notFound(`Solution not found for slug "${slug}"`);
    }
    return solution;
  }
}

export const solutionService = new SolutionService();
