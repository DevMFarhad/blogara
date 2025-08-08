import catchAsync from '@/lib/utils/catchAsync';
import reqBodyValidator from '@/lib/utils/reqBodyValidator';
import { forgotPasswordSchema } from '@/lib/validations/auth.validation';
import prisma from '@/lib/prisma';
import ApiError from '@/lib/utils/ApiError';
import sendResponse from '@/lib/utils/sendResponse';
import { jwtSign } from '@/lib/utils/authHelper';
import env from '@/config/env';
import sendResetPasswordMail from '@/lib/utils/mail/sendResetPasswordMail';

export const POST = catchAsync(async (req) => {
  const { email } = await reqBodyValidator(forgotPasswordSchema, req);

  // check use with this email
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new ApiError(404, 'User not found');

  // generate reset token
  const payload = {
    userId: user.id,
    email: user.email,
  };
  const resetToken = await jwtSign(payload, {
    secret: env.jwt_reset_secret,
    expires: env.jwt_reset_expires,
  });

  // send email and response
  await sendResetPasswordMail(email, resetToken);

  return sendResponse({
    message: 'Please check your email.',
  });
});
