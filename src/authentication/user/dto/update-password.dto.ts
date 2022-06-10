import { IsDefined, IsString } from 'class-validator';

export class UpdatePasswordDto {
  @IsDefined()
  @IsString()
  oldPassword: string;

  @IsDefined()
  @IsString()
  newPassword: string;
}
