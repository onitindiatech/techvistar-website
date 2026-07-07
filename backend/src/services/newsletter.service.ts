/**
 * @file src/services/newsletter.service.ts
 * @description Newsletter service containing business logic for newsletter subscriptions.
 */

import { Newsletter, INewsletter, NewsletterStatus } from '@/models/Newsletter';
import { ApiError } from '@/utils/ApiError';
import { logger } from '@/utils/logger';

export interface CreateSubscriptionDTO {
  email: string;
  source: 'footer' | 'blog_popup' | 'contact_form' | 'hero';
}

export interface NewsletterListOptions {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  source?: string;
  trash?: boolean | string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class NewsletterService {
  async subscribe(data: CreateSubscriptionDTO): Promise<INewsletter> {
    const { email, source } = data;

    logger.info('[NewsletterService] Processing new subscription attempt', { email, source });

    const existing = await Newsletter.findOne({ email });

    if (existing) {
      if (existing.isDeleted) {
        existing.isDeleted = false;
        existing.deletedAt = null;
        existing.deletedBy = '';
        existing.status = 'subscribed';
        existing.source = source;
        await existing.save();
        logger.info('[NewsletterService] Restored soft-deleted subscriber on resubscribe', { email });
        return existing;
      }

      if (existing.status === 'subscribed') {
        logger.warn('[NewsletterService] Duplicate subscription attempt rejected', { email });
        throw ApiError.conflict('This email address is already subscribed.');
      }

      existing.status = 'subscribed';
      existing.source = source;
      await existing.save();

      logger.info('[NewsletterService] Unsubscribed email resubscribed successfully', {
        id: existing._id,
        email,
      });

      return existing;
    }

    const subscriber = new Newsletter({
      email,
      source,
      status: 'subscribed',
    });

    await subscriber.save();

    logger.info('[NewsletterService] New subscriber saved successfully', {
      id: subscriber._id,
      email,
    });

    return subscriber;
  }

  async getAllSubscribers(options: NewsletterListOptions = {}): Promise<{
    data: INewsletter[];
    pagination: { total: number; page: number; limit: number; totalPages: number };
  }> {
    logger.info('[NewsletterService] Retrieving subscribers with options', options);

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

    if (options.source && options.source !== 'all') {
      query.source = options.source;
    }

    if (options.search) {
      query.$or = [
        { email: { $regex: options.search, $options: 'i' } },
        { source: { $regex: options.search, $options: 'i' } },
        { status: { $regex: options.search, $options: 'i' } },
      ];
    }

    let sortObj: Record<string, 1 | -1> = { createdAt: -1 };
    if (options.sortBy) {
      const order = options.sortOrder === 'asc' ? 1 : -1;
      if (['email', 'status', 'source', 'createdAt', 'updatedAt'].includes(options.sortBy)) {
        sortObj = { [options.sortBy]: order };
      }
    }

    const total = await Newsletter.countDocuments(query);
    const data = await Newsletter.find(query).sort(sortObj).skip(skip).limit(limit);
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      pagination: { total, page, limit, totalPages },
    };
  }

  async unsubscribeEmail(email: string): Promise<INewsletter> {
    const subscriber = await Newsletter.findOne({ email, isDeleted: { $ne: true } });
    if (!subscriber) {
      throw ApiError.notFound('Subscriber email not found.');
    }
    if (subscriber.status === 'unsubscribed') {
      return subscriber;
    }
    subscriber.status = 'unsubscribed';
    await subscriber.save();
    logger.info('[NewsletterService] Subscriber unsubscribed', { email });
    return subscriber;
  }

  async updateSubscriberStatus(id: string, status: NewsletterStatus, updatedBy?: string): Promise<INewsletter> {
    logger.info('[NewsletterService] Updating subscriber status', { id, status, updatedBy });
    const subscriber = await Newsletter.findByIdAndUpdate(
      id,
      { status, updatedBy: updatedBy || 'System' },
      { returnDocument: 'after', runValidators: true }
    );
    if (!subscriber) {
      throw ApiError.notFound('Subscriber not found.');
    }
    return subscriber;
  }

  async deleteSubscriber(id: string, deletedBy?: string): Promise<void> {
    logger.info('[NewsletterService] Soft deleting subscriber', { id, deletedBy });
    const result = await Newsletter.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date(), deletedBy: deletedBy || 'System' },
      { returnDocument: 'after' }
    );
    if (!result) {
      throw ApiError.notFound('Subscriber not found.');
    }
  }

  async restoreSubscriber(id: string): Promise<void> {
    logger.info('[NewsletterService] Restoring subscriber', { id });
    const result = await Newsletter.findByIdAndUpdate(
      id,
      { isDeleted: false, deletedAt: null, deletedBy: '' },
      { returnDocument: 'after' }
    );
    if (!result) {
      throw ApiError.notFound('Subscriber not found.');
    }
  }

  async permanentlyDeleteSubscriber(id: string): Promise<void> {
    logger.info('[NewsletterService] Permanently deleting subscriber', { id });
    const result = await Newsletter.findByIdAndDelete(id);
    if (!result) {
      throw ApiError.notFound('Subscriber not found.');
    }
  }

  async bulkDeleteSubscribers(ids: string[], deletedBy?: string): Promise<void> {
    logger.info('[NewsletterService] Bulk soft deleting subscribers', { ids, deletedBy });
    await Newsletter.updateMany(
      { _id: { $in: ids } },
      { isDeleted: true, deletedAt: new Date(), deletedBy: deletedBy || 'System' }
    );
  }

  async bulkRestoreSubscribers(ids: string[]): Promise<void> {
    logger.info('[NewsletterService] Bulk restoring subscribers', { ids });
    await Newsletter.updateMany(
      { _id: { $in: ids } },
      { isDeleted: false, deletedAt: null, deletedBy: '' }
    );
  }

  async bulkUpdateStatus(ids: string[], status: NewsletterStatus, updatedBy?: string): Promise<void> {
    logger.info('[NewsletterService] Bulk status update', { ids, status, updatedBy });
    await Newsletter.updateMany(
      { _id: { $in: ids } },
      { status, updatedBy: updatedBy || 'System' }
    );
  }
}

export const newsletterService = new NewsletterService();
