import { NextRequest, NextResponse } from 'next/server';
import ApiError from './ApiError';

export default function catchAsync<
  Params extends Record<string, string> = Record<string, string>,
>(
  handler: (
    req: NextRequest,
    context: { params: Params },
  ) => Promise<NextResponse>,
) {
  return async (req: NextRequest, context: { params: Params }) => {
    try {
      return await handler(req, context);
    } catch (error: any) {
      const status = error instanceof ApiError ? error.statusCode : 500;
      return NextResponse.json(
        { success: false, message: error.message || 'Internal Server Error' },
        { status },
      );
    }
  };
}
