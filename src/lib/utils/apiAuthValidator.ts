import { NextRequest } from 'next/server';
import jwt, { JwtPayload } from 'jsonwebtoken';
import ApiError from './ApiError';
import { USER_ROLE } from '@prisma/client';
import env from '@/config/env';
import prisma from '../prisma';

declare module 'next/server' {
  interface NextRequest {
    user?: DecodedToken;
  }
}

interface DecodedToken extends JwtPayload {
  userId: string;
  role: USER_ROLE;
}

const apiAuthValidator = (roles?: USER_ROLE[]) => {
  return async (req: NextRequest) => {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : null;

    if (!token) throw new ApiError(401, 'Unauthorized');

    try {
      const decoded = jwt.verify(token, env.jwt_secret) as DecodedToken;

      if (roles && !roles.includes(decoded.role)) {
        throw new ApiError(403, 'Forbidden');
      }

      const existUser = await prisma.user.findUnique({
        where: {
          id: decoded.userId,
          role: decoded.role,
        },
      });

      if (!existUser) {
        throw new ApiError(404, 'User is not exist.');
      }

      if (existUser.isPasswordChanged !== true) {
        throw new ApiError(401, 'Unauthorized');
      }

      // Attach user to request
      req.user = decoded;
    } catch (error: any) {
      throw new ApiError(401, error.message);
    }
  };
};

export default apiAuthValidator;
