import env from '@/config/env';
import prisma from '@/lib/prisma';
import ApiError from '@/lib/utils/ApiError';
import { comparePassword, jwtSign } from '@/lib/utils/authHelper';
import catchAsync from '@/lib/utils/catchAsync';
import reqBodyValidator from '@/lib/utils/reqBodyValidator';
import sendResponse from '@/lib/utils/sendResponse';
import { loginSchema } from '@/lib/validations/auth.validation';

export const POST = catchAsync(async (req) => {
  const body = await reqBodyValidator(loginSchema, req);

  // check is user exist
  const user = await prisma.user.findUnique({ where: { email: body.email } });
  if (!user) throw new ApiError(401, 'Invalid credentials: Wrong email.');

  // match password
  const isMatch = await comparePassword(body.password, user.password);
  if (!isMatch) throw new ApiError(401, 'Invalid credentials: Wrong Password.');

  // generate token
  const payload = {
    userId: user.id,
    role: user.role,
  };

  const token = await jwtSign(payload, {
    secret: env.jwt_secret,
    expires: env.jwt_expires,
  });

  return sendResponse({
    message: 'Login Successfully.',
    data: token,
  });
});
