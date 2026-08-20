import { Request, Response, NextFunction } from 'express';
import { mediaService } from '@/services/media.service';
import { ApiResponse } from '@/utils/ApiResponse';
import { HTTP_STATUS } from '@/constants';
import { ApiError } from '@/utils/ApiError';

export async function getMedia(_req: Request, res: Response, next: NextFunction) {
  try {
    const media = await mediaService.getMedia();
    ApiResponse.success(res, media, 'Media fetched successfully');
  } catch (err) {
    next(err);
  }
}

export async function getMediaById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    if (!id) throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Media ID is required');

    const media = await mediaService.getMediaById(id);
    ApiResponse.success(res, media, 'Media fetched successfully');
  } catch (err) {
    next(err);
  }
}

export async function createMedia(req: Request, res: Response, next: NextFunction) {
  try {
    const media = await mediaService.createMedia(req.body);
    ApiResponse.success(res, media, 'Media created successfully', HTTP_STATUS.CREATED);
  } catch (err) {
    next(err);
  }
}

export async function deleteMedia(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    if (!id) throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Media ID is required');

    await mediaService.deleteMedia(id);
    ApiResponse.success(res, null, 'Media deleted successfully');
  } catch (err) {
    next(err);
  }
}
