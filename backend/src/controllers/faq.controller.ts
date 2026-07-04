/**
 * @file src/controllers/faq.controller.ts
 * @description Thin controller mapping HTTP endpoints to FAQService operations.
 *
 * Controllers do NOT contain business logic — they only:
 *  1. Extract data from the request
 *  2. Call the service
 *  3. Return the standardised ApiResponse
 *  4. Pass errors to the global error handler via next()
 */

import { Request, Response, NextFunction } from 'express';
import { validateFAQInput } from '@/validators/faq.validator';
import { faqService } from '@/services/faq.service';
import { ApiResponse } from '@/utils/ApiResponse';
import { HTTP_STATUS } from '@/constants';

// ─── Public endpoints ──────────────────────────────────────────────────────────

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

// ─── Admin endpoints (JWT-gated in Phase 3) ────────────────────────────────────

/**
 * POST /api/faqs/admin
 * Creates a new FAQ entry. Reserved for future Admin Panel integration.
 */
export async function adminCreateFAQ(
  req:  Request,
  res:  Response,
  next: NextFunction
): Promise<void> {
  try {
    const validatedData = validateFAQInput(req.body);
    const faq = await faqService.createFAQ(validatedData);
    ApiResponse.success(res, faq, 'FAQ created successfully', HTTP_STATUS.CREATED);
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/faqs/admin/:id
 * Updates an existing FAQ. Reserved for future Admin Panel integration.
 */
export async function adminUpdateFAQ(
  req:  Request,
  res:  Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const validatedData = validateFAQInput(req.body, true);
    const faq = await faqService.updateFAQ(id, validatedData);
    ApiResponse.success(res, faq, 'FAQ updated successfully');
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/faqs/admin/:id
 * Permanently deletes a FAQ. Reserved for future Admin Panel integration.
 */
export async function adminDeleteFAQ(
  req:  Request,
  res:  Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    await faqService.deleteFAQ(id);
    ApiResponse.noContent(res);
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/faqs/admin/:id/hide
 * Hides a FAQ by setting status to 'inactive'. Non-destructive alternative to delete.
 */
export async function adminHideFAQ(
  req:  Request,
  res:  Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const faq = await faqService.hideFAQ(id);
    ApiResponse.success(res, faq, 'FAQ hidden successfully');
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/faqs/admin/:id/order
 * Updates the displayOrder for a FAQ item. Used for drag-and-drop reordering.
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
    const faq = await faqService.updateDisplayOrder(id, displayOrder);
    ApiResponse.success(res, faq, 'FAQ display order updated successfully');
  } catch (err) {
    next(err);
  }
}
