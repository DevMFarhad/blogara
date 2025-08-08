import catchAsync from '@/lib/utils/catchAsync';
import sendResponse from '@/lib/utils/sendResponse';
import prisma from '@/lib/prisma';
import apiAuthValidator from '@/lib/utils/apiAuthValidator';
import reqBodyValidator from '@/lib/utils/reqBodyValidator';
import { updateProfileSchema } from '@/lib/validations/profile.validation';

export const GET = catchAsync(async (req) => {
  await apiAuthValidator(['admin', 'author'])(req);
  const user = req.user!;
  const profile = await prisma.user.findUnique({
    where: { id: user.userId },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return sendResponse({
    message: 'Profile fetched successfully',
    data: profile,
  });
});

export const PATCH = catchAsync(async (req) => {
  await apiAuthValidator(['admin', 'author'])(req);
  const user = req.user!;
  const body = await reqBodyValidator(updateProfileSchema, req);

  const updatedUser = await prisma.user.update({
    where: { id: user.userId },
    data: body,
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      role: true,
      updatedAt: true,
    },
  });

  return sendResponse({
    message: 'Profile updated successfully',
    data: updatedUser,
  });
});
