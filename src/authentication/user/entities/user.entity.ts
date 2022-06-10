import {
  Collection,
  Entity,
  Enum,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Exclude } from 'class-transformer';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Session } from '../../session/entities/session.entity';

export enum UserStatus {
  active,
  blocked,
}

export enum UserLocales {
  farsi = 'fa',
  english = 'en',
}

@Entity({
  tableName: 'users',
})
export class User {
  @PrimaryKey()
  id: number;

  @Property()
  firstName: string;

  @Property()
  lastName: string;

  @Property({ index: true, nullable: true })
  email: string;

  @Property({ index: true, nullable: true })
  phone: string;

  @ApiHideProperty()
  @Exclude()
  @Property()
  hashedPassword: string;

  @Property({ nullable: true })
  emailVerifiedAt: Date;

  @Property({ nullable: true })
  phoneVerifiedAt: Date;

  @Property({ onCreate: (u: User) => (u.createdAt = new Date()) })
  createdAt: Date;

  @Property({ onUpdate: (u: User) => (u.updatedAt = new Date()) })
  updatedAt: Date;

  @Enum(() => UserStatus)
  status: UserStatus = UserStatus.active;

  @Enum(() => UserLocales)
  preferredLocale: UserLocales = UserLocales.farsi;

  @ApiProperty({
    type: Session,
    isArray: true,
  })
  @OneToMany(() => Session, (s) => s.user)
  sessions: Collection<Session> = new Collection<Session>(this);
}
