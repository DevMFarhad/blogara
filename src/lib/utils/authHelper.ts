import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import ApiError from './ApiError';
import env from '@/config/env';

/**
 * Hash a plain password
 */
export const hashPassword = async (plainPassword: string): Promise<string> => {
  try {
    if (!plainPassword) throw new ApiError(400, 'Password is required');
    return await bcrypt.hash(plainPassword, env.bcrypt_salt);
  } catch (error: any) {
    throw new ApiError(500, `Password hashing failed: ${error.message}`);
  }
};

/**
 * Compare plain password with hashed password
 */
export const comparePassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  try {
    if (!password || !hash)
      throw new ApiError(400, 'Password and hash are required');
    return await bcrypt.compare(password, hash);
  } catch (error: any) {
    throw new ApiError(500, `Password comparison failed: ${error.message}`);
  }
};

/**
 * Sign a JWT token asynchronously
 */
export const jwtSign = async <T extends JwtPayload>(
  payload: T,
  config: { secret: string; expires: string },
): Promise<string> => {
  try {
    return await new Promise((resolve, reject) => {
      jwt.sign(
        payload,
        config.secret,
        { expiresIn: config.expires as any },
        (err, token) => {
          if (err || !token) {
            return reject(
              new ApiError(
                500,
                `JWT signing failed: ${err?.message || 'Unknown error'}`,
              ),
            );
          }
          resolve(token);
        },
      );
    });
  } catch (error: any) {
    throw new ApiError(500, error.message);
  }
};

/**
 * Verify a JWT token asynchronously
 */
export const jwtVerify = async <T extends JwtPayload>(
  token: string,
  secret: string,
): Promise<T> => {
  try {
    return await new Promise((resolve, reject) => {
      jwt.verify(token, secret, (err, decoded) => {
        if (err) {
          return reject(
            new ApiError(401, `Invalid or expired token: ${err.message}`),
          );
        }
        resolve(decoded as T);
      });
    });
  } catch (error: any) {
    throw error instanceof ApiError ? error : new ApiError(401, error.message);
  }
};
