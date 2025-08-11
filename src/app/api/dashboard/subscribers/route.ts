import prisma from '@/lib/prisma';
import apiAuthValidator from '@/lib/utils/apiAuthValidator';
import catchAsync from '@/lib/utils/catchAsync';
import getReqMeta from '@/lib/utils/getReqMeta';
import getSearchQuery from '@/lib/utils/getSearchQuery';
import sendResponse from '@/lib/utils/sendResponse';

export const GET = catchAsync(async (req) => {
  await apiAuthValidator(['admin'])(req);

  const { limit, page, skip } = getReqMeta(req);
  const { search, isActive } = getSearchQuery(req, ['search', 'isActive']);

  const where: any = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (isActive !== undefined && isActive !== null) {
    where.isActive = isActive === 'true' || isActive === true;
  }

  const subscribers = await prisma.subscriber.findMany({
    where,
    skip,
    take: limit,
    orderBy: {
      updatedAt: 'desc',
    },
    select: {
      interestedCategory: true,
    },
  });
  const total = await prisma.subscriber.count({ where });

  return sendResponse({
    message: 'Subscriber fetched successfully.',
    meta: {
      limit,
      page,
      total,
    },
    data: subscribers,
  });
});
