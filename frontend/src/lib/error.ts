export class AppError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function appError(message: string, statusCode: number) {
  return new AppError(message, statusCode);
}
