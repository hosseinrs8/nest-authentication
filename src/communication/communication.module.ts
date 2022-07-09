import { Module } from '@nestjs/common';
import { NatsClientFactory } from './nats/nats-client.factory';
import { MigratorService } from './migrator/migrator.service';

@Module({
  providers: [NatsClientFactory, MigratorService],
  exports: [NatsClientFactory],
})
export class CommunicationModule {}
