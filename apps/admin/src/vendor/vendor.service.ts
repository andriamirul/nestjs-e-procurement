import { VendorPaginateRequest } from '@libs/clients/vendor/dto/vendor-paginate-request.dto';
import { VendorPaginateResponse } from '@libs/clients/vendor/dto/vendor-paginate-response.dto';
import { VendorResponse } from '@libs/clients/vendor/dto/vendor-response.dto';
import { VendorClientService } from '@libs/clients/vendor/vendor-client.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class VendorService {
  constructor(private readonly vendorClientService: VendorClientService) {}
  async approve(id: number): Promise<string> {
    await this.vendorClientService.approve(id);
    return `vendor approved`;
  }

  async paginate(req: VendorPaginateRequest): Promise<VendorPaginateResponse> {
    return await this.vendorClientService.paginate(req);
  }

  async findOne(id: number): Promise<VendorResponse> {
    return await this.vendorClientService.findOne(id);
  }

  async remove(id: number): Promise<VendorResponse> {
    return await this.vendorClientService.remove(id);
  }
}
