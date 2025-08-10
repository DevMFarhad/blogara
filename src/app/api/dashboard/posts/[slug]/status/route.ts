import prisma from '@/lib/prisma';
import apiAuthValidator from '@/lib/utils/apiAuthValidator';
import ApiError from '@/lib/utils/ApiError';
import catchAsync from '@/lib/utils/catchAsync';
import reqBodyValidator from '@/lib/utils/reqBodyValidator';
import sendResponse from '@/lib/utils/sendResponse';
import { updateBlogStatus } from '@/lib/validations/post.validation';

export const PATCH = catchAsync(async (req, { params }) => {
  await apiAuthValidator(['admin'])(req);

  const { slug } = await params;

  const postExist = await prisma.post.findUnique({
    where: { slug },
  });

  if (!postExist) throw new ApiError(404, 'Post not found');

  const { isPublished } = await reqBodyValidator(updateBlogStatus, req);

  await prisma.post.update({
    where: {
      id: postExist.id,
    },
    data: {
      isPublished,
    },
  });

  return sendResponse({
    message: 'Post status updated.',
  });
});
