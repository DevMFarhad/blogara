import z from 'zod';

export const createPostSchema = z.object({
  title: z.string().min(3),
  thumbnail: z.url().optional(),
  description: z.string().min(10),
  content: z.string().min(20),
  readingTime: z.string(),
  categoryId: z.string(),
  tags: z.array(z.string()),
});

export const updatePostSchema = z.object({
  title: z.string().min(3).optional(),
  thumbnail: z.url().optional(),
  description: z.string().min(10).optional(),
  content: z.string().min(20).optional(),
  readingTime: z.string().optional(),
  categoryId: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const publishedPostStatus = z.object({
  message: z.string(),
});
