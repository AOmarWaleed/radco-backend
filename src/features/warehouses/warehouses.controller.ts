import { Response } from 'express';
import { AuthRequest } from '../../shared/middleware/auth.js';
import { asyncHandler } from '../../shared/utils/asyncHandler.js';
import { listWarehouses, getWarehouse, createWarehouse, updateWarehouse, deleteWarehouse } from './warehouses.service.js';

export const list = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await listWarehouses();
  res.json({ data: result });
});

export const getById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await getWarehouse(Number(req.params.id));
  if (!result) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Warehouse not found' } });
  res.json({ data: result });
});

export const create = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await createWarehouse(req.body, req.user!.id);
  res.status(201).json({ data: result });
});

export const update = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await updateWarehouse(Number(req.params.id), req.body, req.user!.id);
  if (!result) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Warehouse not found' } });
  res.json({ data: result });
});

export const remove = asyncHandler(async (req: AuthRequest, res: Response) => {
  await deleteWarehouse(Number(req.params.id));
  res.json({ success: true });
});