import { ApiError } from '@/utils/ApiError';
import { TestimonialModel, ITestimonial } from '@/models/Testimonial';
import { HTTP_STATUS } from '@/constants';

export const testimonialService = {
  /**
   * Fetch all testimonials
   */
  async getTestimonials(): Promise<ITestimonial[]> {
    return TestimonialModel.find().sort({ createdAt: -1 }).lean();
  },

  /**
   * Fetch only published testimonials
   */
  async getPublishedTestimonials(): Promise<ITestimonial[]> {
    return TestimonialModel.find({ status: 'Published' }).sort({ createdAt: -1 }).lean();
  },

  /**
   * Create a new testimonial
   */
  async createTestimonial(data: Partial<ITestimonial>): Promise<ITestimonial> {
    const testimonial = await TestimonialModel.create(data);
        return testimonial;
  },

  /**
   * Update an existing testimonial
   */
  async updateTestimonial(id: string, data: Partial<ITestimonial>): Promise<ITestimonial> {
    const testimonial = await TestimonialModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    ).lean();

    if (!testimonial) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Testimonial not found');
    }

        return testimonial;
  },

  /**
   * Delete a testimonial
   */
  async deleteTestimonial(id: string): Promise<ITestimonial> {
    const testimonial = await TestimonialModel.findByIdAndDelete(id).lean();
    if (!testimonial) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Testimonial not found');
    }

        return testimonial;
  },
};
