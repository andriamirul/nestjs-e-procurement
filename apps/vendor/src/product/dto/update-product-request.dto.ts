import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateProductRequest {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  stock: number;
}
