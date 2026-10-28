import { Router } from 'express';
import { z } from 'zod';
import { list, getById, create, update, remove } from './warehouses.controller.js';
import { authenticate } from '../../shared/middleware/auth.js';
import { requirePermission } from '../../shared/middleware/requirePermission.js';
import { validate } from '../../shared/validators/common.js';

const createWarehouseSchema = z.object({
  name_ar: z.string().min(1, 'Arabic name is required'),
  name_en: z.string().min(1, 'English name is required'),
  location: z.string().optional().nullable(),
});

export function warehousesRoutes(): Router {
  const router = Router();
  router.use(authenticate);

  router.get('/', requirePermission('warehouses.view'), list);
  router.get('/:id', requirePermission('warehouses.view'), getById);
  router.post('/', requirePermission('warehouses.create'), validate(createWarehouseSchema), create);
  router.put('/:id', requirePermission('warehouses.edit'), validate(createWarehouseSchema), update);
  router.delete('/:id', requirePermission('warehouses.delete'), remove);

  return router;
}