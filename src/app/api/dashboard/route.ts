import prisma from '@/lib/prisma';
import catchAsync from '@/lib/utils/catchAsync';
import apiAuthValidator from '@/lib/utils/apiAuthValidator';
import sendResponse from '@/lib/utils/sendResponse';

export const GET = catchAsync(async (req) => {
  await apiAuthValidator(['admin', 'author'])(req);
  const user = req.user!;

  if (user.role === 'author') {
    const [totalPostCount, publishedPostsCount, unpublishedPostCount] =
      await Promise.all([
        prisma.post.count({ where: { authorId: user.id } }),
        prisma.post.count({ where: { authorId: user.id, isPublished: true } }),
        prisma.post.count({ where: { authorId: user.id, isPublished: false } }),
      ]);

    return sendResponse({
      success: true,
      data: {
        totalPostCount,
        publishedPostsCount,
        unpublishedPostCount,
      },
    });
  } else {
    const [
      totalPosts,
      publishedPosts,
      unpublishedPosts,
      totalUsers,
      activeUsers,
      inactiveUsers,
      totalSubscribers,
      activeSubscribers,
      inactiveSubscribers,
    ] = await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { isPublished: true } }),
      prisma.post.count({ where: { isPublished: false } }),
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.user.count({ where: { isActive: false } }),
      prisma.subscriber.count(),
      prisma.subscriber.count({ where: { isActive: true } }),
      prisma.subscriber.count({ where: { isActive: false } }),
    ]);

    return sendResponse({
      success: true,
      data: {
        posts: {
          total: totalPosts,
          published: publishedPosts,
          unpublished: unpublishedPosts,
        },
        users: {
          total: totalUsers,
          active: activeUsers,
          inactive: inactiveUsers,
        },
        subscribers: {
          total: totalSubscribers,
          active: activeSubscribers,
          inactive: inactiveSubscribers,
        },
      },
    });
  }
});
