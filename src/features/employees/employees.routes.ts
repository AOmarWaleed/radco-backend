import { Router } from 'express';
import { z } from 'zod';
import { list, getById, create, update, remove } from './employees.controller.js';
import { authenticate } from '../../shared/middleware/auth.js';
import { requirePermission } from '../../shared/middleware/requirePermission.js';
import { validate } from '../../shared/validators/common.js';

const createEmployeeSchema = z.object({
  name_ar: z.string().min(1),
  name_en: z.string().min(1),
  employee_type: z.string().min(1), // You can use z.enum(['STOREKEEPER', 'RECEIVER']) if strictly enforced
});

export function employeesRoutes(): Router {
  const router = Router();
  router.use(authenticate); // Apply to all routes below

  router.get('/', requirePermission('employees.view'), list);
  router.get('/:id', requirePermission('employees.view'), getById);
  router.post('/', requirePermission('employees.create'), validate(createEmployeeSchema), create);
  router.put('/:id', requirePermission('employees.edit'), validate(createEmployeeSchema), update);
  router.delete('/:id', requirePermission('employees.delete'), remove);
  
  return router;
}