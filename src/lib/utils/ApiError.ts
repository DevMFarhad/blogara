export default class ApiError extends Error {
  public statusCode: number;

  constructor(statusCode = 500, message = 'Internal Server Error', stack = '') {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
