import { IsDefined, IsString } from 'class-validator';

export class CreateDbTestDto {
  @IsDefined()
  @IsString()
  name: string;
}
