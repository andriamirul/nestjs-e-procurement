import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class IdParamDto {
  @Transform(({ value }) => (value ? parseInt(value, 10) : 1))
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
