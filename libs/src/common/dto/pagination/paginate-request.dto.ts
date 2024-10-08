import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class PaginateRequestDto<T = any> {
  @Transform(({ value }) => (value ? parseInt(value, 10) : 1))
  @Min(1)
  @IsNumber()
  page?: number = 1;

  @Transform(({ value }) => (value ? parseInt(value, 10) : 10))
  @Max(100)
  @IsNumber()
  size?: number = 10;

  @IsString()
  @IsOptional()
  filter?: string;

  @Transform(({ value }) => (value && !Array.isArray(value) ? [value] : value))
  @IsString({ each: true })
  @IsOptional()
  sortBy?: Array<keyof T> = [];

  @ApiProperty({
    type: Array<String>,
    required: false,
  })
  @Transform(({ value }) => (value && !Array.isArray(value) ? [value] : value))
  @IsOptional()
  @IsString({ each: true })
  orderBy?: Array<'asc' | 'desc' | 'ASC' | 'DESC'> = [];
}
