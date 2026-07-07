/**
 * @file src/controllers/newsletter.controller.ts
 * @description Controller for the Newsletter module.
 */

import { Request, Response, NextFunction } from 'express';
import { validateNewsletterInput, validateNewsletterStatusUpdate } from '@/validators/newsletter.validator';
import { newsletterService } from '@/services/newsletter.service';
import { ApiResponse } from '@/utils/ApiResponse';
import { ApiError } from '@/utils/ApiError';
import { HTTP_STATUS } from '@/constants';

export async function subscribeNewsletter(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const validatedData = validateNewsletterInput(req.body);
    const subscriber = await newsletterService.subscribe(validatedData);
    ApiResponse.success(
      res,
      subscriber,
      'Thank you for subscribing to our newsletter.',
      HTTP_STATUS.CREATED
    );
  } catch (err) {
    next(err);
  }
}

export async function unsubscribeNewsletter(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email } = req.body;
    if (!email) {
      throw ApiError.badRequest('Email address is required to unsubscribe');
    }
    const subscriber = await newsletterService.unsubscribeEmail(String(email).trim().toLowerCase());
    ApiResponse.success(res, subscriber, 'Unsubscribed successfully', HTTP_STATUS.OK);
  } catch (err) {
    next(err);
  }
}

export async function adminGetSubscribers(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { page, limit, search, status, source, trash, sortBy, sortOrder } = req.query;
    const result = await newsletterService.getAllSubscribers({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      search: search ? String(search) : undefined,
      status: status ? String(status) : undefined,
      source: source ? String(source) : undefined,
      trash: trash ? String(trash) : undefined,
      sortBy: sortBy ? String(sortBy) : undefined,
      sortOrder: sortOrder ? (String(sortOrder) as 'asc' | 'desc') : undefined,
    });

    const paginationMeta = ApiResponse.buildPagination(
      result.pagination.total,
      result.pagination.page,
      result.pagination.limit
    );

    ApiResponse.paginated(res, result.data, paginationMeta, 'Subscribers list retrieved successfully');
  } catch (err) {
    next(err);
  }
}

export async function adminUpdateSubscriberStatus(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const { status } = validateNewsletterStatusUpdate(req.body);
    const updaterEmail = (req as any).user?.email || 'Admin';
    const subscriber = await newsletterService.updateSubscriberStatus(id, status, updaterEmail);
    ApiResponse.success(res, subscriber, 'Subscriber status updated successfully', HTTP_STATUS.OK);
  } catch (err) {
    next(err);
  }
}

export async function adminDeleteSubscriber(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const deleterEmail = (req as any).user?.email || 'Admin';
    await newsletterService.deleteSubscriber(id, deleterEmail);
    ApiResponse.success(res, null, 'Subscriber moved to trash');
  } catch (err) {
    next(err);
  }
}

export async function adminRestoreSubscriber(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    await newsletterService.restoreSubscriber(id);
    ApiResponse.success(res, null, 'Subscriber restored successfully');
  } catch (err) {
    next(err);
  }
}

export async function adminPermanentlyDeleteSubscriber(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    await newsletterService.permanentlyDeleteSubscriber(id);
    ApiResponse.success(res, null, 'Subscriber permanently deleted');
  } catch (err) {
    next(err);
  }
}

export async function adminBulkDeleteSubscribers(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { ids } = req.body;
    const deleterEmail = (req as any).user?.email || 'Admin';
    await newsletterService.bulkDeleteSubscribers(ids, deleterEmail);
    ApiResponse.success(res, null, 'Subscribers bulk moved to trash');
  } catch (err) {
    next(err);
  }
}

export async function adminBulkRestoreSubscribers(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { ids } = req.body;
    await newsletterService.bulkRestoreSubscribers(ids);
    ApiResponse.success(res, null, 'Subscribers bulk restored');
  } catch (err) {
    next(err);
  }
}

export async function adminBulkStatusSubscribers(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { ids, status } = req.body;
    const validated = validateNewsletterStatusUpdate({ status });
    const updaterEmail = (req as any).user?.email || 'Admin';
    await newsletterService.bulkUpdateStatus(ids, validated.status, updaterEmail);
    ApiResponse.success(res, null, 'Subscribers bulk status updated');
  } catch (err) {
    next(err);
  }
}
