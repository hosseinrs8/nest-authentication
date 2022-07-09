import { Controller, Get, Param } from '@nestjs/common';
import { FloorPriceService } from './floor-price.service';
import { FloorPrice } from './types/floor-price.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Floor Price')
@Controller('floor-price')
export class FloorPriceController {
  constructor(private readonly floorPriceService: FloorPriceService) {}

  @Get(':platformName')
  get(@Param('platformName') platformName: string): Promise<FloorPrice> {
    return this.floorPriceService.get(platformName);
  }
}
