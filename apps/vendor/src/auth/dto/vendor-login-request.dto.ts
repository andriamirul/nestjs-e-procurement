import { IsNotEmpty, IsString } from 'class-validator';

export class VendorLoginRequest {
  @IsNotEmpty()
  @IsString()
  email: string;
}
