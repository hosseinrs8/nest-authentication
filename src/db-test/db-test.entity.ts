import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class DbTest {
  @PrimaryKey()
  id: number;
  @Property()
  name: string;
}
