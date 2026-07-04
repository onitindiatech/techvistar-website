/**
 * @file src/services/job.service.ts
 * @description Service layer managing Job database CRUD queries.
 */

import { Job, IJob } from '@/models/Job';
import { ApiError } from '@/utils/ApiError';
import { logger } from '@/utils/logger';

export class JobService {
  /**
   * Creates a new job posting. Generates slug automatically.
   */
  async createJob(data: Partial<IJob>): Promise<IJob> {
    logger.info('[JobService] Creating new job posting', { title: data.title });

    // Validate slug uniqueness if slug is provided or will be generated
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

    const job = new Job(data);
    await job.save();

    logger.info('[JobService] Job created successfully', { id: job._id, slug: job.slug });
    return job;
  }

  /**
   * Updates an existing job posting.
   */
  async updateJob(id: string, data: Partial<IJob>): Promise<IJob> {
    logger.info('[JobService] Updating job', { id });

    // If title or slug is changed, check uniqueness
    if (data.slug) {
      const existing = await Job.findOne({ slug: data.slug, _id: { $ne: id } });
      if (existing) {
        throw ApiError.conflict(`A job with slug "${data.slug}" already exists.`);
      }
    }

    const job = await Job.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!job) {
      throw ApiError.notFound('Job listing not found');
    }

    logger.info('[JobService] Job updated successfully', { id: job._id });
    return job;
  }

  /**
   * Deletes a job listing.
   */
  async deleteJob(id: string): Promise<void> {
    logger.info('[JobService] Deleting job', { id });
    const result = await Job.findByIdAndDelete(id);
    if (!result) {
      throw ApiError.notFound('Job listing not found');
    }
    logger.info('[JobService] Job deleted successfully', { id });
  }

  /**
   * Retrieve list of jobs with optional status, department, and featured filters.
   */
  async getAllJobs(filters: {
    status?: string;
    department?: string;
    featured?: boolean;
  } = {}): Promise<IJob[]> {
    const query: any = {};
    if (filters.status) query.status = filters.status;
    if (filters.department) query.department = filters.department;
    if (filters.featured !== undefined) query.featured = filters.featured;

    return Job.find(query).sort({ createdAt: -1 });
  }

  /**
   * Retrieve a single job details by its URL slug.
   */
  async getJobBySlug(slug: string): Promise<IJob> {
    const job = await Job.findOne({ slug });
    if (!job) {
      throw ApiError.notFound(`Job listing not found for slug "${slug}"`);
    }
    return job;
  }

  /**
   * Retrieve all featured jobs.
   */
  async getFeaturedJobs(): Promise<IJob[]> {
    return Job.find({ status: 'active', featured: true }).sort({ createdAt: -1 });
  }

  /**
   * Change job posting status.
   */
  async updateStatus(id: string, status: 'active' | 'closed' | 'draft'): Promise<IJob> {
    logger.info('[JobService] Updating job status', { id, status });
    const job = await Job.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
    if (!job) {
      throw ApiError.notFound('Job listing not found');
    }
    logger.info('[JobService] Job status updated successfully', { id: job._id, status: job.status });
    return job;
  }
}

export const jobService = new JobService();
