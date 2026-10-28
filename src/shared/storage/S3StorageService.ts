import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { StorageService, PutObjectParams } from './StorageService.js';
import { env } from '../../config/env.js';

export class S3StorageService implements StorageService {
  private client: S3Client | null = null;
  private bucket: string;
  private initialized = false;

  constructor() {
    this.bucket = env.STORAGE_BUCKET;
  }

  private ensureInitialized(): void {
    if (this.initialized) return;

    if (!env.STORAGE_BUCKET) {
      throw new Error('STORAGE_BUCKET is not configured');
    }
    if (!env.STORAGE_ACCESS_KEY_ID) {
      throw new Error('STORAGE_ACCESS_KEY_ID is not configured');
    }
    if (!env.STORAGE_SECRET_ACCESS_KEY) {
      throw new Error('STORAGE_SECRET_ACCESS_KEY is not configured');
    }

    this.client = new S3Client({
      region: env.STORAGE_REGION || 'auto',
      endpoint: env.STORAGE_ENDPOINT || undefined,
      credentials: {
        accessKeyId: env.STORAGE_ACCESS_KEY_ID,
        secretAccessKey: env.STORAGE_SECRET_ACCESS_KEY,
      },
      forcePathStyle: !!env.STORAGE_ENDPOINT,
    });

    this.initialized = true;
  }

  async putObject(params: PutObjectParams): Promise<{ key: string; url?: string }> {
    this.ensureInitialized();
    if (!this.client) throw new Error('S3 client not initialized');

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: params.key,
      Body: params.body,
      ContentType: params.contentType,
    });

    await this.client.send(command);
    return { key: params.key };
  }

  async getSignedUrl(key: string, expiresInSeconds = 3600): Promise<string> {
    this.ensureInitialized();
    if (!this.client) throw new Error('S3 client not initialized');

    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    return getSignedUrl(this.client, command, { expiresIn: expiresInSeconds });
  }

  async deleteObject(key: string): Promise<void> {
    this.ensureInitialized();
    if (!this.client) throw new Error('S3 client not initialized');

    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    await this.client.send(command);
  }
}

export const storageService = new S3StorageService();
