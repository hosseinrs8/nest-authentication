import { Entity, Enum, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { User } from '../../user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { lookup as ipLookup } from 'geoip-country';
import * as UserAgentParser from 'ua-parser-js';
import { AuthenticationMode } from '../../interfaces';

export const REFRESH_TOKEN_SIZE = 128;

@Entity({
  tableName: 'sessions',
})
export class Session {
  @PrimaryKey()
  id: number;

  @Property({ type: 'uuid' })
  token: string;

  @Property()
  ip: string;

  @Property()
  userAgent: string;

  @Property({ nullable: true })
  refreshToken: string;

  @Property({ defaultRaw: 'NOW()' })
  lastUsage: Date;

  @Property({ default: 0 })
  usage: number;

  @Enum(() => AuthenticationMode)
  mode: AuthenticationMode;

  @Property({ nullable: true })
  revokedAt?: Date;

  @Property({ defaultRaw: 'NOW()' })
  createdAt: Date;

  @ManyToOne(() => User)
  user: User;

  @ApiProperty()
  @Expose()
  get userId(): number {
    if (this.user) {
      return this.user.id;
    } else return null;
  }

  @ApiProperty()
  @Expose()
  get ipCountryCode(): string | null {
    if (this.ip) {
      return ipLookup(this.ip)?.country;
    } else return null;
  }

  @ApiProperty()
  @Expose()
  get userAgentBrowser(): string | null {
    if (this.userAgent) {
      const ua = new UserAgentParser(this.userAgent);
      return ua.getBrowser().name;
    } else return null;
  }

  @ApiProperty()
  @Expose()
  get userAgentOS(): string | null {
    if (this.userAgent) {
      const ua = new UserAgentParser(this.userAgent);
      return ua.getOS().name;
    } else return null;
  }

  @ApiProperty()
  @Expose()
  get isRevoked(): boolean {
    return this.revokedAt && this.createdAt.getTime() < Date.now();
  }
}
