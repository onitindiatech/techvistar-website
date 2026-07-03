/**
 * @file src/controllers/contact.controller.ts
 * @description Controller for the Contact module.
 *
 * ARCHITECTURE DECISION:
 *   Keeps the controller layer clean. It only validates the request body,
 *   hands it off to the contact service, and sends a standard 201 Created
 *   response back using ApiResponse.
 */

import { Request, Response, NextFunction } from 'express';
import { validateContactInput } from '@/validators/contact.validator';
import { contactService } from '@/services/contact.service';
import { ApiResponse } from '@/utils/ApiResponse';
import { HTTP_STATUS } from '@/constants';

/**
 * POST /api/contact
 * Handles new contact form submissions.
 */
export async function submitContactForm(
  req:  Request,
  res:  Response,
  next: NextFunction
): Promise<void> {
  try {
    // 1. Run validator to parse and validate request payload
    const validatedData = validateContactInput(req.body);

    // 2. Invoke contact service to save inquiry to MongoDB
    const contact = await contactService.createContact(validatedData);

    // 3. Respond with standard API envelope
    ApiResponse.success(
      res,
      contact,
      'Thank you for contacting us. Your message has been received.',
      HTTP_STATUS.CREATED
    );
  } catch (err) {
    // Pass errors directly to global error handler
    next(err);
  }
}
