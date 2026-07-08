/**
 * @file src/services/contact.service.ts
 * @description Contact service containing business logic for managing contact submissions.
 */

import { Contact, IContact, ContactStatus } from '@/models/Contact';
import { logger } from '@/utils/logger';
import { ApiError } from '@/utils/ApiError';

export interface CreateContactDTO {
  name: string;
  email: string;
  phone: string;
  company?: string;
  serviceInterested: string;
  budget?: string;
  message: string;
}

export interface ContactListOptions {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  trash?: boolean | string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class ContactService {
  async createContact(data: CreateContactDTO): Promise<IContact> {
    logger.info('[ContactService] Processing new contact submission', {
      email: data.email,
      service: data.serviceInterested,
    });

    const contact = new Contact({
      ...data,
      status: 'new',
    });

    await contact.save();

    logger.info('[ContactService] Contact submission saved successfully', {
      id: contact._id,
      email: contact.email,
    });

    return contact;
  }

  async getAllContacts(options: ContactListOptions = {}): Promise<{
    data: IContact[];
    pagination: { total: number; page: number; limit: number; totalPages: number };
  }> {
    logger.info('[ContactService] Retrieving contacts with options', options);

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

    if (options.search) {
      query.$or = [
        { name: { $regex: options.search, $options: 'i' } },
        { email: { $regex: options.search, $options: 'i' } },
        { phone: { $regex: options.search, $options: 'i' } },
        { company: { $regex: options.search, $options: 'i' } },
        { message: { $regex: options.search, $options: 'i' } },
        { serviceInterested: { $regex: options.search, $options: 'i' } },
        { status: { $regex: options.search, $options: 'i' } },
      ];
    }

    let sortObj: Record<string, 1 | -1> = { createdAt: -1 };
    if (options.sortBy) {
      const order = options.sortOrder === 'asc' ? 1 : -1;
      if (['name', 'email', 'status', 'createdAt', 'updatedAt'].includes(options.sortBy)) {
        sortObj = { [options.sortBy]: order };
      }
    }

    const total = await Contact.countDocuments(query);
    const data = await Contact.find(query).sort(sortObj).skip(skip).limit(limit);
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      pagination: { total, page, limit, totalPages },
    };
  }

  async updateContactStatus(id: string, status: ContactStatus, updatedBy?: string): Promise<IContact> {
    logger.info('[ContactService] Updating contact status', { id, status, updatedBy });
    const contact = await Contact.findByIdAndUpdate(
      id,
      { status, updatedBy: updatedBy || 'System' },
      { returnDocument: 'after', runValidators: true }
    );
    if (!contact) {
      throw ApiError.notFound('Contact submission not found');
    }
    return contact;
  }

  async deleteContact(id: string, deletedBy?: string): Promise<void> {
    logger.info('[ContactService] Soft deleting contact submission', { id, deletedBy });
    const result = await Contact.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date(), deletedBy: deletedBy || 'System' },
      { returnDocument: 'after' }
    );
    if (!result) {
      throw ApiError.notFound('Contact submission not found');
    }
  }

  async restoreContact(id: string): Promise<void> {
    logger.info('[ContactService] Restoring contact submission', { id });
    const result = await Contact.findByIdAndUpdate(
      id,
      { isDeleted: false, deletedAt: null, deletedBy: '' },
      { returnDocument: 'after' }
    );
    if (!result) {
      throw ApiError.notFound('Contact submission not found');
    }
  }

  async permanentlyDeleteContact(id: string): Promise<void> {
    logger.info('[ContactService] Permanently deleting contact submission', { id });
    const result = await Contact.findByIdAndDelete(id);
    if (!result) {
      throw ApiError.notFound('Contact submission not found');
    }
  }

  async bulkDeleteContacts(ids: string[], deletedBy?: string): Promise<void> {
    logger.info('[ContactService] Bulk soft deleting contacts', { ids, deletedBy });
    await Contact.updateMany(
      { _id: { $in: ids } },
      { isDeleted: true, deletedAt: new Date(), deletedBy: deletedBy || 'System' }
    );
  }

  async bulkRestoreContacts(ids: string[]): Promise<void> {
    logger.info('[ContactService] Bulk restoring contacts', { ids });
    await Contact.updateMany(
      { _id: { $in: ids } },
      { isDeleted: false, deletedAt: null, deletedBy: '' }
    );
  }

  async bulkUpdateStatus(ids: string[], status: ContactStatus, updatedBy?: string): Promise<void> {
    logger.info('[ContactService] Bulk status update', { ids, status, updatedBy });
    await Contact.updateMany(
      { _id: { $in: ids } },
      { status, updatedBy: updatedBy || 'System' }
    );
  }
}

export const contactService = new ContactService();
