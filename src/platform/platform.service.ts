import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Platform } from './entities/platform.entity';
import { EntityRepository } from '@mikro-orm/postgresql';
import { CreatePlatformDto } from './dto/create-platform.dto';
import { FilterQuery, MikroORM, UseRequestContext } from '@mikro-orm/core';
import { Report } from './entities/report.entity';
import { UpdatePlatformDto } from './dto/update-platform.dto';

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
  } // sysAdmin

  @UseRequestContext()
  async update(id: number, dto: UpdatePlatformDto): Promise<Platform> {
    const platform = await this.findOne(id);
    platform.name = dto.name || platform.name;
    await this.platformRepository.persistAndFlush(platform);
    return platform;
  } // sysAdmin

  @UseRequestContext()
  async remove(id: number): Promise<void> {
    const platform = await this.findOne(id);
    return this.platformRepository.removeAndFlush(platform);
  } // sysAdmin

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
