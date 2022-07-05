import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Report } from './report.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({
  tableName: 'platforms',
})
export class Platform {
  @PrimaryKey()
  id: number;

  @Property()
  name: string;

  @ApiProperty({
    type: () => Report,
    isArray: true,
  })
  @OneToMany(() => Report, (r) => r.platform)
  reports: Collection<Report> = new Collection<Report>(this);
}
