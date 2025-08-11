import z, { email } from 'zod';

export const subscribeSchema = z.object({
  email: z.email(),
  name: z.string(),
  selectedCategory: z.string(),
});

export const unsubscribeSchema = z.object({
  email: z.email(),
  id: z.string(),
});
