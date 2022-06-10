import { IsDefined, IsEnum, IsString } from 'class-validator';

export enum UsernameSearchKeys {
  email = 'email',
  phone = 'phone',
}

export class UsernameSearchDto {
  @IsDefined()
  @IsEnum(UsernameSearchKeys)
  key: UsernameSearchKeys;

  @IsDefined()
  @IsString()
  value: string;
}
