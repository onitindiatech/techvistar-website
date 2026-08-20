import { Request, Response, NextFunction } from 'express';
import { testimonialService } from '@/services/testimonial.service';
import { ApiResponse } from '@/utils/ApiResponse';
import { HTTP_STATUS } from '@/constants';
import { ApiError } from '@/utils/ApiError';

export async function getTestimonials(_req: Request, res: Response, next: NextFunction) {
  try {
    const testimonials = await testimonialService.getTestimonials();
    ApiResponse.success(res, testimonials, 'Testimonials fetched successfully');
  } catch (err) {
    next(err);
  }
}

export async function getPublishedTestimonials(_req: Request, res: Response, next: NextFunction) {
  try {
    const testimonials = await testimonialService.getPublishedTestimonials();
    ApiResponse.success(res, testimonials, 'Published testimonials fetched successfully');
  } catch (err) {
    next(err);
  }
}

export async function createTestimonial(req: Request, res: Response, next: NextFunction) {
  try {
    const testimonial = await testimonialService.createTestimonial(req.body);
    ApiResponse.success(res, testimonial, 'Testimonial created successfully', HTTP_STATUS.CREATED);
  } catch (err) {
    next(err);
  }
}

export async function updateTestimonial(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    if (!id) throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Testimonial ID is required');

    const testimonial = await testimonialService.updateTestimonial(id, req.body);
    ApiResponse.success(res, testimonial, 'Testimonial updated successfully');
  } catch (err) {
    next(err);
  }
}

export async function deleteTestimonial(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    if (!id) throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Testimonial ID is required');

    await testimonialService.deleteTestimonial(id);
    ApiResponse.success(res, null, 'Testimonial deleted successfully');
  } catch (err) {
    next(err);
  }
}
