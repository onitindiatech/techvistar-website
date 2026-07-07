/**
 * @file src/services/jobApplication.service.ts
 * @description Service layer managing Job Applications.
 */

import { JobApplication, IJobApplication } from '@/models/JobApplication';
import { Job } from '@/models/Job';
import { ApiError } from '@/utils/ApiError';
import { logger } from '@/utils/logger';
import { VALIDATION } from '@/constants';

export interface ApplicationListOptions {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  jobId?: string;
  trash?: boolean | string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

type ApplicationStatus = typeof VALIDATION.JOB_APPLICATION_STATUSES[number];

export class JobApplicationService {
  async submitApplication(data: Partial<IJobApplication>): Promise<IJobApplication> {
    logger.info('[JobApplicationService] Submitting new application', {
      jobId: data.jobId,
      email: data.email,
    });

    const jobExists = await Job.findById(data.jobId);
    if (!jobExists) {
      throw ApiError.notFound('Target job listing not found');
    }

    const existing = await JobApplication.findOne({
      email: data.email,
      jobId: data.jobId,
      isDeleted: { $ne: true },
    });
    if (existing) {
      throw ApiError.conflict('You have already applied for this position.');
    }

    if (!data.resumeUrl) {
      data.resumeUrl = 'http://localhost:5000/resumes/placeholder.pdf';
    }

    const application = new JobApplication(data);
    await application.save();

    logger.info('[JobApplicationService] Application submitted successfully', {
      id: application._id,
    });
    return application;
  }

  async getApplicationById(id: string): Promise<IJobApplication> {
    logger.info('[JobApplicationService] Retrieving application by ID', { id });
    const application = await JobApplication.findById(id).populate('jobId', 'title slug');
    if (!application) {
      throw ApiError.notFound('Job application not found');
    }
    return application;
  }

  async getApplicationsByJob(jobId: string, options: ApplicationListOptions = {}): Promise<{
    data: IJobApplication[];
    pagination: { total: number; page: number; limit: number; totalPages: number };
  }> {
    logger.info('[JobApplicationService] Retrieving applications by Job ID', { jobId });
    return this.getAllApplications({ ...options, jobId });
  }

  async updateApplicationStatus(
    id: string,
    status: ApplicationStatus,
    updatedBy?: string
  ): Promise<IJobApplication> {
    logger.info('[JobApplicationService] Updating application status', { id, status, updatedBy });
    const application = await JobApplication.findByIdAndUpdate(
      id,
      { status, updatedBy: updatedBy || 'System' },
      { returnDocument: 'after', runValidators: true }
    ).populate('jobId', 'title slug');
    if (!application) {
      throw ApiError.notFound('Job application not found');
    }
    return application;
  }

  async getAllApplications(options: ApplicationListOptions = {}): Promise<{
    data: IJobApplication[];
    pagination: { total: number; page: number; limit: number; totalPages: number };
  }> {
    logger.info('[JobApplicationService] Retrieving applications with options', options);

    const page = Math.max(1, Number(options.page) || 1);
    const limit = Math.max(1, Number(options.limit) || 10);
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = {};

    const isTrash = options.trash === 'true' || options.trash === true || options.status === 'deleted';
    if (isTrash) {
      query.isDeleted = true;
    } else {
      query.isDeleted = { $ne: true };
    }

    if (options.status && options.status !== 'all' && options.status !== 'deleted') {
      query.status = options.status;
    }

    if (options.jobId) {
      query.jobId = options.jobId;
    }

    if (options.search) {
      query.$or = [
        { fullName: { $regex: options.search, $options: 'i' } },
        { email: { $regex: options.search, $options: 'i' } },
        { phone: { $regex: options.search, $options: 'i' } },
        { currentLocation: { $regex: options.search, $options: 'i' } },
        { status: { $regex: options.search, $options: 'i' } },
      ];
    }

    let sortObj: Record<string, 1 | -1> = { createdAt: -1 };
    if (options.sortBy) {
      const order = options.sortOrder === 'asc' ? 1 : -1;
      if (['fullName', 'email', 'status', 'createdAt', 'updatedAt', 'yearsOfExperience'].includes(options.sortBy)) {
        sortObj = { [options.sortBy]: order };
      }
    }

    const total = await JobApplication.countDocuments(query);
    const data = await JobApplication.find(query)
      .populate('jobId', 'title slug')
      .sort(sortObj)
      .skip(skip)
      .limit(limit);
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      pagination: { total, page, limit, totalPages },
    };
  }

  async deleteApplication(id: string, deletedBy?: string): Promise<void> {
    logger.info('[JobApplicationService] Soft deleting job application', { id, deletedBy });
    const result = await JobApplication.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date(), deletedBy: deletedBy || 'System' },
      { returnDocument: 'after' }
    );
    if (!result) {
      throw ApiError.notFound('Job application not found');
    }
  }

  async restoreApplication(id: string): Promise<void> {
    logger.info('[JobApplicationService] Restoring job application', { id });
    const result = await JobApplication.findByIdAndUpdate(
      id,
      { isDeleted: false, deletedAt: null, deletedBy: '' },
      { returnDocument: 'after' }
    );
    if (!result) {
      throw ApiError.notFound('Job application not found');
    }
  }

  async permanentlyDeleteApplication(id: string): Promise<void> {
    logger.info('[JobApplicationService] Permanently deleting job application', { id });
    const result = await JobApplication.findByIdAndDelete(id);
    if (!result) {
      throw ApiError.notFound('Job application not found');
    }
  }

  async bulkDeleteApplications(ids: string[], deletedBy?: string): Promise<void> {
    logger.info('[JobApplicationService] Bulk soft deleting applications', { ids, deletedBy });
    await JobApplication.updateMany(
      { _id: { $in: ids } },
      { isDeleted: true, deletedAt: new Date(), deletedBy: deletedBy || 'System' }
    );
  }

  async bulkRestoreApplications(ids: string[]): Promise<void> {
    logger.info('[JobApplicationService] Bulk restoring applications', { ids });
    await JobApplication.updateMany(
      { _id: { $in: ids } },
      { isDeleted: false, deletedAt: null, deletedBy: '' }
    );
  }

  async bulkUpdateStatus(ids: string[], status: ApplicationStatus, updatedBy?: string): Promise<void> {
    logger.info('[JobApplicationService] Bulk status update', { ids, status, updatedBy });
    await JobApplication.updateMany(
      { _id: { $in: ids } },
      { status, updatedBy: updatedBy || 'System' }
    );
  }
}

export const jobApplicationService = new JobApplicationService();
