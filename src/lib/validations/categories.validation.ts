import z from 'zod';

export const createCategorySchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
});
