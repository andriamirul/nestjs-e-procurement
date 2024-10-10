import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { VendorLoginRequest } from './dto/vendor-login-request.dto';
import { VendorLoginResponse } from './dto/vendor-login-response.dto';
import { vendorRegisterRequest } from './dto/vendor-register-request.dto';

@ApiTags(`Auth`)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(`register`)
  register(@Body() req: vendorRegisterRequest): Promise<string> {
    return this.authService.register(req);
  }

  @Post(`login`)
  login(@Body() req: VendorLoginRequest): Promise<VendorLoginResponse> {
    return this.authService.login(req);
  }
}
