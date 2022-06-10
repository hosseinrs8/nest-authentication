import { UserLocales, UserStatus } from '../entities/user.entity';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UserFindAdvanceDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  emailVerifiedAt?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  phoneVerifiedAt?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  createdAt?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  updatedAt?: Date;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @IsOptional()
  @IsEnum(UserLocales)
  preferredLocale?: UserLocales;
}
