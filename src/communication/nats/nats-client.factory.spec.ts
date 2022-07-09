import { Test, TestingModule } from '@nestjs/testing';
import { NatsClientFactory } from './nats-client.factory';

describe('NatsClientFactory', () => {
  let service: NatsClientFactory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NatsClientFactory],
    }).compile();

    service = module.get<NatsClientFactory>(NatsClientFactory);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
