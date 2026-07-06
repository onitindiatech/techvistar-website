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
  _req: Request,
  res:  Response,
  next: NextFunction
): Promise<void> {
  try {
    const solutions = await solutionService.getActiveSolutions();
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
 * POST /api/admin/solutions
 * Creates a new solution. Reserved for future Admin Panel compatibility.
 */
export async function adminCreateSolution(
  req:  Request,
  res:  Response,
  next: NextFunction
): Promise<void> {
  try {
    const validatedData = validateSolutionInput(req.body);
    const solution = await solutionService.createSolution(validatedData);
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
 * PUT /api/admin/solutions/:id
 * Updates an existing solution. Reserved for future Admin Panel compatibility.
 */
export async function adminUpdateSolution(
  req:  Request,
  res:  Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const validatedData = validateSolutionInput(req.body, true);
    const solution = await solutionService.updateSolution(id, validatedData);
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
 * DELETE /api/admin/solutions/:id
 * Deletes a solution listing. Reserved for future Admin Panel compatibility.
 */
export async function adminDeleteSolution(
  req:  Request,
  res:  Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    await solutionService.deleteSolution(id);
    ApiResponse.noContent(res);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/solutions/admin
 * Returns all solutions (active + drafts) for administrative management.
 */
export async function adminGetSolutions(
  _req: Request,
  res:  Response,
  next: NextFunction
): Promise<void> {
  try {
    const solutions = await solutionService.getAllSolutions();
    ApiResponse.success(
      res,
      solutions,
      'All solutions fetched successfully'
    );
  } catch (err) {
    next(err);
  }
}
