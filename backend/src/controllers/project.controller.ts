/**
 * @file src/controllers/project.controller.ts
 * @description Controller mapping HTTP endpoints to ProjectService business layer operations.
 */

import { Request, Response, NextFunction } from 'express';
import { validateProjectInput } from '@/validators/project.validator';
import { projectService } from '@/services/project.service';
import { ApiResponse } from '@/utils/ApiResponse';
import { HTTP_STATUS } from '@/constants';

/**
 * GET /api/portfolio
 * Returns all active portfolio projects.
 */
export async function getPublicProjects(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const projects = await projectService.getActiveProjects();
    ApiResponse.success(
      res,
      projects,
      'Portfolio projects fetched successfully'
    );
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/portfolio/:slug
 * Returns details for a single project by slug.
 */
export async function getPublicProjectBySlug(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { slug } = req.params;
    const project = await projectService.getProjectBySlug(slug);
    ApiResponse.success(
      res,
      project,
      'Project details fetched successfully'
    );
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/portfolio/admin
 * Returns projects with advanced query filters for administrative management.
 */
export async function adminGetProjects(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { page, limit, search, status, category, trash, featured, sortBy, sortOrder } = req.query;
    const result = await projectService.getAllProjects({
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
      'All projects fetched successfully'
    );
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/portfolio/admin
 * Creates a new project listing.
 */
export async function adminCreateProject(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const validatedData = validateProjectInput(req.body);
    const creatorEmail = (req as any).user?.email || 'Admin';
    const project = await projectService.createProject({
      ...validatedData,
      createdBy: creatorEmail,
      updatedBy: creatorEmail,
    });
    ApiResponse.success(
      res,
      project,
      'Project listing created successfully',
      HTTP_STATUS.CREATED
    );
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/portfolio/admin/:id
 * Updates an existing project.
 */
export async function adminUpdateProject(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const validatedData = validateProjectInput(req.body, true);
    const updaterEmail = (req as any).user?.email || 'Admin';
    const project = await projectService.updateProject(id, {
      ...validatedData,
      updatedBy: updaterEmail,
    });
    ApiResponse.success(
      res,
      project,
      'Project updated successfully'
    );
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/portfolio/admin/:id
 * Soft deletes a project listing.
 */
export async function adminDeleteProject(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const deleterEmail = (req as any).user?.email || 'Admin';
    await projectService.deleteProject(id, deleterEmail);
    ApiResponse.success(res, null, 'Project soft deleted successfully');
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/portfolio/admin/:id/restore
 * Restores a soft-deleted project.
 */
export async function adminRestoreProject(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    await projectService.restoreProject(id);
    ApiResponse.success(res, null, 'Project restored successfully');
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/portfolio/admin/:id/permanent
 * Permanently deletes a project.
 */
export async function adminPermanentlyDeleteProject(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    await projectService.permanentlyDeleteProject(id);
    ApiResponse.success(res, null, 'Project permanently deleted');
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/portfolio/admin/bulk-delete
 * Bulk soft-deletes projects.
 */
export async function adminBulkDeleteProjects(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { ids } = req.body;
    const deleterEmail = (req as any).user?.email || 'Admin';
    await projectService.bulkDeleteProjects(ids, deleterEmail);
    ApiResponse.success(res, null, 'Projects bulk soft-deleted');
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/portfolio/admin/bulk-restore
 * Bulk restores projects.
 */
export async function adminBulkRestoreProjects(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { ids } = req.body;
    await projectService.bulkRestoreProjects(ids);
    ApiResponse.success(res, null, 'Projects bulk restored');
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/portfolio/admin/bulk-status
 * Bulk status update.
 */
export async function adminBulkStatusProjects(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { ids, status } = req.body;
    const updaterEmail = (req as any).user?.email || 'Admin';
    await projectService.bulkUpdateStatus(ids, status, updaterEmail);
    ApiResponse.success(res, null, 'Projects bulk status updated');
  } catch (err) {
    next(err);
  }
}
