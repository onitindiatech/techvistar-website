import { Request, Response, NextFunction } from 'express';
import { teamMemberService } from '@/services/teamMember.service';
import { ApiResponse } from '@/utils/ApiResponse';
import { HTTP_STATUS } from '@/constants';
import { ApiError } from '@/utils/ApiError';

export async function getTeamMembers(_req: Request, res: Response, next: NextFunction) {
  try {
    const members = await teamMemberService.getTeamMembers();
    ApiResponse.success(res, members, 'Team members fetched successfully');
  } catch (err) {
    next(err);
  }
}

export async function getActiveTeamMembers(_req: Request, res: Response, next: NextFunction) {
  try {
    const members = await teamMemberService.getActiveTeamMembers();
    ApiResponse.success(res, members, 'Active team members fetched successfully');
  } catch (err) {
    next(err);
  }
}

export async function createTeamMember(req: Request, res: Response, next: NextFunction) {
  try {
    const member = await teamMemberService.createTeamMember(req.body);
    ApiResponse.success(res, member, 'Team member created successfully', HTTP_STATUS.CREATED);
  } catch (err) {
    next(err);
  }
}

export async function updateTeamMember(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    if (!id) throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Team member ID is required');

    const member = await teamMemberService.updateTeamMember(id, req.body);
    ApiResponse.success(res, member, 'Team member updated successfully');
  } catch (err) {
    next(err);
  }
}

export async function deleteTeamMember(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    if (!id) throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Team member ID is required');

    await teamMemberService.deleteTeamMember(id);
    ApiResponse.success(res, null, 'Team member deleted successfully');
  } catch (err) {
    next(err);
  }
}
