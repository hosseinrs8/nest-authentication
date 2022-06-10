import { Injectable } from '@nestjs/common';
import { CryptoUtility } from './crypto-utility';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CryptoService {
  constructor(private configService: ConfigService) {
    CryptoUtility.boot(configService);
  }

  generateUUID(): string {
    return CryptoUtility.generateUUID();
  }

  generateRandomString(size: number): string {
    return CryptoUtility.generateRandomString(size);
  }

  generateEncryptionKey() {
    return CryptoUtility.generateEncryptionKey();
  }

  encryptString(data: string, key?: string | Buffer): string {
    return CryptoUtility.encryptString(data, key);
  }

  decryptString(data: string, key?: string | Buffer): string {
    return CryptoUtility.decryptString(data, key);
  }

  hashPassword(password: string): Promise<string> {
    return CryptoUtility.hashPassword(password);
  }

  verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return CryptoUtility.verifyPassword(password, hashedPassword);
  }

  hash(data: string | Buffer, algorithm?: string): string {
    return CryptoUtility.hash(data, algorithm);
  }
}
