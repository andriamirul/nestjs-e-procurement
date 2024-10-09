import { VendorClientService } from '@libs/clients/admin-client.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class VendorService {
  constructor(private readonly vendorClientService: VendorClientService) {}
  async approve(id: number): Promise<string> {
    await this.vendorClientService.approve(id);
    return `vendor approved`;
  }
}
