import { IsString, IsNumber, IsDefined } from 'class-validator';

export class ServiceConfigValidation {
  @IsString()
  @IsDefined()
  name: string;

  @IsString()
  @IsDefined()
  description: string;

  @IsString()
  @IsDefined()
  version: string;

  @IsString()
  @IsDefined()
  maintainer: string;
}

export class MysqlConfigValidation {
  @IsString()
  @IsDefined()
  host: string;

  @IsNumber()
  @IsDefined()
  port: number;

  @IsString()
  @IsDefined()
  dbname: string;

  @IsString()
  @IsDefined()
  user: string;

  @IsString()
  @IsDefined()
  pass: string;
}

export class ConfigValidation {
  service: ServiceConfigValidation;
  mysql: MysqlConfigValidation;
}
