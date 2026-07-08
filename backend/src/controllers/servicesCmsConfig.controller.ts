/**
 * @file src/controllers/servicesCmsConfig.controller.ts
 */

import { Request, Response, NextFunction } from 'express';
import { servicesCmsConfigService } from '@/services/servicesCmsConfig.service';
import { validateServicesCmsConfigInput } from '@/validators/servicesCmsConfig.validator';
import { ApiResponse } from '@/utils/ApiResponse';

export async function getPublicServicesCmsConfig(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const config = await servicesCmsConfigService.getPublicConfig();
    ApiResponse.success(res, config, 'Services CMS config retrieved successfully');
  } catch (err) {
    next(err);
  }
}

export async function adminGetServicesCmsConfig(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const config = await servicesCmsConfigService.getPublicConfig();
    ApiResponse.success(res, config, 'Services CMS config retrieved successfully');
  } catch (err) {
    next(err);
  }
}

export async function adminUpdateServicesCmsConfig(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const validated = validateServicesCmsConfigInput(req.body as Record<string, unknown>);
    const updatedBy = (req as any).user?.email || 'Admin';
    const config = await servicesCmsConfigService.updateConfig(validated, updatedBy);
    ApiResponse.success(res, config, 'Services CMS config updated successfully');
  } catch (err) {
    next(err);
  }
}
