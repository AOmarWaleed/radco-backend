import { Router } from 'express';
import { z } from 'zod';
import { list, getById, create, update, remove } from './item-code.controller.js';
import { authenticate } from '../../shared/middleware/auth.js';
import { requirePermission } from '../../shared/middleware/requirePermission.js';
import { validate } from '../../shared/validators/common.js';

const createItemCodeSchema = z.object({
  code: z.string().min(1, 'Code is required'),
  name_ar: z.string().min(1, 'Arabic name is required'),
  name_en: z.string().min(1, 'English name is required'),
});

export function itemCodeRoutes(): Router {
  const router = Router();
  router.use(authenticate);

  router.get('/', requirePermission('item_code.view'), list);
  router.get('/:id', requirePermission('item_code.view'), getById);
  router.post('/', requirePermission('item_code.create'), validate(createItemCodeSchema), create);
  router.put('/:id', requirePermission('item_code.edit'), validate(createItemCodeSchema), update);
  router.delete('/:id', requirePermission('item_code.delete'), remove);

  return router;
}