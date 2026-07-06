/**
 * @file src/services/contact.service.ts
 * @description Contact service containing business logic for managing contact submissions.
 *
 * ARCHITECTURE DECISION:
 *   This service is decoupled from HTTP requests. It receives pre-validated DTO inputs,
 *   performs database persistence, logs successfully handled operations, and manages
 *   future transactional tasks (like triggering client/admin email confirmations).
 */

import { Contact, IContact } from '@/models/Contact';
import { logger } from '@/utils/logger';

export interface CreateContactDTO {
  name: string;
  email: string;
  phone: string;
  company?: string;
  serviceInterested: 'web-development' | 'mobile-development' | 'ui-ux' | 'consulting' | 'other';
  budget?: string;
  message: string;
}

export class ContactService {
  /**
   * Persists a validated contact inquiry submission.
   *
   * @param data Validated submission details
   */
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

    // TODO Phase 3: Integrate Nodemailer to dispatch confirmation emails here:
    // try {
    //   await emailService.sendContactConfirmation(contact);
    // } catch (mailErr) {
    //   logger.error('[ContactService] Failed to send confirmation email', { error: mailErr });
    // }

    return contact;
  }

  /**
   * Retrieves all contact form submissions.
   */
  async getAllContacts(): Promise<IContact[]> {
    logger.info('[ContactService] Retrieving all contacts');
    return Contact.find().sort({ createdAt: -1 });
  }

  /**
   * Updates contact status.
   */
  async updateContactStatus(id: string, status: string): Promise<IContact> {
    logger.info('[ContactService] Updating contact status', { id, status });
    const contact = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
    if (!contact) {
      throw ApiError.notFound('Contact submission not found');
    }
    return contact;
  }

  /**
   * Deletes a contact submission permanently.
   */
  async deleteContact(id: string): Promise<void> {
    logger.info('[ContactService] Deleting contact submission', { id });
    const result = await Contact.findByIdAndDelete(id);
    if (!result) {
      throw ApiError.notFound('Contact submission not found');
    }
  }
}

export const contactService = new ContactService();
