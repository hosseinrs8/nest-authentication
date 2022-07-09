import { Module } from '@nestjs/common';
import { PlatformService } from './platform.service';
import { PlatformController } from './platform.controller';
import { FloorPriceService } from './floor-price/floor-price.service';
import { FloorPriceController } from './floor-price/floor-price.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Platform } from './entities/platform.entity';
import { Report } from './entities/report.entity';
import { CommunicationModule } from '../communication/communication.module';

@Module({
  imports: [MikroOrmModule.forFeature([Platform, Report]), CommunicationModule],
  providers: [PlatformService, FloorPriceService],
  controllers: [PlatformController, FloorPriceController],
})
export class PlatformModule {}
