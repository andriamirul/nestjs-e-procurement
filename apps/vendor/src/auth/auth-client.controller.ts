import { VendorMessagePattern } from '@libs/clients/enum/vendor-message-pattern.enum';
import {
  ClassSerializerInterceptor,
  Controller,
  UseInterceptors,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';
@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class AuthClientController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(VendorMessagePattern.vendorApproval)
  async paginate(id: number): Promise<boolean> {
    return await this.authService.approve(id);
  }
}
