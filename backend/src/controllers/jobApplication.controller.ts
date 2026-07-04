/**
 * @file src/controllers/jobApplication.controller.ts
 * @description Controller managing HTTP endpoints for Job Applications.
 */

import { Request, Response, NextFunction } from 'express';
import { validateJobApplicationInput } from '@/validators/jobApplication.validator';
import { jobApplicationService } from '@/services/jobApplication.service';
import { ApiResponse } from '@/utils/ApiResponse';
import { HTTP_STATUS } from '@/constants';
import { ApiError } from '@/utils/ApiError';

/**
 * POST /api/careers/apply
 * Submits a new job application.
 */
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

/**
 * GET /api/careers/applications/:id
 * Retrieves details of a specific job application.
 */
export async function getApplicationById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const application = await jobApplicationService.getApplicationById(id);

    ApiResponse.success(
      res,
      application,
      'Job application details retrieved successfully',
      HTTP_STATUS.OK
    );
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/careers/jobs/:jobId/applications
 * Lists all applications for a specific job listing.
 */
export async function getApplicationsByJob(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { jobId } = req.params;
    const applications = await jobApplicationService.getApplicationsByJob(jobId);

    ApiResponse.success(
      res,
      applications,
      'Job applications retrieved successfully',
      HTTP_STATUS.OK
    );
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/careers/applications/:id/status
 * Updates status of a job application.
 */
export async function updateApplicationStatus(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      throw ApiError.badRequest('Status is required');
    }

    const application = await jobApplicationService.updateApplicationStatus(id, status);

    ApiResponse.success(
      res,
      application,
      'Job application status updated successfully',
      HTTP_STATUS.OK
    );
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/careers/applications/:id
 * Deletes a job application permanently.
 */
export async function deleteApplication(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    await jobApplicationService.deleteApplication(id);

    ApiResponse.success(
      res,
      null,
      'Job application deleted successfully',
      HTTP_STATUS.OK
    );
  } catch (err) {
    next(err);
  }
}
