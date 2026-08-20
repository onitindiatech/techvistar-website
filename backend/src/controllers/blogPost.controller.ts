import { Request, Response, NextFunction } from 'express';
import { blogPostService } from '@/services/blogPost.service';
import { ApiResponse } from '@/utils/ApiResponse';
import { HTTP_STATUS } from '@/constants';
import { ApiError } from '@/utils/ApiError';

export async function getBlogPosts(_req: Request, res: Response, next: NextFunction) {
  try {
    const posts = await blogPostService.getBlogPosts();
    ApiResponse.success(res, posts, 'Blog posts fetched successfully');
  } catch (err) {
    next(err);
  }
}

export async function getPublishedBlogPosts(_req: Request, res: Response, next: NextFunction) {
  try {
    const posts = await blogPostService.getPublishedBlogPosts();
    ApiResponse.success(res, posts, 'Published blog posts fetched successfully');
  } catch (err) {
    next(err);
  }
}

export async function getBlogPostBySlug(req: Request, res: Response, next: NextFunction) {
  try {
    const { slug } = req.params;
    if (!slug) throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Slug is required');

    const post = await blogPostService.getBlogPostBySlug(slug);
    ApiResponse.success(res, post, 'Blog post fetched successfully');
  } catch (err) {
    next(err);
  }
}

export async function createBlogPost(req: Request, res: Response, next: NextFunction) {
  try {
    const post = await blogPostService.createBlogPost(req.body);
    ApiResponse.success(res, post, 'Blog post created successfully', HTTP_STATUS.CREATED);
  } catch (err) {
    next(err);
  }
}

export async function updateBlogPost(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    if (!id) throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Blog post ID is required');

    const post = await blogPostService.updateBlogPost(id, req.body);
    ApiResponse.success(res, post, 'Blog post updated successfully');
  } catch (err) {
    next(err);
  }
}

export async function deleteBlogPost(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    if (!id) throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Blog post ID is required');

    await blogPostService.deleteBlogPost(id);
    ApiResponse.success(res, null, 'Blog post deleted successfully');
  } catch (err) {
    next(err);
  }
}
