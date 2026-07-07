/**
 * @file src/services/project.service.ts
 * @description Service layer managing Project database CRUD operations.
 */

import { ProjectModel, IProject } from '@/models/Project';
import { ApiError } from '@/utils/ApiError';
import { logger } from '@/utils/logger';

export type ProjectStatus = 'Completed' | 'In Progress' | 'Coming Soon';

export class ProjectService {
  /**
   * Creates a new Project portfolio item.
   */
  async createProject(data: Partial<IProject>): Promise<IProject> {
    logger.info('[ProjectService] Creating new project', { title: data.title });

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
      const existing = await ProjectModel.findOne({ slug });
      if (existing) {
        throw ApiError.conflict(`A project with slug "${slug}" already exists.`);
      }
    }

    const project = new ProjectModel({ ...data, slug });
    await project.save();

    logger.info('[ProjectService] Project created successfully', { id: project._id, slug: project.slug });
    return project;
  }

  /**
   * Updates an existing Project.
   */
  async updateProject(id: string, data: Partial<IProject>): Promise<IProject> {
    logger.info('[ProjectService] Updating project', { id });

    if (data.slug) {
      const existing = await ProjectModel.findOne({ slug: data.slug, _id: { $ne: id } });
      if (existing) {
        throw ApiError.conflict(`A project with slug "${data.slug}" already exists.`);
      }
    }

    const project = await ProjectModel.findByIdAndUpdate(id, data, { returnDocument: 'after', runValidators: true });
    if (!project) {
      throw ApiError.notFound('Project not found');
    }

    logger.info('[ProjectService] Project updated successfully', { id: project._id });
    return project;
  }

  /**
   * Soft deletes a Project listing.
   */
  async deleteProject(id: string, deletedBy?: string): Promise<void> {
    logger.info('[ProjectService] Soft deleting project', { id, deletedBy });
    const result = await ProjectModel.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date(), deletedBy: deletedBy || 'System' },
      { returnDocument: 'after' }
    );
    if (!result) {
      throw ApiError.notFound('Project not found');
    }
    logger.info('[ProjectService] Project soft deleted successfully', { id });
  }

  /**
   * Restores a soft-deleted Project listing.
   */
  async restoreProject(id: string): Promise<void> {
    logger.info('[ProjectService] Restoring soft-deleted project', { id });
    const result = await ProjectModel.findByIdAndUpdate(
      id,
      { isDeleted: false, deletedAt: null, deletedBy: '' },
      { returnDocument: 'after' }
    );
    if (!result) {
      throw ApiError.notFound('Project not found');
    }
  }

  /**
   * Permanently deletes a Project listing from MongoDB.
   */
  async permanentlyDeleteProject(id: string): Promise<void> {
    logger.info('[ProjectService] Permanently deleting project', { id });
    const result = await ProjectModel.findByIdAndDelete(id);
    if (!result) {
      throw ApiError.notFound('Project not found');
    }
  }

  /**
   * Bulk soft-deletes multiple Project listings.
   */
  async bulkDeleteProjects(ids: string[], deletedBy?: string): Promise<void> {
    logger.info('[ProjectService] Bulk soft deleting projects', { ids, deletedBy });
    await ProjectModel.updateMany(
      { _id: { $in: ids } },
      { isDeleted: true, deletedAt: new Date(), deletedBy: deletedBy || 'System' }
    );
  }

  /**
   * Bulk restores multiple soft-deleted Project listings.
   */
  async bulkRestoreProjects(ids: string[]): Promise<void> {
    logger.info('[ProjectService] Bulk restoring projects', { ids });
    await ProjectModel.updateMany(
      { _id: { $in: ids } },
      { isDeleted: false, deletedAt: null, deletedBy: '' }
    );
  }

  /**
   * Bulk status update for multiple Project listings.
   */
  async bulkUpdateStatus(ids: string[], status: ProjectStatus, updatedBy?: string): Promise<void> {
    logger.info('[ProjectService] Bulk status update', { ids, status, updatedBy });
    await ProjectModel.updateMany(
      { _id: { $in: ids } },
      { status, updatedBy: updatedBy || 'System' }
    );
  }

  /**
   * Retrieves all active (non-deleted) projects sorted by displayOrder.
   */
  async getActiveProjects(): Promise<IProject[]> {
    logger.info('[ProjectService] Retrieving all active projects');
    return ProjectModel.find({ isDeleted: { $ne: true } })
      .sort({ displayOrder: 1, date: -1 });
  }

  /**
   * Retrieves all projects with pagination, search, category, featured, trash filtering and dynamic sorting.
   */
  async getAllProjects(options: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    category?: string;
    trash?: boolean | string;
    featured?: boolean | string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<{ data: IProject[]; pagination: { total: number; page: number; limit: number; totalPages: number } }> {
    logger.info('[ProjectService] Retrieving all projects with options', options);

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
    if (options.category && options.category !== 'all') {
      query.category = { $regex: new RegExp('^' + options.category + '$', 'i') };
    }
    if (options.featured && options.featured !== 'all') {
      query.featured = options.featured === 'true' || options.featured === true;
    }
    if (options.search) {
      query.$or = [
        { title: { $regex: options.search, $options: 'i' } },
        { category: { $regex: options.search, $options: 'i' } },
        { slug: { $regex: options.search, $options: 'i' } },
        { technologies: { $regex: options.search, $options: 'i' } },
        { status: { $regex: options.search, $options: 'i' } },
        { client: { $regex: options.search, $options: 'i' } },
        { industry: { $regex: options.search, $options: 'i' } },
      ];
    }

    let sortObj: Record<string, 1 | -1> = { displayOrder: 1, createdAt: -1 };
    if (options.sortBy) {
      const order = options.sortOrder === 'desc' ? -1 : 1;
      if (options.sortBy === 'title') sortObj = { title: order };
      else if (options.sortBy === 'createdAt') sortObj = { createdAt: order };
      else if (options.sortBy === 'updatedAt') sortObj = { updatedAt: order };
      else if (options.sortBy === 'displayOrder') sortObj = { displayOrder: order };
      else if (options.sortBy === 'status') sortObj = { status: order };
    }

    const total = await ProjectModel.countDocuments(query);
    const data = await ProjectModel.find(query).sort(sortObj).skip(skip).limit(limit);
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      pagination: { total, page, limit, totalPages },
    };
  }

  /**
   * Retrieves a single active project by its slug.
   */
  async getProjectBySlug(slug: string): Promise<IProject> {
    logger.info('[ProjectService] Retrieving active project by slug', { slug });
    const project = await ProjectModel.findOne({ slug, isDeleted: { $ne: true } });
    if (!project) {
      throw ApiError.notFound(`Project not found for slug "${slug}"`);
    }
    return project;
  }
}

export const projectService = new ProjectService();
