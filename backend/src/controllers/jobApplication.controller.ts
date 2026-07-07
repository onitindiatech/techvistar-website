/**
 * @file src/controllers/jobApplication.controller.ts
 * @description Controller managing HTTP endpoints for Job Applications.
 */

import { Request, Response, NextFunction } from 'express';
import { validateJobApplicationInput, validateApplicationStatusUpdate } from '@/validators/jobApplication.validator';
import { jobApplicationService } from '@/services/jobApplication.service';
import { ApiResponse } from '@/utils/ApiResponse';
import { HTTP_STATUS } from '@/constants';

export async function submitApplication(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const validatedData = validateJobApplicationInput(req.body);
    const application = await jobApplicationService.submitApplication(validatedData);
    ApiResponse.success(
      res,
      application,
      'Job application submitted successfully',
      HTTP_STATUS.CREATED
    );
  } catch (err) {
    next(err);
  }
}

export async function adminGetApplications(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { page, limit, search, status, jobId, trash, sortBy, sortOrder } = req.query;
    const result = await jobApplicationService.getAllApplications({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      search: search ? String(search) : undefined,
      status: status ? String(status) : undefined,
      jobId: jobId ? String(jobId) : undefined,
      trash: trash ? String(trash) : undefined,
      sortBy: sortBy ? String(sortBy) : undefined,
      sortOrder: sortOrder ? (String(sortOrder) as 'asc' | 'desc') : undefined,
    });

    const paginationMeta = ApiResponse.buildPagination(
      result.pagination.total,
      result.pagination.page,
      result.pagination.limit
    );

    ApiResponse.paginated(res, result.data, paginationMeta, 'All job applications retrieved successfully');
  } catch (err) {
    next(err);
  }
}

export async function adminGetApplicationById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const application = await jobApplicationService.getApplicationById(id);
    ApiResponse.success(res, application, 'Job application details retrieved successfully', HTTP_STATUS.OK);
  } catch (err) {
    next(err);
  }
}

export async function adminGetApplicationsByJob(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { jobId } = req.params;
    const { page, limit, search, status, trash, sortBy, sortOrder } = req.query;
    const result = await jobApplicationService.getApplicationsByJob(jobId, {
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

    ApiResponse.paginated(res, result.data, paginationMeta, 'Job applications retrieved successfully');
  } catch (err) {
    next(err);
  }
}

export async function adminUpdateApplicationStatus(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const { status } = validateApplicationStatusUpdate(req.body);
    const updaterEmail = (req as any).user?.email || 'Admin';
    const application = await jobApplicationService.updateApplicationStatus(id, status, updaterEmail);
    ApiResponse.success(res, application, 'Job application status updated successfully', HTTP_STATUS.OK);
  } catch (err) {
    next(err);
  }
}

export async function adminDeleteApplication(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const deleterEmail = (req as any).user?.email || 'Admin';
    await jobApplicationService.deleteApplication(id, deleterEmail);
    ApiResponse.success(res, null, 'Job application moved to trash');
  } catch (err) {
    next(err);
  }
}

export async function adminRestoreApplication(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    await jobApplicationService.restoreApplication(id);
    ApiResponse.success(res, null, 'Job application restored successfully');
  } catch (err) {
    next(err);
  }
}

export async function adminPermanentlyDeleteApplication(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    await jobApplicationService.permanentlyDeleteApplication(id);
    ApiResponse.success(res, null, 'Job application permanently deleted');
  } catch (err) {
    next(err);
  }
}

export async function adminBulkDeleteApplications(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { ids } = req.body;
    const deleterEmail = (req as any).user?.email || 'Admin';
    await jobApplicationService.bulkDeleteApplications(ids, deleterEmail);
    ApiResponse.success(res, null, 'Applications bulk moved to trash');
  } catch (err) {
    next(err);
  }
}

export async function adminBulkRestoreApplications(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { ids } = req.body;
    await jobApplicationService.bulkRestoreApplications(ids);
    ApiResponse.success(res, null, 'Applications bulk restored');
  } catch (err) {
    next(err);
  }
}

export async function adminBulkStatusApplications(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { ids, status } = req.body;
    const validated = validateApplicationStatusUpdate({ status });
    const updaterEmail = (req as any).user?.email || 'Admin';
    await jobApplicationService.bulkUpdateStatus(ids, validated.status, updaterEmail);
    ApiResponse.success(res, null, 'Applications bulk status updated');
  } catch (err) {
    next(err);
  }
}
