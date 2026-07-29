import { ApiError } from '@/utils/ApiError';

interface OfficeInput {
  officeId?: unknown;
  name?: unknown;
  badge?: unknown;
  address?: unknown;
  city?: unknown;
  country?: unknown;
  googleMapsUrl?: unknown;
  image?: unknown;
  imagePublicId?: unknown;
  imageAlt?: unknown;
  displayOrder?: unknown;
  isActive?: unknown;
}

export function validateOfficeInput(input: OfficeInput, isUpdate = false): Record<string, unknown> {
  const errors: Array<{ field: string; message: string }> = [];

  if (!isUpdate) {
    if (!input.officeId || String(input.officeId).trim() === '') {
      errors.push({ field: 'officeId', message: 'Office ID is required' });
    }
  } else if (input.officeId !== undefined) {
    if (!input.officeId || String(input.officeId).trim() === '') {
      errors.push({ field: 'officeId', message: 'Office ID cannot be empty' });
    }
  }

  if (!isUpdate || input.name !== undefined) {
    if (input.name === undefined || input.name === null || String(input.name).trim() === '') {
      errors.push({ field: 'name', message: 'Name is required' });
    }
  }

  if (!isUpdate || input.badge !== undefined) {
    if (input.badge === undefined || input.badge === null || String(input.badge).trim() === '') {
      errors.push({ field: 'badge', message: 'Badge is required' });
    }
  }

  if (!isUpdate || input.address !== undefined) {
    if (input.address === undefined || input.address === null || String(input.address).trim() === '') {
      errors.push({ field: 'address', message: 'Address is required' });
    }
  }

  if (!isUpdate || input.city !== undefined) {
    if (input.city === undefined || input.city === null || String(input.city).trim() === '') {
      errors.push({ field: 'city', message: 'City is required' });
    }
  }

  if (!isUpdate || input.country !== undefined) {
    if (input.country === undefined || input.country === null || String(input.country).trim() === '') {
      errors.push({ field: 'country', message: 'Country is required' });
    }
  }

  if (!isUpdate || input.googleMapsUrl !== undefined) {
    if (input.googleMapsUrl === undefined || input.googleMapsUrl === null || String(input.googleMapsUrl).trim() === '') {
      errors.push({ field: 'googleMapsUrl', message: 'Google Maps URL is required' });
    }
  }

  if (!isUpdate || input.image !== undefined) {
    if (input.image === undefined || input.image === null || String(input.image).trim() === '') {
      errors.push({ field: 'image', message: 'Image URL is required' });
    }
  }

  if (errors.length > 0) {
    throw ApiError.validationError('Validation failed', errors);
  }

  const validated: Record<string, unknown> = {};

  if (input.officeId !== undefined) validated.officeId = String(input.officeId).trim();
  if (input.name !== undefined) validated.name = String(input.name).trim();
  if (input.badge !== undefined) validated.badge = String(input.badge).trim();
  if (input.address !== undefined) validated.address = String(input.address).trim();
  if (input.city !== undefined) validated.city = String(input.city).trim();
  if (input.country !== undefined) validated.country = String(input.country).trim();
  if (input.googleMapsUrl !== undefined) validated.googleMapsUrl = String(input.googleMapsUrl).trim();
  if (input.image !== undefined) validated.image = String(input.image).trim();
  if (input.imagePublicId !== undefined) validated.imagePublicId = input.imagePublicId ? String(input.imagePublicId).trim() : '';
  if (input.imageAlt !== undefined) validated.imageAlt = input.imageAlt ? String(input.imageAlt).trim() : '';
  if (input.displayOrder !== undefined) validated.displayOrder = Number(input.displayOrder) || 0;
  if (input.isActive !== undefined) validated.isActive = Boolean(input.isActive);

  return validated;
}
