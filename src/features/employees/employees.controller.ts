import { Response } from 'express';
import { AuthRequest } from '../../shared/middleware/auth.js';
import { asyncHandler } from '../../shared/utils/asyncHandler.js';
import { listEmployees, getEmployee, createEmployee, updateEmployee, deleteEmployee } from './employees.service.js';

export const list = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await listEmployees();
  // Assuming pagination will be added later, returning array directly for now
  res.json({ data: result }); 
});

export const getById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await getEmployee(Number(req.params.id));
  if (!result) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Employee not found' } });
  res.json({ data: result });
});

export const create = asyncHandler(async (req: AuthRequest, res: Response) => {
  // Pass req.user!.id for audit
  
  const result = await createEmployee(req.body, req.user!.id);
  res.status(201).json({ data: result });
});

export const update = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await updateEmployee(Number(req.params.id), req.body, req.user!.id);
  if (!result) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Employee not found' } });
  res.json({ data: result });
});

export const remove = asyncHandler(async (req: AuthRequest, res: Response) => {
  await deleteEmployee(Number(req.params.id));
  res.json({ success: true });
});