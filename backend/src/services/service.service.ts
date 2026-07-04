/**
 * @file src/services/service.service.ts
 * @description Service layer managing Service database queries and slug generation.
 */

import { Service, IService } from '@/models/Service';
import { ApiError } from '@/utils/ApiError';
import { logger } from '@/utils/logger';

export class ServiceService {
  /**
   * Creates a new service. Auto-generates unique slug.
   */
  async createService(data: Partial<IService>): Promise<IService> {
    logger.info('[ServiceService] Creating new service listing', { title: data.title });

    let slug = data.slug;
    if (!slug && data.title) {
      slug = data.title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
    }

    if (slug) {
      const existing = await Service.findOne({ slug });
      if (existing) {
        throw ApiError.conflict(`A service with slug "${slug}" already exists.`);
      }
    }

    const service = new Service({ ...data, slug });
    await service.save();

    logger.info('[ServiceService] Service created successfully', { id: service._id, slug: service.slug });
    return service;
  }

  /**
   * Updates an existing service posting.
   */
  async updateService(id: string, data: Partial<IService>): Promise<IService> {
    logger.info('[ServiceService] Updating service listing', { id });

    if (data.slug) {
      const existing = await Service.findOne({ slug: data.slug, _id: { $ne: id } });
      if (existing) {
        throw ApiError.conflict(`A service with slug "${data.slug}" already exists.`);
      }
    }

    const service = await Service.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!service) {
      throw ApiError.notFound('Service listing not found');
    }

    logger.info('[ServiceService] Service updated successfully', { id: service._id });
    return service;
  }

  /**
   * Deletes a service listing.
   */
  async deleteService(id: string): Promise<void> {
    logger.info('[ServiceService] Deleting service listing', { id });
    const result = await Service.findByIdAndDelete(id);
    if (!result) {
      throw ApiError.notFound('Service listing not found');
    }
    logger.info('[ServiceService] Service deleted successfully', { id });
  }

  /**
   * Retrieves all active services ordered by displayOrder ascending.
   * Returns only safe, client-facing fields for public consumption.
   */
  async getActiveServices(): Promise<IService[]> {
    logger.info('[ServiceService] Retrieving all active services');
    return Service.find({ status: 'active' })
      .select('title slug shortDescription fullDescription icon coverImage features technologies benefits displayOrder seoTitle seoDescription')
      .sort({ displayOrder: 1, createdAt: 1 });
  }

  /**
   * Retrieves a single active service by slug.
   * Throws 404 if not found or status is draft.
   */
  async getServiceBySlug(slug: string): Promise<IService> {
    logger.info('[ServiceService] Retrieving active service by slug', { slug });
    const service = await Service.findOne({ slug, status: 'active' });
    if (!service) {
      throw ApiError.notFound(`Service not found for slug "${slug}"`);
    }
    return service;
  }
}

export const serviceService = new ServiceService();
