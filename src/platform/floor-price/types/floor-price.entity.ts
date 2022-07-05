import { Platform } from '../../entities/platform.entity';

export class FloorPrice {
  price: number;
  reportAt: Date;
  platform?: Platform;
}
