import { pool } from '../../db/pool.js';

export async function listWarehouses() {
  const result = await pool.query('SELECT * FROM warehouses ORDER BY id DESC');
  return result.rows;
}

export async function getWarehouse(id: number) {
  const result = await pool.query('SELECT * FROM warehouses WHERE id = $1', [id]);
  return result.rows[0];
}

export async function createWarehouse(data: { name_ar: string; name_en: string; location?: string }, userId: number) {
  const result = await pool.query(
    `INSERT INTO warehouses (name_ar, name_en, location, created_by) 
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [data.name_ar, data.name_en, data.location || null, userId]
  );
  return result.rows[0];
}

export async function updateWarehouse(id: number, data: { name_ar: string; name_en: string; location?: string }, userId: number) {
  const result = await pool.query(
    `UPDATE warehouses 
     SET name_ar = $1, name_en = $2, location = $3, modification_at = NOW(), modification_by = $4 
     WHERE id = $5 RETURNING *`,
    [data.name_ar, data.name_en, data.location || null, userId, id]
  );
  return result.rows[0];
}

export async function deleteWarehouse(id: number) {
  await pool.query('DELETE FROM warehouses WHERE id = $1', [id]);
  return { success: true };
}