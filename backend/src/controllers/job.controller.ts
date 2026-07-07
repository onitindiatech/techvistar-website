/**
 * @file src/controllers/job.controller.ts
 * @description Controller for the Careers Module. Exposes CRUD APIs for Jobs.
 */

import { Request, Response, NextFunction } from 'express';
import { validateJobInput } from '@/validators/job.validator';
import { jobService } from '@/services/job.service';
import { ApiResponse } from '@/utils/ApiResponse';
import { HTTP_STATUS } from '@/constants';
import { ApiError } from '@/utils/ApiError';
import { VALIDATION } from '@/constants';

/**
 * GET /api/careers/jobs
 * Public listing of active jobs (optional department/featured filters).
 */
export async function listJobs(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { department, featured } = req.query;

    const filters: { department?: string; featured?: boolean } = {};
    if (department) {
      filters.department = String(department);
    }
    if (featured !== undefined) {
      filters.featured = String(featured) === 'true';
    }

    const jobs = await jobService.getActiveJobs(filters);
    ApiResponse.success(
      res,
      jobs,
      'Job listings retrieved successfully',
      HTTP_STATUS.OK
    );
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/careers/jobs/:slug
 * Retrieve single active job listing by slug.
 */
export async function getJobBySlug(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { slug } = req.params;
    const job = await jobService.getJobBySlug(slug);

    ApiResponse.success(
      res,
      job,
      'Job details retrieved successfully',
      HTTP_STATUS.OK
    );
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/careers/jobs/admin
 * Returns jobs with advanced query filters for administrative management.
 */
export async function adminGetJobs(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { page, limit, search, status, department, trash, featured, sortBy, sortOrder } = req.query;
    const result = await jobService.getAllJobs({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      search: search ? String(search) : undefined,
      status: status ? String(status) : undefined,
      department: department ? String(department) : undefined,
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
      'All jobs fetched successfully'
    );
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/careers/jobs/admin
 * Creates a new job posting.
 */
export async function adminCreateJob(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const validatedData = validateJobInput(req.body);
    const creatorEmail = (req as any).user?.email || 'Admin';
    const job = await jobService.createJob({
      ...validatedData,
      createdBy: creatorEmail,
      updatedBy: creatorEmail,
    });

    ApiResponse.success(
      res,
      job,
      'Job posting created successfully',
      HTTP_STATUS.CREATED
    );
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/careers/jobs/admin/:id
 * Updates an existing job posting.
 */
export async function adminUpdateJob(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const validatedData = validateJobInput(req.body, true);
    const updaterEmail = (req as any).user?.email || 'Admin';
    const job = await jobService.updateJob(id, {
      ...validatedData,
      updatedBy: updaterEmail,
    });

    ApiResponse.success(
      res,
      job,
      'Job posting updated successfully',
      HTTP_STATUS.OK
    );
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/careers/jobs/admin/:id
 * Soft deletes a job listing.
 */
export async function adminDeleteJob(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const deleterEmail = (req as any).user?.email || 'Admin';
    await jobService.deleteJob(id, deleterEmail);

    ApiResponse.success(
      res,
      null,
      'Job listing soft deleted successfully',
      HTTP_STATUS.OK
    );
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/careers/jobs/admin/:id/restore
 * Restores a soft-deleted job listing.
 */
export async function adminRestoreJob(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    await jobService.restoreJob(id);
    ApiResponse.success(res, null, 'Job restored successfully');
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/careers/jobs/admin/:id/permanent
 * Permanently deletes a job listing.
 */
export async function adminPermanentlyDeleteJob(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    await jobService.permanentlyDeleteJob(id);
    ApiResponse.success(res, null, 'Job permanently deleted');
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/careers/jobs/admin/bulk-delete
 * Bulk soft-deletes jobs.
 */
export async function adminBulkDeleteJobs(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { ids } = req.body;
    const deleterEmail = (req as any).user?.email || 'Admin';
    await jobService.bulkDeleteJobs(ids, deleterEmail);
    ApiResponse.success(res, null, 'Jobs bulk soft-deleted');
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/careers/jobs/admin/bulk-restore
 * Bulk restores jobs.
 */
export async function adminBulkRestoreJobs(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { ids } = req.body;
    await jobService.bulkRestoreJobs(ids);
    ApiResponse.success(res, null, 'Jobs bulk restored');
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/careers/jobs/admin/bulk-status
 * Bulk status update.
 */
export async function adminBulkStatusJobs(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { ids, status } = req.body;
    if (!status || !(VALIDATION.JOB_STATUSES as readonly string[]).includes(status)) {
      throw ApiError.badRequest(`Invalid status value. Must be one of: ${VALIDATION.JOB_STATUSES.join(', ')}`);
    }
    const updaterEmail = (req as any).user?.email || 'Admin';
    await jobService.bulkUpdateStatus(ids, status, updaterEmail);
    ApiResponse.success(res, null, 'Jobs bulk status updated');
  } catch (err) {
    next(err);
  }
}
