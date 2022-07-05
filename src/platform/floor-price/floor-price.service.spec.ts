import { Test, TestingModule } from '@nestjs/testing';
import { FloorPriceService } from './floor-price.service';

describe('FloorPriceService', () => {
  let service: FloorPriceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FloorPriceService],
    }).compile();

    service = module.get<FloorPriceService>(FloorPriceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
