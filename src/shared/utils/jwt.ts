import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { JwtPayload } from '../middleware/auth.js';

export const signToken = (payload: JwtPayload): string => {
  // @ts-ignore
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
};
