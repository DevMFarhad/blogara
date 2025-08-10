import prisma from '@/lib/prisma';
import catchAsync from '@/lib/utils/catchAsync';
import sendResponse from '@/lib/utils/sendResponse';
import reqBodyValidator from '@/lib/utils/reqBodyValidator';
import ApiError from '@/lib/utils/ApiError';
import slugify from 'slugify';
import apiAuthValidator from '@/lib/utils/apiAuthValidator';
import { createPostSchema } from '@/lib/validations/post.validation';
import tagCreate from '@/lib/utils/tagCreate';
import getReqMeta from '@/lib/utils/getReqMeta';
import getSearchQuery from '@/lib/utils/getSearchQuery';

export const POST = catchAsync(async (req) => {
  await apiAuthValidator(['admin', 'author'])(req);
  const user = req.user!;
  const body = await reqBodyValidator(createPostSchema, req);

  // check category exist
  const categoryExist = await prisma.category.findUnique({
    where: { id: body.categoryId },
  });

  if (!categoryExist) {
    throw new ApiError(404, 'Category not found.');
  }

  // manage tag for post
  const { tags, ...rest } = body;
  const tagIds = await tagCreate(tags);

  // create slug and create post
  const slug = slugify(body.title, { lower: true, strict: true });

  const post = await prisma.post.create({
    data: {
      slug,
      ...rest,
      authorId: user.userId,
    },
  });

  // link post & tag
  const postTagData = tagIds.map((id) => ({ tagId: id, postId: post.id }));
  await prisma.postTag.createMany({
    data: postTagData,
  });

  const result = await prisma.post.findUnique({
    where: {
      id: post.id,
    },
  });

  return sendResponse({
    statusCode: 201,
    message: 'Blog created successfully',
    data: result,
  });
});

export const GET = catchAsync(async (req) => {
  await apiAuthValidator(['admin', 'author'])(req);
  const user = req.user!;
  const { page, limit, skip } = getReqMeta(req);
  const { search, tagId, categoryId } = getSearchQuery(req, [
    'search',
    'categoryId',
    'tagId',
  ]);

  // Dynamic filtering
  const where: any = {};

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

  if (user.role === 'author') {
    where.authorId = user.userId;
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
