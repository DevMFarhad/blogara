import prisma from '@/lib/prisma';
import apiAuthValidator from '@/lib/utils/apiAuthValidator';
import ApiError from '@/lib/utils/ApiError';
import catchAsync from '@/lib/utils/catchAsync';
import sendPostEmail from '@/lib/utils/mail/sendPostEmail';
import reqBodyValidator from '@/lib/utils/reqBodyValidator';
import sendResponse from '@/lib/utils/sendResponse';
import { publishedPostStatus } from '@/lib/validations/post.validation';

export const PATCH = catchAsync<{ slug: string }>(async (req, { params }) => {
  await apiAuthValidator(['admin'])(req);
  const { slug } = await params;
  const { message } = await reqBodyValidator(publishedPostStatus, req);

  const postExist = await prisma.post.findUnique({
    where: { slug },
  });

  if (!postExist) throw new ApiError(404, 'Post not found');

  await prisma.post.update({
    where: {
      id: postExist.id,
    },
    data: {
      isPublished: true,
    },
  });

  const subscribers = await prisma.subscriber.findMany({
    where: {
      isActive: true,
      interestedCategoryId: postExist.categoryId,
    },
  });

  // send mail to subscriber with a message and post link
  await Promise.all(
    subscribers.map((subscriber) =>
      sendPostEmail({
        slug: postExist.slug,
        title: postExist.title,
        message,
        subscriberName: subscriber.name,
        subscriberEmail: subscriber.email,
        subscriberId: subscriber.id,
      }),
    ),
  );

  return sendResponse({
    message: 'Post published.',
  });
});
