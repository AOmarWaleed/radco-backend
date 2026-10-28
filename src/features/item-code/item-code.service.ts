import { pool } from '../../db/pool.js';

export async function listItemCodes() {
  const result = await pool.query('SELECT * FROM item_code ORDER BY id DESC');
  return result.rows;
}

export async function getItemCode(id: number) {
  const result = await pool.query('SELECT * FROM item_code WHERE id = $1', [id]);
  return result.rows[0];
}

export async function createItemCode(data: { code: string; name_ar: string; name_en: string }, userId: number) {
  const result = await pool.query(
    `INSERT INTO item_code (code, name_ar, name_en, created_by) 
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [data.code, data.name_ar, data.name_en, userId]
  );
  return result.rows[0];
}

export async function updateItemCode(id: number, data: { code: string; name_ar: string; name_en: string }, userId: number) {
  const result = await pool.query(
    `UPDATE item_code 
     SET code = $1, name_ar = $2, name_en = $3, modification_at = NOW(), modification_by = $4 
     WHERE id = $5 RETURNING *`,
    [data.code, data.name_ar, data.name_en, userId, id]
  );
  return result.rows[0];
}

export async function deleteItemCode(id: number) {
  await pool.query('DELETE FROM item_code WHERE id = $1', [id]);
  return { success: true };
}