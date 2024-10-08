import { IsNotEmpty, IsString } from 'class-validator';

export class vendorRegisterRequest {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  name: string;
}
