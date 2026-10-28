import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ApiErrorResponse } from '../types/api.js';

export const validate = (schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      let dataToValidate;
      if (source === 'query') dataToValidate = req.query;
      else if (source === 'params') dataToValidate = req.params;
      else dataToValidate = req.body;

      
      // Parse the data directly against the schema
      const parsedData = schema.parse(dataToValidate);

      // Replace the request data with the parsed (and possibly coerced) data
      if (source === 'query') (req as any).query = parsedData;
      else if (source === 'params') (req as any).params = parsedData;
      else req.body = parsedData;

      next();
    } catch (error: any) {
      const errorResponse: ApiErrorResponse = {
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: error.errors || error.issues,
        },
      };
      return res.status(400).json(errorResponse);
    }
  };
};

export const formatZodError = (error: any): ApiErrorResponse => {
  return {
    error: {
      code: 'VALIDATION_ERROR',
      message: 'Validation failed',
      details: error.errors || error.issues,
    },
  };
};