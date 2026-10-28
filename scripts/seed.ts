import { pool } from '../src/db/pool';
import { hashPassword } from '../src/shared/utils/hash';
import dotenv from 'dotenv';

dotenv.config();

async function clearTables(): Promise<void> {
  const client = await pool.connect();
  try {
    console.log('Clearing all tables...');
    // TRUNCATE resets identity sequences (like BIGSERIAL) automatically
    await client.query(`
      TRUNCATE TABLE 
        items, 
        item_code, 
        warehouses, 
        suppliers, 
        employees, 
        role_permissions, 
        permissions, 
        users, 
        roles 
      RESTART IDENTITY CASCADE;
    `);
    console.log('All tables cleared.');
  } catch (error) {
    console.error('Failed to clear tables:', error);
    throw error;
  } finally {
    client.release();
  }
}

async function seedPermissions(): Promise<void> {
  const client = await pool.connect();
  try {
    const permissions = [
      { key: 'warehouses.view', description: 'View warehouses' },
      { key: 'warehouses.create', description: 'Create warehouses' },
      { key: 'warehouses.edit', description: 'Edit warehouses' },
      { key: 'warehouses.delete', description: 'Delete warehouses' },

      { key: 'suppliers.view', description: 'View suppliers' },
      { key: 'suppliers.create', description: 'Create suppliers' },
      { key: 'suppliers.edit', description: 'Edit suppliers' },
      { key: 'suppliers.delete', description: 'Delete suppliers' },

      { key: 'employees.view', description: 'View employees' },
      { key: 'employees.create', description: 'Create employees' },
      { key: 'employees.edit', description: 'Edit employees' },
      { key: 'employees.delete', description: 'Delete employees' },

      { key: 'item_code.view', description: 'View item code' },
      { key: 'item_code.create', description: 'Create item code' },
      { key: 'item_code.edit', description: 'Edit item code' },
      { key: 'item_code.delete', description: 'Delete item code' },

      { key: 'inventory.view', description: 'View inventory' },
      { key: 'inventory.create', description: 'Create inventory' },
      { key: 'inventory.edit', description: 'Edit inventory' },
      { key: 'inventory.delete', description: 'Delete inventory' },

      { key: 'items.create', description: 'Create item' },
      { key: 'items.edit', description: 'Update item' },
      { key: 'items.delete', description: 'Delete item' },

      { key: 'users.manage', description: 'Manage users' },
    ];

    for (const perm of permissions) {
      await client.query(
        `INSERT INTO permissions (key, description) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING`,
        [perm.key, perm.description]
      );
    }
    console.log('Permissions seeded');
  } finally {
    client.release();
  }
}

async function seedRoles(): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query(`INSERT INTO roles (name, description) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING`, ['admin', 'Administrator with all permissions']);
    await client.query(`INSERT INTO roles (name, description) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING`, ['manager', 'Manager']);
    await client.query(`INSERT INTO roles (name, description) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING`, ['viewer', 'Viewer with read-only permissions']);
    console.log('Roles seeded');
  } finally {
    client.release();
  }
}

async function linkRolePermissions(): Promise<void> {
  const client = await pool.connect();
  try {
    // Link all permissions to admin
    await client.query(`INSERT INTO role_permissions (role_id, permission_id) SELECT r.id, p.id FROM roles r, permissions p WHERE r.name = 'admin' ON CONFLICT DO NOTHING`);
    
    // Link manager permissions (all except delete and users.manage)
    await client.query(`INSERT INTO role_permissions (role_id, permission_id) SELECT r.id, p.id FROM roles r, permissions p WHERE r.name = 'manager' AND p.key NOT LIKE '%.delete' AND p.key != 'users.manage' ON CONFLICT DO NOTHING`);
    
    // Link viewer permissions (only .view)
    await client.query(`INSERT INTO role_permissions (role_id, permission_id) SELECT r.id, p.id FROM roles r, permissions p WHERE r.name = 'viewer' AND p.key LIKE '%.view' ON CONFLICT DO NOTHING`);
    console.log('Role permissions linked');
  } finally {
    client.release();
  }
}

async function seedAdminUser(): Promise<void> {
  const client = await pool.connect();
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@radco.local';
    const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
    const passwordHash = await hashPassword(adminPassword);

    await client.query(`INSERT INTO users (email, password_hash, full_name, role_id, is_active) SELECT $1, $2, $3, r.id, true FROM roles r WHERE r.name = 'admin' ON CONFLICT (email) DO NOTHING`,
      [adminEmail.toLowerCase().trim(), passwordHash, 'System Administrator']);

    const viewerEmail = 'viewer@radco.local';
    const viewerPassword = 'Viewer123!';
    const viewerPasswordHash = await hashPassword(viewerPassword);

    await client.query(`INSERT INTO users (email, password_hash, full_name, role_id, is_active) SELECT $1, $2, $3, r.id, true FROM roles r WHERE r.name = 'viewer' ON CONFLICT (email) DO NOTHING`,
      [viewerEmail.toLowerCase().trim(), viewerPasswordHash, 'Viewer User']);
    console.log('Users seeded');
  } finally {
    client.release();
  }
}

async function main(): Promise<void> {
  try {
    console.log('Starting seed...');
    
    // 1. Clear all tables first
    await clearTables();
    
    // 2. Seed data
    await seedPermissions();
    await seedRoles();
    await linkRolePermissions();
    await seedAdminUser();
    
    console.log('Seed completed successfully');
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    await pool.end();
    process.exit(1);
  }
}

main();