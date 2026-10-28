import pg from 'pg';
import { env } from '../config/env.js';

const { Pool } = pg;

const useSSL = env.DATABASE_URL.includes('sslmode=require') || env.NODE_ENV === 'production';

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: useSSL ? { rejectUnauthorized: false } : false,
  max: 5,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});
