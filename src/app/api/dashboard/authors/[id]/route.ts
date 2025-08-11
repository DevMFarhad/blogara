import prisma from '@/lib/prisma';
import catchAsync from '@/lib/utils/catchAsync';
import sendResponse from '@/lib/utils/sendResponse';
import ApiError from '@/lib/utils/ApiError';
import apiAuthValidator from '@/lib/utils/apiAuthValidator';
import reqBodyValidator from '@/lib/utils/reqBodyValidator';
import { updateAuthorSchema } from '@/lib/validations/author.validation';

export const GET = catchAsync<{ id: string }>(async (req, { params }) => {
  await apiAuthValidator(['admin'])(req);

  const { id } = await params;
  const author = await prisma.user.findUnique({
    where: { id, role: 'author' },
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!author) throw new ApiError(404, 'Author not found');

  return sendResponse({
    message: 'Author details fetched successfully',
    data: author,
  });
});

export const PATCH = catchAsync<{ id: string }>(async (req, { params }) => {
  await apiAuthValidator(['admin'])(req);
  const { id } = await params;
  const data = await reqBodyValidator(updateAuthorSchema, req);

  const authorExist = await prisma.user.findUnique({
    where: { id, role: 'author' },
  });

  if (!authorExist) throw new ApiError(404, 'Author not found');

  const updatedAuthor = await prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return sendResponse({
    message: 'Author updated successfully',
    data: updatedAuthor,
  });
});
