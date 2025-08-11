import env from '@/config/env';
import prisma from '@/lib/prisma';
import ApiError from '@/lib/utils/ApiError';
import { comparePassword, jwtSign } from '@/lib/utils/authHelper';
import catchAsync from '@/lib/utils/catchAsync';
import sendSubscribeMail from '@/lib/utils/mail/sendSubscribeMail';
import reqBodyValidator from '@/lib/utils/reqBodyValidator';
import sendResponse from '@/lib/utils/sendResponse';
import {
  subscribeSchema,
  unsubscribeSchema,
} from '@/lib/validations/subscribe.validation';

export const POST = catchAsync(async (req) => {
  const { email, name, selectedCategory } = await reqBodyValidator(
    subscribeSchema,
    req,
  );

  const subscribe = await prisma.subscriber.upsert({
    where: {
      email: email,
    },
    create: {
      email,
      name,
      interestedCategoryId: selectedCategory,
    },
    update: {
      isActive: true,
      name: name,
      interestedCategoryId: selectedCategory,
    },
  });

  await sendSubscribeMail({
    name: subscribe.name,
    email: subscribe.email,
    id: subscribe.id,
  });

  return sendResponse({
    statusCode: 201,
    message: 'Subscribed successfully.',
    data: subscribe,
  });
});

export const PATCH = catchAsync(async (req) => {
  const body = await reqBodyValidator(unsubscribeSchema, req);

  // validate email and id
  const subscribe = await prisma.subscriber.findUnique({
    where: {
      email: body.email,
      id: body.id,
    },
  });

  if (!subscribe) {
    throw new ApiError(400, 'Invalidate: You entered wrong email.');
  }

  await prisma.subscriber.update({
    where: {
      id: body.id,
    },
    data: {
      isActive: false,
    },
  });

  return sendResponse({
    message: 'Unsubscribed successfully.',
  });
});
