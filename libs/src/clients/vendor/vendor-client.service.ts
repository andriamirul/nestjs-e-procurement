import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { ClientName } from '../enum/client-name.enum';
import { VendorMessagePattern } from '../enum/vendor-message-pattern.enum';
import { VendorPaginateRequest } from './dto/vendor-paginate-request.dto';
import { VendorPaginateResponse } from './dto/vendor-paginate-response.dto';
import { VendorResponse } from './dto/vendor-response.dto';

@Injectable()
export class VendorClientService {
  constructor(
    @Inject(ClientName.VENDOR) private readonly vendorService: ClientProxy,
  ) {}

  async paginate(req: VendorPaginateRequest): Promise<VendorPaginateResponse> {
    return await lastValueFrom(
      this.vendorService.send<VendorPaginateResponse>(
        VendorMessagePattern.vendorPaginate,
        req,
      ),
    );
  }

  async findOne(id: number): Promise<VendorResponse> {
    return await lastValueFrom(
      this.vendorService.send<VendorResponse>(
        VendorMessagePattern.vendorFindOne,
        id,
      ),
    );
  }

  async remove(id: number): Promise<VendorResponse> {
    return await lastValueFrom(
      this.vendorService.send<VendorResponse>(
        VendorMessagePattern.vendorRemove,
        id,
      ),
    );
  }

  async approve(id: number): Promise<boolean> {
    const emit = await lastValueFrom(
      this.vendorService.send<boolean>(VendorMessagePattern.vendorApproval, id),
    );

    return emit;
  }
}
