import { Office, IOffice } from '@/models/Office';
import { ApiError } from '@/utils/ApiError';
import { logger } from '@/utils/logger';

export class OfficeService {
  async getActiveOffices(): Promise<IOffice[]> {
    logger.info('[OfficeService] Retrieving active offices');
    return Office.find({ isActive: true, isDeleted: { $ne: true } }).sort({ displayOrder: 1 }).lean() as Promise<IOffice[]>;
  }

  async getAllOffices(options: { search?: string } = {}): Promise<IOffice[]> {
    logger.info('[OfficeService] Retrieving all offices for admin', options);
    const query: Record<string, unknown> = { isDeleted: { $ne: true } };
    if (options.search) {
      query.$or = [
        { name: { $regex: options.search, $options: 'i' } },
        { city: { $regex: options.search, $options: 'i' } },
        { country: { $regex: options.search, $options: 'i' } }
      ];
    }
    return Office.find(query).sort({ displayOrder: 1 });
  }

  async getOfficeById(id: string): Promise<IOffice> {
    logger.info('[OfficeService] Retrieving office by ID', { id });
    const office = await Office.findOne({ _id: id, isDeleted: { $ne: true } });
    if (!office) {
      throw ApiError.notFound('Office not found');
    }
    return office;
  }

  async createOffice(data: Partial<IOffice>): Promise<IOffice> {
    logger.info('[OfficeService] Creating new office', { name: data.name });

    const existing = await Office.findOne({ officeId: data.officeId, isDeleted: { $ne: true } });
    if (existing) {
      throw ApiError.conflict(`An office with ID "${data.officeId}" already exists.`);
    }

    const office = new Office(data);
    await office.save();

    logger.info('[OfficeService] Office created successfully', { id: office._id, officeId: office.officeId });
    return office;
  }

  async updateOffice(id: string, data: Partial<IOffice>): Promise<IOffice> {
    logger.info('[OfficeService] Updating office', { id });

    if (data.officeId) {
      const existing = await Office.findOne({ officeId: data.officeId, _id: { $ne: id }, isDeleted: { $ne: true } });
      if (existing) {
        throw ApiError.conflict(`An office with ID "${data.officeId}" already exists.`);
      }
    }

    const office = await Office.findByIdAndUpdate(id, data, { returnDocument: 'after', runValidators: true });
    if (!office) {
      throw ApiError.notFound('Office not found');
    }

    logger.info('[OfficeService] Office updated successfully', { id: office._id });
    return office;
  }

  async deleteOffice(id: string, deletedBy?: string): Promise<void> {
    logger.info('[OfficeService] Soft deleting office', { id, deletedBy });
    const result = await Office.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date(), deletedBy: deletedBy || 'System' },
      { returnDocument: 'after' }
    );
    if (!result) {
      throw ApiError.notFound('Office not found');
    }
    logger.info('[OfficeService] Office soft deleted successfully', { id });
  }

  async reorderOffices(officeIds: string[]): Promise<void> {
    logger.info('[OfficeService] Reordering offices', { officeIds });
    const bulkOps = officeIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { displayOrder: index } },
      },
    }));

    if (bulkOps.length > 0) {
      await Office.bulkWrite(bulkOps);
    }
    logger.info('[OfficeService] Offices reordered successfully');
  }
}

export const officeService = new OfficeService();
