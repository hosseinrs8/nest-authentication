import {
  IsBoolean,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export class TLSConfig {
  @IsOptional()
  @IsString()
  caPath?: string;

  @IsOptional()
  @IsString()
  certPath?: string;

  @IsOptional()
  @IsString()
  keyPath?: string;
}

export class WebServerConfig {
  @IsString()
  @IsUrl()
  host: string;

  @IsNumber()
  port: number;

  @IsOptional()
  @ValidateNested()
  tls?: TLSConfig;
}

export class DatabaseConfig {
  @IsString()
  @IsUrl()
  host: string;

  @IsNumber()
  port: number;

  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  database: string;
}

export class JWTConfig {
  @IsNotEmpty()
  @IsString()
  privateKeyPath: string;

  @IsNotEmpty()
  @IsString()
  publicKeyPath: string;

  @IsNotEmpty()
  @IsString()
  expiresIn: string;

  @IsNotEmpty()
  @IsString()
  algorithm: string;
}

export class AuthenticationConfig {
  @ValidateNested()
  jwt: JWTConfig;
}

export class RegistrationConfig {
  @IsDefined()
  @IsBoolean()
  requiredEmail: boolean;

  @IsDefined()
  @IsBoolean()
  requiredPhone: boolean;

  @IsDefined()
  @IsNumber()
  @Min(0)
  @Max(4)
  minimumAcceptablePasswordScore: number;

  @IsBoolean()
  autoVerifyEmail: boolean;

  @IsBoolean()
  autoVerifyPhone: boolean;
}

export class CryptoConfig {
  @IsNotEmpty()
  @IsString()
  encryptionDefaultKeyPath: string;

  @IsNotEmpty()
  @IsString()
  encryptionDefaultAlgorithm: string;

  @IsNotEmpty()
  @IsString()
  hashDefaultAlgorithm: string;
}

export class Configs {
  @IsNotEmpty()
  @IsString()
  serviceName: string;

  @IsEnum(Environment)
  environment: Environment;

  @ValidateNested()
  webServer: WebServerConfig;

  @ValidateNested()
  database: DatabaseConfig;

  @ValidateNested()
  registration: RegistrationConfig;

  @ValidateNested()
  authentication: AuthenticationConfig;

  @ValidateNested()
  crypto: CryptoConfig;
}
