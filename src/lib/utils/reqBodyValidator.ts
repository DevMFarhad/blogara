import { ZodSchema } from 'zod';
import ApiError from './ApiError';

const reqBodyValidator = async <T>(
  schema: ZodSchema<T>,
  req: Request,
): Promise<T> => {
  try {
    const body = await req.json();
    return await schema.parseAsync(body);
  } catch (error: any) {
    throw new ApiError(500, error.message || 'Validation failed');
  }
};

export default reqBodyValidator;
