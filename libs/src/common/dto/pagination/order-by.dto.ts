import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class OrderByDto {
  @ApiProperty({
    type: Array<'ASC' | 'DESC' | 'asc' | 'desc'>,
  })
  @Transform(({ value }) =>
    value && !Array.isArray(value) ? [value.toUpperCase()] : value,
  )
  @IsString({ each: true })
  @IsOptional()
  orderBy?: Array<'ASC' | 'DESC' | 'asc' | 'desc'>;
}
