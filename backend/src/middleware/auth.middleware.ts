/**
 * @file src/middleware/auth.middleware.ts
 * @description Authentication middleware for future protected routes.
 */

import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '@/config/env';
import { ApiError } from '@/utils/ApiError';
import { JwtPayload } from '@/types/common';

export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const token = req.cookies?.accessToken ?? req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return next(ApiError.unauthorized('Authentication required'));
  }

  try {
    const payload = jwt.verify(token, env.jwtAccessSecret) as JwtPayload;

    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };

    next();
  } catch (error) {
    next(ApiError.unauthorized('Invalid or expired authentication token'));
  }
}
