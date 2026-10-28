import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { ApiErrorResponse } from '../types/api.js';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    role_id: number;
    permissions: string[];
  };
}

export interface JwtPayload {
  id: number;
  role_id: number;
  permissions: string[];
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const error: ApiErrorResponse = {
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authorization token required',
        },
      };
      return res.status(401).json(error);
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    
    req.user = {
      id: decoded.id,
      role_id: decoded.role_id,
      permissions: decoded.permissions || [],
    };
    
    next();
  } catch (err) {
    const error: ApiErrorResponse = {
      error: {
        code: 'UNAUTHORIZED',
        message: 'Invalid or expired token',
      },
    };
    return res.status(401).json(error);
  }
};
