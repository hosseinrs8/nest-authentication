import { Module } from '@nestjs/common';
import { DbTestController } from './db-test.controller';
import { DbTestService } from './db-test.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { DbTest } from './db-test.entity';

@Module({
  imports: [MikroOrmModule.forFeature([DbTest])],
  controllers: [DbTestController],
  providers: [DbTestService],
})
export class DbTestModule {}
