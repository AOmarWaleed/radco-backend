import { Response } from 'express';
import { AuthRequest } from '../../shared/middleware/auth.js';
import { asyncHandler } from '../../shared/utils/asyncHandler.js';
import { listItemCodes, getItemCode, createItemCode, updateItemCode, deleteItemCode } from './item-code.service.js';

export const list = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await listItemCodes();
  res.json({ data: result });
});

export const getById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await getItemCode(Number(req.params.id));
  if (!result) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Item code not found' } });
  res.json({ data: result });
});

export const create = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await createItemCode(req.body, req.user!.id);
  res.status(201).json({ data: result });
});

export const update = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await updateItemCode(Number(req.params.id), req.body, req.user!.id);
  if (!result) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Item code not found' } });
  res.json({ data: result });
});

export const remove = asyncHandler(async (req: AuthRequest, res: Response) => {
  await deleteItemCode(Number(req.params.id));
  res.json({ success: true });
});