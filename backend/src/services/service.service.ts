/**
 * @file src/services/service.service.ts
 * @description Service layer managing Service database queries and slug generation.
 */

import { Service, IService } from '@/models/Service';
import { ApiError } from '@/utils/ApiError';
import { logger } from '@/utils/logger';
import {
  SERVICE_MEDIA_FIELDS,
  syncScalarMediaFields,
  collectDocumentPublicIds,
  deleteCloudinaryPublicIds,
} from '@/utils/mediaAsset';

const FALLBACK_SERVICES: Record<string, unknown>[] = [
  {
    title: 'Web Development',
    slug: 'web-development',
    shortDescription: 'High-performance, secure, and SEO-optimized web systems and platforms built for conversion and scale.',
    fullDescription: 'We build fast, secure, and responsive web platforms that grow with your business. From custom corporate portals and portfolio showcases to high-conversion landing pages, e-commerce storefronts, and full-featured SaaS platforms, our systems are engineered for speed, clean UX, and seamless SEO implementation.',
    category: 'Development',
    icon: 'Globe',
    coverImage: 'serviceWebDev',
    thumbnail: 'serviceWebDev',
    overview: 'Complete lifecycle web engineering, building responsive systems from specification to production release.',
    offerings: [
      'Business Websites',
      'Corporate Websites',
      'Portfolio Websites',
      'High-Conversion Landing Pages',
      'E-Commerce Storefronts',
      'Custom CMS Development',
      'Web Applications',
      'SaaS Platforms'
    ],
    process: [
      { step: 1, title: 'Requirements & Scope', description: 'Align on page counts, features, user flows, and tech stacks.' },
      { step: 2, title: 'UX & UI Prototyping', description: 'Design component libraries and interactive high-fidelity layouts.' },
      { step: 3, title: 'Frontend & Backend Build', description: 'Clean, modular engineering with integrated APIs and CMS tools.' },
      { step: 4, title: 'QA & Optimization', description: 'Rigorous responsive testing, speed audits, and SEO configuration.' },
      { step: 5, title: 'Deployment & Support', description: 'Production release under version control with uptime monitoring.' }
    ],
    caseStudies: [
      { title: 'LogiRoute Inc.', description: 'Built an interactive fleet dispatch and management interface.', link: '/work/navigation-route-optimization' }
    ],
    technologies: ['React', 'TypeScript', 'Next.js', 'TailwindCSS', 'Node.js', 'Vite'],
    faqs: [
      { question: 'What CMS platforms do you support?', answer: 'We build custom CMS structures and integrate standard headless architectures like Strapi, Sanity, or WordPress APIs based on your workflow.' },
      { question: 'Are the websites responsive?', answer: 'Yes, every site we deploy is optimized for smartphones, tablets, laptops, and wide desktop displays.' }
    ],
    benefits: [
      'Optimized Core Web Vitals for higher SEO rankings',
      'Responsive layouts across all screen resolutions',
      'Component-driven frontend for easy updates'
    ],
    cta: 'Discuss Your Web Project',
    featured: true,
    displayOrder: 1,
    status: 'active',
    industries: ['E-Commerce & Retail', 'Healthcare & Wellness', 'Fintech', 'SaaS & Tech Startups'],
    whyChooseUs: [
      { title: 'Speed & SEO First', description: 'We optimize every website to score 90+ on Lighthouse/PageSpeed metrics.' },
      { title: 'Clean Architecture', description: 'Our custom React systems are modular, easy to maintain, and completely editable.' }
    ],
    stats: [
      { value: '90+', label: 'Lighthouse Speed', iconType: 'rocket', colorTheme: 'green' },
      { value: '50%', label: 'Bounce Reduction', iconType: 'clock', colorTheme: 'purple' },
      { value: '2.5x', label: 'Conversion Boost', iconType: 'chart', colorTheme: 'gold' },
      { value: '100%', label: 'Responsive Build', iconType: 'shield', colorTheme: 'blue' }
    ],
    dashboardImage: 'sustainability_dashboard'
  }
];

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

    const { payload } = syncScalarMediaFields(null, data as Record<string, unknown>, SERVICE_MEDIA_FIELDS);
    const service = new Service({ ...payload, slug });
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

    const previous = await Service.findById(id).lean();
    if (!previous) {
      throw ApiError.notFound('Service listing not found');
    }

    const { payload, obsoletePublicIds } = syncScalarMediaFields(
      previous as unknown as Record<string, unknown>,
      data as Record<string, unknown>,
      SERVICE_MEDIA_FIELDS
    );

    const service = await Service.findByIdAndUpdate(id, payload, { returnDocument: 'after', runValidators: true });
    if (!service) {
      throw ApiError.notFound('Service listing not found');
    }

    await deleteCloudinaryPublicIds(obsoletePublicIds);

    logger.info('[ServiceService] Service updated successfully', { id: service._id });
    return service;
  }

  /**
   * Soft deletes a service listing.
   */
  async deleteService(id: string, deletedBy?: string): Promise<void> {
    logger.info('[ServiceService] Soft deleting service listing', { id, deletedBy });
    const result = await Service.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date(), deletedBy: deletedBy || 'System' },
      { returnDocument: 'after' }
    );
    if (!result) {
      throw ApiError.notFound('Service listing not found');
    }
    logger.info('[ServiceService] Service soft deleted successfully', { id });
  }

  /**
   * Restores a soft-deleted service listing.
   */
  async restoreService(id: string): Promise<void> {
    logger.info('[ServiceService] Restoring soft-deleted service', { id });
    const result = await Service.findByIdAndUpdate(
      id,
      { isDeleted: false, deletedAt: null, deletedBy: '' },
      { returnDocument: 'after' }
    );
    if (!result) {
      throw ApiError.notFound('Service listing not found');
    }
  }

  /**
   * Permanently deletes a service listing from MongoDB after Cloudinary cleanup.
   */
  async permanentlyDeleteService(id: string): Promise<void> {
    logger.info('[ServiceService] Permanently deleting service listing', { id });
    const existing = await Service.findById(id).lean();
    if (!existing) {
      throw ApiError.notFound('Service listing not found');
    }

    const publicIds = collectDocumentPublicIds(existing as unknown as Record<string, unknown>, SERVICE_MEDIA_FIELDS);
    await deleteCloudinaryPublicIds(publicIds);

    const result = await Service.findByIdAndDelete(id);
    if (!result) {
      throw ApiError.notFound('Service listing not found');
    }
  }

  /**
   * Bulk soft-deletes multiple service listings.
   */
  async bulkDeleteServices(ids: string[], deletedBy?: string): Promise<void> {
    logger.info('[ServiceService] Bulk soft deleting services', { ids, deletedBy });
    await Service.updateMany(
      { _id: { $in: ids } },
      { isDeleted: true, deletedAt: new Date(), deletedBy: deletedBy || 'System' }
    );
  }

  /**
   * Bulk restores multiple soft-deleted service listings.
   */
  async bulkRestoreServices(ids: string[]): Promise<void> {
    logger.info('[ServiceService] Bulk restoring services', { ids });
    await Service.updateMany(
      { _id: { $in: ids } },
      { isDeleted: false, deletedAt: null, deletedBy: '' }
    );
  }

  /**
   * Bulk status update for multiple service listings.
   */
  async bulkUpdateStatus(ids: string[], status: 'draft' | 'active', updatedBy?: string): Promise<void> {
    logger.info('[ServiceService] Bulk status update', { ids, status, updatedBy });
    await Service.updateMany(
      { _id: { $in: ids } },
      { status, updatedBy: updatedBy || 'System' }
    );
  }

  private async ensureFallbackServices(): Promise<void> {
    for (const fallbackService of FALLBACK_SERVICES) {
      if (!fallbackService.slug) continue;

      const existing = await Service.findOne({ slug: fallbackService.slug }).lean();
      if (!existing) {
        await Service.create({
          ...fallbackService,
          isDeleted: false,
          deletedAt: null,
          deletedBy: '',
          createdBy: 'System',
          updatedBy: 'System',
        });
        logger.info('[ServiceService] Seeded missing fallback service', { slug: fallbackService.slug });
      }
    }
  }

  /**
   * Idempotent seed for fallback services — call once at process startup, not per request.
   */
  async seedFallbackServicesIfNeeded(): Promise<void> {
    await this.ensureFallbackServices();
  }

  /**
   * Retrieves all active services ordered by displayOrder ascending.
   * Returns only safe, client-facing fields for public consumption.
   */
  async getActiveServices(category?: string): Promise<IService[]> {
    logger.info('[ServiceService] Retrieving all active services', { category });

    const query: any = { status: 'active', isDeleted: { $ne: true } };
    if (category && category !== 'All') {
      query.category = { $regex: new RegExp('^' + category + '$', 'i') };
    }
    return Service.find(query)
      .select('title slug shortDescription fullDescription icon coverImage thumbnail dashboardImage features technologies benefits offerings displayOrder seoTitle seoDescription category featured')
      .sort({ displayOrder: 1, createdAt: 1 })
      .lean() as Promise<IService[]>;
  }

  /**
   * Retrieves all services (active + drafts) with pagination, search, category, featured, trash filtering and dynamic sorting.
   */
  async getAllServices(options: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    category?: string;
    trash?: boolean | string;
    featured?: boolean | string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<{ data: IService[]; pagination: { total: number; page: number; limit: number; totalPages: number } }> {
    logger.info('[ServiceService] Retrieving all services with options', options);
    
    const page = Math.max(1, Number(options.page) || 1);
    const limit = Math.max(1, Number(options.limit) || 10);
    const skip = (page - 1) * limit;

    const query: any = {};

    // Soft delete check: default is to NOT show deleted items
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
        { status: { $regex: options.search, $options: 'i' } }
      ];
    }

    // Dynamic sorting
    let sortObj: any = { displayOrder: 1, createdAt: -1 };
    if (options.sortBy) {
      const order = options.sortOrder === 'desc' ? -1 : 1;
      if (options.sortBy === 'title') sortObj = { title: order };
      else if (options.sortBy === 'createdAt') sortObj = { createdAt: order };
      else if (options.sortBy === 'updatedAt') sortObj = { updatedAt: order };
      else if (options.sortBy === 'displayOrder') sortObj = { displayOrder: order };
      else if (options.sortBy === 'status') sortObj = { status: order };
    }

    const total = await Service.countDocuments(query);
    const data = await Service.find(query)
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
        totalPages
      }
    };
  }

  /**
   * Retrieves a single active service by slug.
   */
  async getServiceBySlug(slug: string): Promise<IService> {
    logger.info('[ServiceService] Retrieving active service by slug', { slug });

    const service = await Service.findOne({ slug, status: 'active', isDeleted: { $ne: true } }).lean();
    if (!service) {
      throw ApiError.notFound(`Service not found for slug "${slug}"`);
    }
    return service as IService;
  }
}

export const serviceService = new ServiceService();
