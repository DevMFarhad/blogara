import prisma from '@/lib/prisma';
import catchAsync from '@/lib/utils/catchAsync';
import sendResponse from '@/lib/utils/sendResponse';

export const GET = catchAsync(async (req) => {
  const category = await prisma.category.findMany();
  return sendResponse({
    statusCode: 200,
    message: 'Category fetched successfully',
    data: category,
  });
});
