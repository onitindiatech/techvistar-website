/**
 * @file src/services/auth.service.ts
 * @description Authentication service for admin sign-in and sign-out workflows.
 */

import bcrypt from 'bcrypt';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { env } from '@/config/env';
import { Admin, IAdmin } from '@/models/Admin';
import { ApiError } from '@/utils/ApiError';
import { JwtPayload } from '@/types/common';

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResult {
  admin: {
    id: string;
    name: string;
    email: string;
    role: 'admin';
  };
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  async login({ email, password }: LoginPayload): Promise<LoginResult> {
    const admin = await Admin.findOne({ email }).select('+password');

    if (!admin) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const accessToken = this.signToken(admin, env.jwtAccessSecret, env.accessTokenExpiry);
    const refreshToken = this.signToken(admin, env.jwtRefreshSecret, env.refreshTokenExpiry);

    await admin.setRefreshToken(refreshToken);
    await admin.save();

    return {
      admin: {
        id: admin._id.toString(),
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
      accessToken,
      refreshToken,
    };
  }

  async getAdminById(adminId: string): Promise<IAdmin | null> {
    return Admin.findById(adminId);
  }

  async logout(adminId: string): Promise<void> {
    const admin = await Admin.findById(adminId);

    if (!admin) {
      return;
    }

    admin.clearRefreshToken();
    await admin.save();
  }

  async logoutByRefreshToken(refreshToken: string): Promise<void> {
    const admin = await Admin.findOne({ refreshTokenHash: { $exists: true } });

    if (!admin) {
      return;
    }

    const isMatch = await bcrypt.compare(refreshToken, admin.refreshTokenHash ?? '');
    if (!isMatch) {
      return;
    }

    admin.clearRefreshToken();
    await admin.save();
  }

  verifyAccessToken(token: string): JwtPayload {
    return jwt.verify(token, env.jwtAccessSecret) as JwtPayload;
  }

  private signToken(admin: IAdmin, secret: string, expiresIn: string): string {
    const options: SignOptions = { expiresIn: expiresIn as SignOptions['expiresIn'] };

    return jwt.sign(
      {
        sub: admin._id.toString(),
        email: admin.email,
        role: admin.role,
      },
      secret,
      options
    );
  }
}

export const authService = new AuthService();
