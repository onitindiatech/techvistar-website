/**
 * @file src/controllers/auth.controller.ts
 * @description Controller for admin authentication endpoints.
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '@/config/env';
import { ApiResponse } from '@/utils/ApiResponse';
import { authService } from '@/services/auth.service';
import { validateAdminLoginInput } from '@/validators/auth.validator';
import { JwtPayload } from '@/types/common';
import { parseExpiryToMs } from '@/utils/auth.utils';

const ACCESS_TOKEN_COOKIE_NAME = 'accessToken';

class AuthController {
  async login(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { email, password } = validateAdminLoginInput(req.body);
      const result = await authService.login({ email, password });

      res.cookie(ACCESS_TOKEN_COOKIE_NAME, result.accessToken, {
        httpOnly: true,
        secure: env.isProd,
        sameSite: env.isProd ? 'none' : 'lax',
        maxAge: parseExpiryToMs(env.accessTokenExpiry),
      });

      return ApiResponse.success(res, {
        admin: result.admin,
      }, 'Admin logged in successfully');
    } catch (err) {
      return next(err);
    }
  }

  async me(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const token = req.cookies?.accessToken;

      if (!token) {
        return ApiResponse.success(res, { admin: null }, 'No authenticated admin');
      }

      try {
        const payload = jwt.verify(token, env.jwtAccessSecret) as JwtPayload;
        const admin = await authService.getAdminById(payload.sub);

        if (!admin) {
          return ApiResponse.success(res, { admin: null }, 'No authenticated admin');
        }

        return ApiResponse.success(res, {
          admin: {
            id: admin._id.toString(),
            name: admin.name,
            email: admin.email,
            role: admin.role,
          },
        }, 'Authenticated admin loaded');
      } catch {
        return ApiResponse.success(res, { admin: null }, 'No authenticated admin');
      }
    } catch (err) {
      return next(err);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      let adminId: string | null = null;

      const tokenFromCookie = req.cookies?.accessToken;
      if (tokenFromCookie) {
        try {
          const payload = jwt.verify(tokenFromCookie, env.jwtAccessSecret) as JwtPayload;
          adminId = payload.sub;
        } catch {
          adminId = null;
        }
      }

      if (!adminId) {
        const authHeader = req.header('Authorization');
        if (authHeader?.startsWith('Bearer ')) {
          try {
            const payload = jwt.verify(authHeader.replace('Bearer ', ''), env.jwtAccessSecret) as JwtPayload;
            adminId = payload.sub;
          } catch {
            adminId = null;
          }
        }
      }

      if (adminId) {
        await authService.logout(adminId);
      }

      res.clearCookie(ACCESS_TOKEN_COOKIE_NAME, {
        httpOnly: true,
        secure: env.isProd,
        sameSite: env.isProd ? 'none' : 'lax',
      });

      return ApiResponse.success(res, null, 'Admin logged out successfully');
    } catch (err) {
      return next(err);
    }
  }
}

export const authController = new AuthController();
