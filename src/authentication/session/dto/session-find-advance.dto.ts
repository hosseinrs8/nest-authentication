import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class SessionFindAdvanceDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsOptional()
  @IsNumber()
  user?: number;

  @IsOptional()
  @IsString()
  token?: string;

  @IsOptional()
  @IsString()
  ip?: string;

  @IsOptional()
  @IsString()
  userAgent?: string;

  @IsOptional()
  @IsString()
  refreshToken?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  lastUsage?: Date;

  @IsOptional()
  @IsNumber()
  usage?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  revokeAt?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  createdAt?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  deletedAt?: Date;
}
