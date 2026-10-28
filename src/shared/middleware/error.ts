import { Request, Response, NextFunction } from 'express';
import { ApiErrorResponse } from '../types/api.js';
import { getMessage, Lang } from '../i18n/messages.js';

export class AppError extends Error {
  statusCode: number;
  code: string;
  details?: any;

  constructor(statusCode: number, code: string, message: string, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.name = 'AppError';
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const lang = (req as any).lang || 'ar';
  
  if (err instanceof AppError) {
    const messageKey = err.code as keyof typeof import('../i18n/messages.js').messages.en;
    const localizedMessage = getMessage(lang as Lang, messageKey) || err.message;
    const errorResponse: ApiErrorResponse = {
      error: {
        code: err.code,
        message: localizedMessage,
        ...(err.details && { details: err.details }),
      },
    };
    return res.status(err.statusCode).json(errorResponse);
  }

  console.error('Unexpected error:', err);
  
  const errorResponse: ApiErrorResponse = {
    error: {
      code: 'INTERNAL_ERROR',
      message: getMessage(lang as Lang, 'INTERNAL_ERROR'),
    },
  };
  return res.status(500).json(errorResponse);
};
