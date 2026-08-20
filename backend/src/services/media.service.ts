import { ApiError } from '@/utils/ApiError';
import { MediaModel, IMedia } from '@/models/Media';
import { HTTP_STATUS } from '@/constants';

export const mediaService = {
  async getMedia(): Promise<IMedia[]> {
    return MediaModel.find().sort({ createdAt: -1 }).lean();
  },

  async getMediaById(id: string): Promise<IMedia> {
    const media = await MediaModel.findById(id).lean();
    if (!media) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Media not found');
    }
    return media;
  },

  async createMedia(data: Partial<IMedia>): Promise<IMedia> {
    const media = await MediaModel.create(data);
        return media;
  },

  async deleteMedia(id: string): Promise<IMedia> {
    // Note: This only deletes from our local database reference.
    // Cloudinary deletion can be added here if needed.
    const media = await MediaModel.findByIdAndDelete(id).lean();
    if (!media) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Media not found');
    }

        return media;
  },
};
