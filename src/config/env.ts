import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  JWT_EXPIRES_IN: z.string().default('8h'),
  CORS_ORIGIN: z.string().min(1),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  ADMIN_EMAIL: z.string().email().default('admin@radco.local'),
  ADMIN_PASSWORD: z.string().default('ChangeMe123!'),
  KEEP_ALIVE_ENABLED: z.string().transform(v => v === 'true').default('true'),
  KEEP_ALIVE_INTERVAL_MINUTES: z.coerce.number().default(12),
  KEEP_ALIVE_START_NAP_UTC: z.string().default('01:00'),
  KEEP_ALIVE_END_NAP_UTC: z.string().default('07:00'),
  
  STORAGE_DRIVER: z.string().default('s3'),
  STORAGE_BUCKET: z.string().default('radco-files'),
  STORAGE_ENDPOINT: z.string().optional().default(''),
  STORAGE_REGION: z.string().default('auto'),
  STORAGE_ACCESS_KEY_ID: z.string().optional().default(''),
  STORAGE_SECRET_ACCESS_KEY: z.string().optional().default(''),
});

export const env = envSchema.parse(process.env);

export type Env = z.infer<typeof envSchema>;
