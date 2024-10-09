import { IsNotEmpty, IsString } from 'class-validator';

export class AdminLoginRequest {
  @IsNotEmpty()
  @IsString()
  email: string;
}
