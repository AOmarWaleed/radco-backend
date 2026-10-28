import { Router } from 'express';
import { z } from 'zod';
import { list, create, update, itemCodeSearch } from './inventory.controller.js';
import { authenticate } from '../../shared/middleware/auth.js';
import { requirePermission } from '../../shared/middleware/requirePermission.js';
import { validate } from '../../shared/validators/common.js';

// --- Zod Schemas ---
const itemsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  action_type: z.string().optional(),
});

const createItemSchema = z.object({
  item_code_id: z.number().optional(), // Can send either item_code_id
  code: z.string().optional(),         // Or code/name to auto-create
  name_ar: z.string().optional(),
  name_en: z.string().optional(),
  unit: z.string().optional(),
  quantity: z.coerce.number().min(0),
  warehouse_id: z.coerce.number().optional().nullable(),
  employee_id: z.coerce.number().optional().nullable(),
  supplier_id: z.coerce.number().optional().nullable(),
  installation_site: z.string().optional().nullable(),
  action_type: z.enum(['IN', 'OUT', 'BALANCE']),
  action_date: z.string().optional().nullable(),
});

const updateItemSchema = createItemSchema.partial(); // All fields optional for update

// --- Routes ---
export function inventoryRoutes(): Router {
  const router = Router();
  router.use(authenticate); // All routes require login

  router.get('/items', requirePermission('inventory.view'), validate(itemsQuerySchema, 'query'), list);
  router.post('/items', requirePermission('inventory.create'), validate(createItemSchema), create);
  router.put('/items/:id', requirePermission('inventory.edit'), validate(updateItemSchema), update);
  
  // Route to auto-complete item codes
  router.get('/item-codes/search', requirePermission('item_code.view'), itemCodeSearch);

  return router;
}