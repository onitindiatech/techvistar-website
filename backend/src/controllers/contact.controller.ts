/**
 * @file src/controllers/contact.controller.ts
 * @description Controller for the Contact module.
 */

import { Request, Response, NextFunction } from 'express';
import { validateContactInput, validateContactStatusUpdate } from '@/validators/contact.validator';
import { contactService } from '@/services/contact.service';
import { ApiResponse } from '@/utils/ApiResponse';
import { HTTP_STATUS } from '@/constants';

export async function submitContactForm(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const validatedData = validateContactInput(req.body);
    const contact = await contactService.createContact(validatedData);
    ApiResponse.success(
      res,
      contact,
      'Thank you for contacting us. Your message has been received.',
      HTTP_STATUS.CREATED
    );
  } catch (err) {
    next(err);
  }
}

export async function adminGetContacts(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { page, limit, search, status, trash, sortBy, sortOrder } = req.query;
    const result = await contactService.getAllContacts({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      search: search ? String(search) : undefined,
      status: status ? String(status) : undefined,
      trash: trash ? String(trash) : undefined,
      sortBy: sortBy ? String(sortBy) : undefined,
      sortOrder: sortOrder ? (String(sortOrder) as 'asc' | 'desc') : undefined,
    });

    const paginationMeta = ApiResponse.buildPagination(
      result.pagination.total,
      result.pagination.page,
      result.pagination.limit
    );

    ApiResponse.paginated(res, result.data, paginationMeta, 'Contact inquiries retrieved successfully');
  } catch (err) {
    next(err);
  }
}

export async function adminUpdateContactStatus(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const { status } = validateContactStatusUpdate(req.body);
    const updaterEmail = (req as any).user?.email || 'Admin';
    const contact = await contactService.updateContactStatus(id, status, updaterEmail);
    ApiResponse.success(res, contact, 'Contact inquiry status updated successfully', HTTP_STATUS.OK);
  } catch (err) {
    next(err);
  }
}

export async function adminDeleteContact(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const deleterEmail = (req as any).user?.email || 'Admin';
    await contactService.deleteContact(id, deleterEmail);
    ApiResponse.success(res, null, 'Contact inquiry moved to trash');
  } catch (err) {
    next(err);
  }
}

export async function adminRestoreContact(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    await contactService.restoreContact(id);
    ApiResponse.success(res, null, 'Contact inquiry restored successfully');
  } catch (err) {
    next(err);
  }
}

export async function adminPermanentlyDeleteContact(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    await contactService.permanentlyDeleteContact(id);
    ApiResponse.success(res, null, 'Contact inquiry permanently deleted');
  } catch (err) {
    next(err);
  }
}

export async function adminBulkDeleteContacts(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { ids } = req.body;
    const deleterEmail = (req as any).user?.email || 'Admin';
    await contactService.bulkDeleteContacts(ids, deleterEmail);
    ApiResponse.success(res, null, 'Contacts bulk moved to trash');
  } catch (err) {
    next(err);
  }
}

export async function adminBulkRestoreContacts(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { ids } = req.body;
    await contactService.bulkRestoreContacts(ids);
    ApiResponse.success(res, null, 'Contacts bulk restored');
  } catch (err) {
    next(err);
  }
}

export async function adminBulkStatusContacts(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { ids, status } = req.body;
    const validated = validateContactStatusUpdate({ status });
    const updaterEmail = (req as any).user?.email || 'Admin';
    await contactService.bulkUpdateStatus(ids, validated.status, updaterEmail);
    ApiResponse.success(res, null, 'Contacts bulk status updated');
  } catch (err) {
    next(err);
  }
}
