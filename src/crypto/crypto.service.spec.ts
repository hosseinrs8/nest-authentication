import { Test, TestingModule } from '@nestjs/testing';
import { CryptoService } from './crypto.service';
import { randomBytes } from 'crypto';
import { ConfigModule } from '@nestjs/config';
import configModuleSetups from '../config';

describe('CryptoService', () => {
  let service: CryptoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(configModuleSetups)],
      providers: [CryptoService],
    }).compile();

    service = module.get<CryptoService>(CryptoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('encrypt and decrypt random buffer', () => {
    const randomData = randomBytes(256).toString('hex');
    const encrypted = service.encryptString(randomData);
    expect(encrypted).toBeDefined();
    expect(typeof encrypted === 'string').toBeTruthy();
    const decrypted = service.decryptString(encrypted);
    expect(decrypted).toBeDefined();
    expect(decrypted).toEqual(randomData);
  });
});
