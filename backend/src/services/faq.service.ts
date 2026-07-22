/**
 * @file src/services/faq.service.ts
 * @description Service layer managing FAQ database CRUD operations.
 */

import { FAQModel, IFAQ } from '@/models/FAQ';
import { ApiError } from '@/utils/ApiError';
import { logger } from '@/utils/logger';

export class FAQService {
  /**
   * Returns all active, non-deleted FAQs sorted by displayOrder ascending.
   */
  async getActiveFAQs(): Promise<IFAQ[]> {
    logger.info('[FAQService] Retrieving all active FAQs');
    return FAQModel.find({ status: 'active', isDeleted: { $ne: true } }).sort({ displayOrder: 1 }).lean() as Promise<IFAQ[]>;
  }

  /**
   * Returns a single FAQ by its unique faqId string (public).
   */
  async getFAQById(faqId: string): Promise<IFAQ> {
    logger.info('[FAQService] Retrieving FAQ by ID', { faqId });
    const faq = await FAQModel.findOne({ faqId, isDeleted: { $ne: true } }).lean();
    if (!faq) {
      throw ApiError.notFound(`FAQ not found for ID "${faqId}"`);
    }
    return faq as IFAQ;
  }

  /**
   * Creates a new FAQ entry.
   */
  async createFAQ(data: Partial<IFAQ>): Promise<IFAQ> {
    logger.info('[FAQService] Creating new FAQ', { faqId: data.faqId });

    const existing = await FAQModel.findOne({ faqId: data.faqId });
    if (existing) {
      throw ApiError.conflict(`A FAQ with ID "${data.faqId}" already exists.`);
    }

    const faq = new FAQModel(data);
    await faq.save();

    logger.info('[FAQService] FAQ created successfully', { id: faq._id, faqId: faq.faqId });
    return faq;
  }

  /**
   * Updates an existing FAQ by its MongoDB _id.
   */
  async updateFAQ(id: string, data: Partial<IFAQ>): Promise<IFAQ> {
    logger.info('[FAQService] Updating FAQ', { id });

    if (data.faqId) {
      const existing = await FAQModel.findOne({ faqId: data.faqId, _id: { $ne: id } });
      if (existing) {
        throw ApiError.conflict(`A FAQ with ID "${data.faqId}" already exists.`);
      }
    }

    const faq = await FAQModel.findByIdAndUpdate(id, data, { returnDocument: 'after', runValidators: true });
    if (!faq) {
      throw ApiError.notFound('FAQ not found');
    }

    logger.info('[FAQService] FAQ updated successfully', { id: faq._id });
    return faq;
  }

  /**
   * Soft deletes a FAQ by its MongoDB _id.
   */
  async deleteFAQ(id: string, deletedBy?: string): Promise<void> {
    logger.info('[FAQService] Soft deleting FAQ', { id, deletedBy });
    const result = await FAQModel.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date(), deletedBy: deletedBy || 'System' },
      { returnDocument: 'after' }
    );
    if (!result) {
      throw ApiError.notFound('FAQ not found');
    }
    logger.info('[FAQService] FAQ soft deleted successfully', { id });
  }

  /**
   * Restores a soft-deleted FAQ.
   */
  async restoreFAQ(id: string): Promise<void> {
    logger.info('[FAQService] Restoring soft-deleted FAQ', { id });
    const result = await FAQModel.findByIdAndUpdate(
      id,
      { isDeleted: false, deletedAt: null, deletedBy: '' },
      { returnDocument: 'after' }
    );
    if (!result) {
      throw ApiError.notFound('FAQ not found');
    }
  }

  /**
   * Permanently deletes a FAQ from MongoDB.
   */
  async permanentlyDeleteFAQ(id: string): Promise<void> {
    logger.info('[FAQService] Permanently deleting FAQ', { id });
    const result = await FAQModel.findByIdAndDelete(id);
    if (!result) {
      throw ApiError.notFound('FAQ not found');
    }
  }

  /**
   * Bulk soft-deletes multiple FAQs.
   */
  async bulkDeleteFAQs(ids: string[], deletedBy?: string): Promise<void> {
    logger.info('[FAQService] Bulk soft deleting FAQs', { ids, deletedBy });
    await FAQModel.updateMany(
      { _id: { $in: ids } },
      { isDeleted: true, deletedAt: new Date(), deletedBy: deletedBy || 'System' }
    );
  }

  /**
   * Bulk restores multiple soft-deleted FAQs.
   */
  async bulkRestoreFAQs(ids: string[]): Promise<void> {
    logger.info('[FAQService] Bulk restoring FAQs', { ids });
    await FAQModel.updateMany(
      { _id: { $in: ids } },
      { isDeleted: false, deletedAt: null, deletedBy: '' }
    );
  }

  /**
   * Bulk status update for multiple FAQs.
   */
  async bulkUpdateStatus(ids: string[], status: 'active' | 'inactive', updatedBy?: string): Promise<void> {
    logger.info('[FAQService] Bulk status update', { ids, status, updatedBy });
    await FAQModel.updateMany(
      { _id: { $in: ids } },
      { status, updatedBy: updatedBy || 'System' }
    );
  }

  /**
   * Hides a FAQ by setting status to inactive (legacy alias).
   */
  async hideFAQ(id: string, updatedBy?: string): Promise<IFAQ> {
    logger.info('[FAQService] Hiding FAQ (status inactive)', { id });
    const faq = await FAQModel.findByIdAndUpdate(
      id,
      { status: 'inactive', updatedBy: updatedBy || 'System' },
      { returnDocument: 'after', runValidators: true }
    );
    if (!faq) {
      throw ApiError.notFound('FAQ not found');
    }
    return faq;
  }

  /**
   * Updates the displayOrder of a FAQ.
   */
  async updateDisplayOrder(id: string, displayOrder: number, updatedBy?: string): Promise<IFAQ> {
    logger.info('[FAQService] Updating FAQ display order', { id, displayOrder });

    const faq = await FAQModel.findByIdAndUpdate(
      id,
      { displayOrder, updatedBy: updatedBy || 'System' },
      { returnDocument: 'after' }
    );
    if (!faq) {
      throw ApiError.notFound('FAQ not found');
    }
    return faq;
  }

  /**
   * Retrieves all FAQs with pagination, search, category/page/featured/status/trash filtering and dynamic sorting.
   */
  async getAllFAQs(options: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    category?: string;
    pageContext?: string;
    trash?: boolean | string;
    featured?: boolean | string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<{ data: IFAQ[]; pagination: { total: number; page: number; limit: number; totalPages: number } }> {
    logger.info('[FAQService] Retrieving all FAQs with options', options);

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
    if (options.pageContext && options.pageContext !== 'all') {
      query.page = options.pageContext;
    }
    if (options.featured && options.featured !== 'all') {
      query.featured = options.featured === 'true' || options.featured === true;
    }
    if (options.search) {
      query.$or = [
        { question: { $regex: options.search, $options: 'i' } },
        { answer: { $regex: options.search, $options: 'i' } },
        { faqId: { $regex: options.search, $options: 'i' } },
        { category: { $regex: options.search, $options: 'i' } },
        { page: { $regex: options.search, $options: 'i' } },
        { tags: { $regex: options.search, $options: 'i' } },
        { status: { $regex: options.search, $options: 'i' } },
      ];
    }

    let sortObj: Record<string, 1 | -1> = { displayOrder: 1, createdAt: -1 };
    if (options.sortBy) {
      const order = options.sortOrder === 'desc' ? -1 : 1;
      if (options.sortBy === 'question') sortObj = { question: order };
      else if (options.sortBy === 'createdAt') sortObj = { createdAt: order };
      else if (options.sortBy === 'updatedAt') sortObj = { updatedAt: order };
      else if (options.sortBy === 'displayOrder') sortObj = { displayOrder: order };
      else if (options.sortBy === 'status') sortObj = { status: order };
      else if (options.sortBy === 'category') sortObj = { category: order };
    }

    const total = await FAQModel.countDocuments(query);
    const data = await FAQModel.find(query)
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
        totalPages,
      },
    };
  }
}

export const faqService = new FAQService();
