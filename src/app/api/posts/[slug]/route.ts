import prisma from '@/lib/prisma';
import catchAsync from '@/lib/utils/catchAsync';
import sendResponse from '@/lib/utils/sendResponse';
import ApiError from '@/lib/utils/ApiError';

export const GET = catchAsync<{ slug: string }>(async (req, { params }) => {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
  });
  if (!post) throw new ApiError(404, 'Post not found');

  return sendResponse({
    message: 'Post fetched successfully',
    data: post,
  });
});

export const PATCH = catchAsync<{ slug: string }>(async (req, { params }) => {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
  });
  if (!post) throw new ApiError(404, 'Post not found');

  await prisma.post.update({
    where: {
      id: post.id,
    },
    data: {
      views: post.views + 1,
    },
  });

  return sendResponse({
    message: 'Post read completed.',
  });
});
