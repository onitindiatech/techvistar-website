/**
 * @file src/controllers/solution.controller.ts
 * @description Controller for the Solutions CMS module.
 */

import { Request, Response, NextFunction } from 'express';
import { validateSolutionInput } from '@/validators/solution.validator';
import { solutionService } from '@/services/solution.service';
import { ApiResponse } from '@/utils/ApiResponse';
import { HTTP_STATUS } from '@/constants';

/**
 * GET /api/solutions
 * Returns all active solutions ordered by displayOrder.
 */
export async function getPublicSolutions(
  req:  Request,
  res:  Response,
  next: NextFunction
): Promise<void> {
  try {
    const { category } = req.query;
    const solutions = await solutionService.getActiveSolutions(category ? String(category) : undefined);
    ApiResponse.success(
      res,
      solutions,
      'Active solutions fetched successfully'
    );
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/solutions/:slug
 * Returns a single active solution by its slug.
 */
export async function getPublicSolutionBySlug(
  req:  Request,
  res:  Response,
  next: NextFunction
): Promise<void> {
  try {
    const { slug } = req.params;
    const solution = await solutionService.getSolutionBySlug(slug);
    ApiResponse.success(
      res,
      solution,
      'Solution details fetched successfully'
    );
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/solutions/admin
 * Creates a new solution.
 */
export async function adminCreateSolution(
  req:  Request,
  res:  Response,
  next: NextFunction
): Promise<void> {
  try {
    const validatedData = validateSolutionInput(req.body);
    const creatorEmail = (req as any).user?.email || 'Admin';
    const solution = await solutionService.createSolution({
      ...validatedData,
      createdBy: creatorEmail,
      updatedBy: creatorEmail,
    });
    ApiResponse.success(
      res,
      solution,
      'Solution created successfully',
      HTTP_STATUS.CREATED
    );
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/solutions/admin/:id
 * Updates an existing solution.
 */
export async function adminUpdateSolution(
  req:  Request,
  res:  Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const validatedData = validateSolutionInput(req.body, true);
    const updaterEmail = (req as any).user?.email || 'Admin';
    const solution = await solutionService.updateSolution(id, {
      ...validatedData,
      updatedBy: updaterEmail,
    });
    ApiResponse.success(
      res,
      solution,
      'Solution updated successfully'
    );
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/solutions/admin/:id
 * Soft deletes a solution listing.
 */
export async function adminDeleteSolution(
  req:  Request,
  res:  Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const deleterEmail = (req as any).user?.email || 'Admin';
    await solutionService.deleteSolution(id, deleterEmail);
    ApiResponse.success(res, null, 'Solution soft deleted successfully');
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/solutions/admin/:id/restore
 * Restores a soft-deleted solution.
 */
export async function adminRestoreSolution(
  req:  Request,
  res:  Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    await solutionService.restoreSolution(id);
    ApiResponse.success(res, null, 'Solution restored successfully');
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/solutions/admin/:id/permanent
 * Permanently deletes a solution.
 */
export async function adminPermanentlyDeleteSolution(
  req:  Request,
  res:  Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    await solutionService.permanentlyDeleteSolution(id);
    ApiResponse.success(res, null, 'Solution permanently deleted');
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/solutions/admin/bulk-delete
 * Bulk soft-deletes solutions.
 */
export async function adminBulkDelete(
  req:  Request,
  res:  Response,
  next: NextFunction
): Promise<void> {
  try {
    const { ids } = req.body;
    const deleterEmail = (req as any).user?.email || 'Admin';
    await solutionService.bulkDeleteSolutions(ids, deleterEmail);
    ApiResponse.success(res, null, 'Solutions bulk soft-deleted');
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/solutions/admin/bulk-restore
 * Bulk restores solutions.
 */
export async function adminBulkRestore(
  req:  Request,
  res:  Response,
  next: NextFunction
): Promise<void> {
  try {
    const { ids } = req.body;
    await solutionService.bulkRestoreSolutions(ids);
    ApiResponse.success(res, null, 'Solutions bulk restored');
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/solutions/admin/bulk-status
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
    await solutionService.bulkUpdateStatus(ids, status, updaterEmail);
    ApiResponse.success(res, null, 'Solutions bulk status updated');
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/solutions/admin
 * Returns solutions with advanced query filters for administrative management.
 */
export async function adminGetSolutions(
  req:  Request,
  res:  Response,
  next: NextFunction
): Promise<void> {
  try {
    const { page, limit, search, status, category, trash, featured, sortBy, sortOrder } = req.query;
    const result = await solutionService.getAllSolutions({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      search: search ? String(search) : undefined,
      status: status ? String(status) : undefined,
      category: category ? String(category) : undefined,
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
      'All solutions fetched successfully'
    );
  } catch (err) {
    next(err);
  }
}
