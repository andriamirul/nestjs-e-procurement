import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductRequest {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  stock: number;
}
