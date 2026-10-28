import { pool } from '../../db/pool.js';
import { comparePassword } from '../../shared/utils/hash.js';
import { signToken } from '../../shared/utils/jwt.js';
import { AppError } from '../../shared/middleware/error.js';

export interface PublicUser {
  id: number;
  email: string;
  full_name: string;
  role: {
    id: number;
    name: string;
  };
}

export async function loginUser(input: { email: string; password: string }): Promise<{
  token: string;
  user: PublicUser;
  permissions: string[];
}> {
  const client = await pool.connect();
  try {
    const userResult = await client.query(
      `SELECT u.id, u.email, u.password_hash, u.full_name, u.role_id, u.is_active, r.name as role_name
       FROM users u
       JOIN roles r ON r.id = u.role_id
       WHERE LOWER(TRIM(u.email)) = LOWER(TRIM($1))`,
      [input.email]
    );

    

    if (userResult.rows.length === 0) {
      throw new AppError(401, 'UNAUTHORIZED', 'Invalid credentials');
    }

    const user = userResult.rows[0];

    if (!user.is_active) {
      throw new AppError(401, 'UNAUTHORIZED', 'Invalid credentials');
    }

    const isValidPassword = await comparePassword(input.password, user.password_hash);
    if (!isValidPassword) {
      throw new AppError(401, 'UNAUTHORIZED', 'Invalid credentials');
    }

    const permResult = await client.query(
      `SELECT p.key
       FROM permissions p
       JOIN role_permissions rp ON rp.permission_id = p.id
       WHERE rp.role_id = $1`,
      [user.role_id]
    );

    const permissions = permResult.rows.map((row) => row.key);

    // Refresh-token support will be added in a later phase without changing the API shape.
    const token = signToken({
      id: user.id,
      role_id: user.role_id,
      permissions,
    } as any);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: {
          id: user.role_id,
          name: user.role_name,
        },
      },
      permissions,
    };
  } finally {
    client.release();
  }
}

export async function getCurrentUser(userId: number): Promise<{
  user: PublicUser;
  permissions: string[];
}> {
  const client = await pool.connect();
  try {
    const userResult = await client.query(
      `SELECT u.id, u.email, u.full_name, u.role_id, r.name as role_name
       FROM users u
       JOIN roles r ON r.id = u.role_id
       WHERE u.id = $1 AND u.is_active = true`,
      [userId]
    );

    if (userResult.rows.length === 0) {
      throw new AppError(401, 'UNAUTHORIZED', 'User not found');
    }

    const user = userResult.rows[0];

    const permResult = await client.query(
      `SELECT p.key
       FROM permissions p
       JOIN role_permissions rp ON rp.permission_id = p.id
       WHERE rp.role_id = $1`,
      [user.role_id]
    );

    const permissions = permResult.rows.map((row) => row.key);

    return {
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: {
          id: user.role_id,
          name: user.role_name,
        },
      },
      permissions,
    };
  } finally {
    client.release();
  }
}
