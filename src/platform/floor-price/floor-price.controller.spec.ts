import { Test, TestingModule } from '@nestjs/testing';
import { FloorPriceController } from './floor-price.controller';

describe('FloorPriceController', () => {
  let controller: FloorPriceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FloorPriceController],
    }).compile();

    controller = module.get<FloorPriceController>(FloorPriceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
