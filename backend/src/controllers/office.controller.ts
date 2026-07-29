import { Request, Response, NextFunction } from 'express';
import { validateOfficeInput } from '@/validators/office.validator';
import { officeService } from '@/services/office.service';
import { ApiResponse } from '@/utils/ApiResponse';
import { ApiError } from '@/utils/ApiError';
import { HTTP_STATUS } from '@/constants';

export async function getPublicOffices(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const offices = await officeService.getActiveOffices();
    ApiResponse.success(res, offices, 'Active offices fetched successfully');
  } catch (err) {
    next(err);
  }
}

export async function adminGetOffices(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;
    const offices = await officeService.getAllOffices({ search });
    ApiResponse.success(res, offices, 'All offices fetched successfully');
  } catch (err) {
    next(err);
  }
}

export async function adminGetOfficeById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const office = await officeService.getOfficeById(id);
    ApiResponse.success(res, office, 'Office fetched successfully');
  } catch (err) {
    next(err);
  }
}

export async function adminCreateOffice(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const validatedData = validateOfficeInput(req.body);
    const creatorEmail = (req as any).user?.email || 'Admin';
    const office = await officeService.createOffice({
      ...validatedData,
      createdBy: creatorEmail,
      updatedBy: creatorEmail,
    });
    ApiResponse.success(res, office, 'Office created successfully', HTTP_STATUS.CREATED);
  } catch (err) {
    next(err);
  }
}

export async function adminUpdateOffice(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const validatedData = validateOfficeInput(req.body, true);
    const updatorEmail = (req as any).user?.email || 'Admin';
    const office = await officeService.updateOffice(id, {
      ...validatedData,
      updatedBy: updatorEmail,
    });
    ApiResponse.success(res, office, 'Office updated successfully');
  } catch (err) {
    next(err);
  }
}

export async function adminDeleteOffice(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const updatorEmail = (req as any).user?.email || 'Admin';
    await officeService.deleteOffice(id, updatorEmail);
    ApiResponse.success(res, null, 'Office deleted successfully');
  } catch (err) {
    next(err);
  }
}

export async function adminReorderOffices(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { officeIds } = req.body;
    if (!Array.isArray(officeIds)) {
      throw new ApiError(400, 'officeIds must be an array of strings');
    }
    await officeService.reorderOffices(officeIds);
    ApiResponse.success(res, null, 'Offices reordered successfully');
  } catch (err) {
    next(err);
  }
}
