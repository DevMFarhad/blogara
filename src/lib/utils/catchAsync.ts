import { NextRequest, NextResponse } from 'next/server';
import ApiError from './ApiError';

export default function catchAsync(
  handler: (req: NextRequest) => Promise<NextResponse>,
) {
  return async (req: NextRequest) => {
    try {
      return await handler(req);
    } catch (error: any) {
      const status = error instanceof ApiError ? error.statusCode : 500;
      return NextResponse.json(
        { success: false, message: error.message || 'Internal Server Error' },
        { status },
      );
    }
  };
}
