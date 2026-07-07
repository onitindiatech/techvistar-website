/**
 * @file src/services/industry.service.ts
 * @description Service layer managing Industry database queries and slug generation.
 */

import { Industry, IIndustry } from '@/models/Industry';
import { ApiError } from '@/utils/ApiError';
import { logger } from '@/utils/logger';

export class IndustryService {
  /**
   * Creates a new industry. Auto-generates unique slug.
   */
  async createIndustry(data: Partial<IIndustry>): Promise<IIndustry> {
    logger.info('[IndustryService] Creating new industry listing', { title: data.title });

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
      const existing = await Industry.findOne({ slug });
      if (existing) {
        throw ApiError.conflict(`An industry with slug "${slug}" already exists.`);
      }
    }

    const industry = new Industry({ ...data, slug });
    await industry.save();

    logger.info('[IndustryService] Industry created successfully', { id: industry._id, slug: industry.slug });
    return industry;
  }

  /**
   * Updates an existing industry posting.
   */
  async updateIndustry(id: string, data: Partial<IIndustry>): Promise<IIndustry> {
    logger.info('[IndustryService] Updating industry listing', { id });

    if (data.slug) {
      const existing = await Industry.findOne({ slug: data.slug, _id: { $ne: id } });
      if (existing) {
        throw ApiError.conflict(`An industry with slug "${data.slug}" already exists.`);
      }
    }

    const industry = await Industry.findByIdAndUpdate(id, data, { returnDocument: 'after', runValidators: true });
    if (!industry) {
      throw ApiError.notFound('Industry listing not found');
    }

    logger.info('[IndustryService] Industry updated successfully', { id: industry._id });
    return industry;
  }

  /**
   * Soft deletes an industry listing.
   */
  async deleteIndustry(id: string, deletedBy?: string): Promise<void> {
    logger.info('[IndustryService] Soft deleting industry listing', { id, deletedBy });
    const result = await Industry.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date(), deletedBy: deletedBy || 'System' },
      { returnDocument: 'after' }
    );
    if (!result) {
      throw ApiError.notFound('Industry listing not found');
    }
    logger.info('[IndustryService] Industry soft deleted successfully', { id });
  }

  /**
   * Restores a soft-deleted industry listing.
   */
  async restoreIndustry(id: string): Promise<void> {
    logger.info('[IndustryService] Restoring soft-deleted industry', { id });
    const result = await Industry.findByIdAndUpdate(
      id,
      { isDeleted: false, deletedAt: null, deletedBy: '' },
      { returnDocument: 'after' }
    );
    if (!result) {
      throw ApiError.notFound('Industry listing not found');
    }
  }

  /**
   * Permanently deletes an industry listing from MongoDB.
   */
  async permanentlyDeleteIndustry(id: string): Promise<void> {
    logger.info('[IndustryService] Permanently deleting industry listing', { id });
    const result = await Industry.findByIdAndDelete(id);
    if (!result) {
      throw ApiError.notFound('Industry listing not found');
    }
  }

  /**
   * Bulk soft-deletes multiple industry listings.
   */
  async bulkDeleteIndustries(ids: string[], deletedBy?: string): Promise<void> {
    logger.info('[IndustryService] Bulk soft deleting industries', { ids, deletedBy });
    await Industry.updateMany(
      { _id: { $in: ids } },
      { isDeleted: true, deletedAt: new Date(), deletedBy: deletedBy || 'System' }
    );
  }

  /**
   * Bulk restores multiple soft-deleted industry listings.
   */
  async bulkRestoreIndustries(ids: string[]): Promise<void> {
    logger.info('[IndustryService] Bulk restoring industries', { ids });
    await Industry.updateMany(
      { _id: { $in: ids } },
      { isDeleted: false, deletedAt: null, deletedBy: '' }
    );
  }

  /**
   * Bulk status update for multiple industry listings.
   */
  async bulkUpdateStatus(ids: string[], status: 'draft' | 'active', updatedBy?: string): Promise<void> {
    logger.info('[IndustryService] Bulk status update', { ids, status, updatedBy });
    await Industry.updateMany(
      { _id: { $in: ids } },
      { status, updatedBy: updatedBy || 'System' }
    );
  }

  /**
   * Retrieves all active industries ordered by displayOrder ascending.
   * Returns only safe, client-facing fields for public consumption.
   */
  async getActiveIndustries(category?: string): Promise<IIndustry[]> {
    logger.info('[IndustryService] Retrieving all active industries', { category });
    const query: any = { status: 'active', isDeleted: { $ne: true } };
    if (category && category !== 'All') {
      query.category = { $regex: new RegExp('^' + category + '$', 'i') };
    }
    return Industry.find(query).sort({ displayOrder: 1, createdAt: 1 });
  }

  /**
   * Retrieves all industries (active + drafts) with pagination, search, category, featured, trash filtering and dynamic sorting.
   */
  async getAllIndustries(options: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    category?: string;
    trash?: boolean | string;
    featured?: boolean | string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<{ data: IIndustry[]; pagination: { total: number; page: number; limit: number; totalPages: number } }> {
    logger.info('[IndustryService] Retrieving all industries with options', options);
    
    const page = Math.max(1, Number(options.page) || 1);
    const limit = Math.max(1, Number(options.limit) || 10);
    const skip = (page - 1) * limit;

    const query: any = {};

    // Soft delete check
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
        { category: { $regex: options.search, $options: 'i' } },
        { slug: { $regex: options.search, $options: 'i' } },
        { technologies: { $regex: options.search, $options: 'i' } },
        { status: { $regex: options.search, $options: 'i' } }
      ];
    }

    // Dynamic sorting
    let sortObj: any = { displayOrder: 1, createdAt: -1 };
    if (options.sortBy) {
      const order = options.sortOrder === 'desc' ? -1 : 1;
      if (options.sortBy === 'title') sortObj = { title: order };
      else if (options.sortBy === 'createdAt') sortObj = { createdAt: order };
      else if (options.sortBy === 'updatedAt') sortObj = { updatedAt: order };
      else if (options.sortBy === 'displayOrder') sortObj = { displayOrder: order };
      else if (options.sortBy === 'status') sortObj = { status: order };
    }

    const total = await Industry.countDocuments(query);
    const data = await Industry.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages
      }
    };
  }

  /**
   * Retrieves a single active industry by slug.
   */
  async getIndustryBySlug(slug: string): Promise<IIndustry> {
    logger.info('[IndustryService] Retrieving active industry by slug', { slug });
    const industry = await Industry.findOne({ slug, status: 'active', isDeleted: { $ne: true } });
    if (!industry) {
      throw ApiError.notFound(`Industry not found for slug "${slug}"`);
    }
    return industry;
  }
}

export const industryService = new IndustryService();
