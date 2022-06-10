import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import configModuleSetups from './config';
import databaseSetup from './config/database-setup';
import { ConfigModule } from '@nestjs/config';
import { DbTestModule } from './db-test/db-test.module';
import { MigratorService } from './migrator/migrator.service';

@Module({
  imports: [
    ConfigModule.forRoot(configModuleSetups),
    MikroOrmModule.forRootAsync(databaseSetup),
    DbTestModule,
  ],
  providers: [MigratorService],
})
export class AppModule {}
