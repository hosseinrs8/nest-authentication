import { IsDefined, IsJWT, IsNotEmpty, IsString } from 'class-validator';
import { PlainObject } from '@mikro-orm/core';

export class RefreshTokenDto extends PlainObject {
  @IsDefined()
  @IsJWT()
  readonly accessToken: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  readonly refreshToken: string;
}
