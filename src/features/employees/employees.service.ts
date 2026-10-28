import { pool } from '../../db/pool.js';

export async function listEmployees() {
  const result = await pool.query('SELECT * FROM employees ORDER BY id DESC');
  return result.rows;
}

export async function getEmployee(id: number) {
  const result = await pool.query('SELECT * FROM employees WHERE id = $1', [id]);
  return result.rows[0];
}

export async function createEmployee(data: { name_ar: string; name_en: string; employee_type: string }, userId: number) {
  const result = await pool.query(
    `INSERT INTO employees (name_ar, name_en, employee_type, created_by) 
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [data.name_ar, data.name_en, data.employee_type, userId]
  );
  return result.rows[0];
}

export async function updateEmployee(id: number, data: { name_ar: string; name_en: string; employee_type: string }, userId: number) {
  const result = await pool.query(
    `UPDATE employees 
     SET name_ar = $1, name_en = $2, employee_type = $3, modification_at = NOW(), modification_by = $4 
     WHERE id = $5 RETURNING *`,
    [data.name_ar, data.name_en, data.employee_type, userId, id]
  );
  return result.rows[0];
}

export async function deleteEmployee(id: number) {
  await pool.query('DELETE FROM employees WHERE id = $1', [id]);
  return { success: true };
}