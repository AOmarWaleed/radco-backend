import { pool } from '../../db/pool.js';

export interface InventoryItem {
  item_id: number;
  item_code_id: number;
  code: string;
  name_ar: string;
  name_en: string;
  unit: string | null;
  quantity: string;
  warehouse_id: number | null;
  warehouse_name_ar: string | null;
  employee_id: number | null;
  employee_name_ar: string | null;
  supplier_id: number | null;
  supplier_name_ar: string | null;
  installation_site: string | null;
  action_type: string;
  action_date: string | null;
  created_at: Date;
  created_by: number | null;
}

export async function listItems(input: { page: number; limit: number; search?: string; action_type?: string }): Promise<{
  data: InventoryItem[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}> {
  const client = await pool.connect();
  try {
    const offset = (input.page - 1) * input.limit;
    let whereClause = 'WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    if (input.search && input.search.trim()) {
      whereClause += ` AND (ic.code ILIKE $${paramIndex} OR ic.name_ar ILIKE $${paramIndex} OR ic.name_en ILIKE $${paramIndex})`;
      params.push(`%${input.search.trim()}%`);
      paramIndex++;
    }

    if (input.action_type) {
      whereClause += ` AND i.action_type = $${paramIndex}`;
      params.push(input.action_type);
      paramIndex++;
    }

    const countQuery = `SELECT COUNT(*) as total FROM items i JOIN item_code ic ON ic.id = i.item_code_id ${whereClause}`;
    const countResult = await client.query(countQuery, params);
    const total = parseInt(countResult.rows[0].total);

    const dataQuery = `
      SELECT 
        i.item_id, i.item_code_id, ic.code, ic.name_ar, ic.name_en, 
        i.unit, i.quantity, 
        i.warehouse_id, w.name_ar as warehouse_name_ar, 
        i.employee_id, e.name_ar as employee_name_ar,
        i.supplier_id, s.name_ar as supplier_name_ar,
        i.installation_site, i.action_type, i.action_date, i.created_at, i.created_by
      FROM items i
      JOIN item_code ic ON ic.id = i.item_code_id
      LEFT JOIN warehouses w ON w.id = i.warehouse_id
      LEFT JOIN employees e ON e.id = i.employee_id
      LEFT JOIN suppliers s ON s.id = i.supplier_id
      ${whereClause}
      ORDER BY i.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    params.push(input.limit, offset);

    const dataResult = await client.query(dataQuery, params);
    const totalPages = Math.ceil(total / input.limit);

    return {
      data: dataResult.rows,
      pagination: { page: input.page, limit: input.limit, total, totalPages },
    };
  } finally {
    client.release();
  }
}

export async function searchItemCodes(input: { q: string }) {
  const query = `%${input.q.trim()}%`;
  const result = await pool.query(
    `SELECT id, code, name_ar, name_en FROM item_code WHERE code ILIKE $1 OR name_ar ILIKE $1 OR name_en ILIKE $1 ORDER BY code LIMIT 20`,
    [query]
  );
  return result.rows;
}

export async function createItem(input: any, createdBy: number) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Auto-create item_code if it doesn't exist (though usually it should exist from the Item Code page)
    let itemCodeId = input.item_code_id;
    if (!itemCodeId && input.code) {
       const icResult = await client.query(
         `INSERT INTO item_code (code, name_ar, name_en, created_by) 
          VALUES ($1, $2, $3, $4) 
          ON CONFLICT (code) DO UPDATE SET name_ar = EXCLUDED.name_ar, name_en = EXCLUDED.name_en 
          RETURNING id`,
         [input.code, input.name_ar || 'N/A', input.name_en || 'N/A', createdBy]
       );
       itemCodeId = icResult.rows[0].id;
    }

    const result = await client.query(
      `INSERT INTO items (
        item_code_id, unit, quantity, warehouse_id, employee_id, supplier_id, 
        installation_site, action_type, action_date, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING item_id`,
      [
        itemCodeId, input.unit || null, input.quantity, input.warehouse_id || null,
        input.employee_id || null, input.supplier_id || null, input.installation_site || null,
        input.action_type, input.action_date || null, createdBy
      ]
    );

    await client.query('COMMIT');
    return { item_id: result.rows[0].item_id, ...input };
  } catch (error: any) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function updateItem(id: number, input: any, modifiedBy: number) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(
      `UPDATE items SET 
        unit = $1, quantity = $2, warehouse_id = $3, employee_id = $4, supplier_id = $5, 
        installation_site = $6, action_type = $7, action_date = $8, 
        modification_at = NOW(), modification_by = $9 
       WHERE item_id = $10`,
      [
        input.unit || null, input.quantity, input.warehouse_id || null,
        input.employee_id || null, input.supplier_id || null, input.installation_site || null,
        input.action_type, input.action_date || null, modifiedBy, id
      ]
    );

    await client.query('COMMIT');
    return { item_id: id, ...input };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}