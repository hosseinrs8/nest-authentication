import { IsDefined, IsString } from 'class-validator';

export class CreatePlatformDto {
  @IsDefined()
  @IsString()
  name: string;
}
