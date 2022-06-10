import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { UserLocales, UserStatus } from '../entities/user.entity';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  @IsPhoneNumber()
  phone?: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEnum(UserLocales)
  preferredLocales?: UserLocales;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}
