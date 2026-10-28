import { Router } from 'express';
import { login, me } from './auth.controller.js';
import { loginRateLimit } from '../../shared/middleware/rateLimit.js';
import { authenticate } from '../../shared/middleware/auth.js';
import { validate } from '../../shared/validators/common.js';
import { loginSchema } from './auth.schema.js';

export function authRoutes(): Router {
  const router = Router();
  router.post('/login', loginRateLimit, validate(loginSchema), login);
  router.get('/me', authenticate, me);
  return router;
}
