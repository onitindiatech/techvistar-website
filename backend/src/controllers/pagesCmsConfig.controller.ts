/**
 * @file src/controllers/pagesCmsConfig.controller.ts
 */

import { Request, Response, NextFunction } from 'express';
import { pagesCmsConfigService } from '@/services/pagesCmsConfig.service';
import { validatePagesCmsConfigPartialInput } from '@/validators/pagesCmsConfig.validator';
import { ApiResponse } from '@/utils/ApiResponse';

export async function getPublicPagesCmsConfig(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const config = await pagesCmsConfigService.getPublicConfig();
    ApiResponse.success(res, config, 'Page CMS config retrieved successfully');
  } catch (err) {
    next(err);
  }
}

export async function adminGetPagesCmsConfig(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const config = await pagesCmsConfigService.getPublicConfig();
    ApiResponse.success(res, config, 'Page CMS config retrieved successfully');
  } catch (err) {
    next(err);
  }
}

export async function adminUpdatePagesCmsConfig(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const validated = validatePagesCmsConfigPartialInput(req.body as Record<string, unknown>);
    const updatedBy = (req as { user?: { email?: string } }).user?.email || 'Admin';
    const config = await pagesCmsConfigService.updateConfig(validated, updatedBy);
    ApiResponse.success(res, config, 'Page CMS settings updated successfully');
  } catch (err) {
    next(err);
  }
}
