import { DatabaseConfig } from './types';
import { ConfigService } from '@nestjs/config';
import { MikroOrmModuleAsyncOptions } from '@mikro-orm/nestjs';

export default {
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const config: DatabaseConfig =
      configService.get<DatabaseConfig>('database');
    return {
      host: config.host,
      port: config.port,
      user: config.username,
      password: config.password,
      type: 'postgresql',
      schema: 'public',
      dbName: config.database,
      synchronize: false,
      debug: false,
      autoLoadEntities: true,
      migrations: {
        tableName: 'mikro_orm_migrations',
        path: '../migrations',
        pattern: /^[\w-]+\d+\.ts$/,
        transactional: true,
        disableForeignKeys: true,
        allOrNothing: true,
        dropTables: true,
        safe: false,
        emit: 'ts',
      },
    };
  },
} as MikroOrmModuleAsyncOptions;
