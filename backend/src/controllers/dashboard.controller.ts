import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '@/utils/ApiResponse';
import { getDashboardSummary } from '@/services/dashboard.service';
import { parseDashboardDateRange } from '@/utils/dashboard.aggregations';

export async function adminGetDashboard(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const range = parseDashboardDateRange(req.query.from, req.query.to);
    const preset = typeof req.query.preset === 'string' ? req.query.preset : null;
    const summary = await getDashboardSummary(range, preset);
    ApiResponse.success(res, summary, 'Dashboard analytics retrieved successfully');
  } catch (error) {
    next(error);
  }
}
