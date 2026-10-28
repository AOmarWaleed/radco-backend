import { pool } from '../../db/pool.js';

export async function listSuppliers() {
  const result = await pool.query('SELECT * FROM suppliers ORDER BY id DESC');
  return result.rows;
}

export async function getSupplier(id: number) {
  const result = await pool.query('SELECT * FROM suppliers WHERE id = $1', [id]);
  return result.rows[0];
}

export async function createSupplier(data: { name_ar: string; name_en: string; phone?: string; email?: string }, userId: number) {
  const result = await pool.query(
    `INSERT INTO suppliers (name_ar, name_en, phone, email, created_by) 
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [data.name_ar, data.name_en, data.phone || null, data.email || null, userId]
  );
  return result.rows[0];
}

export async function updateSupplier(id: number, data: { name_ar: string; name_en: string; phone?: string; email?: string }, userId: number) {
  const result = await pool.query(
    `UPDATE suppliers 
     SET name_ar = $1, name_en = $2, phone = $3, email = $4, modification_at = NOW(), modification_by = $5 
     WHERE id = $6 RETURNING *`,
    [data.name_ar, data.name_en, data.phone || null, data.email || null, userId, id]
  );
  return result.rows[0];
}

export async function deleteSupplier(id: number) {
  await pool.query('DELETE FROM suppliers WHERE id = $1', [id]);
  return { success: true };
}