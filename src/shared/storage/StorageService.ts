export interface PutObjectParams {
  key: string;
  body: Buffer | Uint8Array | string;
  contentType?: string;
}

export interface StorageService {
  putObject(params: PutObjectParams): Promise<{ key: string; url?: string }>;
  getSignedUrl(key: string, expiresInSeconds?: number): Promise<string>;
  deleteObject(key: string): Promise<void>;
}
