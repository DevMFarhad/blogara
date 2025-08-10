import prisma from '@/lib/prisma';
import catchAsync from '@/lib/utils/catchAsync';
import getReqMeta from '@/lib/utils/getReqMeta';
import getSearchQuery from '@/lib/utils/getSearchQuery';
import sendResponse from '@/lib/utils/sendResponse';

export const GET = catchAsync(async (req) => {
  const { page, limit, skip } = getReqMeta(req);
  const { search, tagId, categoryId } = getSearchQuery(req, [
    'search',
    'categoryId',
    'tagId',
  ]);

  // Dynamic filtering
  const where: any = {
    isPublished: true,
  };

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (tagId) {
    where.tags = {
      some: {
        tagId,
      },
    };
  }

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      skip,
      take: limit,
      orderBy: { updatedAt: 'desc' },
      include: {
        author: { select: { id: true, name: true, email: true, avatar: true } },
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    }),
    prisma.post.count({ where }),
  ]);

  return sendResponse({
    message: 'Posts fetched successfully',
    data: posts,
    meta: {
      total: total,
      limit: limit,
      page: page,
    },
  });
});
