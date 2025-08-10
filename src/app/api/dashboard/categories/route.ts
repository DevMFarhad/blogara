import prisma from '@/lib/prisma';
import apiAuthValidator from '@/lib/utils/apiAuthValidator';
import ApiError from '@/lib/utils/ApiError';
import catchAsync from '@/lib/utils/catchAsync';
import reqBodyValidator from '@/lib/utils/reqBodyValidator';
import sendResponse from '@/lib/utils/sendResponse';
import { createCategorySchema } from '@/lib/validations/categories.validation';

export const POST = catchAsync(async (req) => {
  await apiAuthValidator(['admin'])(req);

  const { title } = await reqBodyValidator(createCategorySchema, req);

  const exists = await prisma.category.findUnique({ where: { title } });
  if (exists) throw new ApiError(400, 'Category already exists');

  const category = await prisma.category.create({ data: { title } });

  return sendResponse({
    statusCode: 201,
    message: 'Category created successfully',
    data: category,
  });
});
