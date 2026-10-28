import { Response } from 'express';
import { AuthRequest } from '../../shared/middleware/auth.js';
import { asyncHandler } from '../../shared/utils/asyncHandler.js';
import { listSuppliers, getSupplier, createSupplier, updateSupplier, deleteSupplier } from './suppliers.service.js';

export const list = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await listSuppliers();
  res.json({ data: result });
});

export const getById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await getSupplier(Number(req.params.id));
  if (!result) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Supplier not found' } });
  res.json({ data: result });
});

export const create = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await createSupplier(req.body, req.user!.id);
  res.status(201).json({ data: result });
});

export const update = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await updateSupplier(Number(req.params.id), req.body, req.user!.id);
  if (!result) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Supplier not found' } });
  res.json({ data: result });
});

export const remove = asyncHandler(async (req: AuthRequest, res: Response) => {
  await deleteSupplier(Number(req.params.id));
  res.json({ success: true });
});