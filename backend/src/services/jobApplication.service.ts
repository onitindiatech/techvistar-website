/**
 * @file src/services/jobApplication.service.ts
 * @description Service layer managing Job Applications.
 */

import { JobApplication, IJobApplication } from '@/models/JobApplication';
import { Job } from '@/models/Job';
import { ApiError } from '@/utils/ApiError';
import { logger } from '@/utils/logger';

export class JobApplicationService {
  /**
   * Submits a new job application.
   */
  async submitApplication(data: Partial<IJobApplication>): Promise<IJobApplication> {
    logger.info('[JobApplicationService] Submitting new application', { 
      jobId: data.jobId, 
      email: data.email 
    });

    // 1. Verify job exists
    const jobExists = await Job.findById(data.jobId);
    if (!jobExists) {
      throw ApiError.notFound('Target job listing not found');
    }

    // 2. Prevent duplicate applications
    const existing = await JobApplication.findOne({ 
      email: data.email, 
      jobId: data.jobId 
    });
    if (existing) {
      throw ApiError.conflict('You have already applied for this position.');
    }

    // 3. Set placeholder resumeUrl if not present
    if (!data.resumeUrl) {
      data.resumeUrl = 'http://localhost:5000/resumes/placeholder.pdf';
    }

    const application = new JobApplication(data);
    await application.save();

    logger.info('[JobApplicationService] Application submitted successfully', { 
      id: application._id 
    });
    return application;
  }

  /**
   * Retrieves a single job application by ID.
   */
  async getApplicationById(id: string): Promise<IJobApplication> {
    logger.info('[JobApplicationService] Retrieving application by ID', { id });
    const application = await JobApplication.findById(id).populate('jobId', 'title slug');
    if (!application) {
      throw ApiError.notFound('Job application not found');
    }
    return application;
  }

  /**
   * Retrieves all job applications submitted for a specific job listing.
   */
  async getApplicationsByJob(jobId: string): Promise<IJobApplication[]> {
    logger.info('[JobApplicationService] Retrieving applications by Job ID', { jobId });
    return JobApplication.find({ jobId }).sort({ createdAt: -1 });
  }

  /**
   * Updates application status.
   */
  async updateApplicationStatus(id: string, status: string): Promise<IJobApplication> {
    logger.info('[JobApplicationService] Updating application status', { id, status });
    const application = await JobApplication.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
    if (!application) {
      throw ApiError.notFound('Job application not found');
    }
    return application;
  }

  /**
   * Retrieves all job applications in the database.
   */
  async getAllApplications(): Promise<IJobApplication[]> {
    logger.info('[JobApplicationService] Retrieving all applications');
    return JobApplication.find().populate('jobId', 'title slug').sort({ createdAt: -1 });
  }

  /**
   * Deletes a job application permanently.
   */
  async deleteApplication(id: string): Promise<void> {
    logger.info('[JobApplicationService] Deleting job application', { id });
    const result = await JobApplication.findByIdAndDelete(id);
    if (!result) {
      throw ApiError.notFound('Job application not found');
    }
  }
}

export const jobApplicationService = new JobApplicationService();
