import { JwtModuleAsyncOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { readFileSync } from 'fs';

export default {
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    privateKey: readFileSync(
      configService.get<string>('authentication.jwt.privateKeyPath'),
    ),
    publicKey: readFileSync(
      configService.get<string>('authentication.jwt.publicKeyPath'),
    ),
    signOptions: {
      algorithm: configService.get<string>('authentication.jwt.algorithm'),
      expiresIn: configService.get<string>('authentication.jwt.expiresIn'),
    },
  }),
} as JwtModuleAsyncOptions;
