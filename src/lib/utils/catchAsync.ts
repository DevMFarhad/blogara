import { NextRequest, NextResponse } from 'next/server';
import ApiError from './ApiError';

export default function catchAsync<
  Params extends Record<string, any> | undefined = undefined,
>(
  handler: Params extends Record<string, any>
    ? (
        req: NextRequest,
        context: { params: Promise<Params> },
      ) => Promise<NextResponse>
    : (req: NextRequest) => Promise<NextResponse>,
) {
  return async (
    req: NextRequest,
    ...args: Params extends Record<string, any>
      ? [context: { params: Promise<Params> }]
      : []
  ) => {
    try {
      // @ts-expect-error TS can't perfectly infer spread args here
      return await handler(req, ...args);
    } catch (error: any) {
      const status = error instanceof ApiError ? error.statusCode : 500;
      return NextResponse.json(
        { success: false, message: error.message || 'Internal Server Error' },
        { status },
      );
    }
  };
}
