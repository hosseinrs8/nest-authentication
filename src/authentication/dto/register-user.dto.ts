import {
  IsDefined,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class RegisterUserDto {
  @IsDefined()
  @IsString()
  @MaxLength(74)
  firstName: string;

  @IsDefined()
  @IsString()
  @MaxLength(74)
  lastName: string;

  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @Transform(({ value }) => value?.toLowerCase())
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsDefined()
  @IsString()
  password: string;
}
