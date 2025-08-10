import z from 'zod';

export const createAuthorSchema = z.object({
  email: z.email(),
  name: z.string().min(2),
  avatar: z.url().optional(),
});

export const updateAuthorSchema = z.object({
  name: z.string().min(2).optional(),
  avatar: z.url().optional(),
  email: z.email().optional(),
  isActive: z.boolean().optional(),
});
