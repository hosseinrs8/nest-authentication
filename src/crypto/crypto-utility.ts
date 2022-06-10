import * as crypto from 'crypto';
import * as argon2 from 'argon2';
import { readFileSync } from 'fs';
import { ConfigService } from '@nestjs/config';

export class CryptoUtility {
  private static encryptionDefaultKey: Buffer;
  private static encryptionDefaultAlgorithm: string;
  private static hashDefaultAlgorithm: string;

  static boot(configService: ConfigService) {
    CryptoUtility.encryptionDefaultKey = Buffer.from(
      readFileSync(
        configService.get<string>('crypto.encryptionDefaultKeyPath'),
        'hex',
      ),
      'hex',
    );
    CryptoUtility.encryptionDefaultAlgorithm = configService.get<string>(
      'crypto.encryptionDefaultAlgorithm',
    );
    CryptoUtility.hashDefaultAlgorithm = configService.get<string>(
      'crypto.hashDefaultAlgorithm',
    );
  }

  static generateUUID(): string {
    return crypto.randomUUID();
  }

  static generateRandomString(size: number): string {
    return crypto.randomBytes(size).toString('base64').slice(0, size);
  }

  static generateEncryptionKey() {
    return crypto.randomBytes(32);
  }

  static encryptString(data: string, key?: string | Buffer): string {
    const iv = crypto.randomBytes(16);
    const keyBuffer = key
      ? Buffer.isBuffer(key)
        ? key
        : Buffer.from(key)
      : this.encryptionDefaultKey;
    const ctx = crypto.createCipheriv(
      this.encryptionDefaultAlgorithm,
      keyBuffer,
      iv,
    );
    let encrypted = ctx.update(data, 'utf8', 'hex');
    encrypted += ctx.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  }

  static decryptString(data: string, key?: string | Buffer): string {
    const keyBuffer = key
      ? Buffer.isBuffer(key)
        ? key
        : Buffer.from(key)
      : this.encryptionDefaultKey;
    const dataInfo = data.split(':');
    const iv = Buffer.from(dataInfo[0], 'hex');
    const encrypted = dataInfo[1];
    const ctx = crypto.createDecipheriv(
      this.encryptionDefaultAlgorithm,
      keyBuffer,
      iv,
    );
    let decrypted = ctx.update(encrypted, 'hex', 'utf8');
    decrypted += ctx.final('utf8');
    return decrypted;
  }

  static hashPassword(password: string): Promise<string> {
    return argon2.hash(password);
  }

  static verifyPassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return argon2.verify(hashedPassword, password);
  }

  static hash(data: string | Buffer, algorithm?: string): string {
    const hashAlgorithm = algorithm || this.hashDefaultAlgorithm || 'sha256';
    const ctx = crypto.createHash(hashAlgorithm);
    ctx.update(data);
    return ctx.digest('hex');
  }
}
