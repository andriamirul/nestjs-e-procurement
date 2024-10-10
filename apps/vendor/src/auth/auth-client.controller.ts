import { VendorMessagePattern } from '@libs/clients/enum/vendor-message-pattern.enum';
import { VendorPaginateRequest } from '@libs/clients/vendor/dto/vendor-paginate-request.dto';
import { VendorPaginateResponse } from '@libs/clients/vendor/dto/vendor-paginate-response.dto';
import { VendorResponse } from '@libs/clients/vendor/dto/vendor-response.dto';
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
  async approve(id: number): Promise<boolean> {
    return await this.authService.approve(id);
  }

  @MessagePattern(VendorMessagePattern.vendorPaginate)
  async paginate(req: VendorPaginateRequest): Promise<VendorPaginateResponse> {
    return await this.authService.paginate(req);
  }

  @MessagePattern(VendorMessagePattern.vendorFindOne)
  async findOne(id: number): Promise<VendorResponse> {
    return await this.authService.findOneOrThrow(id);
  }

  @MessagePattern(VendorMessagePattern.vendorRemove)
  async remove(id: number): Promise<boolean> {
    await this.authService.remove(id);
    return true;
  }
}
