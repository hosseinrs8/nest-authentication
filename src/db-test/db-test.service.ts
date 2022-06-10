import { Injectable } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/postgresql';
import { DbTest } from './db-test.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ApiTags } from '@nestjs/swagger';
import { MikroORM, UseRequestContext } from '@mikro-orm/core';
import { CreateDbTestDto } from './create-db-test.dto';

@ApiTags('DB-Test')
@Injectable()
export class DbTestService {
  constructor(
    @InjectRepository(DbTest)
    private readonly dbTestRepo: EntityRepository<DbTest>,
    private readonly orm: MikroORM,
  ) {}

  @UseRequestContext()
  async create(dto: CreateDbTestDto): Promise<DbTest> {
    const dbTest = new DbTest();
    dbTest.name = dto.name;
    await this.dbTestRepo.persistAndFlush(dbTest);
    return dbTest;
  }

  @UseRequestContext()
  findOne(id: number): Promise<DbTest> {
    return this.dbTestRepo.findOne({ id });
  }
}
