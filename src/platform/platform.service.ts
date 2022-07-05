import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Platform } from './entities/platform.entity';
import { EntityRepository } from '@mikro-orm/postgresql';
import { CreatePlatformDto } from './dto/create-platform.dto';
import { FilterQuery, MikroORM, UseRequestContext } from '@mikro-orm/core';
import { Report } from './entities/report.entity';

@Injectable()
export class PlatformService {
  constructor(
    @InjectRepository(Platform)
    private readonly platformRepository: EntityRepository<Platform>,
    private readonly orm: MikroORM,
  ) {}

  @UseRequestContext()
  async create(dto: CreatePlatformDto) {
    const platform = new Platform();
    platform.name = dto.name;
    await this.platformRepository.persistAndFlush(platform);
    return platform;
  }

  @UseRequestContext()
  findOne(id: number) {
    return this.platformRepository.findOne(id);
  }

  @UseRequestContext()
  findAll(limit = 10, offset = 0) {
    return this.platformRepository.findAll({ limit, offset });
  }

  @UseRequestContext()
  findAdvance(where: FilterQuery<Platform>, limit = 15, offset = 0) {
    return this.platformRepository.find(where, { limit, offset });
  }

  @UseRequestContext()
  async getReports(id: number): Promise<Array<Report>> {
    const platform = await this.platformRepository.findOne(id, {
      populate: ['reports'],
    });
    return await platform.reports.loadItems();
  }
}
