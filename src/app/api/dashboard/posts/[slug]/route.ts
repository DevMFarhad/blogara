import prisma from '@/lib/prisma';
import catchAsync from '@/lib/utils/catchAsync';
import sendResponse from '@/lib/utils/sendResponse';
import ApiError from '@/lib/utils/ApiError';
import apiAuthValidator from '@/lib/utils/apiAuthValidator';
import reqBodyValidator from '@/lib/utils/reqBodyValidator';
import { updatePostSchema } from '@/lib/validations/post.validation';
import tagCreate from '@/lib/utils/tagCreate';

export const PATCH = catchAsync(async (req, { params }) => {
  await apiAuthValidator(['admin', 'author'])(req);
  const user = req.user!;

  const { slug } = await params;

  const postExist = await prisma.post.findUnique({
    where: { slug },
  });
  if (!postExist) throw new ApiError(404, 'Post not found');
  if (user.role !== 'admin' && postExist.authorId !== user.userId)
    throw new ApiError(403, 'You are not allowed to update this post');

  const { tags, ...rest } = await reqBodyValidator(updatePostSchema, req);

  const result = await prisma.$transaction(async (tx) => {
    // Update post data
    const post = await tx.post.update({
      where: { id: postExist.id },
      data: rest,
    });

    if (tags && tags.length > 0) {
      await tx.postTag.deleteMany({ where: { postId: post.id } });

      // Pass tx to tagCreate to reuse transaction client (implement this in tagCreate)
      const tagIds = await tagCreate(tags, tx);

      const postTags = tagIds.map((tagId) => ({ tagId, postId: post.id }));
      await tx.postTag.createMany({ data: postTags });
    }

    // Return updated post with relations inside transaction to ensure consistency
    return tx.post.findUnique({
      where: { id: post.id },
      include: {
        author: { select: { id: true, name: true, email: true, avatar: true } },
        category: true,
        tags: { include: { tag: true } },
      },
    });
  });

  return sendResponse({
    message: 'Blog updated successfully',
    data: result,
  });
});
