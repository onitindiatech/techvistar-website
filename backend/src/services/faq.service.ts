/**
 * @file src/services/faq.service.ts
 * @description Service layer managing FAQ database CRUD operations.
 *
 * ALL business logic lives here. Controllers are thin wrappers that only
 * call into this service and relay the response.
 */

import { FAQModel, IFAQ } from '@/models/FAQ';
import { ApiError } from '@/utils/ApiError';
import { logger } from '@/utils/logger';

export class FAQService {
  // ─── Public read operations ───────────────────────────────────────────────────

  /**
   * Returns all active FAQs sorted by displayOrder ascending.
   * Used by GET /api/faqs (public endpoint consumed by the frontend).
   */
  async getActiveFAQs(): Promise<IFAQ[]> {
    logger.info('[FAQService] Retrieving all active FAQs');
    return FAQModel.find({ status: 'active' }).sort({ displayOrder: 1 });
  }

  /**
   * Returns a single FAQ by its unique faqId string.
   * Used by GET /api/faqs/:faqId
   */
  async getFAQById(faqId: string): Promise<IFAQ> {
    logger.info('[FAQService] Retrieving FAQ by ID', { faqId });
    const faq = await FAQModel.findOne({ faqId });
    if (!faq) {
      throw ApiError.notFound(`FAQ not found for ID "${faqId}"`);
    }
    return faq;
  }

  // ─── Admin write operations ────────────────────────────────────────────────────

  /**
   * Creates a new FAQ entry.
   * Validates uniqueness of faqId before inserting.
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
   * Partial update — only supplied fields are changed.
   */
  async updateFAQ(id: string, data: Partial<IFAQ>): Promise<IFAQ> {
    logger.info('[FAQService] Updating FAQ', { id });

    const faq = await FAQModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );
    if (!faq) {
      throw ApiError.notFound('FAQ not found');
    }

    logger.info('[FAQService] FAQ updated successfully', { id: faq._id });
    return faq;
  }

  /**
   * Permanently deletes a FAQ by its MongoDB _id.
   */
  async deleteFAQ(id: string): Promise<void> {
    logger.info('[FAQService] Deleting FAQ', { id });
    const result = await FAQModel.findByIdAndDelete(id);
    if (!result) {
      throw ApiError.notFound('FAQ not found');
    }
    logger.info('[FAQService] FAQ deleted successfully', { id });
  }

  /**
   * Hides a FAQ from the public site by setting status to 'inactive'.
   * Separate from delete — preserves the record for future reactivation.
   */
  async hideFAQ(id: string): Promise<IFAQ> {
    logger.info('[FAQService] Hiding FAQ', { id });
    const faq = await FAQModel.findByIdAndUpdate(
      id,
      { $set: { status: 'inactive' } },
      { new: true }
    );
    if (!faq) {
      throw ApiError.notFound('FAQ not found');
    }
    logger.info('[FAQService] FAQ hidden successfully', { id: faq._id });
    return faq;
  }

  /**
   * Updates the displayOrder of a FAQ.
   * Used by the admin panel drag-and-drop reordering (Phase 3).
   */
  async updateDisplayOrder(id: string, displayOrder: number): Promise<IFAQ> {
    logger.info('[FAQService] Updating FAQ display order', { id, displayOrder });

    const faq = await FAQModel.findByIdAndUpdate(
      id,
      { $set: { displayOrder } },
      { new: true }
    );
    if (!faq) {
      throw ApiError.notFound('FAQ not found');
    }
    logger.info('[FAQService] FAQ display order updated', { id: faq._id, displayOrder });
    return faq;
  }
}

export const faqService = new FAQService();
