import catchAsync from '@/lib/utils/catchAsync';
import reqBodyValidator from '@/lib/utils/reqBodyValidator';
import { resetPasswordSchema } from '@/lib/validations/auth.validation';
import prisma from '@/lib/prisma';
import ApiError from '@/lib/utils/ApiError';
import sendResponse from '@/lib/utils/sendResponse';
import { hashPassword, jwtVerify } from '@/lib/utils/authHelper';
import env from '@/config/env';

export const POST = catchAsync(async (req) => {
  const { password: newPassword, token } = await reqBodyValidator(
    resetPasswordSchema,
    req,
  );
  const decoded = await jwtVerify(token, env.jwt_reset_secret);
  const user = await prisma.user.findUnique({
    where: {
      id: decoded.id,
      email: decoded.email,
    },
  });

  if (!user) throw new ApiError(400, 'Invalid or expired reset token');

  // hash new password and update
  const password = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password,
      isPasswordChanged: true,
    },
  });

  return sendResponse({ message: 'Password reset successfully' });
});
