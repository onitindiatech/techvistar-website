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
 * GET /api/services
 * Returns all active services ordered by displayOrder.
 */
export async function getPublicServices(
  _req: Request,
  res:  Response,
  next: NextFunction
): Promise<void> {
  try {
    const services = await serviceService.getActiveServices();
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
 * Creates a new service. Reserved for future Admin Panel compatibility.
 */
export async function adminCreateService(
  req:  Request,
  res:  Response,
  next: NextFunction
): Promise<void> {
  try {
    const validatedData = validateServiceInput(req.body);
    const service = await serviceService.createService(validatedData);
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
 * Updates an existing service. Reserved for future Admin Panel compatibility.
 */
export async function adminUpdateService(
  req:  Request,
  res:  Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const validatedData = validateServiceInput(req.body, true);
    const service = await serviceService.updateService(id, validatedData);
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
 * Deletes a service listing. Reserved for future Admin Panel compatibility.
 */
export async function adminDeleteService(
  req:  Request,
  res:  Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    await serviceService.deleteService(id);
    ApiResponse.noContent(res);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/services/admin
 * Returns all services (active + drafts) for administrative management.
 */
export async function adminGetServices(
  _req: Request,
  res:  Response,
  next: NextFunction
): Promise<void> {
  try {
    const services = await serviceService.getAllServices();
    ApiResponse.success(
      res,
      services,
      'All services fetched successfully'
    );
  } catch (err) {
    next(err);
  }
}
