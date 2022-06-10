import { Test, TestingModule } from '@nestjs/testing';
import { DbTestController } from './db-test.controller';

describe('DbTestController', () => {
  let controller: DbTestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DbTestController],
    }).compile();

    controller = module.get<DbTestController>(DbTestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
