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

/**
 * POST /api/careers/jobs
 * Creates a new job posting.
 */
export async function createJob(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const validatedData = validateJobInput(req.body);
    const job = await jobService.createJob(validatedData);

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
 * GET /api/careers/jobs
 * Public listing of jobs (default: active, support filters).
 */
export async function listJobs(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { status, department, featured } = req.query;

    const filters: any = {};
    
    // For public, restrict to active status unless specified
    filters.status = status ? String(status) : 'active';
    
    if (department) {
      filters.department = String(department);
    }
    if (featured !== undefined) {
      filters.featured = String(featured) === 'true';
    }

    const jobs = await jobService.getAllJobs(filters);
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
 * Retrieve single job listing by slug.
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
 * PUT /api/careers/jobs/:id
 * Updates an existing job posting.
 */
export async function updateJob(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const validatedData = validateJobInput(req.body, true);
    const job = await jobService.updateJob(id, validatedData);

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
 * PATCH /api/careers/jobs/:id/status
 * Updates job status.
 */
export async function updateJobStatus(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['active', 'closed', 'draft'].includes(status)) {
      throw ApiError.badRequest('Invalid status value. Must be active, closed, or draft.');
    }

    const job = await jobService.updateStatus(id, status);
    ApiResponse.success(
      res,
      job,
      'Job status updated successfully',
      HTTP_STATUS.OK
    );
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/careers/jobs/:id
 * Deletes job listing permanently.
 */
export async function deleteJob(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    await jobService.deleteJob(id);

    ApiResponse.success(
      res,
      null,
      'Job listing deleted successfully',
      HTTP_STATUS.OK
    );
  } catch (err) {
    next(err);
  }
}
