import { IsNumber, IsOptional, IsString } from 'class-validator';

export class PlatformFindAdvanceDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  id?: number;
}
