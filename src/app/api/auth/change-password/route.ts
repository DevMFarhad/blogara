import catchAsync from '@/lib/utils/catchAsync';
import reqBodyValidator from '@/lib/utils/reqBodyValidator';
import { changePasswordSchema } from '@/lib/validations/auth.validation';
import sendResponse from '@/lib/utils/sendResponse';
import { comparePassword, hashPassword } from '@/lib/utils/authHelper';
import apiAuthValidator from '@/lib/utils/apiAuthValidator';
import prisma from '@/lib/prisma';
import ApiError from '@/lib/utils/ApiError';

export const PATCH = catchAsync(async (req) => {
  await apiAuthValidator(['admin', 'author'])(req);
  const user = req.user!;

  const { oldPassword, newPassword } = await reqBodyValidator(
    changePasswordSchema,
    req,
  );

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: user.userId,
    },
  });

  const isMatch = await comparePassword(oldPassword, userData.password);
  if (!isMatch) throw new ApiError(401, 'Wrong password.');

  const password = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: user.userId },
    data: { password: password, isPasswordChanged: true },
  });

  return sendResponse({ message: 'Password changed successfully' });
});
