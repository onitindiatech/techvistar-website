/**
 * @file src/controllers/service.controller.ts
 * @description Controller for the Services CMS module.
 */

import { Request, Response, NextFunction } from 'express';
import { validateServiceInput } from '@/validators/service.validator';
import { serviceService } from '@/services/service.service';
import { ApiResponse } from '@/utils/ApiResponse';
import { HTTP_STATUS } from '@/constants';

/**
 * The 4 service pillar categories used to group services in the navbar mega-menu.
 * Stored here as the single backend source of truth — the admin dropdown fetches
 * this list dynamically so no category name is hardcoded in the frontend form.
 */
export const SERVICE_PILLAR_CATEGORIES = ['Brand', 'Growth', 'Systems', 'Digital'] as const;

/**
 * GET /api/services/categories
 * Returns the list of available service categories.
 * Public — no auth required (used by admin form on page load).
 */
export async function getServiceCategories(
  _req: Request,
  res:  Response,
  next: NextFunction
): Promise<void> {
  try {
    ApiResponse.success(res, [...SERVICE_PILLAR_CATEGORIES], 'Service categories fetched successfully');
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/services
 * Returns all active services ordered by displayOrder.
 */
export async function getPublicServices(
  req:  Request,
  res:  Response,
  next: NextFunction
): Promise<void> {
  try {
    const { category } = req.query;
    const services = await serviceService.getActiveServices(category ? String(category) : undefined);
    ApiResponse.success(
      res,
      services,
      'Active services fetched successfully'
    );
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/services/:slug
 * Returns a single active service by its slug.
 */
export async function getPublicServiceBySlug(
  req:  Request,
  res:  Response,
  next: NextFunction
): Promise<void> {
  try {
    const { slug } = req.params;
    const service = await serviceService.getServiceBySlug(slug);
    ApiResponse.success(
      res,
      service,
      'Service details fetched successfully'
    );
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/admin/services
 * Creates a new service.
 */
export async function adminCreateService(
  req:  Request,
  res:  Response,
  next: NextFunction
): Promise<void> {
  try {
    const validatedData = validateServiceInput(req.body);
    const creatorEmail = (req as any).user?.email || 'Admin';
    const service = await serviceService.createService({
      ...validatedData,
      createdBy: creatorEmail,
      updatedBy: creatorEmail
    });
    ApiResponse.success(
      res,
      service,
      'Service created successfully',
      HTTP_STATUS.CREATED
    );
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/admin/services/:id
 * Updates an existing service.
 */
export async function adminUpdateService(
  req:  Request,
  res:  Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const validatedData = validateServiceInput(req.body, true);
    const updaterEmail = (req as any).user?.email || 'Admin';
    const service = await serviceService.updateService(id, {
      ...validatedData,
      updatedBy: updaterEmail
    });
    ApiResponse.success(
      res,
      service,
      'Service updated successfully'
    );
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/admin/services/:id
 * Soft deletes a service listing.
 */
export async function adminDeleteService(
  req:  Request,
  res:  Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const deleterEmail = (req as any).user?.email || 'Admin';
    await serviceService.deleteService(id, deleterEmail);
    ApiResponse.success(res, null, 'Service soft deleted successfully');
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/admin/services/:id/restore
 * Restores a soft-deleted service.
 */
export async function adminRestoreService(
  req:  Request,
  res:  Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    await serviceService.restoreService(id);
    ApiResponse.success(res, null, 'Service restored successfully');
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/admin/services/:id/permanent
 * Permanently deletes a service.
 */
export async function adminPermanentlyDeleteService(
  req:  Request,
  res:  Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    await serviceService.permanentlyDeleteService(id);
    ApiResponse.success(res, null, 'Service permanently deleted');
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/admin/services/bulk-delete
 * Bulk soft-deletes services.
 */
export async function adminBulkDelete(
  req:  Request,
  res:  Response,
  next: NextFunction
): Promise<void> {
  try {
    const { ids } = req.body;
    const deleterEmail = (req as any).user?.email || 'Admin';
    await serviceService.bulkDeleteServices(ids, deleterEmail);
    ApiResponse.success(res, null, 'Services bulk soft-deleted');
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/admin/services/bulk-restore
 * Bulk restores services.
 */
export async function adminBulkRestore(
  req:  Request,
  res:  Response,
  next: NextFunction
): Promise<void> {
  try {
    const { ids } = req.body;
    await serviceService.bulkRestoreServices(ids);
    ApiResponse.success(res, null, 'Services bulk restored');
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/admin/services/bulk-status
 * Bulk status update.
 */
export async function adminBulkStatus(
  req:  Request,
  res:  Response,
  next: NextFunction
): Promise<void> {
  try {
    const { ids, status } = req.body;
    const updaterEmail = (req as any).user?.email || 'Admin';
    await serviceService.bulkUpdateStatus(ids, status, updaterEmail);
    ApiResponse.success(res, null, 'Services bulk status updated');
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/services/admin
 * Returns services with advanced query filters for administrative management.
 */
export async function adminGetServices(
  req:  Request,
  res:  Response,
  next: NextFunction
): Promise<void> {
  try {
    const { page, limit, search, status, category, trash, featured, sortBy, sortOrder } = req.query;
    const result = await serviceService.getAllServices({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      search: search ? String(search) : undefined,
      status: status ? String(status) : undefined,
      category: category ? String(category) : undefined,
      trash: trash ? String(trash) : undefined,
      featured: featured ? String(featured) : undefined,
      sortBy: sortBy ? String(sortBy) : undefined,
      sortOrder: sortOrder ? (String(sortOrder) as any) : undefined
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
      'All services fetched successfully'
    );
  } catch (err) {
    next(err);
  }
}
