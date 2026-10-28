import { Response } from 'express';
import { AuthRequest } from '../../shared/middleware/auth.js';
import { asyncHandler } from '../../shared/utils/asyncHandler.js';
import { listItems, createItem, searchItemCodes, updateItem } from './inventory.service.js';

export const list = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page = 1, limit = 10, search, action_type } = (req.query || {}) as any;
  const result = await listItems({ page: Number(page), limit: Number(limit), search, action_type });
  res.json(result);
});

export const create = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await createItem(req.body, req.user!.id);
  res.status(201).json({ data: result });
});

export const update = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await updateItem(Number(req.params.id), req.body, req.user!.id);
  res.json({ data: result });
});

export const itemCodeSearch = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { q } = req.query as any;
  const result = await searchItemCodes({ q: q || '' });
  res.json({ data: result });
});