import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { ClientName } from './enum/client-name.enum';
import { VendorMessagePattern } from './enum/vendor-message-pattern.enum';

@Injectable()
export class VendorClientService {
  constructor(
    @Inject(ClientName.VENDOR) private readonly vendorService: ClientProxy,
  ) {}

  async approve(id: number): Promise<boolean> {
    const emit = await lastValueFrom(
      this.vendorService.send<boolean>(VendorMessagePattern.vendorApproval, id),
    );

    return emit;
  }
}
