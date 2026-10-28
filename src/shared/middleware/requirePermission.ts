import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.js';
import { ApiErrorResponse } from '../types/api.js';

export const requirePermission = (permission: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      const error: ApiErrorResponse = {
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
      };
      return res.status(401).json(error);
    }

    if (!req.user.permissions.includes(permission)) {
      const error: ApiErrorResponse = {
        error: {
          code: 'FORBIDDEN',
          message: 'Insufficient permissions',
        },
      };
      return res.status(403).json(error);
    }

    next();
  };
};
