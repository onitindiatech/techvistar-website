import { ApiError } from '@/utils/ApiError';
import { BlogPostModel, IBlogPost } from '@/models/BlogPost';
import { HTTP_STATUS } from '@/constants';

export const blogPostService = {
  async getBlogPosts(): Promise<IBlogPost[]> {
    return BlogPostModel.find().sort({ publicationDate: -1, createdAt: -1 }).lean();
  },

  async getPublishedBlogPosts(): Promise<IBlogPost[]> {
    return BlogPostModel.find({ status: 'Published' }).sort({ publicationDate: -1 }).lean();
  },

  async getBlogPostBySlug(slug: string): Promise<IBlogPost> {
    const post = await BlogPostModel.findOne({ slug }).lean();
    if (!post) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Blog post not found');
    }
    return post;
  },

  async createBlogPost(data: Partial<IBlogPost>): Promise<IBlogPost> {
    // Check if slug is unique
    if (data.slug) {
      const existing = await BlogPostModel.findOne({ slug: data.slug }).lean();
      if (existing) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'A blog post with this slug already exists');
      }
    }

    const post = await BlogPostModel.create(data);
        return post;
  },

  async updateBlogPost(id: string, data: Partial<IBlogPost>): Promise<IBlogPost> {
    if (data.slug) {
      const existing = await BlogPostModel.findOne({ slug: data.slug, _id: { $ne: id } }).lean();
      if (existing) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'A blog post with this slug already exists');
      }
    }

    const post = await BlogPostModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    ).lean();

    if (!post) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Blog post not found');
    }

        return post;
  },

  async deleteBlogPost(id: string): Promise<IBlogPost> {
    const post = await BlogPostModel.findByIdAndDelete(id).lean();
    if (!post) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Blog post not found');
    }

        return post;
  },
};
