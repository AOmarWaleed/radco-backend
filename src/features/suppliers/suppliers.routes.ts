import { Router } from 'express';
import { z } from 'zod';
import { list, getById, create, update, remove } from './suppliers.controller.js';
import { authenticate } from '../../shared/middleware/auth.js';
import { requirePermission } from '../../shared/middleware/requirePermission.js';
import { validate } from '../../shared/validators/common.js';

const createSupplierSchema = z.object({
  name_ar: z.string().min(1, 'Arabic name is required'),
  name_en: z.string().min(1, 'English name is required'),
  phone: z.string().optional().nullable(),
  email: z.string().email('Invalid email').optional().nullable().or(z.literal('')),
});

export function suppliersRoutes(): Router {
  const router = Router();
  router.use(authenticate); // Apply to all

  router.get('/', requirePermission('suppliers.view'), list);
  router.get('/:id', requirePermission('suppliers.view'), getById);
  router.post('/', requirePermission('suppliers.create'), validate(createSupplierSchema), create);
  router.put('/:id', requirePermission('suppliers.edit'), validate(createSupplierSchema), update);
  router.delete('/:id', requirePermission('suppliers.delete'), remove);

  return router;
}