import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import configModuleSetups from './config';
import databaseSetup from './config/database-setup';
import { ConfigModule } from '@nestjs/config';
import { DbTestModule } from './db-test/db-test.module';
import { MigratorService } from './migrator/migrator.service';
import { AuthenticationModule } from './authentication/authentication.module';
import { CryptoModule } from './crypto/crypto.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { eventEmitterSetup } from './config/event-emitter-setup';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './authentication/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot(configModuleSetups),
    MikroOrmModule.forRootAsync(databaseSetup),
    EventEmitterModule.forRoot(eventEmitterSetup),
    CryptoModule,
    DbTestModule,
    AuthenticationModule,
  ],
  providers: [
    MigratorService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
