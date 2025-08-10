import prisma from '@/lib/prisma';
import catchAsync from '@/lib/utils/catchAsync';
import sendResponse from '@/lib/utils/sendResponse';
import ApiError from '@/lib/utils/ApiError';
import reqBodyValidator from '@/lib/utils/reqBodyValidator';
import { createAuthorSchema } from '@/lib/validations/author.validation';
import apiAuthValidator from '@/lib/utils/apiAuthValidator';
import generatePassword from '@/lib/utils/generatePassword';
import { hashPassword } from '@/lib/utils/authHelper';
import sendAuthorMail from '@/lib/utils/mail/sendAuthorMail';
import getSearchQuery from '@/lib/utils/getSearchQuery';
import { USER_ROLE } from '@prisma/client';
import getReqMeta from '@/lib/utils/getReqMeta';

export const POST = catchAsync(async (req) => {
  await apiAuthValidator(['admin'])(req);
  const { email, name, avatar } = await reqBodyValidator(
    createAuthorSchema,
    req,
  );

  // Check if user exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new ApiError(400, 'Email already exists');

  const password = generatePassword();
  const hashedPassword = await hashPassword(password);

  const author = await prisma.user.create({
    data: {
      email,
      name,
      avatar,
      password: hashedPassword,
      role: 'author',
    },
  });

  // send password to email
  sendAuthorMail({
    userName: author.name,
    email: author.email,
    password: password,
  });

  const { password: _, ...authorData } = author;

  return sendResponse({
    statusCode: 201,
    message: 'Author created successfully',
    data: authorData,
  });
});

export const GET = catchAsync(async (req) => {
  await apiAuthValidator(['admin'])(req);

  const { search } = getSearchQuery(req, ['search']);
  const { page, limit, skip } = getReqMeta(req);

  // Dynamic filtering
  const where: any = {
    role: USER_ROLE.author,
  };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [authors, total] = await Promise.all([
    prisma.user.findMany({
      where: where,
      skip,
      take: limit,
      orderBy: { updatedAt: 'desc' },
      select: {
        name: true,
        email: true,
        avatar: true,
        id: true,
        isPasswordChanged: true,
        updatedAt: true,
      },
    }),
    prisma.user.count({ where }),
  ]);

  return sendResponse({
    message: 'Author fetched successfully.',
    data: authors,
    meta: {
      page,
      limit,
      total,
    },
  });
});
