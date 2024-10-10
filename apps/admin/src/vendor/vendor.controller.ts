import { Auth } from '@admin/auth/guards/auth.decorator';
import { IdParamDto } from '@libs';
import { VendorPaginateRequest } from '@libs/clients/vendor/dto/vendor-paginate-request.dto';
import { VendorPaginateResponse } from '@libs/clients/vendor/dto/vendor-paginate-response.dto';
import { VendorResponse } from '@libs/clients/vendor/dto/vendor-response.dto';
import { Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { VendorService } from './vendor.service';

@Controller('vendor')
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}
  @Auth()
  @Get()
  paginate(
    @Query() req: VendorPaginateRequest,
  ): Promise<VendorPaginateResponse> {
    return this.vendorService.paginate(req);
  }

  @Auth()
  @Get(':id')
  findOne(@Param() req: IdParamDto): Promise<VendorResponse> {
    return this.vendorService.findOne(req.id);
  }

  @Auth()
  @Delete(':id')
  remove(@Param() req: IdParamDto): Promise<VendorResponse> {
    return this.vendorService.remove(req.id);
  }

  @Auth()
  @Post('approve/:id')
  approve(@Param() req: IdParamDto) {
    return this.vendorService.approve(req.id);
  }
}
