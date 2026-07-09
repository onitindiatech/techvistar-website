/**
 * @file src/services/job.service.ts
 * @description Service layer managing Job database CRUD queries.
 */

import { Job, IJob } from '@/models/Job';
import { ApiError } from '@/utils/ApiError';
import { logger } from '@/utils/logger';
import { VALIDATION } from '@/constants';
import {
  collectJobMediaPublicIds,
  obsoleteJobMediaPublicIds,
  deleteCloudinaryPublicIds,
  JOB_MEDIA_FIELDS,
  syncScalarMediaFields,
} from '@/utils/mediaAsset';

type JobStatus = typeof VALIDATION.JOB_STATUSES[number];

export class JobService {
  /**
   * Creates a new job posting. Generates slug automatically.
   */
  async createJob(data: Partial<IJob>): Promise<IJob> {
    logger.info('[JobService] Creating new job posting', { title: data.title });

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
      const existing = await Job.findOne({ slug });
      if (existing) {
        throw ApiError.conflict(`A job with slug "${slug}" already exists.`);
      }
    }

    const { payload } = syncScalarMediaFields(null, data as Record<string, unknown>, JOB_MEDIA_FIELDS);
    const job = new Job({ ...payload, slug });
    await job.save();

    logger.info('[JobService] Job created successfully', { id: job._id, slug: job.slug });
    return job;
  }

  /**
   * Updates an existing job posting.
   */
  async updateJob(id: string, data: Partial<IJob>): Promise<IJob> {
    logger.info('[JobService] Updating job', { id });

    if (data.slug) {
      const existing = await Job.findOne({ slug: data.slug, _id: { $ne: id } });
      if (existing) {
        throw ApiError.conflict(`A job with slug "${data.slug}" already exists.`);
      }
    }

    const previous = await Job.findById(id).lean();
    if (!previous) {
      throw ApiError.notFound('Job listing not found');
    }

    const { payload, obsoletePublicIds } = syncScalarMediaFields(
      previous as unknown as Record<string, unknown>,
      data as Record<string, unknown>,
      JOB_MEDIA_FIELDS
    );

    const job = await Job.findByIdAndUpdate(id, payload, { returnDocument: 'after', runValidators: true });
    if (!job) {
      throw ApiError.notFound('Job listing not found');
    }

    await deleteCloudinaryPublicIds(obsoletePublicIds);

    if (typeof data.description === 'string') {
      await deleteCloudinaryPublicIds(
        obsoleteJobMediaPublicIds(previous.description, data.description)
      );
    }

    logger.info('[JobService] Job updated successfully', { id: job._id });
    return job;
  }

  /**
   * Soft deletes a job listing.
   */
  async deleteJob(id: string, deletedBy?: string): Promise<void> {
    logger.info('[JobService] Soft deleting job listing', { id, deletedBy });
    const result = await Job.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date(), deletedBy: deletedBy || 'System' },
      { returnDocument: 'after' }
    );
    if (!result) {
      throw ApiError.notFound('Job listing not found');
    }
    logger.info('[JobService] Job soft deleted successfully', { id });
  }

  /**
   * Restores a soft-deleted job listing.
   */
  async restoreJob(id: string): Promise<void> {
    logger.info('[JobService] Restoring soft-deleted job', { id });
    const result = await Job.findByIdAndUpdate(
      id,
      { isDeleted: false, deletedAt: null, deletedBy: '' },
      { returnDocument: 'after' }
    );
    if (!result) {
      throw ApiError.notFound('Job listing not found');
    }
  }

  /**
   * Permanently deletes a job listing from MongoDB after Cloudinary cleanup.
   */
  async permanentlyDeleteJob(id: string): Promise<void> {
    logger.info('[JobService] Permanently deleting job listing', { id });
    const existing = await Job.findById(id).lean();
    if (!existing) {
      throw ApiError.notFound('Job listing not found');
    }

    await deleteCloudinaryPublicIds(collectJobMediaPublicIds(existing.description));

    const result = await Job.findByIdAndDelete(id);
    if (!result) {
      throw ApiError.notFound('Job listing not found');
    }
  }

  /**
   * Bulk soft-deletes multiple job listings.
   */
  async bulkDeleteJobs(ids: string[], deletedBy?: string): Promise<void> {
    logger.info('[JobService] Bulk soft deleting jobs', { ids, deletedBy });
    await Job.updateMany(
      { _id: { $in: ids } },
      { isDeleted: true, deletedAt: new Date(), deletedBy: deletedBy || 'System' }
    );
  }

  /**
   * Bulk restores multiple soft-deleted job listings.
   */
  async bulkRestoreJobs(ids: string[]): Promise<void> {
    logger.info('[JobService] Bulk restoring jobs', { ids });
    await Job.updateMany(
      { _id: { $in: ids } },
      { isDeleted: false, deletedAt: null, deletedBy: '' }
    );
  }

  /**
   * Bulk status update for multiple job listings.
   */
  async bulkUpdateStatus(ids: string[], status: JobStatus, updatedBy?: string): Promise<void> {
    logger.info('[JobService] Bulk status update', { ids, status, updatedBy });
    await Job.updateMany(
      { _id: { $in: ids } },
      { status, updatedBy: updatedBy || 'System' }
    );
  }

  /**
   * Retrieves active job listings for public consumption.
   */
  async getActiveJobs(filters: {
    department?: string;
    featured?: boolean;
  } = {}): Promise<IJob[]> {
    logger.info('[JobService] Retrieving active jobs', filters);
    const query: any = { status: 'active', isDeleted: { $ne: true } };
    if (filters.department) {
      query.department = { $regex: new RegExp('^' + filters.department + '$', 'i') };
    }
    if (filters.featured !== undefined) {
      query.featured = filters.featured;
    }
    return Job.find(query).sort({ displayOrder: 1, createdAt: -1 });
  }

  /**
   * Retrieves all jobs with pagination, search, filters, trash filtering and dynamic sorting.
   */
  async getAllJobs(options: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    department?: string;
    trash?: boolean | string;
    featured?: boolean | string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<{ data: IJob[]; pagination: { total: number; page: number; limit: number; totalPages: number } }> {
    logger.info('[JobService] Retrieving all jobs with options', options);

    const page = Math.max(1, Number(options.page) || 1);
    const limit = Math.max(1, Number(options.limit) || 10);
    const skip = (page - 1) * limit;

    const query: any = {};

    const isTrash = options.trash === 'true' || options.trash === true || options.status === 'deleted';
    if (isTrash) {
      query.isDeleted = true;
    } else {
      query.isDeleted = { $ne: true };
    }

    if (options.status && options.status !== 'all' && options.status !== 'deleted') {
      query.status = options.status;
    }
    if (options.department && options.department !== 'all') {
      query.department = { $regex: new RegExp('^' + options.department + '$', 'i') };
    }
    if (options.featured && options.featured !== 'all') {
      query.featured = options.featured === 'true' || options.featured === true;
    }
    if (options.search) {
      query.$or = [
        { title: { $regex: options.search, $options: 'i' } },
        { department: { $regex: options.search, $options: 'i' } },
        { location: { $regex: options.search, $options: 'i' } },
        { slug: { $regex: options.search, $options: 'i' } },
        { employmentType: { $regex: options.search, $options: 'i' } },
        { status: { $regex: options.search, $options: 'i' } },
      ];
    }

    let sortObj: any = { displayOrder: 1, createdAt: -1 };
    if (options.sortBy) {
      const order = options.sortOrder === 'desc' ? -1 : 1;
      if (options.sortBy === 'title') sortObj = { title: order };
      else if (options.sortBy === 'createdAt') sortObj = { createdAt: order };
      else if (options.sortBy === 'updatedAt') sortObj = { updatedAt: order };
      else if (options.sortBy === 'displayOrder') sortObj = { displayOrder: order };
      else if (options.sortBy === 'status') sortObj = { status: order };
      else if (options.sortBy === 'department') sortObj = { department: order };
    }

    const total = await Job.countDocuments(query);
    const data = await Job.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  /**
   * Retrieve a single active job details by its URL slug.
   */
  async getJobBySlug(slug: string): Promise<IJob> {
    logger.info('[JobService] Retrieving active job by slug', { slug });
    const job = await Job.findOne({ slug, status: 'active', isDeleted: { $ne: true } });
    if (!job) {
      throw ApiError.notFound(`Job listing not found for slug "${slug}"`);
    }
    return job;
  }

  /**
   * Retrieve all featured active jobs.
   */
  async getFeaturedJobs(): Promise<IJob[]> {
    return Job.find({ status: 'active', featured: true, isDeleted: { $ne: true } })
      .sort({ displayOrder: 1, createdAt: -1 });
  }

  /**
   * Change job posting status.
   */
  async updateStatus(id: string, status: JobStatus, updatedBy?: string): Promise<IJob> {
    logger.info('[JobService] Updating job status', { id, status, updatedBy });
    const job = await Job.findByIdAndUpdate(
      id,
      { status, updatedBy: updatedBy || 'System' },
      { returnDocument: 'after', runValidators: true }
    );
    if (!job) {
      throw ApiError.notFound('Job listing not found');
    }
    logger.info('[JobService] Job status updated successfully', { id: job._id, status: job.status });
    return job;
  }
}

export const jobService = new JobService();
