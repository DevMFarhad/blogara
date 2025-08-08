import { NextResponse } from 'next/server';

interface IResMeta {
  total: number;
  limit: number;
  page: number;
}

interface ResponseProps<T> {
  statusCode?: number;
  success?: boolean;
  message?: string;
  data?: T;
  meta?: IResMeta;
}

const sendResponse = <T>({
  statusCode = 200,
  success = true,
  message = 'Success',
  data,
  meta,
}: ResponseProps<T>) => {
  return NextResponse.json(
    { success, message, meta, data },
    { status: statusCode },
  );
};

export default sendResponse;
