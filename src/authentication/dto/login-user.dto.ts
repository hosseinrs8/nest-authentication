import { IsDefined, IsEnum, IsString } from 'class-validator';
import { AuthenticationMode } from '../interfaces';

export class LoginUserDto {
  @IsDefined()
  @IsString()
  username: string;

  @IsDefined()
  @IsString()
  password: string;

  @IsDefined()
  @IsEnum(AuthenticationMode)
  mode: AuthenticationMode;
}
