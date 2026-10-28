import { Request, Response } from 'express';
import { loginUser, getCurrentUser } from './auth.service.js';
import { AuthRequest } from '../../shared/middleware/auth.js';
import { asyncHandler } from '../../shared/utils/asyncHandler.js';
import { AppError } from '../../shared/middleware/error.js';

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Email and password are required');
  }
  const result = await loginUser({ email, password });
  res.json(result);
});

export const me = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError(401, 'UNAUTHORIZED', 'Authentication required');
  }
  const result = await getCurrentUser(req.user.id);
  res.json(result);
});
