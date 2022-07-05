import { Injectable, OnModuleInit } from '@nestjs/common';
import { NatsClientFactory } from '../../communication/nats/nats-client.factory';
import { JSONCodec, NatsConnection } from 'nats';
import { FloorPrice } from './types/floor-price.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Report } from '../entities/report.entity';
import { EntityRepository } from '@mikro-orm/postgresql';
import { MikroORM, UseRequestContext } from '@mikro-orm/core';

@Injectable()
export class FloorPriceService implements OnModuleInit {
  private natsConnection: NatsConnection;
  private natsCoded = JSONCodec();

  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: EntityRepository<Report>,
    private readonly natsClientFactory: NatsClientFactory,
    private readonly orm: MikroORM,
  ) {}

  async onModuleInit(): Promise<void> {
    this.natsConnection = await this.natsClientFactory.create();
  }

  @UseRequestContext()
  get(platformName: string): Promise<FloorPrice> {
    //todo request to desired api - create reportEntity
    return Promise.resolve(new FloorPrice());
  }

  makeRequest() {
    //todo
  }

  reportData() {
    //todo
  }
}
