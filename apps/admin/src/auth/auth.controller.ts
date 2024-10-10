import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AdminLoginRequest } from './dto/admin-login-request.dto';
import { AdminLoginResponse } from './dto/admin-login-response.dto';

@ApiTags(`Auth`)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(`login`)
  login(@Body() req: AdminLoginRequest): Promise<AdminLoginResponse> {
    return this.authService.login(req);
  }
}
