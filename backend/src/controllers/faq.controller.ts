/**
 * @file src/controllers/faq.controller.ts
 * @description Controller for the FAQ CMS module.
 */

import { Request, Response, NextFunction } from 'express';
import { validateFAQInput } from '@/validators/faq.validator';
import { faqService } from '@/services/faq.service';
import { ApiResponse } from '@/utils/ApiResponse';
import { HTTP_STATUS } from '@/constants';

/**
 * GET /api/faqs
 * Returns all active FAQs sorted by displayOrder.
 */
export async function getPublicFAQs(
  _req: Request,
  res:  Response,
  next: NextFunction
): Promise<void> {
  try {
    const faqs = await faqService.getActiveFAQs();
    ApiResponse.success(res, faqs, 'FAQs fetched successfully');
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/faqs/:faqId
 * Returns a single FAQ by its faqId string.
 */
export async function getPublicFAQById(
  req:  Request,
  res:  Response,
  next: NextFunction
): Promise<void> {
  try {
    const { faqId } = req.params;
    const faq = await faqService.getFAQById(faqId);
    ApiResponse.success(res, faq, 'FAQ fetched successfully');
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/faqs/admin
 * Creates a new FAQ entry.
 */
export async function adminCreateFAQ(
  req:  Request,
  res:  Response,
  next: NextFunction
): Promise<void> {
  try {
    const validatedData = validateFAQInput(req.body);
    const creatorEmail = (req as any).user?.email || 'Admin';
    const faq = await faqService.createFAQ({
      ...validatedData,
      createdBy: creatorEmail,
      updatedBy: creatorEmail,
    });
    ApiResponse.success(res, faq, 'FAQ created successfully', HTTP_STATUS.CREATED);
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/faqs/admin/:id
 * Updates an existing FAQ.
 */
export async function adminUpdateFAQ(
  req:  Request,
  res:  Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const validatedData = validateFAQInput(req.body, true);
    const updaterEmail = (req as any).user?.email || 'Admin';
    const faq = await faqService.updateFAQ(id, {
      ...validatedData,
      updatedBy: updaterEmail,
    });
    ApiResponse.success(res, faq, 'FAQ updated successfully');
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/faqs/admin/:id
 * Soft deletes a FAQ.
 */
export async function adminDeleteFAQ(
  req:  Request,
  res:  Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const deleterEmail = (req as any).user?.email || 'Admin';
    await faqService.deleteFAQ(id, deleterEmail);
    ApiResponse.success(res, null, 'FAQ soft deleted successfully');
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/faqs/admin/:id/restore
 * Restores a soft-deleted FAQ.
 */
export async function adminRestoreFAQ(
  req:  Request,
  res:  Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    await faqService.restoreFAQ(id);
    ApiResponse.success(res, null, 'FAQ restored successfully');
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/faqs/admin/:id/permanent
 * Permanently deletes a FAQ.
 */
export async function adminPermanentlyDeleteFAQ(
  req:  Request,
  res:  Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    await faqService.permanentlyDeleteFAQ(id);
    ApiResponse.success(res, null, 'FAQ permanently deleted');
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/faqs/admin/bulk-delete
 * Bulk soft-deletes FAQs.
 */
export async function adminBulkDeleteFAQs(
  req:  Request,
  res:  Response,
  next: NextFunction
): Promise<void> {
  try {
    const { ids } = req.body;
    const deleterEmail = (req as any).user?.email || 'Admin';
    await faqService.bulkDeleteFAQs(ids, deleterEmail);
    ApiResponse.success(res, null, 'FAQs bulk soft-deleted');
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/faqs/admin/bulk-restore
 * Bulk restores FAQs.
 */
export async function adminBulkRestoreFAQs(
  req:  Request,
  res:  Response,
  next: NextFunction
): Promise<void> {
  try {
    const { ids } = req.body;
    await faqService.bulkRestoreFAQs(ids);
    ApiResponse.success(res, null, 'FAQs bulk restored');
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/faqs/admin/bulk-status
 * Bulk status update.
 */
export async function adminBulkStatusFAQs(
  req:  Request,
  res:  Response,
  next: NextFunction
): Promise<void> {
  try {
    const { ids, status } = req.body;
    const updaterEmail = (req as any).user?.email || 'Admin';
    await faqService.bulkUpdateStatus(ids, status, updaterEmail);
    ApiResponse.success(res, null, 'FAQs bulk status updated');
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/faqs/admin/:id/hide
 * Legacy alias — sets status to inactive.
 */
export async function adminHideFAQ(
  req:  Request,
  res:  Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const updaterEmail = (req as any).user?.email || 'Admin';
    const faq = await faqService.hideFAQ(id, updaterEmail);
    ApiResponse.success(res, faq, 'FAQ hidden successfully');
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/faqs/admin/:id/order
 * Updates the displayOrder for a FAQ item.
 */
export async function adminUpdateFAQOrder(
  req:  Request,
  res:  Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const displayOrder = Number(req.body.displayOrder);
    if (isNaN(displayOrder)) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'displayOrder must be a valid number',
      });
      return;
    }
    const updaterEmail = (req as any).user?.email || 'Admin';
    const faq = await faqService.updateDisplayOrder(id, displayOrder, updaterEmail);
    ApiResponse.success(res, faq, 'FAQ display order updated successfully');
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/faqs/admin
 * Returns FAQs with advanced query filters for administrative management.
 */
export async function adminGetFAQs(
  req:  Request,
  res:  Response,
  next: NextFunction
): Promise<void> {
  try {
    const { page, limit, search, status, category, pageContext, trash, featured, sortBy, sortOrder } = req.query;
    const result = await faqService.getAllFAQs({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      search: search ? String(search) : undefined,
      status: status ? String(status) : undefined,
      category: category ? String(category) : undefined,
      pageContext: pageContext ? String(pageContext) : undefined,
      trash: trash ? String(trash) : undefined,
      featured: featured ? String(featured) : undefined,
      sortBy: sortBy ? String(sortBy) : undefined,
      sortOrder: sortOrder ? (String(sortOrder) as 'asc' | 'desc') : undefined,
    });

    const paginationMeta = ApiResponse.buildPagination(
      result.pagination.total,
      result.pagination.page,
      result.pagination.limit
    );

    ApiResponse.paginated(
      res,
      result.data,
      paginationMeta,
      'All FAQs fetched successfully'
    );
  } catch (err) {
    next(err);
  }
}
