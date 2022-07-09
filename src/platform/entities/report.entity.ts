import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Platform } from './platform.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({
  tableName: 'reports',
})
export class Report {
  @PrimaryKey()
  id: number;

  @Property()
  price: number;

  @Property({ onCreate: (r: Report) => (r.date = new Date()) })
  date: Date;

  @ApiProperty({
    type: () => Platform,
  })
  @ManyToOne(() => Platform)
  platform: Platform;
}
